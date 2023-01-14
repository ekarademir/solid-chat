use anyhow::{Context, Result};
use redis::Connection;
use uuid::Uuid;

const EXPIRY_S: usize = 60 * 15; // 15mins

pub struct Session {
    pub hash: Uuid,
    pub state: String,
}

impl<'a> std::fmt::Display for Session {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.hash)
    }
}

impl<'a> Session {
    pub fn new(token: Option<&'a str>) -> Self {
        Session {
            hash: token
                .and_then(|x| Uuid::parse_str(x).ok())
                .unwrap_or(Uuid::new_v4()),
            state: "NEW".to_string(),
        }
    }

    pub fn save(self, conn: &mut Connection) -> Result<Self> {
        let key = self.to_string();
        // Atomic set and expire
        redis::transaction(conn, &[&key], |conn, pipe| {
            pipe.set(&key, self.state.clone())
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

    pub fn load(mut self, conn: &mut Connection) -> Result<Self> {
        let result: String = redis::cmd("GET")
            .arg(self.to_string())
            .query(conn)
            .context(format!("Can't find session {}", self.hash))?;

        self.state = result;

        Ok(self)
    }
}
