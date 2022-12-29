use tokio_stream::wrappers::ReceiverStream;
use tonic::{Request, Response, Status};

use crate::chat::{users_admin_server::UsersAdmin, User, UserAdminRequest, UserAdminResponse};
use crate::errors;
use crate::models::{tenant::Tenant, user::NewUser, user::User as UserModel};

pub use crate::chat::users_admin_server::UsersAdminServer;

#[derive(Default)]
pub struct UsersAdminService {}

#[tonic::async_trait]
impl UsersAdmin for UsersAdminService {
    async fn create(&self, req: Request<User>) -> Result<Response<UserAdminResponse>, Status> {
        super::connect_and(|conn| {
            let req = req.get_ref();
            if let Ok(tenant) = Tenant::find_by_name(conn, &req.tenant_name) {
                match NewUser::new(&req.username, Some(req.fullname()), req.kind(), &tenant)
                    .create(conn)
                {
                    Ok(user) => Ok(Response::new(UserAdminResponse {
                        user: Some(user.into_proto(&tenant)),
                    })),
                    Err(e) => Err(errors::into_status(e)),
                }
            } else {
                Err(errors::into_status(anyhow::Error::new(
                    errors::ServiceErrors::TenantDoesNotExist,
                )))
            }
        })
    }

    type ListStream = ReceiverStream<Result<User, Status>>;
    async fn list(
        &self,
        req: Request<UserAdminRequest>,
    ) -> Result<Response<Self::ListStream>, Status> {
        let (tx, rx) = tokio::sync::mpsc::channel(100);
        tokio::spawn(async move {
            let req = req.get_ref();
            match super::connect_to_pg() {
                Ok(mut conn) => {
                    if let Ok(tenant) = Tenant::find_by_name(&mut conn, &req.tenant_name) {
                        if req.list_all {
                            match UserModel::list(&mut conn, &tenant) {
                                Ok(users) => {
                                    for user in users {
                                        tx.send(Ok(user.into_proto(&tenant))).await.unwrap();
                                    }
                                }
                                Err(e) => tx.send(Err(errors::into_status(e))).await.unwrap(),
                            }
                        } else if req.username.len() > 0 {
                            match UserModel::find_by_username(&mut conn, &tenant, &req.username) {
                                Ok(user) => tx.send(Ok(user.into_proto(&tenant))).await.unwrap(),
                                Err(e) => tx.send(Err(errors::into_status(e))).await.unwrap(),
                            }
                        } else {
                            tx.send(Err(errors::into_status(
                                anyhow::Error::new(errors::ServiceErrors::EmptyRequestFields)
                                    .context("list_all, username"),
                            )))
                            .await
                            .unwrap();
                        }
                    } else {
                        tx.send(Err(errors::into_status(anyhow::Error::new(
                            errors::ServiceErrors::TenantDoesNotExist,
                        ))))
                        .await
                        .unwrap();
                    }
                }
                Err(e) => tx.send(Err(errors::into_status(e))).await.unwrap(),
            }
        });
        Ok(Response::new(ReceiverStream::new(rx)))
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
