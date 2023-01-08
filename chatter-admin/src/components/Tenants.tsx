import { createResource, createSignal, Component, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";

import { RiSystemAddFill } from "solid-icons/ri";
import { RiSystemDeleteBin5Line } from "solid-icons/ri";
import { RiDocumentFolderUserLine } from "solid-icons/ri";

import Loading from "../lib/Loading";
import Modal from "./Modal";
import Table from "./Table";
import { errorMessage } from "../lib/error-message";

import { notificationsApi } from "../lib/notifications/Notifications";
import { tenantsService } from "../services/TenantsService";

const Tenants: Component = () => {
  const [_s1, { scheduleError, scheduleSuccess, scheduleWarning }] =
    notificationsApi();
  const [_s2, { deleteTenant, listTenants, newTenant }] = tenantsService();

  const fetchTenants = async () => {
    try {
      return await listTenants({
        start: 0,
        count: 10,
      });
    } catch (e) {
      scheduleError(errorMessage(e));
      return [];
    }
  };

  const saveTenant = () => {
    const name = tenantName();
    if (name) {
      newTenant(name)
        .then(() => scheduleSuccess(`Tenant, ${name}, created`))
        .catch((e) => scheduleError(errorMessage(e)))
        .then(refetch);
    }
    setOpenNewTenantModal(false);
  };

  const removeTenant = (name) => {
    deleteTenant(name)
      .then(() => scheduleWarning(`${name} deleted`))
      .catch((e) => scheduleError(errorMessage(e)))
      .then(refetch);
  };

  const [tenants, { refetch }] = createResource(fetchTenants);
  const navigate = useNavigate();

  // Modal state
  const [openNewTenantModal, setOpenNewTenantModal] = createSignal(false);
  const [tenantName, setTenantName] = createSignal("");

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
                      removeTenant(row[0]);
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
