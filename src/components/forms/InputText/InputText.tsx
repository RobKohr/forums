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

  createEffect(() => {});

  return (
    <div>
      <input type={type} name={name} id={name} placeholder={label} value={props.form.data[name]} onInput={form.inputChangeHandler(name)} />
      <div class="error">{error()}</div>
    </div>
  );
}
