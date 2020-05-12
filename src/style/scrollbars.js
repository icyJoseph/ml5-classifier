import { css } from "styled-components";

export const scrollbars = css`
  --scrollbarBG: ${({ theme }) => theme.background};
  --thumbBG: ${({ theme }) => theme.foreground};

  scrollbar-width: thin;
  scrollbar-color: var(--thumbBG) var(--scrollbarBG);

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--scrollbarBG);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--thumbBG);
    border-radius: 6px;
    border: 1px solid var(--scrollbarBG);
  }
`;
