import { Tenant, ListRequest } from "../chat/chat";
import { TenantsClient } from "../chat/chat.client";
import { transport } from "../lib/transport";

const tenantsService = new TenantsClient(transport);

export async function listTenants(opts: ListRequest) {
  const pending = tenantsService.list(opts);
  const tenants = [];
  for await (let t of pending.responses) tenants.push(t);
  return tenants;
}

export async function newTenant(name: string) {
  const pending = tenantsService.create({
    name,
    id: 0,
  });
  return (await pending.response).tenant;
}

export async function deleteTenant(name: string) {
  const pending = tenantsService.delete({
    param: { findOneof: { oneofKind: "name", name } },
  });
  return (await pending.response).tenant;
}
