use tokio_stream::wrappers::ReceiverStream;
use tonic::{Request, Response, Status};

use crate::chat::{tenants_server::Tenants, FindRequest, ListRequest, Tenant, TenantResponse};
use crate::errors;
use crate::errors::ErrorExt;
use crate::models::tenant::NewTenant;
use crate::models::tenant::Tenant as TenantModel;

use super::ServiceResult;

pub use crate::chat::tenants_server::TenantsServer;

#[tonic::async_trait]
pub trait Streaming {
    async fn stream();
}

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
            match TenantModel::find_by_name(conn, &req.get_ref().name.unwrap()) {
                Ok(tenant) => match tenant.delete(conn) {
                    Ok(()) => Ok(Response::new(TenantResponse { tenant: None })),
                    Err(e) => Err(e.into_status()),
                },
                Err(e) => Err(e.into_status()),
            }
        })
    }

    type ListStream = ReceiverStream<Result<Tenant, Status>>;
    async fn list(&self, req: Request<ListRequest>) -> ServiceResult<Self::ListStream> {
        let (tx, rx) = tokio::sync::mpsc::channel(100);
        tokio::spawn(async move {
            match super::connect_to_pg() {
                Ok(mut conn) => {
                    let req = req.get_ref();
                    match TenantModel::list(&mut conn) {
                        Ok(tenants) => {
                            for tenant in tenants {
                                tx.send(Ok(tenant.into())).await.unwrap();
                            }
                        }
                        Err(e) => tx.send(Err(e.into_status())).await.unwrap(),
                    };
                }
                Err(e) => tx.send(Err(e.into_status())).await.unwrap(),
            }
        });

        Ok(Response::new(ReceiverStream::new(rx)))
    }
}
