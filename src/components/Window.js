import { h } from "preact";

import style from "./window.scss";

export function Window({ children }) {
  return <div className={style.window}>{children}</div>;
}
