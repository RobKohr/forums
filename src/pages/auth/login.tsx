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
import { saveAuthUserToken } from "../../components/authUserToken";
import { loginValidation } from "../../server/validation/auth.validation";

export default function SignIn() {
  const navigate = useNavigate();
  const [serverErrors, setServerErrors] = createSignal<string[] | undefined>();
  const apiPath = "auth/login";
  const initialData = {
    emailOrUsername: "",
    password: "",
  };

  async function onSubmit(data: any) {
    const response = await handleSubmission({
      data,
      apiPath,
      setServerErrors,
    });
    if (response?.success === true && response.token) {
      saveAuthUserToken(response.token);
      const loginMessage = "User logged in successfully.";
      closeMenuModal();
      navigate("/?notification=" + encodeURIComponent(loginMessage));
    }
  }

  return (
    <div class="narrow-content page-auth-login">
      <FormContextProvider
        initialData={initialData}
        validation={loginValidation}
        onSubmit={onSubmit}
        id="login-form"
      >
        <ServerErrors serverErrors={serverErrors()} />
        <InputText label="Username" name="emailOrUsername" type="text" />
        <InputText label="Password" name="password" type="password" />
        <InputSubmit value="Login" />
      </FormContextProvider>
    </div>
  );
}
