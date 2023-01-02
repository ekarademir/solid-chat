import { createResource, createSignal, Component, For, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { useParams } from "@solidjs/router";

import { RiSystemAddFill } from "solid-icons/ri";
import { RiSystemDeleteBin5Line } from "solid-icons/ri";

import commands from "../../commands/";
import Loading from "../../lib/Loading";
import Modal from "../../components/Modal";
import Table from "../../components/Table";
import { notificationsApi } from "../../lib/notifications/Notifications";
import { errorMessage } from "../../commands/";

const Users: Component = () => {
  const params = useParams();
  const [_state, { scheduleError, scheduleSuccess, scheduleWarning }] =
    notificationsApi();
  const fetchUsers = async () => {
    try {
      return await commands.users.listUsers({
        tenantName: params.tenant,
        start: 0,
        count: 10,
      });
    } catch (e) {
      scheduleError(errorMessage(e));
      return [];
    }
  };

  const saveUser = () => {
    commands.users
      .newUser(userModel)
      .then(() => {
        scheduleSuccess("User created");
        setOpenNewUserModal(false);
      })
      .catch((e) => scheduleError(errorMessage(e)))
      .then(refetch);
  };

  const deleteUser = (username) => {
    commands.users
      .deleteUser({
        name: username,
        tenantName: params.tenant,
      })
      .then(() => scheduleWarning(`${name} deleted`))
      .catch((e) => scheduleError(errorMessage(e)))
      .then(refetch);
  };

  const setPassword = () => {
    //
  };

  const [users, { refetch }] = createResource(fetchUsers);

  // Modal state
  const [openNewUserModal, setOpenNewUserModal] = createSignal(false);
  const [userModel, setUserModel] = createStore({
    username: "",
    kind: 0,
    fullname: null,
    tenantName: params.tenant,
  });

  return (
    <>
      <div class="content">
        <button class="button" onClick={() => setOpenNewUserModal(true)}>
          <span class="icon is-small">
            <RiSystemAddFill />
          </span>
          <span>New User</span>
        </button>
        <Show when={!users.loading} keyed={true} fallback={<Loading />}>
          {() => {
            const values = users().map((x) => x.username);
            return (
              <Table
                columns={[
                  {
                    title: "Username",
                    values,
                  },
                ]}
                actions={[
                  {
                    // Delete
                    icon: <RiSystemDeleteBin5Line />,
                    handler: (row) => {
                      deleteUser(row[0]);
                    },
                  },
                ]}
              />
            );
          }}
        </Show>
      </div>
      <Modal
        title="New User"
        isOpen={openNewUserModal()}
        onClose={() => setOpenNewUserModal(false)}
        onSuccess={() => saveUser()}
      >
        <div class="field">
          <label class="label">Tenant name</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Tenant name"
              value={params.tenant}
              disabled
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Username</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Username"
              value={userModel.username}
              onInput={(e) => setUserModel("username", e.currentTarget.value)}
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Full Name (Optional)</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Full name"
              value={userModel.fullname}
              onInput={(e) => setUserModel("fullname", e.currentTarget.value)}
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Kind</label>
          <div class="control">
            <div class="select">
              <select
                value={userModel.kind}
                onChange={(e) =>
                  setUserModel("kind", parseInt(e.currentTarget.value))
                }
              >
                <For each={Object.entries(commands.users.UserKind)}>
                  {([val, kind]) => <option value={val}>{kind}</option>}
                </For>
              </select>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Users;
