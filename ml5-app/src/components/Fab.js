import React from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { space } from "@styled-system/space";

export const Fab = styled.button`
  ${space({ mb: 2 })};
  border-radius: 50%;
  height: 48px;
  width: 48px;
  font-size: 24px;
  background: ${({ theme }) => theme.primary};
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);

  cursor: ${({ onClick }) => (!!onClick ? "pointer" : "default")};

  &:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.4);
  }
`;

const Base = styled.div`
  position: fixed;
  z-index: 200;
  bottom: 16px;
  right: 16px;
  display: flex;
  flex-direction: column-reverse;
`;

export const FabBase = ({ portal = null, children }) => {
  const root = portal ?? document.body;

  if (!root) {
    return null;
  }

  return createPortal(<Base>{children}</Base>, root);
};
