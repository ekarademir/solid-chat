use anyhow::{Context, Result};
use redis::Connection;
use uuid::Uuid;

const EXPIRY_S: usize = 60 * 15; // 15mins

pub struct Session<'a> {
    pub hash: Uuid,
    pub identity: &'a str,
}

impl<'a> std::fmt::Display for Session<'a> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}:{}", self.hash, self.identity)
    }
}

impl<'a> Session<'a> {
    pub fn new(identity: &'a str) -> Self {
        Session {
            hash: Uuid::new_v4(),
            identity,
        }
    }

    pub fn create(&'a self, conn: &mut Connection) -> Result<&Self> {
        let key = self.to_string();
        // Atomic set and expire
        redis::transaction(conn, &[&key], |conn, pipe| {
            pipe.set(&key, "NEW".to_string())
                .ignore()
                .expire(&key, EXPIRY_S)
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
}
