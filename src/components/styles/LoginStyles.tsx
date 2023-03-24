import styled from 'styled-components';
import { point } from '../config/breakpoints';

export const BlueLogin = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  background: url();
  background-size: cover;
  padding: 15px 50px;
  position: relative;
  z-index: 1;
  ::before {
    content: '';
    display: flex;
    width: 100%;
    height: 100%;
    background: rgba(15, 62, 105, 0.8);
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
  svg {
    width: 310px;
    height: 50px;
    margin-top: 150px;
  }

  & p {
    font-family: 'Open Sans', sans-serif;
    font-size: 14px;
    margin-top: 15px;
    margin-bottom: 30px;
    font-weight: normal;
    color: #ffffff;
    opacity: 0.95;
  }

  @media (max-width: 1000px) {
    display: none;
  }
`;

export const WhiteLogin = styled.div`
  display: grid;
  padding: 10px 20%;
  justify-items: center;
  @media only screen and (${point.tablet}) {
    padding: 10px 100px;
  }
  @media only screen and (${point.mobile}) {
    padding: 10px 50px;
  }
`;

export const HeaderLogin = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;

  h1 {
    font-family: 'Work Sans', sans-serif;
    font-weight: normal;
    color: #a3a3a3;
    font-size: 14px;
  }
  h1 strong {
    font-size: 16px;
  }
`;
export const ButtonArea = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  gap: 25px;
`;

export const LoginInputsArea = styled.div`
  display: grid;
  width: 100%;
  grid-template-rows: repeat(2, 42px) 80px;
  gap: 25px;
  padding: 10px 5%;

  h1 {
    align-self: center;
    font-size: 28px;
    color: #555555;
    font-weight: bold;
    margin-top: 30px;
  }
`;

export const LoginActions = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  align-items: center;

  a {
    font-weight: bold;
    font-family: 'Open Sans', sans-serif;
    font-size: 13px;
    color: #f57e34;
    line-height: 11px;
    border-bottom: 1px solid #f57e34;
    :hover {
      color: #f57e34;
      opacity: 0.8;
    }
  }
`;
