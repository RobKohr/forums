import { A } from "@solidjs/router";
import "./Logo.scss";

export default function Logo() {
  return (
    <div class="logo-component">
      <A href="/">
        {/* <img class="top-icon" src="/icons/iconmonstr-stream-2.svg" />
        <span class="logo-text inline-block">
          <span>Channels</span>
        </span> */}
        <img class="top-icon godot-shopping" src="/icons/godot-shopping.png" />
        <h1 class="logo-text inline-block">Godot Asset Store</h1>
      </A>
    </div>
  );
}
