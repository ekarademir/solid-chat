import { Tenant } from "../chat/chat";
import { TenantsClient } from "../chat/chat.client";
import { transport } from "../lib/transport";

import { errorMessage } from ".";

const tenantsService = new TenantsClient(transport);

export async function listTenants(): Promise<Tenant[]> {
  try {
    const pendingResponse = tenantsService.list({
      listAll: true,
      name: "",
    });
    const tenants = [];
    for await (let t of pendingResponse.responses) tenants.push(t);
    return tenants;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function newTenant(name: string): Promise<Tenant> {
  try {
    const pendingResponse = tenantsService.create({
      name,
      id: 0,
    });
    const response = await pendingResponse.response;
    return response.tenant;
  } catch (e) {
    console.log(errorMessage(e));
  }
}

export async function deleteTenant(name: string) {
  try {
    const pendingResponse = tenantsService.delete({
      listAll: false,
      name,
    });
    return pendingResponse.response;
  } catch (e) {
    console.error(e);
  }
}
