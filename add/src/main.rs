use http::Response;
use lambda_http::{run, http::StatusCode, service_fn, Error, IntoResponse, Request, RequestExt};
use serde::{Deserialize, Serialize};
use serde_json::json;

#[tokio::main]
async fn main() -> Result<(), Error> {
    // tracing_subscriber::fmt()
    //     .with_ansi(false)
    //     .without_time()
    //     .with_max_level(tracing_subscriber::filter::LevelFilter::INFO)
    //     .init();

    run(service_fn(add)).await
}

pub async fn add(event: Request) -> Result<impl IntoResponse, Error> {
    let body = event.payload::<MyPayload>()?;

    let response = Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", "application/json")
        .body(json!({
            "message": "Hello World",
            "payload": body, 
          }).to_string())
        .map_err(Box::new)?;

    Ok(response)
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct MyPayload {
    pub prop1: String,
    pub prop2: String,
}