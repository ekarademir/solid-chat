use tokio_stream::wrappers::ReceiverStream;
use tonic::{Request, Response, Status};

use crate::chat::{tenants_server::Tenants, Tenant, TenantRequest, TenantResponse};
use crate::errors;
use crate::models::tenant::NewTenant;
use crate::models::tenant::Tenant as TenantModel;

pub use crate::chat::tenants_server::TenantsServer;

#[derive(Default)]
pub struct TenantsService {}

#[tonic::async_trait]
impl Tenants for TenantsService {
    async fn create(&self, req: Request<Tenant>) -> Result<Response<TenantResponse>, Status> {
        super::connect_and(
            |conn| match NewTenant::new(&req.get_ref().name).create(conn) {
                Ok(tenant) => Ok(Response::new(TenantResponse {
                    tenant: Some(tenant.into()),
                })),
                Err(e) => Err(errors::into_status(e)),
            },
        )
    }

    async fn delete(
        &self,
        req: Request<TenantRequest>,
    ) -> Result<Response<TenantResponse>, Status> {
        super::connect_and(
            |conn| match TenantModel::find_by_name(conn, &req.get_ref().name) {
                Ok(tenant) => match tenant.delete(conn) {
                    Ok(()) => Ok(Response::new(TenantResponse { tenant: None })),
                    Err(e) => Err(errors::into_status(e)),
                },
                Err(e) => Err(errors::into_status(e)),
            },
        )
    }

    type ListStream = ReceiverStream<Result<Tenant, Status>>;
    async fn list(
        &self,
        req: Request<TenantRequest>,
    ) -> Result<Response<Self::ListStream>, Status> {
        let (tx, rx) = tokio::sync::mpsc::channel(100);
        tokio::spawn(async move {
            match super::connect_to_pg() {
                Ok(mut conn) => {
                    let req = req.get_ref();
                    if req.list_all {
                        match TenantModel::list(&mut conn) {
                            Ok(tenants) => {
                                for tenant in tenants {
                                    tx.send(Ok(tenant.into())).await.unwrap();
                                }
                            }
                            Err(e) => tx.send(Err(errors::into_status(e))).await.unwrap(),
                        };
                    } else if req.name.len() > 0 {
                        match TenantModel::find_by_name(&mut conn, &req.name) {
                            Ok(tenant) => tx.send(Ok(tenant.into())).await.unwrap(),
                            Err(e) => tx.send(Err(errors::into_status(e))).await.unwrap(),
                        }
                    }
                }
                Err(e) => tx.send(Err(errors::into_status(e))).await.unwrap(),
            }

            tx.send(Err(errors::into_status(
                anyhow::Error::new(errors::ServiceErrors::EmptyRequestFields)
                    .context("list_all, name"),
            )))
            .await
            .unwrap();
        });

        Ok(Response::new(ReceiverStream::new(rx)))
    }
}
