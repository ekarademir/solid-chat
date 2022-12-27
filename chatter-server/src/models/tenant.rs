use diesel::prelude::*;

use crate::chat::Tenant;
use crate::schema::tenants;

#[derive(Queryable)]
pub struct TenantModel {
    pub id: i32,
    pub tenant_name: String,
}

impl Into<Tenant> for TenantModel {
    fn into(self) -> Tenant {
        Tenant {
            name: self.tenant_name,
            id: self.id,
        }
    }
}

#[derive(Insertable)]
#[diesel(table_name = tenants)]
pub struct NewTenant<'a> {
    pub tenant_name: &'a str,
}
