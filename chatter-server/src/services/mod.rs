use anyhow::Context;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use dotenvy::dotenv;
use std::env;
use tonic::{Request, Response, Status};
use tracing::{span, Level};

use crate::chat::{find_parameter::FindOneof, FindParameter};
use crate::errors::ErrorExt;
use crate::errors::ServiceError;
use crate::models::tenant::Tenant;

pub mod tenants;
pub mod users_admin;

pub type ServiceResult<T> = Result<Response<T>, Status>;

pub fn connect_to_pg() -> anyhow::Result<PgConnection> {
    let connect_to_pg_span = span!(Level::DEBUG, "connect_to_pg").entered();
    dotenv()?;
    let database_url =
        env::var("DATABASE_URL").context("DATABASE_URL has not found in the environment")?;

    let conn = PgConnection::establish(&database_url)
        .context("A databse connection cannot be established with provided url.")?;

    connect_to_pg_span.exit();
    Ok(conn)
}

pub fn connect_and<T, F>(f: F) -> Result<T, anyhow::Error>
where
    F: Fn(&mut PgConnection) -> Result<T, anyhow::Error>,
{
    let mut conn = connect_to_pg()?;
    f(&mut conn)
}

pub fn check_tenant_and<T, F>(tenant_name: &str, f: F) -> Result<T, anyhow::Error>
where
    F: Fn(&mut PgConnection, &Tenant) -> Result<T, anyhow::Error>,
{
    connect_and(|conn| {
        let tenant = Tenant::find_by_name(conn, &tenant_name)?;
        f(conn, &tenant)
    })
}

pub fn with_username<T, F>(field: &Option<FindParameter>, f: F) -> Result<T, anyhow::Error>
where
    F: Fn(&str) -> Result<T, anyhow::Error>,
{
    if let Some(x) = field {
        if let Some(y) = &x.find_oneof {
            if let FindOneof::Username(u) = y {
                return f(&u);
            }
        }
    }
    Err(ServiceError::ValidationFailed).context("Missing username")
}

pub fn with_name<T, F>(field: &Option<FindParameter>, f: F) -> Result<T, anyhow::Error>
where
    F: Fn(&str) -> Result<T, anyhow::Error>,
{
    if let Some(x) = field {
        if let Some(y) = &x.find_oneof {
            if let FindOneof::Name(u) = y {
                return f(&u);
            }
        }
    }
    Err(ServiceError::ValidationFailed).context("Missing name")
}

pub fn with_uuid<T, F>(field: &Option<FindParameter>, f: F) -> Result<T, anyhow::Error>
where
    F: Fn(&str) -> Result<T, anyhow::Error>,
{
    if let Some(x) = field {
        if let Some(y) = &x.find_oneof {
            if let FindOneof::Uuid(u) = y {
                return f(&u);
            }
        }
    }
    Err(ServiceError::ValidationFailed).context("Missing uuid")
}

pub fn with_id<T, F>(field: &Option<FindParameter>, f: F) -> Result<T, anyhow::Error>
where
    F: Fn(&i32) -> Result<T, anyhow::Error>,
{
    if let Some(x) = field {
        if let Some(y) = &x.find_oneof {
            if let FindOneof::Id(u) = y {
                return f(&u);
            }
        }
    }
    Err(ServiceError::ValidationFailed).context("Missing id")
}

pub trait Respondable<T> {
    fn response(self) -> Result<Response<T>, Status>;
    fn with_status(self) -> Result<T, Status>;
}

impl<T> Respondable<T> for Result<T, anyhow::Error> {
    fn response(self) -> Result<Response<T>, Status> {
        self.and_then(|x| Ok(Response::new(x)))
            .map_err(|e| e.into_status())
    }
    fn with_status(self) -> Result<T, Status> {
        self.map_err(|e| e.into_status())
    }
}

pub fn authenticate_middleware(req: Request<()>) -> Result<Request<()>, Status> {
    println!("{:?}", req);
    Ok(req)
}
