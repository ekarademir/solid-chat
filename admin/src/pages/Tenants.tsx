import { createResource, Component, For, Show } from "solid-js";

import { Tenant } from "../chat/chat";
import { TenantsClient } from "../chat/chat.client";
import Loading from "../lib/Loading";
import { transport } from "../lib/transport";

const tenantsService = new TenantsClient(transport);

const Tenants: Component = () => {
  const [tenants] = createResource(listTenants);

  return (
    <>
      <button onClick={() => newTenant().then((t) => console.log(t))}>
        New Tenant
      </button>
      <Show when={tenants()} keyed={true} fallback={<Loading />}>
        {(tenantsData: Tenant[]) => (
          <For each={tenantsData}>
            {(tenant) => (
              <div>
                {tenant.name}
                <button
                  onClick={() =>
                    deleteTenant(tenant.name).then(() =>
                      console.log(`Deleted ${tenant.name}`)
                    )
                  }
                >
                  Del
                </button>
              </div>
            )}
          </For>
        )}
      </Show>
    </>
  );
};

export default Tenants;

async function listTenants(): Promise<Tenant[]> {
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

async function newTenant(): Promise<Tenant> {
  try {
    const pendingResponse = tenantsService.create({
      name: "Yeni",
      id: 0,
    });
    const response = await pendingResponse.response;
    return response.tenant;
  } catch (e) {
    console.error(e);
  }
}

async function deleteTenant(name: string) {
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
