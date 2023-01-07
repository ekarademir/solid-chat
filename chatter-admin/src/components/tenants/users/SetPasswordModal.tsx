import { Accessor, Component } from "solid-js";
import { createStore } from "solid-js/store";

import LabelledInput from "../../form/LabelledInput";
import Modal from "../../Modal";

import { notificationsApi } from "../../../lib/notifications/Notifications";
import commands from "../../../commands";
import { errorMessage } from "../../../commands";

const [userPasswordModel, setUserPasswordModel] = createStore({
  username: null,
  password: null,
  passwordRepeat: null,
  tenantName: null,
});

export { userPasswordModel, setUserPasswordModel };

export interface SetPassportModalProps {
  isOpen: Accessor<boolean>;
  onClose: () => void;
}

const SetPassportModal: Component<SetPassportModalProps> = (props) => {
  const [_state, { scheduleError, scheduleSuccess }] = notificationsApi();

  const savePassword = () => {
    commands.users
      .setPassword(userPasswordModel)
      .then(() => {
        scheduleSuccess("Password set");
        props.onClose();
      })
      .catch((e) => scheduleError(errorMessage(e)));
  };

  return (
    <Modal
      title="Set Password"
      isOpen={props.isOpen()}
      onClose={() => props.onClose()}
      onSuccess={() => savePassword()}
    >
      <LabelledInput
        label="Password"
        type="password"
        onInput={(e) => setUserPasswordModel("password", e.currentTarget.value)}
      />
      <LabelledInput
        label="Password repeat"
        type="password"
        onInput={(e) =>
          setUserPasswordModel("passwordRepeat", e.currentTarget.value)
        }
      />
    </Modal>
  );
};

export default SetPassportModal;
