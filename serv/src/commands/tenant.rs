use anyhow::{Context, Result};
use diesel::{pg::PgConnection, RunQueryDsl, QueryDsl, TextExpressionMethods};
use tracing::{span, Level};

use crate::models::tenant::{Tenant, NewTenant};
use crate::schema::tenants;

pub fn create_tenant(conn: &mut PgConnection, tenant_name: &str) -> Result<Tenant>{
  let create_tenant_span = span!(Level::INFO, "create_tenant").entered();

  let new_tenant = NewTenant { tenant_name };

  let result = diesel::insert_into(tenants::table)
    .values(&new_tenant)
    .get_result(conn)
    .context(format!("Can not insert {}", tenant_name))?;

  create_tenant_span.exit();

  Ok(result)
}

pub fn find_tenant(conn: &mut PgConnection, name: &str) -> Result<Tenant> {
  let find_teantn_span = span!(Level::INFO, "find_tenant").entered();

  let tenant_name_filter = format!("%{}%", name);

  let result = tenants::dsl::tenants
    .filter(tenants::columns::tenant_name.like(tenant_name_filter))
    .first(conn)?;

  find_teantn_span.exit();

  Ok(result)
}