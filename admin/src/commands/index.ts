"use strict";
import { newTenant, listTenants, deleteTenant } from "./tenants";
import { RpcError } from "grpc-web";

export default {
  tenants: {
    newTenant,
    listTenants,
    deleteTenant,
  },
};

export function errorMessage(err: RpcError) {
  switch (`${err.code}`) {
    case "OK":
      return `${decodeURI(err.message)}`;
    case "CANCELLED":
      return `${decodeURI(err.message)} cancelled`;
    case "UNKNOWN":
      return `${decodeURI(err.message)}`;
    case "INVALID_ARGUMENT":
      return `Invalid argument, ${decodeURI(err.message)}`;
    case "DEADLINE_EXCEEDED":
      return `Deadline exceeded for ${decodeURI(err.message)}`;
    case "NOT_FOUND":
      return `${decodeURI(err.message)} not found`;
    case "ALREADY_EXISTS":
      return `${decodeURI(err.message)} already exists`;
    case "PERMISSION_DENIED":
      return `Permission denied for ${decodeURI(err.message)}`;
    case "RESOURCE_EXHAUSTED":
      return `Enf of ${decodeURI(err.message)}`;
    case "FAILED_PRECONDITION":
      return `${decodeURI(err.message)}`;
    case "ABORTED":
      return `${decodeURI(err.message)} aborted`;
    case "OUT_OF_RANGE":
      return `${decodeURI(err.message)} out of range`;
    case "UNIMPLEMENTED":
      return `${decodeURI(err.message)} unimplemented`;
    case "INTERNAL":
      return `An internal error occured ${decodeURI(err.message)}`;
    case "UNAVAILABLE":
      return `${decodeURI(err.message)} unavailable`;
    case "DATA_LOSS":
      return `Data loss with ${decodeURI(err.message)}`;
    case "UNAUTHENTICATED":
      return `${decodeURI(err.message)} is unauthenticated`;
    default:
      return "Unknown error.";
  }
}
