import { A, Route, Routes } from "@solidjs/router";
import _ from "lodash";
import { Component, For } from "solid-js";
import Home from "./routes";
import About from "./routes/About";
import { SignIn } from "./routes/accounts/SignIn";
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

const App: Component = () => {
  function signIn() {
    console.log("sign in");
    window.location.href = `/sign-in?returnTo=${urlEncode(window.location.href.split("?")[0])}`;
  }
  console.log(routes);
  return (
    <div id="app">
      <div id="header">
        <div id="neverall-forums-logo">Logo</div>
        <div id="search-area">
          <input type="text" id="search" placeholder="Search" />
          {import.meta.env["VITE_VARIABLE_NAME"]}
          <input type="submit" id="search-button" value="Search" />
        </div>
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
