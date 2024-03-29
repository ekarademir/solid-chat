use diesel::result::ConnectionError;
use diesel::result::Error as DieselError;
use redis::ErrorKind as RedisError;
use tonic::Status;

#[derive(thiserror::Error, Debug)]
pub enum ServiceError {
    #[error("Can not delete the default tenant")]
    CannotDeleteDefaultTenant,
    #[error("Tenant does not exist")]
    TenantDoesNotExist,
    #[error("There is a validation error")]
    ValidationFailed,
    #[error("No session token provided")]
    SessionTokenMissing,
    #[error("Provided token is invalid")]
    SessionTokenInvalid,
    #[error("Provided credentials are wrong")]
    WrongCredentials,
}

pub trait ErrorExt {
    fn into_status(&self) -> Status;
}

impl ErrorExt for anyhow::Error {
    fn into_status(&self) -> Status {
        match self.downcast_ref::<DieselError>() {
            Some(DieselError::NotFound) => Status::not_found(self.to_string()),
            Some(DieselError::DatabaseError(
                diesel::result::DatabaseErrorKind::UniqueViolation,
                _,
            )) => Status::already_exists(self.to_string()),
            Some(_) => Status::unknown(format!("Unknown database error {:?}", self)),
            None => match self.downcast_ref::<redis::RedisError>() {
                Some(e) => match e.kind() {
                    /*
                     Redis can return
                       RedisError::InvalidClientConfig
                       RedisError::AuthenticationFailed
                       std::io::ErrorKind, especially std::io::ErrorKind::ConnectionRefused  -> This might be being converted

                       RedisError::ResponseError will not always mean key not found, if key not found it will return nil
                    */
                    RedisError::ResponseError => Status::unauthenticated(""),
                    _ => Status::unknown(format!("Unknown session error {:?}", self)),
                },
                None => match self.downcast_ref::<ConnectionError>() {
                    Some(_) => Status::internal("Internal server error"),
                    None => match self.downcast_ref::<ServiceError>() {
                        Some(ServiceError::CannotDeleteDefaultTenant) => {
                            Status::failed_precondition("Can't delete the default tenant")
                        }
                        Some(ServiceError::TenantDoesNotExist) => {
                            Status::failed_precondition("Tenant does not exist")
                        }
                        Some(ServiceError::ValidationFailed) => {
                            Status::failed_precondition(format!("{}", self))
                        }
                        Some(ServiceError::WrongCredentials) => {
                            Status::failed_precondition(format!("{}", self))
                        }
                        _ => Status::unknown(format!("{:?}", self)),
                    },
                },
            },
        }
    }
}
