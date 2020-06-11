import React from "react";
import ReactSidebar from "react-sidebar";
import styled from "styled-components";
import { space } from "@styled-system/space";
import { scrollbars } from "style/scrollbars";

const Base = ({ className, ...props }) => (
  <ReactSidebar
    sidebarClassName={className}
    contentClassName="content"
    {...props}
  />
);

export const Sidebar = styled(Base)`
  ${space({ px: 2, py: 1 })};
  background: ${({ theme }) => theme.background};
  ${scrollbars}

  & ~ .content {
    ${scrollbars}
  }
`;

