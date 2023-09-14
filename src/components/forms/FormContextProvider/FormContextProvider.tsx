import type Joi from "joi";
import { Accessor, createContext, createSignal, useContext } from "solid-js";
import type { Validator } from "../../../server/common/validation";

export const FormContext = createContext<Form>();

export interface Form {
  data: any;
  set: (data: any) => void;
  validationResult: Accessor<Joi.ValidationResult<any> | undefined>;
  touched: Accessor<TouchedData>;
  setFieldValue: (field: string, value: string) => void;
  inputChangeHandler: (name: string) => (e: Event) => void;
  id: string;
}

export interface FormContextProviderProps {
  children: any;
  initialData: { [key: string]: any };
  validation?: Validator;
  onSubmit: (data: any) => void;
  id: string;
}

interface FormData {
  [key: string]: string;
}
interface TouchedData {
  [key: string]: boolean;
}

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      formDecorator: boolean;
    }
  }
}

// wrap children in provider
export default function FormContextProvider(props: FormContextProviderProps) {
  const [formData, setFormData] = createSignal<FormData>(
    props.initialData || {}
  );
  const initialTouchData: TouchedData = { test: true };
  const [touched, setTouched] = createSignal<TouchedData>(initialTouchData);
  const [validationResult, setValidationResult] = createSignal<
    Joi.ValidationResult<any> | undefined
  >();

  async function validate(): Promise<boolean> {
    return new Promise(async function (resolve, _) {
      resolve(true);
      if (!props.validation) {
        return true;
      }
      const localValidationResult = await props.validation(formData());
      setValidationResult(localValidationResult);
      if (validationResult()?.error) {
        return false;
      } else {
        return true;
      }
    });
  }

  function formDecorator(element: HTMLFormElement, _: () => any): void {
    element.addEventListener("submit", async (e) => {
      e.preventDefault();
      const validationResult = await validate();
      if (validationResult) {
        props.onSubmit(formData());
        console.log("validation passes");
      } else {
        console.log("validation fails");
      }
    });
  }
  true && formDecorator; // hack to prevent unused variable error

  const form = {
    data: formData(),
    id: props.id,
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
      <form id={`form-${props.id}`} use:formDecorator>
        {props.children}
      </form>
    </FormContext.Provider>
  );
}

export function useForm() {
  return useContext(FormContext);
}
