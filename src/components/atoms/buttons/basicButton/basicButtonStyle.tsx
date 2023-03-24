import styled, { css } from 'styled-components';
import { IBasicButton, buttonAppearance } from './basicButton';

export const ButtonLogoArea = styled.button`
  display: inline-block;
  text-align: center;
  font-family: 'Work Sans', sans-serif;
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

  ${({ buttonStyle }: IBasicButton) => getButtonType(buttonStyle)}

  :focus {
    outline: none;
  }
`;

const getButtonType = (buttonStyle: buttonAppearance) => {
  switch (buttonStyle) {
    case 'normal': {
      return css`
        background-color: transparent;
        color: #f57e34;
        :hover {
          background-color: #f57e34;
          color: #ffffff;
        }
      `;
    }
    case 'ghost': {
      return css`
        background-color: #f57e34;
        color: #ffffff;
        :hover {
          opacity: 0.9;
        }
      `;
    }
    case 'large': {
      return css`
        display: flex;
        flex-direction: row;
        border: 1px solid #f57e34;
        background: #f57e34;
        color: #ffffff;
        justify-content: center;
        align-items: center;
        text-align: center;
        border-radius: 21px;
        width: 100%;
        height: 42px;
        font-size: 14px;
        font-weight: 400;
        transition: all 0.3s ease-in-out;
        font-family: 'Work Sans', sans-serif;
        cursor: pointer;
        :hover {
          box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
        }
        :focus {
          outline: none;
        }
      `;
    }
  }
};
