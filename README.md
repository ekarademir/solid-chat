# Solid-Chat

A project that implements a chat app simialr to Slack. It uses **Proto Buffers** anf **gRPC** to communicate with the server. Admin and the client application are written in **SolidJS**. Persistance layer is **PostgreSQL**.

## Podman

Start Podman in rootful setting because Postgres image requires rootful.

```sh
podman machine set --rootful
podman machine start
```

## Persistance Layer

### Diesel CLI installation

Also [see](https://stackoverflow.com/questions/70313347/ld-library-not-found-for-lpq-when-build-rust-in-macos?rq=1).

```sh
brew install libpq
brew link --force libpq
```

then

```sh
PQ_LIB_DIR="$(brew --prefix libpq)/lib"

cargo install diesel_cli --no-default-features --features postgres
```

### Starting Postgres

We use the latest [Postgres](https://github.com/docker-library/docs/blob/master/postgres/README.md) image.

Below command requires rootful start of podman.

Persistence layer using Postgres that binds to the data folder inside this directory which will remove after Ctrl+C:

```sh
podman run --rm --name chat-data -v $(pwd)/data:/var/lib/postgresql/data -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
```

### Default creds

```
password: mysecretpassword
username: postgres

postgres://postgres:mysecretpassword@localhost/diesel_demo
```

## In memory storage

### Starting redis

podman run --rm --name chat-redis -d redis

## Protobuf

### Web client generation

Run in the web folders. See [protobuf-ts](https://github.com/timostamm/protobuf-ts/blob/master/MANUAL.md)

```
npx protoc --ts_out src/chat --proto_path ../chat-proto ../chat-proto/chat.proto
```

Also [see](https://github.com/grpc/grpc-web/issues/704#issuecomment-1215965557)

```sh
brew install protobuf@3
brew link --overwrite protobuf@3
```
