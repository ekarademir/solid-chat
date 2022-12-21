use crate::schema::tenants;
use diesel::prelude::*;

#[derive(Queryable)]
pub struct Tenant {
    pub id: i32,
    pub tenant_name: String,
}

#[derive(Insertable)]
#[diesel(table_name = tenants)]
pub struct NewTenant<'a> {
    pub tenant_name: &'a str,
}
