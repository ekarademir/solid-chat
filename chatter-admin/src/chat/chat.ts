// @generated by protobuf-ts 2.8.2
// @generated from protobuf file "chat.proto" (package "chat", syntax proto3)
// tslint:disable
import { ServiceType } from "@protobuf-ts/runtime-rpc";
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MESSAGE_TYPE } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
// 
// Tenants
// 

/**
 * @generated from protobuf message chat.Tenant
 */
export interface Tenant {
    /**
     * @generated from protobuf field: int32 id = 1;
     */
    id: number;
    /**
     * @generated from protobuf field: string name = 2;
     */
    name: string;
}
/**
 * @generated from protobuf message chat.TenantRequest
 */
export interface TenantRequest {
    /**
     * @generated from protobuf field: bool list_all = 1;
     */
    listAll: boolean;
    /**
     * @generated from protobuf field: string name = 2;
     */
    name: string;
}
/**
 * @generated from protobuf message chat.TenantResponse
 */
export interface TenantResponse {
    /**
     * @generated from protobuf field: chat.Tenant tenant = 1;
     */
    tenant?: Tenant;
}
/**
 * @generated from protobuf message chat.User
 */
export interface User {
    /**
     * @generated from protobuf field: chat.Tenant tenant = 1;
     */
    tenant?: Tenant;
    /**
     * @generated from protobuf field: string id = 2;
     */
    id: string;
    /**
     * @generated from protobuf field: string name = 3;
     */
    name: string;
    /**
     * @generated from protobuf field: string username = 4;
     */
    username: string;
    /**
     * @generated from protobuf field: chat.UserKind kind = 5;
     */
    kind: UserKind;
}
/**
 * @generated from protobuf message chat.UserAdminRequest
 */
export interface UserAdminRequest {
    /**
     * @generated from protobuf field: bool list_all = 1;
     */
    listAll: boolean;
    /**
     * @generated from protobuf field: string username = 2;
     */
    username: string;
}
/**
 * @generated from protobuf message chat.UserAdminResponse
 */
export interface UserAdminResponse {
    /**
     * @generated from protobuf field: chat.User user = 1;
     */
    user?: User;
}
/**
 * @generated from protobuf enum chat.UserKind
 */
export enum UserKind {
    /**
     * @generated from protobuf enum value: VISITOR = 0;
     */
    VISITOR = 0,
    /**
     * @generated from protobuf enum value: INVITEE = 1;
     */
    INVITEE = 1,
    /**
     * @generated from protobuf enum value: REGISTERED = 2;
     */
    REGISTERED = 2
}
// @generated message type with reflection information, may provide speed optimized methods
class Tenant$Type extends MessageType<Tenant> {
    constructor() {
        super("chat.Tenant", [
            { no: 1, name: "id", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<Tenant>): Tenant {
        const message = { id: 0, name: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<Tenant>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Tenant): Tenant {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 id */ 1:
                    message.id = reader.int32();
                    break;
                case /* string name */ 2:
                    message.name = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: Tenant, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* int32 id = 1; */
        if (message.id !== 0)
            writer.tag(1, WireType.Varint).int32(message.id);
        /* string name = 2; */
        if (message.name !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.name);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message chat.Tenant
 */
export const Tenant = new Tenant$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TenantRequest$Type extends MessageType<TenantRequest> {
    constructor() {
        super("chat.TenantRequest", [
            { no: 1, name: "list_all", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 2, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<TenantRequest>): TenantRequest {
        const message = { listAll: false, name: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<TenantRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TenantRequest): TenantRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bool list_all */ 1:
                    message.listAll = reader.bool();
                    break;
                case /* string name */ 2:
                    message.name = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: TenantRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* bool list_all = 1; */
        if (message.listAll !== false)
            writer.tag(1, WireType.Varint).bool(message.listAll);
        /* string name = 2; */
        if (message.name !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.name);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message chat.TenantRequest
 */
export const TenantRequest = new TenantRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TenantResponse$Type extends MessageType<TenantResponse> {
    constructor() {
        super("chat.TenantResponse", [
            { no: 1, name: "tenant", kind: "message", T: () => Tenant }
        ]);
    }
    create(value?: PartialMessage<TenantResponse>): TenantResponse {
        const message = {};
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<TenantResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TenantResponse): TenantResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* chat.Tenant tenant */ 1:
                    message.tenant = Tenant.internalBinaryRead(reader, reader.uint32(), options, message.tenant);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: TenantResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* chat.Tenant tenant = 1; */
        if (message.tenant)
            Tenant.internalBinaryWrite(message.tenant, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message chat.TenantResponse
 */
export const TenantResponse = new TenantResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class User$Type extends MessageType<User> {
    constructor() {
        super("chat.User", [
            { no: 1, name: "tenant", kind: "message", T: () => Tenant },
            { no: 2, name: "id", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "username", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "kind", kind: "enum", T: () => ["chat.UserKind", UserKind] }
        ]);
    }
    create(value?: PartialMessage<User>): User {
        const message = { id: "", name: "", username: "", kind: 0 };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<User>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: User): User {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* chat.Tenant tenant */ 1:
                    message.tenant = Tenant.internalBinaryRead(reader, reader.uint32(), options, message.tenant);
                    break;
                case /* string id */ 2:
                    message.id = reader.string();
                    break;
                case /* string name */ 3:
                    message.name = reader.string();
                    break;
                case /* string username */ 4:
                    message.username = reader.string();
                    break;
                case /* chat.UserKind kind */ 5:
                    message.kind = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: User, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* chat.Tenant tenant = 1; */
        if (message.tenant)
            Tenant.internalBinaryWrite(message.tenant, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* string id = 2; */
        if (message.id !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.id);
        /* string name = 3; */
        if (message.name !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.name);
        /* string username = 4; */
        if (message.username !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.username);
        /* chat.UserKind kind = 5; */
        if (message.kind !== 0)
            writer.tag(5, WireType.Varint).int32(message.kind);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message chat.User
 */
export const User = new User$Type();
// @generated message type with reflection information, may provide speed optimized methods
class UserAdminRequest$Type extends MessageType<UserAdminRequest> {
    constructor() {
        super("chat.UserAdminRequest", [
            { no: 1, name: "list_all", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 2, name: "username", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<UserAdminRequest>): UserAdminRequest {
        const message = { listAll: false, username: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<UserAdminRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: UserAdminRequest): UserAdminRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bool list_all */ 1:
                    message.listAll = reader.bool();
                    break;
                case /* string username */ 2:
                    message.username = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: UserAdminRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* bool list_all = 1; */
        if (message.listAll !== false)
            writer.tag(1, WireType.Varint).bool(message.listAll);
        /* string username = 2; */
        if (message.username !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.username);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message chat.UserAdminRequest
 */
export const UserAdminRequest = new UserAdminRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class UserAdminResponse$Type extends MessageType<UserAdminResponse> {
    constructor() {
        super("chat.UserAdminResponse", [
            { no: 1, name: "user", kind: "message", T: () => User }
        ]);
    }
    create(value?: PartialMessage<UserAdminResponse>): UserAdminResponse {
        const message = {};
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<UserAdminResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: UserAdminResponse): UserAdminResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* chat.User user */ 1:
                    message.user = User.internalBinaryRead(reader, reader.uint32(), options, message.user);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: UserAdminResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* chat.User user = 1; */
        if (message.user)
            User.internalBinaryWrite(message.user, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message chat.UserAdminResponse
 */
export const UserAdminResponse = new UserAdminResponse$Type();
/**
 * @generated ServiceType for protobuf service chat.Tenants
 */
export const Tenants = new ServiceType("chat.Tenants", [
    { name: "Create", options: {}, I: Tenant, O: TenantResponse },
    { name: "List", serverStreaming: true, options: {}, I: TenantRequest, O: Tenant },
    { name: "Delete", options: {}, I: TenantRequest, O: TenantResponse }
]);
/**
 * @generated ServiceType for protobuf service chat.UsersAdmin
 */
export const UsersAdmin = new ServiceType("chat.UsersAdmin", [
    { name: "Create", options: {}, I: User, O: UserAdminResponse },
    { name: "List", serverStreaming: true, options: {}, I: UserAdminRequest, O: User },
    { name: "Delete", options: {}, I: UserAdminRequest, O: UserAdminResponse },
    { name: "Update", options: {}, I: UserAdminRequest, O: UserAdminResponse }
]);
