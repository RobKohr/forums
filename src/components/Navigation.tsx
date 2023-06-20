import { A } from "@solidjs/router";
import { For } from "solid-js";
import { Route } from "../App";

export function Navigation(props: { routes: Route[] }) {
  return (
    <nav>
      <ul>
        <For each={props.routes}>
          {(route) => (
            <li>
              <A href={route.path}>{route.label}</A>
            </li>
          )}
        </For>
      </ul>
    </nav>
  );
}
