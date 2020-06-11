import React from "react";
import ReactDOM from "react-dom";

import { App } from "App";
import { theme } from "style/theme";
import { GlobalStyle } from "style/global";
import { ThemeProvider } from "providers/ThemeProvider";

import * as serviceWorker from "serviceWorker";

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ThemeProvider>,
  document.getElementById("root")
);

serviceWorker.unregister();
