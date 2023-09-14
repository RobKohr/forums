import UserIcon from "../../assets/icons/user.svg";
import { setMenuModalActive } from "../MenuModal/MenuModalState";
import "./AccountImage.scss";
export default function AccountImage() {
  return (
    <div class="account-image-component">
      <UserIcon
        class="user-icon clickable"
        data-testid="toggle-account-menu"
        onClick={() =>
          setMenuModalActive((value) => (value === "account" ? "" : "account"))
        }
      />
    </div>
  );
}
