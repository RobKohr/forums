import { createSignal } from "solid-js";

export const [menuModalActive, setMenuModalActive] = createSignal("");

export function closeMenuModal() {
  setMenuModalActive("");
}
