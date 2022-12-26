pub mod commands;
pub mod errors;
pub mod models;
pub mod schema;
pub mod services;

pub mod chat {
    tonic::include_proto!("chat");
}

use http::{header::HeaderName, HeaderValue, Method};
use tonic::transport::{Identity, Server, ServerTlsConfig};
use tower_http::cors::{Any, CorsLayer};

use crate::services::tenants::{TenantsServer, TenantsService};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "[::1]:50051".parse()?;
    listen(addr).await?;

    Ok(())
}

async fn listen(addr: std::net::SocketAddr) -> Result<(), Box<dyn std::error::Error>> {
    let tenants_service = TenantsServer::new(TenantsService::default());

    // TLS
    let key = std::fs::read_to_string("../ssl/key.pem")?;
    let cert = std::fs::read_to_string("../ssl/cert.pem")?;
    let tls_config = ServerTlsConfig::new().identity(Identity::from_pem(&cert, &key));

    // Ready for grpc-web
    let grpc_encoding_header = HeaderName::from_static("grpc-encoding");
    let grpc_message_header = HeaderName::from_static("grpc-message");
    let grpc_status_header = HeaderName::from_static("grpc-status");

    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST])
        .allow_origin(
            "https://rotatingwave.local:8000"
                .parse::<HeaderValue>()
                .unwrap(),
        )
        .allow_headers(Any)
        .expose_headers([
            grpc_encoding_header,
            grpc_message_header,
            grpc_status_header,
        ]);

    // Listen
    println!("Listenning at {}", addr);
    Server::builder()
        .tls_config(tls_config)?
        .accept_http1(true)
        .layer(cors)
        .layer(tonic_web::GrpcWebLayer::new())
        .add_service(tenants_service)
        .serve(addr)
        .await?;

    Ok(())
}
