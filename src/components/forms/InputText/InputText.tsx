import { createEffect, createSignal, JSX, splitProps } from "solid-js";
import { useForm } from "../FormContextProvider/FormContextProvider";

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
  const id = form.id + "-" + name;
  const dataTestId = local["data-testid"] || id;
  return (
    <div>
      <input
        type={local.type}
        name={name}
        id={id}
        placeholder={local.label}
        value={form.data[local.name] || ""}
        onInput={form.inputChangeHandler(name)}
        data-testid={dataTestId}
        {...htmlProps}
      />
      <div class="error">{form.touched()?.[name] && error()}&nbsp;</div>
    </div>
  );
}
