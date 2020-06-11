import styled from "styled-components";

export const Preview = styled.div`
  width: 100%;
  height: 100%;
`;

Preview.Image = styled.img`
  width: 128px;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.4);
  }
`;
