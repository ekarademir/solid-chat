import { createResource, createSignal, Component, Show } from "solid-js";

import { RiSystemAddFill } from "solid-icons/ri";
import { RiSystemDeleteBin5Line } from "solid-icons/ri";

import commands from "../../commands/";
import Loading from "../../lib/Loading";
import Modal from "../../components/Modal";
import Table from "../../components/table";

const Tenants: Component = () => {
  const [tenants, { refetch }] = createResource(commands.tenants.listTenants);
  const [tenantName, setTenantName] = createSignal("");
  const [openNewTenantModal, setOpenNewTenantModal] = createSignal(false);
  const saveTenant = () => {
    const name = tenantName();
    if (name) {
      commands.tenants.newTenant(name).then(refetch);
    }
    setOpenNewTenantModal(false);
  };

  return (
    <>
      <div class="content">
        <button class="button" onClick={() => setOpenNewTenantModal(true)}>
          <span class="icon is-small">
            <RiSystemAddFill />
          </span>
          <span>New Tenant</span>
        </button>
        <Show when={!tenants.loading} keyed={true} fallback={<Loading />}>
          {() => {
            const values = tenants().map((x) => x.name);
            return (
              <Table
                columns={[
                  {
                    title: "Name",
                    values,
                  },
                ]}
                actions={[
                  {
                    // Delete
                    icon: <RiSystemDeleteBin5Line />,
                    handler: (row) => {
                      commands.tenants.deleteTenant(row[0]).then(refetch);
                    },
                  },
                ]}
              />
            );
          }}
        </Show>
      </div>
      <Modal
        title="New Tenant"
        isOpen={openNewTenantModal()}
        onClose={() => setOpenNewTenantModal(false)}
        onSuccess={() => saveTenant()}
      >
        <div class="field">
          <label class="label">Name</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Tenant name"
              onInput={(e) => setTenantName(e.currentTarget.value)}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Tenants;
