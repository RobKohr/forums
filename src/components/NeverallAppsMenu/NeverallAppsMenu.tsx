import { setMenuModalActive } from "../MenuModal/MenuModalState";
import AppsIcon from "./apps.svg";
import NeverallLogo from "./neverall-logo.svg";
import "./NeverallAppsMenu.scss";
export default function NeverallAppsMenu() {
  return (
    <div class="neverall-apps-component clickable" onClick={() => setMenuModalActive((value) => (value === "apps" ? "" : "apps"))}>
      <NeverallLogo class="neverall-logo" />
      <AppsIcon class="apps-icon" />
    </div>
  );
}
