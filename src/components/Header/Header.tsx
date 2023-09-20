import { useIsRouting, useLocation, useNavigate } from "@solidjs/router";
import { Show, createEffect, createSignal } from "solid-js";
import AccountImage from "../AccountImage/AccountImage";
import ActionButton from "../Forums/ActionButton/ActonButton";
import Logo from "../Logo/Logo";
import NeverallAppsMenu from "../NeverallAppsMenu/NeverallAppsMenu";
import Search from "../Search/Search";
import { authUserToken } from "../authUserToken";
import "./Header.scss";

export const [belowHeader, setBelowHeader] = createSignal<string>("");

function toggleSearch() {
  if (belowHeader() !== "search") {
    setBelowHeader("search");
    document?.getElementById("search")?.focus();
  } else {
    setBelowHeader("");
  }
}
export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isRouting = useIsRouting();
  createEffect(() => {
    console.log("routing", isRouting());
    if (isRouting()) {
      setBelowHeader("");
    }
    if (location.pathname === "/search") {
      setBelowHeader("search");
    }
  });
  return (
    <div id="header">
      <div class="header-sub">
        <Logo />
      </div>
      <div class="header-sub">
        <span onClick={toggleSearch}>Search</span>
      </div>
      <div class="header-sub">
        <NeverallAppsMenu />
        <Show when={!authUserToken()}>
          <ActionButton
            data-testid="action-button-navigate-to-login"
            onClick={() => {
              navigate("/auth/login");
            }}
          >
            Login
          </ActionButton>
          <ActionButton
            data-testid="action-button-navigate-to-register"
            onClick={() => {
              navigate("/auth/register");
            }}
          >
            Register
          </ActionButton>
        </Show>
        <Show when={authUserToken()}>
          <AccountImage />
        </Show>
      </div>
      <Show when={belowHeader()}>
        <div class="header-sub below hidden">
          <Search />
        </div>
      </Show>
    </div>
  );
}
