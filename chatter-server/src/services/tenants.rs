use tokio_stream::wrappers::ReceiverStream;
use tonic::{Request, Response, Status};

use crate::chat::{tenants_server::Tenants, Tenant, TenantRequest, TenantResponse};
use crate::commands;
use crate::errors;

pub use crate::chat::tenants_server::TenantsServer;

#[derive(Default)]
pub struct TenantsService {}

#[tonic::async_trait]
impl Tenants for TenantsService {
    async fn create(&self, req: Request<Tenant>) -> Result<Response<TenantResponse>, Status> {
        commands::connect_and(|conn| {
            match commands::tenants::create_tenant(conn, req.get_ref().name.as_str()) {
                Ok(tenant) => Ok(Response::new(TenantResponse {
                    tenant: Some(tenant.into()),
                })),
                Err(e) => Err(errors::into_status(e)),
            }
        })
    }

    async fn delete(
        &self,
        req: Request<TenantRequest>,
    ) -> Result<Response<TenantResponse>, Status> {
        commands::connect_and(|conn| {
            match commands::tenants::delete_tenant(conn, req.get_ref().name.as_str()) {
                Ok(()) => Ok(Response::new(TenantResponse { tenant: None })),
                Err(e) => Err(errors::into_status(e)),
            }
        })
    }

    type ListStream = ReceiverStream<Result<Tenant, Status>>;
    async fn list(
        &self,
        req: Request<TenantRequest>,
    ) -> Result<Response<Self::ListStream>, Status> {
        let (tx, rx) = tokio::sync::mpsc::channel(100);
        tokio::spawn(async move {
            let list_all = req.get_ref().list_all;
            let name = req.get_ref().name.as_str();
            match commands::connect_to_pg() {
                Ok(mut conn) => {
                    if list_all {
                        match commands::tenants::list_tenants(&mut conn) {
                            Ok(tenants) => {
                                for tenant in tenants {
                                    tx.send(Ok(tenant.into())).await.unwrap();
                                }
                            }
                            Err(e) => tx.send(Err(errors::into_status(e))).await.unwrap(),
                        };
                    } else if name.len() > 0 {
                        match commands::tenants::find_tenant(&mut conn, name) {
                            Ok(tenant) => tx.send(Ok(tenant.into())).await.unwrap(),
                            Err(e) => tx.send(Err(errors::into_status(e))).await.unwrap(),
                        }
                    }
                }
                Err(e) => tx.send(Err(errors::into_status(e))).await.unwrap(),
            }

            tx.send(Err(Status::ok("Empty"))).await.unwrap();
        });

        Ok(Response::new(ReceiverStream::new(rx)))
    }
}
