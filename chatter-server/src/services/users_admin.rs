use tokio_stream::wrappers::ReceiverStream;
use tonic::{Request, Response, Status};

use crate::chat::{users_admin_server::UsersAdmin, User, UserAdminRequest, UserAdminResponse};
use crate::errors;
use crate::models::{tenant::Tenant, user::NewUser};

pub use crate::chat::users_admin_server::UsersAdminServer;

#[derive(Default)]
pub struct UsersAdminService {}

#[tonic::async_trait]
impl UsersAdmin for UsersAdminService {
    async fn create(&self, req: Request<User>) -> Result<Response<UserAdminResponse>, Status> {
        super::connect_and(|conn| {
            let payload = req.get_ref();
            if let Ok(tenant) = Tenant::find_by_name(conn, &payload.tenant_name) {
                match NewUser::new(
                    &payload.username,
                    Some(payload.fullname()),
                    payload.kind(),
                    &tenant,
                )
                .create(conn)
                {
                    Ok(user) => Ok(Response::new(UserAdminResponse {
                        user: Some(user.proto(&tenant)),
                    })),
                    Err(e) => Err(errors::into_status(e)),
                }
            } else {
                Err(errors::into_status(anyhow::Error::new(
                    errors::ServiceErrors::CannotDeleteDefaultTenant,
                )))
            }
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
