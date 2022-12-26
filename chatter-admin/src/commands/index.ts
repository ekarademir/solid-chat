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

export function errorMessage(err: Error | RpcError) {
  if (err instanceof RpcError) {
    const message = decodeURI(err.message);
    switch (`${err.code}`) {
      case "OK":
        return `${message}`;
      case "CANCELLED":
        return `${message} cancelled`;
      case "UNKNOWN":
        return `${message}`;
      case "INVALID_ARGUMENT":
        return `Invalid argument, ${message}`;
      case "DEADLINE_EXCEEDED":
        return `Deadline exceeded for ${message}`;
      case "NOT_FOUND":
        return `${message} not found`;
      case "ALREADY_EXISTS":
        return `${message} already exists`;
      case "PERMISSION_DENIED":
        return `Permission denied for ${message}`;
      case "RESOURCE_EXHAUSTED":
        return `Enf of ${message}`;
      case "FAILED_PRECONDITION":
        return `${message}`;
      case "ABORTED":
        return `${message} aborted`;
      case "OUT_OF_RANGE":
        return `${message} out of range`;
      case "UNIMPLEMENTED":
        return `${message} unimplemented`;
      case "INTERNAL":
        return `A system error occured: "${message}"`;
      case "UNAVAILABLE":
        return `${message} unavailable`;
      case "DATA_LOSS":
        return `Data loss with ${message}`;
      case "UNAUTHENTICATED":
        return `${message} is unauthenticated`;
      default:
        return "Unknown error.";
    }
  } else {
    return err.message;
  }
}
