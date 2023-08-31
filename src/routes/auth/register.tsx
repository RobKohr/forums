import { Show, createSignal } from "solid-js";
import FormContextProvider from "../../components/forms/FormContextProvider/FormContextProvider";
import InputText from "../../components/forms/InputText/InputText";
import { registrationValidation } from "../../server/validation/auth.validation";
import { postData } from "../../utils";

export default function Register() {
  const [serverError, setServerError] = createSignal<string | undefined>();
  async function onSubmit(data: any) {
    const response = await postData("auth/register", data);
    if (response.success === false) {
      setServerError(response.message);
    }
    console.log(response);
  }
  const initialData = { username: "", password: "", repeat_password: "" };
  return (
    <FormContextProvider initialData={initialData} validation={registrationValidation} onSubmit={onSubmit}>
      <Show when={serverError()}>
        <div class="error-message">{serverError()}</div>
      </Show>
      <InputText label="Username" name="username" type="text" />
      <InputText label="Email" name="email" type="email" />
      <InputText label="Password" name="password" type="password" />
      <InputText label="Repeat Password" name="repeat_password" type="password" />
      <div>
        <input type="checkbox" name="terms" id="terms" /> <label for="terms">I agree to the terms and conditions</label>
      </div>
      <input type="submit" value="Submit" />
    </FormContextProvider>
  );
}
