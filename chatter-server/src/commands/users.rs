use anyhow::{Context, Result};
use diesel::{pg::PgConnection, QueryDsl, RunQueryDsl, TextExpressionMethods};
use tracing::{span, Level};

use crate::errors;
use crate::models::user::{NewUser, UserKind, UserModel};
use crate::schema::users;

pub fn create_user(conn: &mut PgConnection, new_user: &NewUser) -> Result<UserModel> {
    let create_user_span = span!(Level::INFO, "create_user").entered();

    let result = diesel::insert_into(users::table)
        .values(new_user)
        .get_result(conn)
        .context(new_user.username.to_string())?;

    create_user_span.exit();

    Ok(result)
}
