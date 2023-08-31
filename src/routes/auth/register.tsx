import FormContextProvider from "../../components/forms/FormContextProvider/FormContextProvider";
import InputText from "../../components/forms/InputText/InputText";
import { registrationValidation } from "../../server/validation/auth.validation";

function onSubmit(data: any) {
  console.log(data);
}

export default function Register() {
  const initialData = { username: "", password: "", repeat_password: "" };
  return (
    <FormContextProvider initialData={initialData} validation={registrationValidation} onSubmit={onSubmit}>
      <InputText label="Username" name="username" type="text" />
      <InputText label="Email" name="email" type="email" />
      <InputText label="Password" name="password" type="password" />
      <InputText label="Repeat Password" name="repeat_password" type="password" />
      <div>
        <input type="checkbox" name="terms" /> I agree to the terms and conditions
      </div>
      <input type="submit" value="Submit" />
    </FormContextProvider>
  );
}
