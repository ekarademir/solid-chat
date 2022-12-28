use anyhow::{Context, Result};
use diesel::prelude::*;

use crate::chat::User as ProtoUser;
use crate::chat::UserKind as ProtoUserKind;
use crate::schema::users;

use super::tenant::Tenant;

#[derive(Clone, Debug, PartialEq, Eq, Queryable, Identifiable, Associations)]
#[diesel(belongs_to(Tenant))]
pub struct User {
    pub id: uuid::Uuid,
    pub username: String,
    pub fullname: Option<String>,
    pub password: String,
    pub kind: i32,
    pub tenant_id: i32,
}

impl User {
    pub fn find(conn: &mut PgConnection, id: uuid::Uuid) -> Result<User> {
        users::table.find(id).first(conn).context(id)
    }

    pub fn list(conn: &mut PgConnection, tenant: &Tenant) -> Result<Vec<User>> {
        User::belonging_to(tenant)
            .load::<User>(conn)
            .context(format!("list for {}", tenant.tenant_name))
    }

    pub fn into_proto(&self, tenant: &Tenant) -> ProtoUser {
        ProtoUser {
            username: self.username.clone(),
            fullname: self.fullname.clone(),
            kind: self.kind,
            id: self.id.braced().to_string(),
            tenant_name: tenant.tenant_name.clone(),
        }
    }
}

#[derive(Debug, Default, Insertable, Associations)]
#[diesel(belongs_to(Tenant))]
#[diesel(table_name = users)]
pub struct NewUser<'a> {
    pub username: &'a str,
    pub fullname: Option<&'a str>,
    pub kind: i32,
    pub tenant_id: i32,
}

impl<'a> NewUser<'a> {
    pub fn new(
        username: &'a str,
        fullname: Option<&'a str>,
        kind: ProtoUserKind,
        tenant: &'a Tenant,
    ) -> Self {
        NewUser {
            username,
            fullname,
            kind: kind as i32,
            tenant_id: tenant.id,
        }
    }

    pub fn create(&self, conn: &mut PgConnection) -> Result<User> {
        diesel::insert_into(users::table)
            .values(self)
            .get_result(conn)
            .context(self.username.to_string())
    }
}
