import { A, useIsRouting, useLocation } from "@solidjs/router";
import { Show, createEffect, createSignal } from "solid-js";
import AccountImage from "../AccountImage/AccountImage";
import Logo from "../Logo";
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
  const location = useLocation();
  const isRouting = useIsRouting();
  createEffect(() => {
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
        <A href="auth/login?notification=atSignIn">Login</A>{" "}
        <A href="auth/register?notification=atLogin">Register</A>
        <span>Auth user token = {authUserToken()}</span>
      </div>
      <div class="header-sub">
        <NeverallAppsMenu />
        <AccountImage />
      </div>
      <Show when={belowHeader()}>
        <div class="header-sub below hidden">
          <Search />
        </div>
      </Show>
    </div>
  );
}
