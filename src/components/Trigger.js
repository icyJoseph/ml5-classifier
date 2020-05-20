import { h } from "preact";
import trigger from "./trigger.scss";

const Loading = () => (
  <span
    className={trigger.hourglass}
    role="img"
    aria-label="loading"
    title="Loading..."
  >
    ⏳
  </span>
);

const OpenMenu = ({ onClick }) => (
  <span
    className={trigger.openmenu}
    role="img"
    aria-label="open menu"
    title="Open Menu"
    onClick={onClick}
  >
    📖
  </span>
);

export function Trigger({ loading, toggleWindow }) {
  return (
    <div className={trigger.trigger}>
      {loading ? <Loading /> : <OpenMenu onClick={toggleWindow} />}
    </div>
  );
}
