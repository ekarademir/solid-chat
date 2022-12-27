use diesel::prelude::*;

use crate::chat::Tenant;
use crate::chat::User;
use crate::chat::UserKind as ProtoUserKind;
use crate::schema::users;
pub type UserKind = ProtoUserKind;

#[derive(Queryable)]
pub struct UserModel {
    pub id: uuid::Uuid,
    pub username: String,
    pub fullname: Option<String>,
    pub password: String,
    pub kind: i32,
    pub tenant_id: i32,
}

impl Into<User> for UserModel {
    fn into(self) -> User {
        User {
            id: self.id.braced().to_string(),
            username: self.username,
            fullname: self.fullname,
            kind: self.kind,
        }
    }
}

#[derive(Insertable)]
#[diesel(table_name = users)]
pub struct NewUser<'a> {
    pub username: &'a str,
    pub fullname: Option<&'a str>,
    pub kind: i32,
    pub tenant_id: i32,
}
