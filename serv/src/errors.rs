use diesel::result::Error as DieselError;

pub fn into_status(err: anyhow::Error) -> tonic::Status {
    match err.downcast_ref::<diesel::result::Error>() {
        Some(DieselError::NotFound) => tonic::Status::not_found(err.to_string()),
        Some(DieselError::DatabaseError(diesel::result::DatabaseErrorKind::UniqueViolation, _)) => {
            tonic::Status::already_exists(err.to_string())
        }
        _ => tonic::Status::unknown(format!("{:?}", err)),
    }
}
