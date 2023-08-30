import Nested from "../components/_Test/Nested";
import { UnneededFormContextProvider } from "../components/_Test/UnneededFormContextProvider";

export default function Test() {
  return (
    <>
      <UnneededFormContextProvider count={1}>
        <Nested />
      </UnneededFormContextProvider>
      <UnneededFormContextProvider count={2}>
        <Nested />
        <Nested />
      </UnneededFormContextProvider>
    </>
  );
}
