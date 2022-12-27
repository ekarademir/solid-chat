use diesel::expression::Expression;
use diesel::prelude::*;
use diesel::sql_types::Integer;

use crate::chat::Tenant;
use crate::chat::User;
use crate::chat::UserKind as ProtoUserKind;
use crate::schema::users;
pub type UserKind = ProtoUserKind;

impl Expression for UserKind {
    type SqlType = Integer;
}

#[derive(Queryable)]
pub struct UserModel {
    pub id: uuid::Uuid,
    pub username: String,
    pub fullname: String,
    pub password: String,
    pub kind: UserKind,
    pub tenant: Tenant,
}

impl Into<User> for UserModel {
    fn into(self) -> User {
        User {
            id: self.id.braced().to_string(),
            username: self.username,
            fullname: self.fullname,
            kind: self.kind as i32,
            tenant: Some(self.tenant),
        }
    }
}

#[derive(Insertable)]
#[diesel(table_name = users)]
pub struct NewUser<'a> {
    pub username: &'a str,
    pub fullname: Option<&'a str>,
    pub kind: UserKind,
    pub tenant_id: i32,
}
