/* Copyright Robert Kohr 2023 - All Rights Reserved */

import { Route, Routes } from "@solidjs/router";
import capitalize from "lodash.capitalize";
import { Component, For } from "solid-js";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Home from "./routes";
import About from "./routes/About";
import Register from "./routes/auth/register";
import SignIn from "./routes/auth/sign-in";
export interface AppRoute {
  path: string;
  component: Component;
  label?: string;
}

window.addEventListener("popstate", function () {
  console.log("change event");
});

const routes: AppRoute[] = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/sign-in", component: SignIn },
  { path: "/sign-up", component: Register },
];

routes.forEach((route) => {
  route.label = capitalize(route.path.replace("/", ""));
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
      <div id="content-container" class="headerBelowShown">
        <div id="content">
          <Routes>
            <For each={routes}>{(route) => <Route path={route.path} component={route.component} />}</For>
            <Route path="*" component={NotFound} />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
