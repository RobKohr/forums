import { useNavigate } from "@solidjs/router";
import ActionButton from "../../forms/ActionButton/ActonButton";
import { setMenuModalActive } from "../MenuModalState";

export default function MenuModalAccount() {
  const navigate = useNavigate();
  return (
    <>
      <ActionButton
        onClick={() => {
          setMenuModalActive("signup");
        }}
      >
        Sign up
      </ActionButton>
      <ActionButton
        onClick={() => {
          setMenuModalActive("signin");
        }}
      >
        Sign in
      </ActionButton>
    </>
  );
}
