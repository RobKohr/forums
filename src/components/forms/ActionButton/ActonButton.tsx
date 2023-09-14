import { JSX, splitProps } from "solid-js";
import "./ActionButton.scss";

interface ActionButtonProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  children: any;
}

export default function ActionButton(props: ActionButtonProps) {
  const [local, htmlProps] = splitProps(props, ["children"]);
  return (
    <button class="action-button" {...htmlProps}>
      {local.children}
    </button>
  );
}
