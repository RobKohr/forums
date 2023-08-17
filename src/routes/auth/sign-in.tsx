import { createStore } from "solid-js/store";
import { useForm } from "../../components/forms/useFormBak";
import "./sign-in.scss";
// from example https://www.solidjs.com/examples/forms
const EMAILS = ["johnsmith@outlook.com", "mary@gmail.com", "djacobs@move.org"];

function fetchUserName(name: string) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(EMAILS.indexOf(name) > -1), 200);
  });
}

interface ErrorMessageProps {
  error: string;
}

const ErrorMessage = (props: ErrorMessageProps) => <span class="error-message">{props.error}</span>;

const [fields, setFields] = createStore({
  email: "",
  password: "",
});
const fn = (form: HTMLFormElement) => {
  // form.submit()
  console.log("Done", form);
};
const userNameExists = async ({ value }: { value: string }) => {
  const exists = await fetchUserName(value);
  return exists && `${value} is already being used`;
};
const matchesPassword = ({ value }: { value: string }) => (value === fields.password ? false : "Passwords must Match");

type ValidationFunction = ({ value }: { value: string }) => boolean | string | Promise<unknown>;
declare module "solid-js" {
  namespace JSX {
    interface Directives {
      formSubmit: (form: HTMLFormElement) => void;
      validate: ValidationFunction[] | boolean;
    }
  }
}

export default function SignIn() {
  // @ts-ignore
  const { validate, formSubmit, errors } = useForm({
    errorClass: "error-input",
  });
  return (
    <form use:formSubmit={fn}>
      <h1>Sign Up</h1>
      <div class="field-block">
        <input name="email" type="email" placeholder="Email" required use:validate={[userNameExists]} />
        {errors["email"] && <ErrorMessage error={errors["email"]} />}
      </div>
      <div class="field-block">
        <input
          type="password"
          name="password"
          placeholder="Password"
          required={false}
          minlength="8"
          onInput={(e) => setFields("password", e.target.value)}
          use:validate
        />
        {errors["password"] && <ErrorMessage error={errors["password"]} />}
      </div>
      <div class="field-block">
        <input type="password" name="confirmPassword" placeholder="Confirm Password" required={false} use:validate={[matchesPassword]} />
        {errors["confirmPassword"] && <ErrorMessage error={errors["confirmPassword"]} />}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
