/* Copyright Robert Kohr 2023 - All Rights Reserved */

import { Route, Routes } from "@solidjs/router";
import capitalize from "lodash.capitalize";
import { Component, For } from "solid-js";
import Footer from "./components/Footer/Footer";
import Header, { belowHeader } from "./components/Header/Header";
import Loading from "./components/Loading/Loading";
import { MenuModal } from "./components/MenuModal/MenuModal";
import Notifications from "./components/Notifications/Notifications";
import { setAuthUserTokenFromCookie } from "./components/authUserToken";

import Asset from "./pages/_sites/asset-store/asset";
import Browse from "./pages/_sites/asset-store/browse";
import Article from "./pages/_sites/forum/article";
import SignIn from "./pages/auth/login";
import Logout from "./pages/auth/logout";
import Register from "./pages/auth/register";
import Test from "./pages/test";
export interface AppRoute {
  path: string;
  component: Component;
  label?: string;
}

const site: string = "asset-store";

export interface SiteRoutes {
  [site: string]: AppRoute[];
}

const siteRoutes: SiteRoutes = {};

siteRoutes["common"] = [
  { path: "/auth/login", component: SignIn },
  { path: "/auth/register", component: Register },
  { path: "/auth/logout", component: Logout },
];
siteRoutes["forum"] = [{ path: "/article/:id", component: Article }];

siteRoutes["asset-store"] = [
  { path: "/", component: Browse },
  { path: "/assets/browse", component: Browse },
  { path: "/assets/:tag0/browse", component: Browse },
  { path: "/assets/:tag0/:tag1/browse", component: Browse },
  { path: "/assets/:tag0/:tag1/:tag2/browse", component: Browse },
  { path: "/assets/:tag0/:tag1/:tag2/:tag3/browse", component: Browse },
  { path: "/assets/:id", component: Asset },
  { path: "/assets/:tag0/:id", component: Asset },
  { path: "/assets/:tag0/:tag1/:id", component: Asset },
  { path: "/assets/:tag0/:tag1/:tag2/:id", component: Asset },
  { path: "/assets/:tag0/:tag1/:tag2/:tag3/:id", component: Asset },
  { path: "/test", component: Test },
];

const routes: AppRoute[] = [...siteRoutes[site], ...siteRoutes["common"]];

routes.forEach((route) => {
  route.label = capitalize(route.path.replace("/", ""));
  if (!route.label) {
    route.label = "Home";
  }
});

function NotFound() {
  return <div>Page Not Found</div>;
}

// const VITE_VARIABLE_NAME = import.meta.env["VITE_VARIABLE_NAME"];
const App: Component = () => {
  setAuthUserTokenFromCookie();
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
