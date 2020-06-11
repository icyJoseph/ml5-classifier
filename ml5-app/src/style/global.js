import { createGlobalStyle } from "styled-components";
import { reset } from "style/reset";
import { normalize } from "style/normalize";

export const GlobalStyle = createGlobalStyle`
  ${reset}
  ${normalize}

  * {
    font-family: 'Didact Gothic', sans-serif;
  }

  html, body {
    height: 100%;
  }

  body {
      background: ${({ theme }) => theme.background};
      color:${({ theme }) => (theme.mode === "dark" ? "white" : "black")};
      transition: all 0.25s linear;
  }
`;
