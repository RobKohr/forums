import Joi from "joi";
import InputText from "../../components/forms/InputText/InputText";
import useForm from "../../components/forms/useForm";

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

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      formDecorator: boolean;
    }
  }
}

export default function Register() {
  const { formDecorator, form } = useForm({
    initialData: { username: "", password: "", repeat_password: "" },
    validation: registrationSchema,
    validationMessageRewrite: registrationSchemaMessageRewrite,
  });
  true && formDecorator; // hack to prevent unused variable error

  return (
    <form use:formDecorator>
      <InputText label="Username" name="username" type="text" form={form} />
      <InputText label="Email" name="email" type="email" form={form} />
      <InputText label="Password" name="password" type="password" form={form} />
      <InputText label="Repeat Password" name="repeat_password" type="password" form={form} />
      <div>
        <input type="checkbox" name="terms" /> I agree to the terms and conditions
      </div>
      <input type="submit" value="Submit" />
    </form>
  );
}
