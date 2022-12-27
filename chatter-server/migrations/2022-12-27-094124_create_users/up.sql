-- Your SQL goes here
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR NOT NULL,
  fullname VARCHAR,
  password VARCHAR NOT NULL,
  kind INTEGER NOT NULL,
  tenant_id INTEGER NOT NULL
);

CREATE UNIQUE INDEX users_tenant_username ON users (
  tenant_id, username
);