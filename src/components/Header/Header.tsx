import AccountImage from "../AccountImage/AccountImage";
import Logo from "../Logo";
import NeverallAppsMenu from "../NeverallAppsMenu";
import Search from "../Search/Search";
import "./Header.scss";
export default function Header() {
  return (
    <div id="header">
      <div class="header-sub">
        <Logo />
      </div>
      <div class="header-sub">SearchButton</div>
      <div class="header-sub">
        <NeverallAppsMenu />
        <AccountImage />
      </div>
      <div class="header-sub below hidden">
        <Search />
      </div>
    </div>
  );
}
