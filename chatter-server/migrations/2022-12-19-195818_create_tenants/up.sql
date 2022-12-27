-- Your SQL goes here
CREATE TABLE tenants (
  id SERIAL PRIMARY KEY,
  tenant_name VARCHAR NOT NULL UNIQUE
);