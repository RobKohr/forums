import { createFormControl, createFormGroup } from "solid-forms";
import { createEffect } from "solid-js";
import { TextInput } from "../components/forms/TextInput";
import { required } from "../validators";

export default function SignIn() {
  const group = createFormGroup({
    username: createFormControl(""),
    email: createFormControl("", {
      required: true,
      validators: [required],
    }),
  });

  // This will automatically re-run whenever `group.isDisabled`, `group.isValid` or `group.value` change
  createEffect(() => {
    if (group.isDisabled || !group.isValid) return;

    console.log("Current group value", group.value);
  });

  const onSubmit = async () => {
    if (group.isSubmitted || !group.isValid) return;

    group.markSubmitted(true);
    // do stuff...
    // const { name, email } = group.value;
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <TextInput label="Your Username" name="name" control={group.controls.username} />
        <TextInput label="Your email address" name="email" type="email" control={group.controls.email} />
        <TextInput label="Password" name="password" type="password" control={group.controls.password} />
        <TextInput label="Retype Password" name="retypePassword" type="retypePassword" control={group.controls.retypePassword} />
        <button>Submit</button>
      </form>
      <div>
        <a href="/sign-up">Sign Up</a>
      </div>
    </div>
  );
}
