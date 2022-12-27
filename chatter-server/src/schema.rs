// @generated automatically by Diesel CLI.

diesel::table! {
    tenants (id) {
        id -> Int4,
        tenant_name -> Varchar,
    }
}

diesel::table! {
    users (id) {
        id -> Uuid,
        username -> Varchar,
        fullname -> Nullable<Varchar>,
        password -> Varchar,
        kind -> Int4,
        tenant_id -> Int4,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    tenants,
    users,
);
