use futures::future::join_all;
use tokio_stream::wrappers::ReceiverStream;
use tonic::{Request, Response, Status};

use crate::chat::{tenants_server::Tenants, FindRequest, ListRequest, Tenant, TenantResponse};
use crate::models::tenant::NewTenant;
use crate::models::tenant::Tenant as TenantModel;

use super::Respondable;
use super::ServiceResult;

pub use crate::chat::tenants_server::TenantsServer;

#[derive(Default)]
pub struct TenantsService {}

#[tonic::async_trait]
impl Tenants for TenantsService {
    async fn create(&self, req: Request<Tenant>) -> ServiceResult<TenantResponse> {
        let req = req.get_ref();
        super::connect_and(|mut conn| {
            NewTenant::validate(&req).and_then(|_| {
                NewTenant::new(&req.name)
                    .create(&mut conn)
                    .and_then(|tenant| {
                        Ok(TenantResponse {
                            tenant: Some(tenant.into()),
                        })
                    })
            })
        })
        .respond()
    }

    async fn delete(&self, req: Request<FindRequest>) -> ServiceResult<TenantResponse> {
        super::with_name(&req.get_ref().param, |name| {
            super::connect_and(|mut conn| {
                TenantModel::find_by_name(&mut conn, name)
                    .and_then(|tenant| tenant.delete(&mut conn))
                    .and_then(|_| Ok(TenantResponse { tenant: None }))
            })
        })
        .respond()
    }

    type ListStream = ReceiverStream<Result<Tenant, Status>>;
    async fn list(&self, _req: Request<ListRequest>) -> ServiceResult<Self::ListStream> {
        let (tx, rx) = tokio::sync::mpsc::channel(100);
        tokio::spawn(async move {
            match super::connect_and(|mut conn| {
                TenantModel::list(&mut conn).and_then(|tenants| {
                    Ok(join_all(
                        tenants
                            .iter()
                            .map(|tenant| tx.send(Ok(tenant.clone().into()))),
                    ))
                })
            })
            .with_status()
            {
                Ok(x) => {
                    x.await;
                }
                Err(x) => {
                    tx.send(Err(x)).await.ok();
                }
            }
        });

        Ok(Response::new(ReceiverStream::new(rx)))
    }
}
