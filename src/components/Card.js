import styled, { keyframes } from "styled-components";
import { space } from "@styled-system/space";

const appear = keyframes`
   0% { opacity: 0; }
   100% { opacity: 1; }  
`;

const pulse = keyframes`
  0% {opacity:1;}
  50% {opacity:0.5;}
  100% {opacity: 1;}
`;

export const Card = styled.div`
  ${space};
  background: ${({ theme }) => theme.foreground};
  position: relative;

  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: unset;
  overflow-x: hidden;
  justify-self: center;
  align-self: center;

  @media (min-width: 576px) {
    border-radius: 4px;
    width: 80%;
    height: unset;
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
`;

Card.FigCaption = styled.figcaption`
  ${space({ p: 1 })}
  width: 100%;
  position: absolute;
  top: ${(props) => props.top ?? "unset"};
  bottom: ${(props) => props.bottom ?? "unset"};
  color: ${(props) => props.theme.highlight};
  background: rgba(0, 0, 0, 0.7);
  z-index: 1;

  > span {
    color: white;
  }
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

  > img.loading {
    animation: ${pulse} 1s forwards infinite;
  }
`;
