import Joi from "joi";
import { createSignal } from "solid-js";
import InputText from "../../components/forms/InputText/InputText";
import useForm from "../../components/forms/useForm";

// export const registerRules = {
//   email: "required|email",
//   username: "required|string",
//   password: "required|string|min:8|commonPassword|strongPassword",
// };

const registrationSchema = Joi.object({
  email: Joi.string().email({ tlds: false }),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  repeat_password: Joi.ref("password"),
}).with("password", "repeat_password");

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      formDecorator: boolean;
    }
  }
}
// const data = { username: "", birth_year: 1994, password: "asdfasddf", repeat_password: "asdfasdf" };
const data = { username: "asdf", password: "asdfasdf", repeat_password: "asdfasdf" };
export default function Register() {
  const { formDecorator, form } = useForm({
    initialData: { username: "", password: "", repeat_password: "" },
    validation: registrationSchema,
  });
  true && formDecorator; // hack to prevent unused variable error
  // const onSubmit = async (e: Event) => {
  //   e.preventDefault();
  //   const validationResult = registrationSchema.validate(data, { abortEarly: false });
  //   if (validationResult.error) {
  //     console.error(validationResult.error);
  //   } else if (validationResult.value) {
  //     console.log(validationResult.value);
  //   } else {
  //     console.error("no error, no value", validationResult);
  //   }
  // };

  // const onChange = (e: Event) => {
  //   console.log("change event", e);
  // };

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
