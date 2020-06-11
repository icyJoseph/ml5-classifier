import { h } from "preact";
import { useReducer, useEffect } from "preact/hooks";

import style from "./window.scss";

const [OPENING, CLOSING] = ["opening", "closing"];

const reducer = (state, action) => {
  switch (action.type) {
    case OPENING:
      return { closing: false, opening: true };
    case CLOSING:
      return { opening: false, closing: true };
    default:
      return state;
  }
};

export function Window({ nextWindowState, children }) {
  const [state, dispatch] = useReducer(reducer, {
    opening: true,
    closing: false
  });

  useEffect(() => {
    if (nextWindowState) {
      dispatch({ type: OPENING });
    } else {
      dispatch({ type: CLOSING });
    }
  }, [nextWindowState]);

  const { opening, closing } = state;

  return (
    <div
      className={`${style.window} ${opening ? style.opening : ""} ${
        closing ? style.closing : ""
      }`}
    >
      {children}
    </div>
  );
}
