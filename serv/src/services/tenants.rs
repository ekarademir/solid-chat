use tokio_stream::wrappers::ReceiverStream;
use tonic::{
  Request,
  Response,
  Status,
};

use crate::chat::{
  tenants_server::Tenants,
  TenantRequest,
  Tenant,
};

pub use crate::chat::tenants_server::TenantsServer;

#[derive(Default)]
pub struct TenantsService {}

#[tonic::async_trait]
impl Tenants for TenantsService {
  type ListStream = ReceiverStream<Result<Tenant, Status>>;
  async fn list(&self, request: Request<TenantRequest>) -> Result<Response<Self::ListStream>, Status> {
    let (tx, rx) = tokio::sync::mpsc::channel(100);
    tokio::spawn(async move {
      let t = Tenant {
        name: "Osman".to_string(),
        id: 1,
      };
      tx.send(Ok(t)).await.unwrap();
    });


    Ok(Response::new(ReceiverStream::new(rx)))
  }
}
