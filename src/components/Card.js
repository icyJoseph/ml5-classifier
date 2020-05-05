import styled, { keyframes } from "styled-components";
import { space } from "@styled-system/space";

const appear = keyframes`
   0% { opacity: 0; }
   100% { opacity: 1; }  
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.foreground};

  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: unset;
  overflow-x: hidden;

  @media (min-width: 768px) {
    border-radius: 4px;
    width: 80%;
    min-width: 512px;
    transition: box-shadow 0.7s ease;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
    &:hover {
      box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.4);
    }
  }
`;

Card.Figure = styled.figure`
  display: flex;
  flex: 2;
  flex-direction: column;
  position: relative;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-height: 512px;

  @media (min-width: 1024px) {
    min-width: 512px;
  }
`;

Card.FigCaption = styled.figcaption`
  ${space({ p: 1 })}
  width: 100%;
  position: absolute;
  top: ${(props) => props.top ?? "unset"};
  bottom: ${(props) => props.bottom ?? "unset"};
  color: white;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1;
`;

Card.Image = styled.img`
  animation: ${appear} 1s;
  animation-fill-mode: forwards;
  width: 512px;
  overflow: hidden;
  height: 100%;
`;

Card.Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
`;
