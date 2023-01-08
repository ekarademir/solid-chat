import { Accessor, Component, For } from "solid-js";
import { createStore } from "solid-js/store";

import Modal from "../../Modal";
import LabelledInput from "../../form/LabelledInput";
import { errorMessage } from "../../../commands";

import { notificationsApi } from "../../../lib/notifications/Notifications";
import {
  usersAdminService,
  UserKindHumanReadable as UserKind,
} from "../../../services/UsersAdminService";

const [userModel, setUserModel] = createStore({
  id: null,
  username: null,
  kind: null,
  fullname: null,
  tenantName: null,
});

export { userModel, setUserModel };

export interface CreateEditUserModalProps {
  isEditUser: Accessor<boolean>;
  isOpen: Accessor<boolean>;
  onClose: () => void;
}

const CreateEditUserModal: Component<CreateEditUserModalProps> = (props) => {
  const [_s1, { scheduleError, scheduleSuccess }] = notificationsApi();
  const [_s2, { newUser, updateUser }] = usersAdminService();

  const saveUser = () => {
    newUser(userModel)
      .then(() => {
        scheduleSuccess("User created");
        props.onClose();
      })
      .catch((e) => scheduleError(errorMessage(e)));
  };

  const editUser = () => {
    updateUser(userModel)
      .then(() => {
        scheduleSuccess("User updated");
        props.onClose();
      })
      .catch((e) => scheduleError(errorMessage(e)));
  };
  return (
    <Modal
      title={props.isEditUser() ? "Edit User" : "New User"}
      isOpen={props.isOpen()}
      onClose={() => props.onClose()}
      onSuccess={() => (props.isEditUser() ? editUser() : saveUser())}
    >
      <LabelledInput
        label="Tenant name"
        value={userModel.tenantName}
        placeholder="Tenant name"
        disabled
      />
      <LabelledInput
        label="Username"
        onInput={(e) => setUserModel("username", e.currentTarget.value)}
        placeholder="Username"
        value={userModel.username}
        disabled={props.isEditUser()}
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
              <option value={null}>Select...</option>
              <For each={Object.entries(UserKind)}>
                {([val, kind]) => <option value={val}>{kind}</option>}
              </For>
            </select>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateEditUserModal;
