import { Component } from "solid-js";

import LabelledInput from "../../form/LabelledInput";

export interface SetPassportFormProps {
  modelUpdater: any;
}

const SetPassportForm: Component<SetPassportFormProps> = (props) => {
  return (
    <>
      <LabelledInput
        label="Password"
        type="password"
        onInput={(e) => props.modelUpdater("password", e.currentTarget.value)}
      />
      <LabelledInput
        label="Password repeat"
        type="password"
        onInput={(e) =>
          props.modelUpdater("passwordRepeat", e.currentTarget.value)
        }
      />
    </>
  );
};

export default SetPassportForm;
