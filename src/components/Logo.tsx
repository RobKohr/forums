import { A } from "@solidjs/router";
import "./Logo.scss";

export default function Logo() {
  return (
    <div class="logo-component">
      <A href="/">
        <img class="top-icon" src="/icons/iconmonstr-stream-2.svg" />
        <span class="logo-text inline-block">
          <span>Channels</span>
        </span>
      </A>
    </div>
  );
}
