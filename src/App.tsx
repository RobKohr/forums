/* Copyright Robert Kohr 2023 - All Rights Reserved */

import { Route, Routes } from "@solidjs/router";
import _ from "lodash";
import { Component, For } from "solid-js";
import Header from "./components/Header/Header";
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
export function signIn() {
  console.log("sign in");
  const path = window.location.href.split("?")[0];
  window.location.href = `/sign-in?returnTo=${urlEncode(path || "/")}`;
}

// const VITE_VARIABLE_NAME = import.meta.env["VITE_VARIABLE_NAME"];
const App: Component = () => {
  console.log(routes);
  return (
    <div id="app">
      <Header />
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
