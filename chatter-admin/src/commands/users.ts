import { User, ListWithTenantRequest } from "../chat/chat";
import { UsersAdminClient } from "../chat/chat.client";
import { transport } from "../lib/transport";

const usersAdminService = new UsersAdminClient(transport);

export async function listUsers(opts: ListWithTenantRequest): Promise<User[]> {
  const pending = usersAdminService.list(opts);
  const users = [];
  for await (let u of pending.responses) users.push(u);
  return users;
}

export async function newUser(newUser): Promise<User> {
  const pending = usersAdminService.create(newUser);
  return (await pending.response).user;
}
