use std::task::{Context as StdContext, Poll};
use tonic::body::BoxBody;
use tower::{Layer, Service};

#[derive(Debug, Clone, Default)]
pub struct InjectionLayer;

impl<S> Layer<S> for InjectionLayer {
    type Service = InjectionMiddleware<S>;

    fn layer(&self, service: S) -> Self::Service {
        InjectionMiddleware { inner: service }
    }
}

#[derive(Debug, Clone)]
pub struct InjectionMiddleware<S> {
    inner: S,
}

impl<S> Service<hyper::Request<hyper::Body>> for InjectionMiddleware<S>
where
    S: Service<hyper::Request<hyper::Body>, Response = hyper::Response<BoxBody>>
        + Clone
        + Send
        + 'static,
    S::Future: Send + 'static,
{
    type Response = S::Response;
    type Error = S::Error;
    type Future = futures::future::BoxFuture<'static, Result<Self::Response, Self::Error>>;

    fn poll_ready(&mut self, cx: &mut StdContext<'_>) -> Poll<Result<(), Self::Error>> {
        self.inner.poll_ready(cx)
    }

    fn call(&mut self, mut req: hyper::Request<hyper::Body>) -> Self::Future {
        // This is necessary because tonic internally uses `tower::buffer::Buffer`.
        // See https://github.com/tower-rs/tower/issues/547#issuecomment-767629149
        // for details on why this is necessary
        let clone = self.inner.clone();
        let mut inner = std::mem::replace(&mut self.inner, clone);

        Box::pin(async move {
            let has_no_auth = req.headers().get("no-auth").is_some();
            let is_no_auth = req
                .uri()
                .to_string()
                .ends_with("chat.Authentication/BasicAuthentication");

            if is_no_auth && !has_no_auth {
                // no-auth shouldn't be set from client side
                req.headers_mut().insert(
                    "no-auth",
                    // Unwrap is fine since this won't fail.
                    hyper::header::HeaderValue::from_str("true").unwrap(),
                );
                println!("No auth injected");
            }

            let response = inner.call(req).await?;

            Ok(response)
        })
    }
}
