import { createEffect, createSignal } from "solid-js";
import type { Form } from "../useForm";

interface InputTextProps {
  label: string;
  name: string;
  type: string;
  form: Form;
}

export default function InputText(props: InputTextProps) {
  const { label, name, type, form } = props;
  const [error, setError] = createSignal("");

  createEffect(() => {
    let updatedError = "";
    const errorDetails = form.validationResult()?.error?.details;
    if (!errorDetails || !errorDetails.length) return setError(updatedError);
    errorDetails.forEach((error) => {
      if (error.context?.key === name) {
        updatedError = error.message;
      }
    });
    return setError(updatedError);
  });

  return (
    <div>
      <input type={type} name={name} id={name} placeholder={label} value={props.form.data[name] || ""} onInput={form.inputChangeHandler(name)} />
      <div class="error">{form.touched()?.[name] && error()}&nbsp;</div>
    </div>
  );
}
