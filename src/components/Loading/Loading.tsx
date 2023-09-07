import { Show, createEffect, createSignal } from "solid-js";
import "./Loading.scss";
const [loading, setLoading] = createSignal<boolean>(false);

export default function Loading() {
  const [showLoading, setShowLoading] = createSignal<boolean>(false);
  const [timeoutId, setTimeoutId] = createSignal<number>(0);

  // when loading is true, show the loading component after waiting 1000ms
  createEffect(() => {
    // if there was already a timeout, clear it
    // clearTimeout(timeoutId());
    if (loading() === true) {
      setTimeout(() => {
        if (loading() === true) {
          setShowLoading(true);
        }
      }, 1000);
      // setTimeoutId(Number(id));
    } else {
      setShowLoading(false);
      // clearTimeout(timeoutId());
    }
  });

  return (
    <Show when={showLoading()}>
      <div class="loading-component">
        <div class="loading"></div>
      </div>
    </Show>
  );
}

interface Inputs extends NodeListOf<HTMLInputElement> {}

export function setLoadingState(state: boolean) {
  const inputs: Inputs = document.querySelectorAll("input, button, textarea, select");

  // disable all inputs, buttons, textareas, etc when loading
  // this prevents the user from interacting with the page while loading
  if (state === true) {
    inputs.forEach((input) => {
      input.disabled = state;
    });
  } else {
    inputs.forEach((input) => {
      input.disabled = state;
    });
  }

  setLoading(state);
}
