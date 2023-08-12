import { createSignal } from "solid-js";

export const [paragraphs, setParagraphs] = createSignal<number>(2);
export function addParagraph() {
  setParagraphs(paragraphs() + 1);
}
export function removeParagraph() {
  setParagraphs(paragraphs() - 1);
}
