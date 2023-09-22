import { createEffect, createSignal, JSX, Show, splitProps } from "solid-js";
import { toId } from "../../../utils";
import { useForm } from "../FormContextProvider/FormContextProvider";
import "./InputText.scss";
interface InputTextProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  type: string;
  "data-testid"?: string;
}

export default function InputText(props: InputTextProps) {
  const [local, htmlProps] = splitProps(props, [
    "label",
    "name",
    "type",
    "data-testid",
  ]);
  const [focused, setFocused] = createSignal(false);
  const [currentValue, setCurrentValue] = createSignal("");
  const { name } = local;
  const form = useForm();
  if (form === undefined) {
    return <div>FormContextProvider not found</div>;
  }
  const [error, setError] = createSignal("");

  createEffect(() => {
    let updatedError = "";
    const errorDetails = form.validationResult()?.error?.details;
    if (!errorDetails || !errorDetails.length) {
      setError("");
    } else {
      errorDetails.forEach((error) => {
        if (error.context?.key === name) {
          updatedError = error.message;
        }
      });
      setError(updatedError);
    }
  });
  const id = toId(form.id + "-" + name);
  const dataTestId = local["data-testid"] || id;
  setCurrentValue(form.data[local.name] || "");
  return (
    <div class="input-text-component">
      <input
        type={local.type}
        name={name}
        id={id}
        value={form.data[local.name] || ""}
        onInput={form.inputChangeHandler(name)}
        data-testid={dataTestId}
        {...htmlProps}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyUp={(e: any) => {
          setCurrentValue(e.target.value);
        }}
        // class="error"
      />
      <Show
        when={
          (currentValue() && !focused()) ||
          (!currentValue() && focused()) ||
          focused() ||
          !currentValue()
        }
      >
        <div
          class={`placeholder ${focused() || currentValue() ? "focused" : ""}`}
        >
          {local.label}
        </div>
      </Show>
      <div class="error">{form.touched()?.[name] && error()}&nbsp;</div>
    </div>
  );
}
