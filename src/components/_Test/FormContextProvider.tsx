import { createContext, createSignal, useContext } from "solid-js";

const FormContextProviderContext = createContext();

export interface FormContextProviderProps {
  children: any;
  count: number;
}

export function FormContextProvider(props: FormContextProviderProps) {
  const [count, setCount] = createSignal(props.count || 0);
  const counter = [
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

  return <FormContextProviderContext.Provider value={counter}>{props.children}</FormContextProviderContext.Provider>;
}

export function useFormContextProvider() {
  return useContext(FormContextProviderContext);
}
