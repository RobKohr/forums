import { Show } from "solid-js";
import SignIn from "../../pages/auth/login";
import Register from "../../pages/auth/register";
import "./MenuModal.scss";
import MenuModalAccount from "./MenuModalAccount/MenuModalAccount";
import { menuModalActive, setMenuModalActive } from "./MenuModalState";
import X from "./x.svg";
export function MenuModal() {
  return (
    <Show when={menuModalActive()}>
      <div id="menu-modal" class={menuModalActive()}>
        <div
          class="x-container clickable"
          onClick={() => {
            setMenuModalActive("");
          }}
        >
          <X />
        </div>
        <Show when={menuModalActive() === "account"}>
          <MenuModalAccount />
        </Show>
        <Show when={menuModalActive() === "login"}>
          <Register />
        </Show>
        <Show when={menuModalActive() === "signin"}>
          <SignIn />
        </Show>
      </div>
    </Show>
  );
}
