import { IFormControl, createFormControl } from "solid-forms";
import { Show, mergeProps, type Component } from "solid-js";
import "./TextInput.scss";
export const TextInput: Component<{
  control: IFormControl<string>;
  name?: string;
  type?: string;
  label?: string;
}> = (props) => {
  // here we provide a default form control in case the user doesn't supply one
  props = mergeProps({ control: createFormControl(""), type: "text" }, props);

  return (
    <div
      classList={{
        "is-invalid": !!props.control.errors,
        "is-touched": props.control.isTouched,
        "is-required": props.control.isRequired,
        "text-input-component": true,
      }}
    >
      <input
        name={props.name}
        type={props.type}
        value={props.control.value}
        oninput={(e) => {
          props.control.setValue(e.currentTarget.value);
        }}
        onblur={() => props.control.markTouched(true)}
        required={props.control.isRequired}
        placeholder={props.label}
      />

      <Show when={props.control.isTouched && props.control.errors?.isMissing}>
        <small>Answer required.</small>
      </Show>
    </div>
  );
};
