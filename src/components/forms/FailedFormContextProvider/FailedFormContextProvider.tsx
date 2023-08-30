import type Joi from "joi";
import { Accessor, createContext, createSignal, splitProps, useContext } from "solid-js";

export const FormContext = createContext<Form>();

// export const FormContext = createContext<Form>({
//   data: {},
//   set: () => undefined,
//   validationResult: () => undefined,
//   touched: () => ({}),
//   setFieldValue: () => undefined,
//   inputChangeHandler: () => () => undefined,
// });

export interface Form {
  data: any;
  set: (data: any) => void;
  validationResult: Accessor<Joi.ValidationResult<any> | undefined>;
  touched: Accessor<TouchedData>;
  setFieldValue: (field: string, value: string) => void;
  inputChangeHandler: (name: string) => (e: Event) => void;
}

export interface FormContextProviderProps {
  children: any;
  initialData: { [key: string]: any };
  validation?: Joi.ObjectSchema<any>;
  postValidation?: (validationResult: Joi.ValidationResult<any>) => Joi.ValidationResult<any>;
}

interface FormData {
  [key: string]: string;
}
interface TouchedData {
  [key: string]: boolean;
}

function defaultPostValidation(validationResult: Joi.ValidationResult<any>) {
  return validationResult;
}

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      formDecorator: boolean;
    }
  }
}

// wrap children in provider
export default function FailedFormContextProvider(props: FormContextProviderProps) {
  const [{ children, initialData, validation, postValidation = defaultPostValidation }] = splitProps(props, [
    "children",
    "initialData",
    "validation",
    "postValidation",
  ]);
  const [formData, setFormData] = createSignal<FormData>(initialData || {});
  const initialTouchData: TouchedData = { test: true };
  const [touched, setTouched] = createSignal<TouchedData>(initialTouchData);
  const [validationResult, setValidationResult] = createSignal<Joi.ValidationResult<any> | undefined>();

  function validate(): boolean {
    if (!validation) {
      return true;
    }
    setValidationResult(postValidation(validation.validate(formData(), { abortEarly: false })));
    if (validationResult()?.error) {
      return false;
    } else {
      return true;
    }
  }

  function formDecorator(element: HTMLFormElement, _: () => any): void {
    element.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (validate()) {
        console.log("validation passes");
      } else {
        console.log("validation fails");
      }
    });
  }
  true && formDecorator; // hack to prevent unused variable error

  const form = {
    data: formData,
    set: setFormData,
    validationResult,
    touched,
    setFieldValue: (field: string, value: string) => {
      setFormData({ [field]: value });
    },
    inputChangeHandler: (name: string) => (e: Event) => {
      const target = e.target as HTMLInputElement;
      setFormData({ ...formData(), [name]: target.value });
      setTouched({ ...touched(), [name]: true });
      validate();
    },
  };
  validate();
  return (
    <FormContext.Provider value={form}>
      <form use:formDecorator>{children}</form>
    </FormContext.Provider>
  );
}

export function useForm() {
  return useContext(FormContext);
}
