use tokio_stream::wrappers::ReceiverStream;
use tonic::{Request, Response, Status};

use crate::chat::{users_admin_server::UsersAdmin, User, UserAdminRequest, UserAdminResponse};
use crate::commands;
use crate::errors;

pub use crate::chat::users_admin_server::UsersAdminServer;

#[derive(Default)]
pub struct UsersAdminService {}

#[tonic::async_trait]
impl UsersAdmin for UsersAdminService {
    async fn create(&self, req: Request<User>) -> Result<Response<UserAdminResponse>, Status> {
        unimplemented!()
    }

    type ListStream = ReceiverStream<Result<User, Status>>;
    async fn list(
        &self,
        req: Request<UserAdminRequest>,
    ) -> Result<Response<Self::ListStream>, Status> {
        unimplemented!()
    }

    async fn delete(
        &self,
        req: Request<UserAdminRequest>,
    ) -> Result<Response<UserAdminResponse>, Status> {
        unimplemented!()
    }

    async fn update(
        &self,
        req: Request<UserAdminRequest>,
    ) -> Result<Response<UserAdminResponse>, Status> {
        unimplemented!()
    }
}
