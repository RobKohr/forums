import type { JSX } from "solid-js";
import { toId } from "../../../utils";
import { useForm } from "../FormContextProvider/FormContextProvider";

interface InputSubmitProps extends JSX.InputHTMLAttributes<HTMLInputElement> {}

export default function InputSubmit(props: InputSubmitProps) {
  const form = useForm();
  if (form === undefined) {
    return <div>FormContextProvider not found</div>;
  }
  const id = toId(form.id + "-" + props.value);
  return <input type="submit" value="Submit" data-testid={id} />;
}
