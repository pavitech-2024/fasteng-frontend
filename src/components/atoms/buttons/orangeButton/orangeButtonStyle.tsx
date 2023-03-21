import styled, { css } from "styled-components";
import { buttonType, IOrangeButton } from "./orangeButton";

export const ButtonLogoArea = styled.button`
  display: inline-block;
  text-align: center;
  font-family: "Work Sans", sans-serif;
  border: 1px solid #f57e34;
  transition: all 0.4s ease 0s;
  font-weight: 500;
  letter-spacing: 1px;
  width: 110px;
  height: 30px;
  border-radius: 15px;
  padding: 4px 0px;
  font-size: 12px;
  cursor: pointer;

  ${({ buttonStyle }: IOrangeButton) => getButtonType(buttonStyle)}
  
  :focus {
    outline: none;
  }
  `;

const getButtonType = (buttonStyle: buttonType) => {
  switch (buttonStyle) {
    case "normal": {
      return css`
        background-color: transparent;
        color: #f57e34;
        :hover {
            background-color: #f57e34;
            color: #ffffff;
        }
      `;
    }
    case "ghost": {
      return css`
        background-color: #f57e34;
        color: #ffffff;
        :hover {
            opacity: 0.9;
        }
      `
    }
  }
};
