import "./ActionButton.scss";
export default function ActionButton(props: { children: any; onClick: () => void }) {
  return (
    <button class="action-button" onClick={props.onClick}>
      {props.children}
    </button>
  );
}
