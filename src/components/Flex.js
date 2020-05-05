import styled from "styled-components";
import { space } from "@styled-system/space";
import { Box } from "components/Box";

export const Flex = styled(Box)`
  ${space}
  display: flex;
  flex: ${(props) => props.flex ?? "unset"};
  flex-direction: ${(props) => props.flexDirection ?? "row"};
  flex-wrap: ${(props) => props.flexWrap ?? "nowrap"};
  justify-content: ${(props) => props.justifyContent ?? "unset"};
  align-items: ${(props) => props.alignItems ?? "unset"};
`;
