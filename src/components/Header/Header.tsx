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
      <div class="header-sub" style="position:absolute; top:100px; left:0px; right:0px;background:white; height:100px;">
        <Search />
      </div>
    </div>
  );
}
