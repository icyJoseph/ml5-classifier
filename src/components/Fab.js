import React from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

const Base = styled.button`
  position: absolute;
  bottom: 32px;
  right: 32px;
  border-radius: 50%;
  height: 48px;
  width: 48px;
  font-size: 24px;
  background: ${({ theme }) => theme.primary};
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.4);

  z-index: 200;
`;

export const Fab = (props) => {
  const root = document.getElementById("root");

  if (!root) {
    return null;
  }

  return createPortal(<Base {...props} />, root);
};
