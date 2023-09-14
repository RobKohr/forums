import { useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";

import {
  ServerErrors,
  handleSubmission,
} from "../../components/ApiUtils/ApiUtils";
import { closeMenuModal } from "../../components/MenuModal/MenuModalState";
import FormContextProvider from "../../components/forms/FormContextProvider/FormContextProvider";
import InputText from "../../components/forms/InputText/InputText";
import { registrationValidation } from "../../server/validation/auth.validation";

export default function Register() {
  const navigate = useNavigate();
  const [serverErrors, setServerErrors] = createSignal<string[] | undefined>();
  const apiPath = "auth/register";
  const initialData = {
    email: "testfish@gmail.com",
    username: "testfish",
    password: "asdfasdfasdf",
    retype_password: "testfish",
  };

  async function onSubmit(data: any) {
    const success = await handleSubmission({
      data,
      apiPath,
      setServerErrors,
    });
    if (success) {
      const loginMessage = "Registration successful. Please login.";
      closeMenuModal();
      navigate(
        "/auth/sign-in?notification=" + encodeURIComponent(loginMessage)
      );
    }
  }
  const id = "register-form";
  return (
    <FormContextProvider
      initialData={initialData}
      validation={registrationValidation}
      onSubmit={onSubmit}
      id={id}
    >
      <ServerErrors serverErrors={serverErrors()} />
      <InputText label="Username" name="username" type="text" />
      <InputText label="Email" name="email" type="email" />
      <InputText label="Password" name="password" type="password" />
      <InputText
        label="Retype Password"
        name="retype_password"
        type="password"
      />
      <InputSubmit label="Register" />
      <input type="submit" value="Register" data-test-id={`${id}-submit`} />
    </FormContextProvider>
  );
}
