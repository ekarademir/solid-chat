import { createResource, createSignal, Component, Show } from "solid-js";

import { RiSystemAddFill } from "solid-icons/ri";
import { RiSystemDeleteBin5Line } from "solid-icons/ri";

import commands from "../../commands/";
import Loading from "../../lib/Loading";
import Modal from "../../components/Modal";
import Table from "../../components/table";
import { notificationsApi } from "../../lib/Notifications";
import { errorMessage } from "../../commands/";

const Tenants: Component = () => {
  const [tenants, { refetch }] = createResource(commands.tenants.listTenants);
  const [tenantName, setTenantName] = createSignal("");
  const [openNewTenantModal, setOpenNewTenantModal] = createSignal(false);
  const [_state, { scheduleError, scheduleSuccess, scheduleWarning }] =
    notificationsApi();

  const saveTenant = () => {
    const name = tenantName();
    if (name) {
      commands.tenants
        .newTenant(name)
        .then(() => scheduleSuccess(`${name} successfully created`))
        .catch((e) => scheduleError(errorMessage(e)))
        .then(refetch);
    }
    setOpenNewTenantModal(false);
  };

  const deleteTenant = (name) => {
    commands.tenants
      .deleteTenant(name)
      .then(() => scheduleWarning(`${name} deleted`))
      .catch((e) => scheduleError(errorMessage(e)))
      .then(refetch);
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
                      deleteTenant(row[0]);
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
