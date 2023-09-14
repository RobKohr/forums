import { useNavigate } from "@solidjs/router";
import ActionButton from "../../forms/ActionButton/ActonButton";
import { setMenuModalActive } from "../MenuModalState";

export default function MenuModalAccount() {
  const navigate = useNavigate();
  return (
    <>
      <ActionButton
        data-testid="header-sub-sign-up"
        onClick={() => {
          setMenuModalActive("signup");
        }}
      >
        Sign up
      </ActionButton>
      <ActionButton
        data-testid="header-sub-sign-in"
        onClick={() => {
          setMenuModalActive("signin");
        }}
      >
        Sign in
      </ActionButton>
    </>
  );
}
