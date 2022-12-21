use crate::schema::tenants;
use diesel::prelude::*;

#[derive(Queryable)]
pub struct TenantModel {
    pub id: i32,
    pub tenant_name: String,
}

impl Into<crate::chat::Tenant> for TenantModel {
    fn into(self) -> crate::chat::Tenant {
        crate::chat::Tenant {
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
