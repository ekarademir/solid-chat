use anyhow::{Context, Result};
use diesel::pg::PgConnection;
use diesel::prelude::*;

use crate::chat::Tenant as ProtoTenant;
use crate::errors;
use crate::schema::tenants;

#[derive(Clone, Debug, PartialEq, Eq, Queryable, Identifiable)]
pub struct Tenant {
    pub id: i32,
    pub tenant_name: String,
}

impl Default for Tenant {
    fn default() -> Self {
        Tenant {
            id: 0,
            tenant_name: String::from("chatter"),
        }
    }
}

impl Tenant {
    pub fn find(conn: &mut PgConnection, id: i32) -> Result<Tenant> {
        tenants::table.find(id).first(conn).context(id)
    }

    pub fn find_by_name(conn: &mut PgConnection, name: &str) -> Result<Tenant> {
        tenants::dsl::tenants
            .filter(tenants::columns::tenant_name.eq(name))
            .first(conn)
            .context(name.to_string())
    }

    pub fn list(conn: &mut PgConnection) -> Result<Vec<Tenant>> {
        tenants::dsl::tenants.load::<Tenant>(conn).context("list")
    }

    fn delete_entities(&self, conn: &mut PgConnection) -> Result<()> {
        Ok(())
    }

    pub fn delete(&self, conn: &mut PgConnection) -> Result<()> {
        if self.tenant_name == "chatter" {
            return Err(errors::ServiceError::CannotDeleteDefaultTenant.into());
        }
        self.delete_entities(conn).and_then(|_| {
            diesel::delete(self)
                .execute(conn)
                .context(self.tenant_name.clone())
        })?;
        Ok(())
    }
}

impl Into<ProtoTenant> for Tenant {
    fn into(self) -> ProtoTenant {
        ProtoTenant {
            name: self.tenant_name,
            id: self.id,
        }
    }
}

#[derive(Debug, Default, Insertable)]
#[diesel(table_name = tenants)]
pub struct NewTenant<'a> {
    pub tenant_name: &'a str,
}

impl<'a> NewTenant<'a> {
    pub fn new(name: &'a str) -> Self {
        NewTenant { tenant_name: name }
    }

    pub fn validate(tenant: &ProtoTenant) -> Result<()> {
        if tenant.name.len() == 0 {
            return Err(errors::ServiceError::ValidationFailed)
                .context("Tenant name can't be empty");
        }
        Ok(())
    }

    pub fn create(&self, conn: &mut PgConnection) -> Result<Tenant> {
        diesel::insert_into(tenants::table)
            .values(self)
            .get_result(conn)
            .context(self.tenant_name.to_string())
    }
}
