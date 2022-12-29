use diesel::result::ConnectionError;
use diesel::result::Error as DieselError;
use tonic::Status;

pub fn into_status(err: anyhow::Error) -> Status {
    match err.downcast_ref::<DieselError>() {
        Some(DieselError::NotFound) => Status::not_found(err.to_string()),
        Some(DieselError::DatabaseError(diesel::result::DatabaseErrorKind::UniqueViolation, _)) => {
            Status::already_exists(err.to_string())
        }
        Some(_) => Status::unknown(format!("Unknown database error {:?}", err)),
        None => match err.downcast_ref::<ConnectionError>() {
            Some(_) => Status::internal("Internal server error"),
            None => match err.downcast_ref::<ServiceErrors>() {
                Some(ServiceErrors::CannotDeleteDefaultTenant) => {
                    Status::failed_precondition("Can't delete the default tenant")
                }
                Some(ServiceErrors::TenantDoesNotExist) => {
                    Status::failed_precondition("Tenant does not exist")
                }
                Some(ServiceErrors::EmptyRequestFields) => {
                    Status::failed_precondition(format!("Empty request fields {}", err))
                }
                _ => Status::unknown(format!("{:?}", err)),
            },
        },
    }
}

#[derive(thiserror::Error, Debug)]
pub enum ServiceErrors {
    #[error("Can not delete the default tenant")]
    CannotDeleteDefaultTenant,
    #[error("Tenant does not exist")]
    TenantDoesNotExist,
    #[error("At least one of the fields should be defined")]
    EmptyRequestFields,
}
