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
        let conn = &mut commands::connect_to_pg().unwrap();
        match commands::tenants::create_tenant(conn, req.get_ref().name.as_str()) {
            Ok(tenant) => Ok(Response::new(TenantResponse {
                tenant: Some(tenant.into()),
            })),
            Err(e) => Err(errors::into_status(e)),
        }
    }

    async fn delete(
        &self,
        req: Request<TenantRequest>,
    ) -> Result<Response<TenantResponse>, Status> {
        let conn = &mut commands::connect_to_pg().unwrap();
        match commands::tenants::delete_tenant(conn, req.get_ref().name.as_str()) {
            Ok(()) => Ok(Response::new(TenantResponse { tenant: None })),
            Err(e) => Err(errors::into_status(e)),
        }
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

            if list_all {
                let conn = &mut commands::connect_to_pg().unwrap();
                let tenants = commands::tenants::list_tenants(conn).unwrap();
                for tenant in tenants {
                    tx.send(Ok(tenant.into())).await.unwrap();
                }
            } else if name.len() > 0 {
                let conn = &mut commands::connect_to_pg().unwrap();
                match commands::tenants::find_tenant(conn, name) {
                    Ok(tenant) => tx.send(Ok(tenant.into())).await.unwrap(),
                    _ => tx
                        .send(Err(Status::not_found("Requested tenant not found")))
                        .await
                        .unwrap(),
                }
            }

            tx.send(Err(Status::ok("Empty"))).await.unwrap();
        });

        Ok(Response::new(ReceiverStream::new(rx)))
    }
}
