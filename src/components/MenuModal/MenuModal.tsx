import { useNavigate } from "@solidjs/router";
import { Show } from "solid-js";
import Register from "../../routes/auth/register";
import SignIn from "../../routes/auth/sign-in";
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
        <Show when={menuModalActive() === "signup"}>
          <Register />
        </Show>
        <Show when={menuModalActive() === "signin"}>
          <SignIn />
        </Show>
      </div>
    </Show>
  );
}
