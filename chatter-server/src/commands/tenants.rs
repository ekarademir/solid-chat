use anyhow::{Context, Result};
use diesel::{pg::PgConnection, QueryDsl, RunQueryDsl, TextExpressionMethods};
use tracing::{span, Level};

use crate::errors;
use crate::models::tenant::{NewTenant, TenantModel};
use crate::schema::tenants;

pub fn create_tenant(conn: &mut PgConnection, tenant_name: &str) -> Result<TenantModel> {
    let create_tenant_span = span!(Level::INFO, "create_tenant").entered();

    let new_tenant = NewTenant { tenant_name };

    let result = diesel::insert_into(tenants::table)
        .values(&new_tenant)
        .get_result(conn)
        .context(tenant_name.to_string())?;

    create_tenant_span.exit();

    Ok(result)
}

pub fn find_tenant(conn: &mut PgConnection, name: &str) -> Result<TenantModel> {
    let find_tenant_span = span!(Level::INFO, "find_tenant").entered();

    let tenant_name_filter = format!("%{}%", name);

    let result = tenants::dsl::tenants
        .filter(tenants::columns::tenant_name.like(tenant_name_filter))
        .first(conn)
        .context(name.to_string())?;

    find_tenant_span.exit();

    Ok(result)
}

pub fn list_tenants(conn: &mut PgConnection) -> Result<Vec<TenantModel>> {
    let list_tenant_span = span!(Level::INFO, "list_tenant").entered();

    let result = tenants::dsl::tenants.load::<TenantModel>(conn)?;

    list_tenant_span.exit();

    Ok(result)
}

pub fn delete_tenant(conn: &mut PgConnection, name: &str) -> Result<()> {
    let delete_tenant_span = span!(Level::INFO, "delete_tenant").entered();

    if name == "chatter" {
        return Err(anyhow::Error::new(
            errors::ServiceErrors::CannotDeleteDefaultTenant,
        ));
    }

    let tenant_name_filter = format!("%{}%", name);

    diesel::delete(tenants::table.filter(tenants::columns::tenant_name.like(tenant_name_filter)))
        .execute(conn)
        .context(name.to_string())?;

    delete_tenant_span.exit();
    Ok(())
}
