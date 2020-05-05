import React from "react";
import ReactSidebar from "react-sidebar";
import styled from "styled-components";
import { space } from "@styled-system/space";

const Base = ({ className, ...props }) => (
  <ReactSidebar sidebarClassName={className} {...props} />
);

export const Sidebar = styled(Base)`
  ${space({ px: 2, py: 1 })};
  background: ${({ theme }) => theme.background};

  --scrollbarBG: ${({ theme }) => theme.background};
  --thumbBG: ${({ theme }) => theme.foreground};

  scrollbar-width: thin;
  scrollbar-color: var(--thumbBG) var(--scrollbarBG);

  &::-webkit-scrollbar {
    width: 11px;
  }

  &::-webkit-scrollbar-track {
    background: var(--scrollbarBG);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--thumbBG);
    border-radius: 6px;
    border: 3px solid var(--scrollbarBG);
  }
`;
