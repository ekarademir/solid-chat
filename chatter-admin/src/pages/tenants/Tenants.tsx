import { createResource, createSignal, Component, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";

import { RiSystemAddFill } from "solid-icons/ri";
import { RiSystemDeleteBin5Line } from "solid-icons/ri";
import { RiDocumentFolderUserLine } from "solid-icons/ri";

import commands from "../../commands/";
import Loading from "../../lib/Loading";
import Modal from "../../components/Modal";
import Table from "../../components/Table";
import { notificationsApi } from "../../lib/notifications/Notifications";
import { errorMessage } from "../../commands/";

const Tenants: Component = () => {
  const [_state, { scheduleError, scheduleSuccess, scheduleWarning }] =
    notificationsApi();

  const fetchTenants = async () => {
    try {
      return await commands.tenants.listTenants();
    } catch (e) {
      scheduleError(errorMessage(e));
      return [];
    }
  };

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

  const [tenants, { refetch }] = createResource(fetchTenants);
  const [tenantName, setTenantName] = createSignal("");
  const [openNewTenantModal, setOpenNewTenantModal] = createSignal(false);
  const navigate = useNavigate();

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
                  {
                    // List Users
                    icon: <RiDocumentFolderUserLine />,
                    handler: (row) => {
                      navigate(`/tenant/${row[0]}/users`);
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
