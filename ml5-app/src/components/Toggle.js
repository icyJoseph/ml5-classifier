import React from "react";
import styled from "styled-components";

const ToggleContainer = styled.label`
  background: ${({ theme }) =>
    theme.mode === "dark"
      ? "linear-gradient(#091236, #1E215D)"
      : "linear-gradient(#39598A, #79D7ED)"};

  border-radius: 30px;
  cursor: pointer;
  display: flex;

  justify-content: space-between;
  margin: 0 auto;
  overflow: hidden;

  position: relative;
  width: 4rem;
  height: 2rem;
  font-size: 1.125rem;

  & > input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  & > div {
    height: auto;
    width: 100%;
    margin: auto;
    display: flex;
    justify-content: space-around;
  }

  & > div > *:first-child {
    transition: all 0.3s linear;
    transform: ${({ theme }) =>
      theme.mode === "dark" ? "translateX(0)" : "translateX(-2rem)"};
  }

  & > div > *:nth-child(2) {
    transition: all 0.3s linear;
    transform: ${({ theme }) =>
      theme.mode === "dark" ? "translateX(4rem)" : "translateY(0)"};
  }
`;

export const Toggle = ({ checked, onChange, darkLabel, lightLabel }) => (
  <ToggleContainer
    aria-label="color-theme-switch"
    htmlFor="theme-toggle"
    tabIndex="1"
    onKeyDown={(e) => {
      if (e.key === "Enter") onChange();
    }}
  >
    <input
      id="theme-toggle"
      name="theme-toggle"
      type="checkbox"
      onChange={onChange}
      checked={checked}
      tabIndex="-1"
    />
    <div>
      {darkLabel}
      {lightLabel}
    </div>
  </ToggleContainer>
);
