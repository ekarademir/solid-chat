use anyhow::{Context, Result};
use redis::Connection;
use uuid::Uuid;

use crate::errors::ServiceError;

const EXPIRY_S: usize = 60 * 15; // 15mins
const EXPIRY_LONG: usize = 60 * 60 * 24 * 2; // 2days

pub struct Session {
    pub hash: Uuid,
    pub state: String,
    pub expires: usize,
}

impl<'a> std::fmt::Display for Session {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.hash)
    }
}

impl<'a> Session {
    pub fn new() -> SessionBuilder {
        SessionBuilder::new()
    }

    pub fn with_token(token: &'a str) -> Result<Session> {
        Uuid::parse_str(token)
            .ok()
            .and_then(|x| {
                let mut session = Session::new().build();
                session.hash = x;
                Some(session)
            })
            .ok_or(anyhow::Error::new(ServiceError::SessionTokenInvalid))
    }

    pub fn save(self, conn: &mut Connection) -> Result<Self> {
        let key = self.to_string();
        // Atomic set and expire
        redis::transaction(conn, &[&key], |conn, pipe| {
            pipe.set(&key, self.state.clone())
                .ignore()
                .expire(&key, self.expires)
                .query(conn)
        })
        .context("Can't create session")?;
        Ok(self)
    }

    pub fn find(&'a self, conn: &mut Connection) -> Result<String> {
        let result: String = redis::cmd("GET")
            .arg(self.to_string())
            .query(conn)
            .context(format!("Can't find session {}", self.hash))?;

        Ok(result)
    }

    pub fn load(mut self, conn: &mut Connection) -> Result<Self> {
        let result: String = redis::cmd("GET")
            .arg(self.to_string())
            .query(conn)
            .context(format!("Can't find session {}", self.hash))?;

        self.state = result;

        Ok(self)
    }
}

pub struct SessionBuilder {
    inner: Session,
}

impl SessionBuilder {
    pub fn new() -> Self {
        let inner = Session {
            hash: Uuid::new_v4(),
            state: "NEW".to_string(),
            expires: EXPIRY_S,
        };
        SessionBuilder { inner }
    }

    pub fn with_token(mut self, token: &str) -> Self {
        self.inner.hash = Uuid::parse_str(token).ok().unwrap_or(Uuid::new_v4());
        self
    }

    pub fn with_expiry(mut self, long: bool) -> Self {
        self.inner.expires = if long { EXPIRY_LONG } else { EXPIRY_S };
        self
    }

    pub fn long_session(mut self) -> Self {
        self.inner.expires = EXPIRY_LONG;
        self
    }

    pub fn build(self) -> Session {
        self.inner
    }
}
