import { createEffect, createSignal } from "solid-js";
import { useForm } from "../../FormContextProvider/FormContextProvider";

interface InputTextProps {
  label: string;
  name: string;
  type: string;
}

export default function InputText(props: InputTextProps) {
  const { label, name, type } = props;
  const form = useForm();

  console.log(form);
  if (form === undefined) {
    return <div>FormContextProvider not found</div>;
  }

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
      <input type={type} name={name} id={name} placeholder={label} value={form.data[name] || ""} onInput={form.inputChangeHandler(name)} />
      <div class="error">{form.touched()?.[name] && error()}&nbsp;</div>
    </div>
  );
}
