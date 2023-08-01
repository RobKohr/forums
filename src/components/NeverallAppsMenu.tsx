import NeverallLogo from "../assets/icons/neverall-logo.svg";

export default function NeverallAppsMenu() {
  return (
    <div class="logo-container">
      <a href="https://neverall.com">
        <NeverallLogo
          style={{
            width: "60px",
            height: "60px",
            fill: "white",
            position: "relative",
            top: "-10px",
            left: "0px",
          }}
        />
      </a>
    </div>
  );
}
