use tonic::Request;

use crate::chat::{
    authentication_server::Authentication, BasicAuthenticationRequest, BasicAuthenticationResponse,
};
use crate::models::session::Session;
use crate::models::user::User;

use super::Respondable;
use super::ServiceResult;

pub use crate::chat::authentication_server::AuthenticationServer;

#[derive(Default)]
pub struct AuthenticationService {}

#[tonic::async_trait]
impl Authentication for AuthenticationService {
    async fn basic_authentication(
        &self,
        req: Request<BasicAuthenticationRequest>,
    ) -> ServiceResult<BasicAuthenticationResponse> {
        let req = req.get_ref();

        let maybe_user = if let Some(tenant_name) = &req.tenant_name {
            super::check_tenant_and(&tenant_name, |mut conn, tenant| {
                User::find_by_username(&mut conn, tenant, &req.username)
            })
        } else {
            super::connect_and(|mut conn| User::root(&mut conn, &req.username))
        };

        maybe_user
            .and_then(|user| user.check_passport(&req.password))
            .and_then(|_| super::connect_to_redis())
            .and_then(|mut conn| Session::new(None).save(&mut conn))
            .and_then(|session| {
                Ok(BasicAuthenticationResponse {
                    session_state: "".to_string(),
                    session_token: session.hash.as_simple().to_string(),
                })
            })
            .response()
    }
}
