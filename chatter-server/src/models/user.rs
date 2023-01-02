use anyhow::{Context, Result};
use diesel::prelude::*;
use uuid::Uuid;

use crate::chat::User as ProtoUser;
use crate::chat::UserKind as ProtoUserKind;
use crate::errors;
use crate::schema::users;

use super::tenant::Tenant;

#[derive(Clone, Debug, PartialEq, Eq, Queryable, Identifiable, Associations)]
#[diesel(belongs_to(Tenant))]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub fullname: Option<String>,
    pub password: String,
    pub kind: i32,
    pub tenant_id: i32,
}

impl User {
    pub fn find(conn: &mut PgConnection, id: Uuid) -> Result<User> {
        users::table.find(id).first(conn).context(id)
    }

    pub fn find_by_username(
        conn: &mut PgConnection,
        tenant: &Tenant,
        username: &str,
    ) -> Result<User> {
        User::belonging_to(tenant)
            .filter(users::columns::username.eq(username))
            .first(conn)
            .context(username.to_string())
    }

    pub fn list(conn: &mut PgConnection, tenant: &Tenant) -> Result<Vec<User>> {
        User::belonging_to(tenant)
            .load::<User>(conn)
            .context(format!("list for {}", tenant.tenant_name))
    }

    pub fn delete(&self, conn: &mut PgConnection) -> Result<()> {
        diesel::delete(self)
            .execute(conn)
            .context(self.username.clone())?;
        Ok(())
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

#[derive(Debug, Default, Insertable, Associations, AsChangeset)]
#[diesel(belongs_to(Tenant))]
#[diesel(table_name = users)]
pub struct NewUser<'a> {
    pub id: Uuid,
    pub username: &'a str,
    pub fullname: Option<&'a str>,
    pub password: String,
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
            id: Uuid::new_v4(),
            username,
            fullname,
            password: Uuid::new_v4().as_simple().to_string(),
            kind: kind as i32,
            tenant_id: tenant.id,
        }
    }

    pub fn validate(user: &ProtoUser) -> Result<()> {
        if user.username.len() == 0 {
            return Err(errors::ServiceError::ValidationFailed).context("Username can't be empty");
        }
        if !ProtoUserKind::is_valid(user.kind) {
            return Err(errors::ServiceError::ValidationFailed).context("User kind is not valid");
        }
        Ok(())
    }

    pub fn create_or_update(&self, conn: &mut PgConnection) -> Result<User> {
        diesel::insert_into(users::table)
            .values(self)
            .on_conflict((users::tenant_id, users::username))
            .do_update()
            .set(self)
            .get_result(conn)
            .context(self.username.to_string())
    }
}
