import { createResource, Component, For, Show } from "solid-js";
import { RiSystemDeleteBin5Line } from "solid-icons/ri";
import { RiSystemAddFill } from "solid-icons/ri";

import commands from "../../commands/";
import Loading from "../../lib/Loading";
import Modal from "../../components/Modal";

const Tenants: Component = () => {
  const [tenants, { refetch }] = createResource(commands.tenants.listTenants);

  return (
    <>
      <div class="content">
        <button
          class="button"
          onClick={() => commands.tenants.newTenant().then(() => refetch())}
        >
          <span class="icon is-small">
            <RiSystemAddFill />
          </span>
          <span>New Tenant</span>
        </button>
        <Show when={!tenants.loading} keyed={true} fallback={<Loading />}>
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <For each={tenants()}>
                {(tenant) => (
                  <tr>
                    <td>
                      <div class="my-2">{tenant.name}</div>
                    </td>
                    <td>
                      <button
                        class="button"
                        onClick={() =>
                          commands.tenants
                            .deleteTenant(tenant.name)
                            .then(() => refetch())
                        }
                      >
                        <span class="icon is-small">
                          <RiSystemDeleteBin5Line />
                        </span>
                      </button>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </Show>
      </div>
      <Modal title="New Tenant">Tenant</Modal>
    </>
  );
};

export default Tenants;
