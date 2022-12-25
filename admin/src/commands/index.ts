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
      return `${err.message}`;
    case "CANCELLED":
      return `${err.message} cancelled`;
    case "UNKNOWN":
      return `${err.message}`;
    case "INVALID_ARGUMENT":
      return `Invalid argument, ${err.message}`;
    case "DEADLINE_EXCEEDED":
      return `Deadline exceeded for ${err.message}`;
    case "NOT_FOUND":
      return `${err.message} not found`;
    case "ALREADY_EXISTS":
      return `${err.message} already exists`;
    case "PERMISSION_DENIED":
      return `Permission denied for ${err.message}`;
    case "RESOURCE_EXHAUSTED":
      return `Enf of ${err.message}`;
    case "FAILED_PRECONDITION":
      return `${err.message} precondition failed`;
    case "ABORTED":
      return `${err.message} aborted`;
    case "OUT_OF_RANGE":
      return `${err.message} out of range`;
    case "UNIMPLEMENTED":
      return `${err.message} unimplemented`;
    case "INTERNAL":
      return `An internal error occured ${err.message}`;
    case "UNAVAILABLE":
      return `${err.message} unavailable`;
    case "DATA_LOSS":
      return `Data loss with ${err.message}`;
    case "UNAUTHENTICATED":
      return `${err.message} is unauthenticated`;
    default:
      return "Unknown error.";
  }
}
