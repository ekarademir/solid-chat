// @generated by protobuf-ts 2.8.2
// @generated from protobuf file "chat.proto" (package "chat", syntax proto3)
// tslint:disable
import { UsersAdmin } from "./chat";
import type { UserAdminRequest } from "./chat";
import type { UserAdminResponse } from "./chat";
import type { User } from "./chat";
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { Tenants } from "./chat";
import type { TenantRequest } from "./chat";
import type { ServerStreamingCall } from "@protobuf-ts/runtime-rpc";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { TenantResponse } from "./chat";
import type { Tenant } from "./chat";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service chat.Tenants
 */
export interface ITenantsClient {
    /**
     * @generated from protobuf rpc: Create(chat.Tenant) returns (chat.TenantResponse);
     */
    create(input: Tenant, options?: RpcOptions): UnaryCall<Tenant, TenantResponse>;
    /**
     * @generated from protobuf rpc: List(chat.TenantRequest) returns (stream chat.Tenant);
     */
    list(input: TenantRequest, options?: RpcOptions): ServerStreamingCall<TenantRequest, Tenant>;
    /**
     * @generated from protobuf rpc: Delete(chat.TenantRequest) returns (chat.TenantResponse);
     */
    delete(input: TenantRequest, options?: RpcOptions): UnaryCall<TenantRequest, TenantResponse>;
}
/**
 * @generated from protobuf service chat.Tenants
 */
export class TenantsClient implements ITenantsClient, ServiceInfo {
    typeName = Tenants.typeName;
    methods = Tenants.methods;
    options = Tenants.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: Create(chat.Tenant) returns (chat.TenantResponse);
     */
    create(input: Tenant, options?: RpcOptions): UnaryCall<Tenant, TenantResponse> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<Tenant, TenantResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: List(chat.TenantRequest) returns (stream chat.Tenant);
     */
    list(input: TenantRequest, options?: RpcOptions): ServerStreamingCall<TenantRequest, Tenant> {
        const method = this.methods[1], opt = this._transport.mergeOptions(options);
        return stackIntercept<TenantRequest, Tenant>("serverStreaming", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: Delete(chat.TenantRequest) returns (chat.TenantResponse);
     */
    delete(input: TenantRequest, options?: RpcOptions): UnaryCall<TenantRequest, TenantResponse> {
        const method = this.methods[2], opt = this._transport.mergeOptions(options);
        return stackIntercept<TenantRequest, TenantResponse>("unary", this._transport, method, opt, input);
    }
}
// 
// /Tenants
// 

/**
 *
 * Users
 *
 *
 * @generated from protobuf service chat.UsersAdmin
 */
export interface IUsersAdminClient {
    /**
     * @generated from protobuf rpc: Create(chat.User) returns (chat.UserAdminResponse);
     */
    create(input: User, options?: RpcOptions): UnaryCall<User, UserAdminResponse>;
    /**
     * @generated from protobuf rpc: List(chat.UserAdminRequest) returns (stream chat.User);
     */
    list(input: UserAdminRequest, options?: RpcOptions): ServerStreamingCall<UserAdminRequest, User>;
    /**
     * @generated from protobuf rpc: Delete(chat.UserAdminRequest) returns (chat.UserAdminResponse);
     */
    delete(input: UserAdminRequest, options?: RpcOptions): UnaryCall<UserAdminRequest, UserAdminResponse>;
    /**
     * @generated from protobuf rpc: Update(chat.UserAdminRequest) returns (chat.UserAdminResponse);
     */
    update(input: UserAdminRequest, options?: RpcOptions): UnaryCall<UserAdminRequest, UserAdminResponse>;
}
// 
// /Tenants
// 

/**
 *
 * Users
 *
 *
 * @generated from protobuf service chat.UsersAdmin
 */
export class UsersAdminClient implements IUsersAdminClient, ServiceInfo {
    typeName = UsersAdmin.typeName;
    methods = UsersAdmin.methods;
    options = UsersAdmin.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: Create(chat.User) returns (chat.UserAdminResponse);
     */
    create(input: User, options?: RpcOptions): UnaryCall<User, UserAdminResponse> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<User, UserAdminResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: List(chat.UserAdminRequest) returns (stream chat.User);
     */
    list(input: UserAdminRequest, options?: RpcOptions): ServerStreamingCall<UserAdminRequest, User> {
        const method = this.methods[1], opt = this._transport.mergeOptions(options);
        return stackIntercept<UserAdminRequest, User>("serverStreaming", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: Delete(chat.UserAdminRequest) returns (chat.UserAdminResponse);
     */
    delete(input: UserAdminRequest, options?: RpcOptions): UnaryCall<UserAdminRequest, UserAdminResponse> {
        const method = this.methods[2], opt = this._transport.mergeOptions(options);
        return stackIntercept<UserAdminRequest, UserAdminResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: Update(chat.UserAdminRequest) returns (chat.UserAdminResponse);
     */
    update(input: UserAdminRequest, options?: RpcOptions): UnaryCall<UserAdminRequest, UserAdminResponse> {
        const method = this.methods[3], opt = this._transport.mergeOptions(options);
        return stackIntercept<UserAdminRequest, UserAdminResponse>("unary", this._transport, method, opt, input);
    }
}