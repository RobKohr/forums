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
    repeat_password: "testfish",
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

  return (
    <FormContextProvider
      initialData={initialData}
      validation={registrationValidation}
      onSubmit={onSubmit}
    >
      <ServerErrors serverErrors={serverErrors()} />
      <InputText label="Username" name="username" type="text" />
      <InputText label="Email" name="email" type="email" />
      <InputText label="Password" name="password" type="password" />
      <InputText
        label="Repeat Password"
        name="repeat_password"
        type="password"
      />
      <input type="submit" value="Submit" />
    </FormContextProvider>
  );
}
