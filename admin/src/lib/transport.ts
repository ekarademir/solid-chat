import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";

export const transport = new GrpcWebFetchTransport({
  baseUrl: "http://localhost:50051",
  format: "binary",
});
