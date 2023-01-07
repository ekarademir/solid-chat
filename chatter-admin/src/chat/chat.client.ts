// @generated by protobuf-ts 2.8.2
// @generated from protobuf file "chat.proto" (package "chat", syntax proto3)
// tslint:disable
import { UsersAdmin } from "./chat";
import type { UserPassword } from "./chat";
import type { FindWithTenantRequest } from "./chat";
import type { ListWithTenantRequest } from "./chat";
import type { UserAdminResponse } from "./chat";
import type { User } from "./chat";
import { Tenants } from "./chat";
import type { FindRequest } from "./chat";
import type { ListRequest } from "./chat";
import type { ServerStreamingCall } from "@protobuf-ts/runtime-rpc";
import type { TenantResponse } from "./chat";
import type { Tenant } from "./chat";
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { Authentication } from "./chat";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { BasicAuthenticationResponse } from "./chat";
import type { BasicAuthenticationRequest } from "./chat";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service chat.Authentication
 */
export interface IAuthenticationClient {
    /**
     * @generated from protobuf rpc: BasicAuthentication(chat.BasicAuthenticationRequest) returns (chat.BasicAuthenticationResponse);
     */
    basicAuthentication(input: BasicAuthenticationRequest, options?: RpcOptions): UnaryCall<BasicAuthenticationRequest, BasicAuthenticationResponse>;
}
/**
 * @generated from protobuf service chat.Authentication
 */
export class AuthenticationClient implements IAuthenticationClient, ServiceInfo {
    typeName = Authentication.typeName;
    methods = Authentication.methods;
    options = Authentication.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: BasicAuthentication(chat.BasicAuthenticationRequest) returns (chat.BasicAuthenticationResponse);
     */
    basicAuthentication(input: BasicAuthenticationRequest, options?: RpcOptions): UnaryCall<BasicAuthenticationRequest, BasicAuthenticationResponse> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<BasicAuthenticationRequest, BasicAuthenticationResponse>("unary", this._transport, method, opt, input);
    }
}
/**
 * @generated from protobuf service chat.Tenants
 */
export interface ITenantsClient {
    /**
     * @generated from protobuf rpc: Create(chat.Tenant) returns (chat.TenantResponse);
     */
    create(input: Tenant, options?: RpcOptions): UnaryCall<Tenant, TenantResponse>;
    /**
     * @generated from protobuf rpc: List(chat.ListRequest) returns (stream chat.Tenant);
     */
    list(input: ListRequest, options?: RpcOptions): ServerStreamingCall<ListRequest, Tenant>;
    /**
     * @generated from protobuf rpc: Delete(chat.FindRequest) returns (chat.TenantResponse);
     */
    delete(input: FindRequest, options?: RpcOptions): UnaryCall<FindRequest, TenantResponse>;
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
     * @generated from protobuf rpc: List(chat.ListRequest) returns (stream chat.Tenant);
     */
    list(input: ListRequest, options?: RpcOptions): ServerStreamingCall<ListRequest, Tenant> {
        const method = this.methods[1], opt = this._transport.mergeOptions(options);
        return stackIntercept<ListRequest, Tenant>("serverStreaming", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: Delete(chat.FindRequest) returns (chat.TenantResponse);
     */
    delete(input: FindRequest, options?: RpcOptions): UnaryCall<FindRequest, TenantResponse> {
        const method = this.methods[2], opt = this._transport.mergeOptions(options);
        return stackIntercept<FindRequest, TenantResponse>("unary", this._transport, method, opt, input);
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
     * @generated from protobuf rpc: List(chat.ListWithTenantRequest) returns (stream chat.User);
     */
    list(input: ListWithTenantRequest, options?: RpcOptions): ServerStreamingCall<ListWithTenantRequest, User>;
    /**
     * @generated from protobuf rpc: Delete(chat.FindWithTenantRequest) returns (chat.UserAdminResponse);
     */
    delete(input: FindWithTenantRequest, options?: RpcOptions): UnaryCall<FindWithTenantRequest, UserAdminResponse>;
    /**
     * @generated from protobuf rpc: Update(chat.User) returns (chat.UserAdminResponse);
     */
    update(input: User, options?: RpcOptions): UnaryCall<User, UserAdminResponse>;
    /**
     * @generated from protobuf rpc: SetPassword(chat.UserPassword) returns (chat.UserAdminResponse);
     */
    setPassword(input: UserPassword, options?: RpcOptions): UnaryCall<UserPassword, UserAdminResponse>;
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
     * @generated from protobuf rpc: List(chat.ListWithTenantRequest) returns (stream chat.User);
     */
    list(input: ListWithTenantRequest, options?: RpcOptions): ServerStreamingCall<ListWithTenantRequest, User> {
        const method = this.methods[1], opt = this._transport.mergeOptions(options);
        return stackIntercept<ListWithTenantRequest, User>("serverStreaming", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: Delete(chat.FindWithTenantRequest) returns (chat.UserAdminResponse);
     */
    delete(input: FindWithTenantRequest, options?: RpcOptions): UnaryCall<FindWithTenantRequest, UserAdminResponse> {
        const method = this.methods[2], opt = this._transport.mergeOptions(options);
        return stackIntercept<FindWithTenantRequest, UserAdminResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: Update(chat.User) returns (chat.UserAdminResponse);
     */
    update(input: User, options?: RpcOptions): UnaryCall<User, UserAdminResponse> {
        const method = this.methods[3], opt = this._transport.mergeOptions(options);
        return stackIntercept<User, UserAdminResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: SetPassword(chat.UserPassword) returns (chat.UserAdminResponse);
     */
    setPassword(input: UserPassword, options?: RpcOptions): UnaryCall<UserPassword, UserAdminResponse> {
        const method = this.methods[4], opt = this._transport.mergeOptions(options);
        return stackIntercept<UserPassword, UserAdminResponse>("unary", this._transport, method, opt, input);
    }
}
