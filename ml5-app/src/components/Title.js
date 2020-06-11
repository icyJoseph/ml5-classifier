import React from "react";
import styled from "styled-components";
import { space } from "@styled-system/space";

const Base = ({ as: El = "div", ...props }) => <El {...props} />;

export const Title = styled(Base)`
  ${space}
`;
