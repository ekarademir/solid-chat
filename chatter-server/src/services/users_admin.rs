use tokio_stream::wrappers::ReceiverStream;
use tonic::{Request, Response, Status};

use crate::chat::{users_admin_server::UsersAdmin, User, UserAdminRequest, UserAdminResponse};
use crate::commands;
use crate::errors;
use crate::models::user::{NewUser, UserKind};

pub use crate::chat::users_admin_server::UsersAdminServer;

#[derive(Default)]
pub struct UsersAdminService {}

#[tonic::async_trait]
impl UsersAdmin for UsersAdminService {
    async fn create(&self, req: Request<User>) -> Result<Response<UserAdminResponse>, Status> {
        let new_user = NewUser {
            username: req.get_ref().username.as_str(),
            fullname: Some(req.get_ref().fullname()),
            kind: req.get_ref().kind,
            tenant_id: 1,
        };
        commands::connect_and(|conn| match commands::users::create_user(conn, &new_user) {
            Ok(user) => Ok(Response::new(UserAdminResponse {
                user: Some(user.into()),
            })),
            Err(e) => Err(errors::into_status(e)),
        })
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
