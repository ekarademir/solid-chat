import { Tenant } from "../chat/chat";
import { TenantsClient } from "../chat/chat.client";
import { transport } from "../lib/transport";

const tenantsService = new TenantsClient(transport);

export async function listTenants(): Promise<Tenant[]> {
  const pendingResponse = tenantsService.list({
    listAll: true,
    name: "",
  });
  const tenants = [];
  for await (let t of pendingResponse.responses) tenants.push(t);
  return tenants;
}

export async function newTenant(name: string): Promise<Tenant> {
  const pendingResponse = tenantsService.create({
    name,
    id: 0,
  });
  const response = await pendingResponse.response;
  return response.tenant;
}

export async function deleteTenant(name: string) {
  const pendingResponse = tenantsService.delete({
    listAll: false,
    name,
  });
  return pendingResponse.response;
}
