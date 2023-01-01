use futures::future::join_all;
use tokio_stream::wrappers::ReceiverStream;
use tonic::{Request, Response, Status};

use crate::chat::{
    users_admin_server::UsersAdmin, FindWithTenantRequest, ListWithTenantRequest, User,
    UserAdminResponse,
};
use crate::errors::ErrorExt;
use crate::models::{user::NewUser, user::User as UserModel};

pub use crate::chat::users_admin_server::UsersAdminServer;

#[derive(Default)]
pub struct UsersAdminService {}

#[tonic::async_trait]
impl UsersAdmin for UsersAdminService {
    async fn create(&self, req: Request<User>) -> Result<Response<UserAdminResponse>, Status> {
        let req = req.get_ref();
        super::check_tenant_and(&req.tenant_name, |conn, tenant| {
            NewUser::new(&req.username, Some(req.fullname()), req.kind(), &tenant)
                .create(conn)
                .and_then(|user| {
                    Ok(Response::new(UserAdminResponse {
                        user: Some(user.into_proto(&tenant)),
                    }))
                })
        })
        .map_err(|e| e.into_status())
    }

    type ListStream = ReceiverStream<Result<User, Status>>;
    async fn list(
        &self,
        req: Request<ListWithTenantRequest>,
    ) -> Result<Response<Self::ListStream>, Status> {
        let (tx, rx) = tokio::sync::mpsc::channel(100);
        tokio::spawn(async move {
            let req = req.get_ref();
            match super::check_tenant_and(&req.tenant_name, |mut conn, tenant| {
                UserModel::list(&mut conn, &tenant).and_then(|users| {
                    Ok(join_all(
                        users
                            .iter()
                            .map(|user| tx.send(Ok(user.into_proto(&tenant)))),
                    ))
                })
            }) {
                Ok(x) => {
                    x.await;
                }
                Err(x) => {
                    tx.send(Err(x.into_status())).await.ok();
                }
            };
        });
        Ok(Response::new(ReceiverStream::new(rx)))
    }

    async fn delete(
        &self,
        req: Request<FindWithTenantRequest>,
    ) -> Result<Response<UserAdminResponse>, Status> {
        unimplemented!()
    }

    async fn update(
        &self,
        req: Request<FindWithTenantRequest>,
    ) -> Result<Response<UserAdminResponse>, Status> {
        unimplemented!()
    }
}
