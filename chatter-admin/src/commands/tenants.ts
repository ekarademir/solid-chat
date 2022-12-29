import { Tenant } from "../chat/chat";
import { TenantsClient } from "../chat/chat.client";
import { transport } from "../lib/transport";

const tenantsService = new TenantsClient(transport);

export async function listTenants(): Promise<Tenant[]> {
  const pending = tenantsService.list({
    listAll: true,
    name: "",
  });
  const tenants = [];
  for await (let t of pending.responses) tenants.push(t);
  return tenants;
}

export async function newTenant(name: string): Promise<Tenant> {
  const pending = tenantsService.create({
    name,
    id: 0,
  });
  return (await pending.response).tenant;
}

export async function deleteTenant(name: string) {
  const pending = tenantsService.delete({
    listAll: false,
    name,
  });
  return pending.response;
}
