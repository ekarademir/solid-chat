import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";

export const transport = new GrpcWebFetchTransport({
  baseUrl: "https://rotatingwave.local:50051",
  format: "binary",
});
