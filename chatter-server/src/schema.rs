// @generated automatically by Diesel CLI.

diesel::table! {
    tenants (id) {
        id -> Int4,
        tenant_name -> Varchar,
    }
}
