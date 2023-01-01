use futures::future::join_all;
use tokio_stream::wrappers::ReceiverStream;
use tonic::{Request, Response, Status};

use crate::chat::{tenants_server::Tenants, FindRequest, ListRequest, Tenant, TenantResponse};
use crate::errors::ErrorExt;
use crate::models::tenant::NewTenant;
use crate::models::tenant::Tenant as TenantModel;

use super::ServiceResult;

pub use crate::chat::tenants_server::TenantsServer;

#[derive(Default)]
pub struct TenantsService {}

#[tonic::async_trait]
impl Tenants for TenantsService {
    async fn create(&self, req: Request<Tenant>) -> ServiceResult<TenantResponse> {
        super::connect_and(|conn| {
            NewTenant::new(&req.get_ref().name)
                .create(conn)
                .and_then(|tenant| {
                    Ok(Response::new(TenantResponse {
                        tenant: Some(tenant.into()),
                    }))
                })
                .map_err(|e| e.into_status())
        })
    }

    async fn delete(&self, req: Request<FindRequest>) -> ServiceResult<TenantResponse> {
        super::connect_and(|conn| {
            TenantModel::find_by_name(conn, &req.get_ref().name.as_deref().unwrap_or(""))
                .and_then(|tenant| tenant.delete(conn))
                .and_then(|_| Ok(Response::new(TenantResponse { tenant: None })))
                .map_err(|e| e.into_status())
        })
    }

    type ListStream = ReceiverStream<Result<Tenant, Status>>;
    async fn list(&self, req: Request<ListRequest>) -> ServiceResult<Self::ListStream> {
        let (tx, rx) = tokio::sync::mpsc::channel(100);
        tokio::spawn(async move {
            match super::connect_to_pg()
                .and_then(|mut conn| TenantModel::list(&mut conn))
                .and_then(|tenants| {
                    Ok(join_all(
                        tenants
                            .iter()
                            .map(|tenant| tx.send(Ok(tenant.clone().into()))),
                    ))
                })
                .map_err(|e| tx.send(Err(e.into_status())))
            {
                Ok(x) => {
                    x.await;
                }
                Err(x) => {
                    x.await.ok();
                }
            };
        });

        Ok(Response::new(ReceiverStream::new(rx)))
    }
}
