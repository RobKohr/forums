import AppsIcon from "../assets/icons/apps.svg";
import NeverallLogo from "../assets/icons/neverall-logo.svg";
import "./NeverallAppsMenu.scss";
export default function NeverallAppsMenu() {
  return (
    <div class="neverall-apps-component">
      <NeverallLogo class="neverall-logo" />
      <AppsIcon class="apps-icon" />
    </div>
  );
}
