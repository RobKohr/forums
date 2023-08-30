import { useFormContextProvider } from "./UnneededFormContextProvider";

export default function Nested() {
  const [count, { increment, decrement }] = useFormContextProvider();
  return (
    <>
      <div>{count()}</div>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </>
  );
}