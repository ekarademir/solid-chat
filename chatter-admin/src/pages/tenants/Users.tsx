import { createResource, createSignal, Component, For, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { useParams } from "@solidjs/router";

import { RiSystemAddFill } from "solid-icons/ri";
import { RiSystemDeleteBin5Line } from "solid-icons/ri";
import { RiSystemLockPasswordLine } from "solid-icons/ri";
import { RiDesignEditBoxLine } from "solid-icons/ri";

import Table from "../../components/Table";
import LabelledInput from "../../components/form/LabelledInput";

import SetPassportForm from "../../components/tenants/users/SetPasswordForm";

import commands from "../../commands/";
import Loading from "../../lib/Loading";
import Modal from "../../components/Modal";
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
        setNewEditUserModalOpen(false);
      })
      .catch((e) => scheduleError(errorMessage(e)))
      .then(refetch);
  };

  const updateUser = () => {
    commands.users
      .updateUser(userModel)
      .then(() => {
        scheduleSuccess("User updated");
        setNewEditUserModalOpen(false);
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
      .then(() => scheduleWarning(`${username} deleted`))
      .catch((e) => scheduleError(errorMessage(e)))
      .then(refetch);
  };

  const setPassword = (username) => {
    setUserPasswordModel("username", username);
    setOpenPasswordModal(true);
  };

  const editUser = (username) => {
    const user = users()
      .filter((x) => x.username === username)
      .at(0);
    setUserModel(user);
    openNewEditUserModal({ isNew: false });
  };

  const savePassword = () => {
    commands.users
      .setPassword(userPasswordModel)
      .then(() => {
        scheduleSuccess("Password set");
        setOpenPasswordModal(false);
      })
      .catch((e) => scheduleError(errorMessage(e)))
      .then(refetch);
  };

  const [users, { refetch }] = createResource(fetchUsers);

  // Edit Update User Modal state
  const [newEditUserModalOpen, setNewEditUserModalOpen] = createSignal(false);
  const [isEditUser, setIsEditUser] = createSignal(false);
  const [userModel, setUserModel] = createStore({
    id: null,
    username: "",
    kind: 0,
    fullname: null,
    tenantName: params.tenant,
  });

  const openNewEditUserModal = ({ isNew = true }) => {
    isNew ? setIsEditUser(false) : setIsEditUser(true);
    setNewEditUserModalOpen(true);
  };

  // Password reset state
  const [openPasswordModal, setOpenPasswordModal] = createSignal(false);
  const [userPasswordModel, setUserPasswordModel] = createStore({
    username: "",
    password: "",
    passwordRepeat: "",
    tenantName: params.tenant,
  });

  return (
    <>
      <div class="content">
        <button
          class="button"
          onClick={() => openNewEditUserModal({ isNew: true })}
        >
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
                  {
                    // Set password
                    icon: <RiSystemLockPasswordLine />,
                    handler: (row) => {
                      setPassword(row[0]);
                    },
                  },
                  {
                    // Edit user
                    icon: <RiDesignEditBoxLine />,
                    handler: (row) => {
                      editUser(row[0]);
                    },
                  },
                ]}
              />
            );
          }}
        </Show>
      </div>
      <Modal
        title={isEditUser() ? "Edit User" : "New User"}
        isOpen={newEditUserModalOpen()}
        onClose={() => setNewEditUserModalOpen(false)}
        onSuccess={() => (isEditUser() ? updateUser() : saveUser())}
      >
        <LabelledInput
          label="Tenant name"
          value={params.tenant}
          placeholder="Tenant name"
          disabled
        />
        <LabelledInput
          label="Username"
          onInput={(e) => setUserModel("username", e.currentTarget.value)}
          placeholder="Username"
          value={userModel.username}
          disabled={isEditUser()}
        />
        <LabelledInput
          label="Full Name (optional)"
          placeholder="Full name"
          value={userModel.fullname}
          onInput={(e) => setUserModel("fullname", e.currentTarget.value)}
        />
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
      <Modal
        title="Set Password"
        isOpen={openPasswordModal()}
        onClose={() => setOpenPasswordModal(false)}
        onSuccess={() => savePassword()}
      >
        <SetPassportForm modelUpdater={setUserPasswordModel} />
      </Modal>
    </>
  );
};

export default Users;
