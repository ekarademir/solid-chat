import {
  FindWithTenantRequest,
  ListWithTenantRequest,
  UserKind,
  UserPassword,
} from "../chat/chat";
import { UsersAdminClient } from "../chat/chat.client";
import { transport } from "../lib/transport";

const usersAdminService = new UsersAdminClient(transport);

export async function listUsers(opts: ListWithTenantRequest) {
  const pending = usersAdminService.list(opts);
  const users = [];
  for await (let u of pending.responses) users.push(u);
  return users;
}

export async function newUser(newUser) {
  const pending = usersAdminService.create(newUser);
  return (await pending.response).user;
}

export async function deleteUser(opts: FindWithTenantRequest) {
  const pending = usersAdminService.delete(opts);
  return (await pending.response).user;
}

export interface SetPassword extends UserPassword {
  passwordRepeat: string;
}

export async function setPassword(opts: SetPassword) {
  if (opts.password !== opts.passwordRepeat) {
    throw new Error("Passwords don't match");
  }
  const pending = usersAdminService.setPassword(opts);
  return (await pending.response).user;
}

type UserKindType = { [id: number]: string };

export const UserKindHumanReadable: UserKindType = Object.create(null);

UserKindHumanReadable[UserKind.INVITEE] = "Invitee";
UserKindHumanReadable[UserKind.REGISTERED] = "Registered";
UserKindHumanReadable[UserKind.VISITOR] = "Visitor";
