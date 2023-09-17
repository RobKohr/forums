import { useNavigate } from "@solidjs/router";
import ActionButton from "../../Forums/ActionButton/ActonButton";
import { setMenuModalActive } from "../MenuModalState";

export default function MenuModalAccount() {
  const navigate = useNavigate();
  return (
    <>
      <ActionButton
        data-testid="header-sub-register"
        onClick={() => {
          setMenuModalActive("login");
        }}
      >
        Register
      </ActionButton>
      <ActionButton
        data-testid="header-sub-login"
        onClick={() => {
          setMenuModalActive("signin");
        }}
      >
        Login
      </ActionButton>
    </>
  );
}
