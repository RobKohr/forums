import { useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";

import {
  ServerErrors,
  handleSubmission,
} from "../../components/ApiUtils/ApiUtils";
import FormContextProvider from "../../components/Forums/FormContextProvider/FormContextProvider";
import InputSubmit from "../../components/Forums/InputSubmit/InputSubmit";
import InputText from "../../components/Forums/InputText/InputText";
import { closeMenuModal } from "../../components/MenuModal/MenuModalState";
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
      navigate("/auth/login?notification=" + encodeURIComponent(loginMessage));
    }
  }
  const id = "register-form";
  return (
    <div class="narrow-content page-auth-register">
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
        <InputSubmit value="Register" />
      </FormContextProvider>
    </div>
  );
}
