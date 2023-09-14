import { useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";

import {
  ServerErrors,
  handleSubmission,
} from "../../components/ApiUtils/ApiUtils";
import { closeMenuModal } from "../../components/MenuModal/MenuModalState";
import FormContextProvider from "../../components/forms/FormContextProvider/FormContextProvider";
import InputText from "../../components/forms/InputText/InputText";
import { loginValidation } from "../../server/validation/auth.validation";

export default function SignIn() {
  const navigate = useNavigate();
  const [serverErrors, setServerErrors] = createSignal<string[] | undefined>();
  const apiPath = "auth/sign-in";
  const initialData = {
    username: "",
    password: "",
  };

  async function onSubmit(data: any) {
    const success = await handleSubmission({
      data,
      apiPath,
      setServerErrors,
    });
    if (success) {
      const loginMessage = "User logged in successfully.";
      closeMenuModal();
      navigate("/?notification=" + encodeURIComponent(loginMessage));
    }
  }

  return (
    <FormContextProvider
      initialData={initialData}
      validation={loginValidation}
      onSubmit={onSubmit}
      id="sign-in-form"
    >
      <ServerErrors serverErrors={serverErrors()} />
      <InputText label="Username" name="emailOrUsername" type="text" />
      <InputText label="Password" name="password" type="password" />
      <input type="submit" value="Login" />
    </FormContextProvider>
  );
}
