import { Component } from "solid-js";

export interface LabelledInputProps {
  label: string;
  onInput?: (e: any) => void;
  type?: string;
  disabled?: boolean;
  value?: string;
  placeholder?: string;
}

const LabelledInput: Component<LabelledInputProps> = (props) => {
  return (
    <div class="field">
      <label class="label">{props.label}</label>
      <div class="control">
        <input
          class="input"
          type={props.type ?? "text"}
          placeholder={props.placeholder}
          onInput={props.onInput}
          disabled={props.disabled}
          value={props.value}
        />
      </div>
    </div>
  );
};

export default LabelledInput;
