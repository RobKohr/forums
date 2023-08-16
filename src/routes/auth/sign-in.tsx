import { A } from "@solidjs/router";
import { createFormControl, createFormGroup } from "solid-forms";
import { createEffect } from "solid-js";
import { closeMenuModal } from "../../components/MenuModal/MenuModalState";
import { TextInput } from "../../components/forms/TextInput/TextInput";
import { required } from "../../validators";

export default function SignIn() {
  const group = createFormGroup({
    username: createFormControl(""),
    email: createFormControl("", {
      required: true,
      validators: [required],
    }),
    password: createFormControl("", {
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
    <div class="padded">
      <form onSubmit={onSubmit}>
        <TextInput label="Your Username" name="name" control={group.controls.username} />
        <TextInput label="Your email address" name="email" type="email" control={group.controls.email} />
        <TextInput label="Password" name="password" type="password" control={group.controls.password} />
        <TextInput label="Retype Password" name="retypePassword" type="retypePassword" control={group.controls.retypePassword} />
        <button>Submit</button>
      </form>
      <p>
        New to the site?{" "}
        <A href="auth/sign-up" class="underline" onclick={closeMenuModal}>
          Sign Up »
        </A>
      </p>

      <div>
        <A href="auth/forgot-password" class="underline" onclick={closeMenuModal}>
          Forgot Username/Password »
        </A>
      </div>
    </div>
  );
}
