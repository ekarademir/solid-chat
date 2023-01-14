use anyhow::{Context, Result};
use diesel::prelude::*;
use uuid::Uuid;

use crate::chat::{User as ProtoUser, UserKind as ProtoUserKind, UserPassword};
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

    pub fn root(conn: &mut PgConnection, username: &str) -> Result<User> {
        let id = Uuid::parse_str("00000000-0000-0000-0000-000000000001")
            .context("Can't parse root id")?;
        users::table
            .find(id)
            .filter(users::columns::username.eq(username))
            .first(conn)
            .context("Can't find root user")
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

    pub fn validate_password(value: &UserPassword) -> Result<()> {
        use lazy_regex::regex;

        let uppercase_letter = regex!(r"[A-Z]");
        let lowercase_letter = regex!(r"[a-z]");
        let numeric_letter = regex!(r"[0-9]");
        let symbolic_letter = regex!(r"\W\D");
        // Also add !

        let candidate = &value.password;

        if value.password.len() < 8 {
            return Err(errors::ServiceError::ValidationFailed)
                .context("Passwords should be longer than 8 characters");
        }
        if !uppercase_letter.is_match(&candidate) {
            return Err(errors::ServiceError::ValidationFailed)
                .context("Passwords should include uppercase letters");
        }
        if !lowercase_letter.is_match(&candidate) {
            return Err(errors::ServiceError::ValidationFailed)
                .context("Passwords should include lowercase letters");
        }
        if !numeric_letter.is_match(&candidate) {
            return Err(errors::ServiceError::ValidationFailed)
                .context("Passwords should include numeric letters");
        }
        if !symbolic_letter.is_match(&candidate) {
            return Err(errors::ServiceError::ValidationFailed)
                .context("Passwords should include symbolic letters");
        }
        Ok(())
    }

    pub fn set_password(&self, conn: &mut PgConnection, password: &str) -> Result<User> {
        diesel::update(users::table.filter(users::id.eq(self.id)))
            .set(users::password.eq(password.to_string()))
            .get_result(conn)
            .context("password change")
    }

    pub fn check_passport(&self, password: &str) -> Result<()> {
        if self.password == password {
            Ok(())
        } else {
            Err(errors::ServiceError::ValidationFailed).context("Provided credentials are wrong")
        }
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
            .set((users::fullname.eq(self.fullname), users::kind.eq(self.kind)))
            .get_result(conn)
            .context(self.username.to_string())
    }
}
