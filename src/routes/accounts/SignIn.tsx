import { createFormControl, createFormGroup } from "solid-forms";
import { createEffect, type Component } from "solid-js";
import { TextInput } from "../../components/forms/TextInput";

export const SignIn: Component<{}> = () => {
  const group = createFormGroup({
    name: createFormControl(""),
    email: createFormControl("", {
      required: true,
      validators: (value: string) => (value.length === 0 ? { isMissing: true } : null),
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
    <form onSubmit={onSubmit}>
      <label for="name">Your name</label>
      <TextInput name="name" control={group.controls.name} />

      <label for="email">Your email address</label>
      <TextInput name="email" type="email" control={group.controls.email} />

      <button>Submit</button>
    </form>
  );
};
