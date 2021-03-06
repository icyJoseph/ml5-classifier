import styled from "styled-components";
import { space } from "@styled-system/space";

export const Box = styled.div`
  ${space};
  width: ${(props) => props.width ?? "auto"};
  height: ${(props) => props.height ?? "auto"};
`;
