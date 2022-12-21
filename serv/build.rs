fn main() -> Result<(), Box<dyn std::error::Error>> {
  println!("cargo:rustc-env={}={}", "RUST_LOG", "debug");

  tonic_build::compile_protos("../chat-proto/chat.proto")?;
  Ok(())
}
