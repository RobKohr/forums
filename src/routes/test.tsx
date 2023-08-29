import { FormContextProvider } from "../components/_Test/FormContextProvider";
import Nested from "../components/_Test/Nested";

export default function Test() {
  return (
    <>
      <FormContextProvider count={1}>
        <Nested />
      </FormContextProvider>
      <FormContextProvider count={2}>
        <Nested />
        <Nested />
      </FormContextProvider>
    </>
  );
}
