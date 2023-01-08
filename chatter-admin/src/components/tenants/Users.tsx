import { createResource, createSignal, Component, Show } from "solid-js";
import { useParams } from "@solidjs/router";

import { RiSystemAddFill } from "solid-icons/ri";
import { RiSystemDeleteBin5Line } from "solid-icons/ri";
import { RiSystemLockPasswordLine } from "solid-icons/ri";
import { RiDesignEditBoxLine } from "solid-icons/ri";

import Loading from "../Loading";
import Table from "../Table";
import { errorMessage } from "../../lib/error-message";

import { notificationsApi } from "../../services/notifications/Notifications";
import { usersAdminService } from "../../services/UsersAdminService";

import SetPassportModal, {
  setUserPasswordModel,
} from "./users/SetPasswordModal";
import CreateEditUserModal, { setUserModel } from "./users/CreateEditUserModal";

const Users: Component = () => {
  const params = useParams();
  const [_s1, { scheduleError, scheduleWarning }] = notificationsApi();
  const [_s2, { deleteUser, listUsers }] = usersAdminService();

  // Modal states
  const [openPasswordModal, setOpenPasswordModal] = createSignal(false);
  const [newEditUserModalOpen, setNewEditUserModalOpen] = createSignal(false);
  const [isEditUser, setIsEditUser] = createSignal(false);
  const openNewEditUserModal = ({ isNew = true }) => {
    isNew ? setIsEditUser(false) : setIsEditUser(true);
    setNewEditUserModalOpen(true);
  };

  const fetchUsers = async () => {
    try {
      return await listUsers({
        tenantName: params.tenant,
        start: 0,
        count: 10,
      });
    } catch (e) {
      scheduleError(errorMessage(e));
      return [];
    }
  };

  const removeUser = (username) => {
    deleteUser({
      username: username,
      tenantName: params.tenant,
    })
      .then(() => scheduleWarning(`${username} deleted`))
      .catch((e) => scheduleError(errorMessage(e)))
      .then(refetch);
  };

  const setPassword = (username) => {
    setUserPasswordModel({
      username,
      tenantName: params.tenant,
      password: "",
      passwordRepeat: "",
    });
    setOpenPasswordModal(true);
  };

  const editUser = (username) => {
    const user = users()
      .filter((x) => x.username === username)
      .at(0);
    setUserModel(user);
    openNewEditUserModal({ isNew: false });
  };

  const [users, { refetch }] = createResource(fetchUsers);

  return (
    <>
      <div class="content">
        <button
          class="button"
          onClick={() => {
            setUserModel({
              username: null,
              kind: null,
              fullname: null,
              tenantName: params.tenant,
            });
            openNewEditUserModal({ isNew: true });
          }}
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
                      removeUser(row[0]);
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
      <CreateEditUserModal
        isEditUser={isEditUser}
        isOpen={newEditUserModalOpen}
        onClose={() => {
          setNewEditUserModalOpen(false);
          refetch();
        }}
      />
      <SetPassportModal
        isOpen={openPasswordModal}
        onClose={() => {
          setOpenPasswordModal(false);
          refetch();
        }}
      />
    </>
  );
};

export default Users;
