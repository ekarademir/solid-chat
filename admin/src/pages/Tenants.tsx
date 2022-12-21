import { createResource, Component, For, Show } from "solid-js";

import { Tenant } from "../chat/chat";
import { TenantsClient } from "../chat/chat.client";
import Loading from "../lib/Loading";
import { transport } from "../lib/transport";

const tenantsService = new TenantsClient(transport);

const Tenants: Component = () => {
  const [tenants] = createResource(listTenants);
  return (
    <Show when={tenants()} keyed={true} fallback={<Loading />}>
      {(tenantsData: Tenant[]) => (
        <For each={tenantsData}>{(tenant) => <>{tenant.name}</>}</For>
      )}
    </Show>
  );
};

export default Tenants;

async function listTenants(): Promise<Tenant[]> {
  try {
    const pendingResponse = tenantsService.list({
      listAll: true,
      id: 0n,
    });
    const tenants = [];
    for await (let t of pendingResponse.responses) tenants.push(t);
    return tenants;
  } catch (e) {
    console.error(e);
    return [];
  }
}
