import Joi from "joi";
import FailedFormContextProvider from "../../components/forms/FailedFormContextProvider/FailedFormContextProvider";
import InputText from "../../components/forms/InputText/InputText";

const registrationSchema = Joi.object({
  email: Joi.string().email({ tlds: false }).required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  repeat_password: Joi.ref("password"),
}).with("password", "repeat_password");

function registrationSchemaMessageRewrite(validationResult: Joi.ValidationResult) {
  if (validationResult.error?.details?.length) {
    validationResult.error.details.forEach((error) => {
      if (error.context?.key === "repeat_password") {
        error.message = "Passwords do not match";
      }
    });
  }
  return validationResult;
}

export default function Register() {
  const initialData = { username: "", password: "", repeat_password: "" };
  return (
    <FailedFormContextProvider initialData={initialData} validation={registrationSchema} postValidation={registrationSchemaMessageRewrite}>
      <InputText label="Username" name="username" type="text" />
      <InputText label="Email" name="email" type="email" />
      <InputText label="Password" name="password" type="password" />
      <InputText label="Repeat Password" name="repeat_password" type="password" />
      <div>
        <input type="checkbox" name="terms" /> I agree to the terms and conditions
      </div>
      <input type="submit" value="Submit" />
    </FailedFormContextProvider>
  );
}
