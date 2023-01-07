import { Accessor, Component, For } from "solid-js";
import { createStore } from "solid-js/store";

import Modal from "../../Modal";
import LabelledInput from "../../form/LabelledInput";

import commands from "../../../commands";
import { notificationsApi } from "../../../lib/notifications/Notifications";
import { errorMessage } from "../../../commands";

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
  const [_state, { scheduleError, scheduleSuccess }] = notificationsApi();

  const saveUser = () => {
    commands.users
      .newUser(userModel)
      .then(() => {
        scheduleSuccess("User created");
        props.onClose();
      })
      .catch((e) => scheduleError(errorMessage(e)));
  };

  const updateUser = () => {
    commands.users
      .updateUser(userModel)
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
      onSuccess={() => (props.isEditUser() ? updateUser() : saveUser())}
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
              <For each={Object.entries(commands.users.UserKind)}>
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
