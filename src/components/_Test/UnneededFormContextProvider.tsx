import type Joi from "joi";
import { createContext, createSignal, useContext } from "solid-js";

const FormContextProviderContext = createContext();

export interface FormContextProviderProps {
  children: any;
  count: number;

  initialData: { [key: string]: any };
  validation?: Joi.ObjectSchema<any>;
  postValidation?: (validationResult: Joi.ValidationResult<any>) => Joi.ValidationResult<any>;
}
interface FormData {
  [key: string]: string;
}

export function UnneededFormContextProvider(props: FormContextProviderProps) {
  const [count, setCount] = createSignal(props.count || 0);

  // const [{ children, initialData, validation, postValidation }] = splitProps(props, ["children", "initialData", "validation", "postValidation"]);

  // const [formData, setFormData] = createSignal<FormData>(initialData || {});

  const contextValue = [
    count,
    {
      increment() {
        setCount((c) => c + 1);
      },
      decrement() {
        setCount((c) => c - 1);
      },
    },
  ];
  return <FormContextProviderContext.Provider value={contextValue}>{props.children}</FormContextProviderContext.Provider>;
}

export function useFormContextProvider() {
  return useContext(FormContextProviderContext);
}
