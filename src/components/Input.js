import styled from "styled-components";
import { space } from "@styled-system/space";

export const Fieldset = styled.fieldset`
  text-align: center;
  @media (min-width: 320px) {
    text-align: unset;
  }
`;

Fieldset.Legend = styled.legend`
  transition: transform 0.5s ease, opacity 0.5s ease;
  transform: translateY(-15px);
  opacity: 0;

  input:not(:placeholder-shown) ~ & {
    transform: translateY(0px);
    opacity: 1;
  }
`;

Fieldset.Input = styled.input`
  background: transparent;
  font-size: inherit;
  border: none;
  border-bottom-color: ${({ theme }) =>
    theme.mode === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0, 0, 0, 0.4)"};
  border-bottom-style: solid;
  border-bottom-width: 1px;
  color: ${({ theme }) => (theme.mode === "dark" ? "white" : "black")};

  &:focus {
    outline-color: ${({ theme }) => theme.primary};
    outline-width: 1px;
    outline-offset: 8px;
    outline-style: dotted;
  }

  &::placeholder {
    color: ${({ theme }) => (theme.mode === "dark" ? "#f8f8f8" : "#090909")};
    opacity: 0.5;
    transition: opacity 0.35s ease-in-out;
  }

  &:focus::placeholder {
    transition: opacity 0.5s 0.5s ease !important;
    opacity: 0.25;
  }
`;

Fieldset.Button = styled.button`
${space({ mt: 1, mx: 2, py: 1, px: 2 })}
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 4px;

  @media (min-width: 320px) {
    ${space({ mx: 2, py: 1, px: 2 })};
  }
`;
