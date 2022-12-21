pub mod tenant;

use std::env;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use dotenvy::dotenv;
use tracing::{span, Level};
use anyhow::{Context, Result};


fn connect_to_pg() -> Result<PgConnection> {
  let connect_to_pg_span = span!(Level::DEBUG, "connect_to_pg").entered();
  dotenv()?;
  let database_url = env::var("DATABASE_URL")
    .context("DATABASE_URL has not found in the environment")?;

  let conn = PgConnection::establish(&database_url)
    .context("A databse connection cannot be established with provided url.")?;

  connect_to_pg_span.exit();
  Ok(conn)
}