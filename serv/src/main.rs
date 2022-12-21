pub mod commands;
pub mod models;
pub mod schema;
pub mod services;

pub mod chat {
    tonic::include_proto!("chat");
}

use http::{header::HeaderName, HeaderValue, Method};
use tonic::transport::Server;
use tower_http::cors::{Any, CorsLayer};

use crate::services::tenants::{TenantsServer, TenantsService};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "[::1]:50051".parse()?;
    let tenants_service = TenantsServer::new(TenantsService::default());

    let grpc_encoding_header = HeaderName::from_static("grpc-encoding");
    let grpc_message_header = HeaderName::from_static("grpc-message");
    let grpc_status_header = HeaderName::from_static("grpc-status");

    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST])
        .allow_origin("http://localhost:3000".parse::<HeaderValue>().unwrap())
        .allow_headers(Any)
        .expose_headers([
            grpc_encoding_header,
            grpc_message_header,
            grpc_status_header,
        ]);

    println!("Listenning at {}", addr);
    Server::builder()
        .accept_http1(true)
        .layer(cors)
        .layer(tonic_web::GrpcWebLayer::new())
        .add_service(tenants_service)
        .serve(addr)
        .await?;

    Ok(())
}
