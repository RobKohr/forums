/* Copyright Robert Kohr 2023 - All Rights Reserved */

import { Route, Routes } from "@solidjs/router";
import capitalize from "lodash.capitalize";
import { Component, For } from "solid-js";
import Footer from "./components/Footer/Footer";
import Header, { belowHeader } from "./components/Header/Header";
import Loading from "./components/Loading/Loading";
import { MenuModal } from "./components/MenuModal/MenuModal";
import Notifications, {
  createNotification,
} from "./components/Notifications/Notifications";
import Home from "./routes";
import About from "./routes/about";
import Register from "./routes/auth/register";
import SignIn from "./routes/auth/sign-in";
import Test from "./routes/test";
export interface AppRoute {
  path: string;
  component: Component;
  label?: string;
}

const routes: AppRoute[] = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/auth/sign-in", component: SignIn },
  { path: "/auth/sign-up", component: Register },
  { path: "/test", component: Test },
];

routes.forEach((route) => {
  route.label = capitalize(route.path.replace("/", ""));
  if (!route.label) {
    route.label = "Home";
  }
});

// function urlEncode(str: string) {
//   return encodeURIComponent(str).replace(/%20/g, "+");
// }

function NotFound() {
  return <div>Page Not Found</div>;
}

// export function signIn() {
//   console.log("sign in");
//   const path = window.location.href.split("?")[0];
//   window.location.href = `/sign-in?returnTo=${urlEncode(path || "/")}`;
// }

// const VITE_VARIABLE_NAME = import.meta.env["VITE_VARIABLE_NAME"];
const App: Component = () => {
  createNotification({ message: "Hello World", type: "info" });
  return (
    <div id="app">
      <Loading />
      <MenuModal />
      <Header />
      <div
        id="content-container"
        class={`${belowHeader() ? "headerBelowShown" : ""}`}
      >
        <Notifications />
        <div id="content">
          <Routes>
            <For each={routes}>
              {(route) => (
                <Route path={route.path} component={route.component} />
              )}
            </For>
            <Route path="*" component={NotFound} />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
