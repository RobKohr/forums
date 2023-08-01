/* Copyright Robert Kohr 2023 - All Rights Reserved */

import { A, Route, Routes } from "@solidjs/router";
import _ from "lodash";
import { Component, For } from "solid-js";
import NeverallAppsMenu from "./components/NeverallAppsMenu";
import Home from "./routes";
import About from "./routes/About";
import Register from "./routes/auth/register";
import SignIn from "./routes/auth/sign-in";
export interface Route {
  path: string;
  component: Component;
  label?: string;
}

window.addEventListener("popstate", function () {
  console.log("change event");
});

const routes: Route[] = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/sign-in", component: SignIn },
  { path: "/sign-up", component: Register },
];

routes.forEach((route) => {
  route.label = _.capitalize(route.path.replace("/", ""));
  if (!route.label) {
    route.label = "Home";
  }
});

function urlEncode(str: string) {
  return encodeURIComponent(str).replace(/%20/g, "+");
}

function NotFound() {
  return <div>Page Not Found</div>;
}
const VITE_VARIABLE_NAME = import.meta.env["VITE_VARIABLE_NAME"];
const App: Component = () => {
  function signIn() {
    console.log("sign in");
    const path = window.location.href.split("?")[0];
    window.location.href = `/sign-in?returnTo=${urlEncode(path || "/")}`;
  }
  console.log(routes);
  return (
    <div id="app">
      <div id="header">
        <NeverallAppsMenu />
        <div class="logo-container logo" style={{ "white-space": "nowrap" }}>
          <A href="/">
            {/* <Logo
              style={{
                width: "45px",
                height: "60px",
                fill: "white",
                display: "inline-block",
                position: "relative",
                top: "2px",
                left: "12px",
              }}
            /> */}
            <div style={{ display: "inline-block", position: "relative", left: "50px" }}>
              <img
                src="/icons/iconmonstr-stream-2.svg"
                style={{ width: "35px", height: "35px", display: "inline-block", position: "relative", top: "2px", left: "24px", color: "orange" }}
              />
              <span
                class="logo-text desktop-only inline-block"
                style={{
                  position: "relative",
                  top: "15px",
                  left: "-28px",
                  "font-size": "1rem",
                  "font-family": "sans-serif",
                  color: "white",
                }}
              >
                <span>Channels</span>
              </span>
            </div>
          </A>
        </div>
        {/* <Search /> */}
        {/* <HeaderMenu menu={menu} /> */}

        <div id="account-controls">
          <A href="/settings">Settings</A>
          <A href="/apps">Apps</A>
          <button onClick={signIn}>Sign In</button>
        </div>
        {/* <Navigation routes={routes} /> */}
      </div>

      <div id="content">
        <Routes>
          <For each={routes}>{(route) => <Route path={route.path} component={route.component} />}</For>
          <Route path="*" component={NotFound} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export function Footer() {
  return (
    <div id="footer">
      Powered by <a href="https://solidjs.com">SolidJS</a>
    </div>
  );
}

export default App;
