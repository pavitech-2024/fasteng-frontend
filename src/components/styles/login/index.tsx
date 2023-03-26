import styled from 'styled-components';
import { Container } from '@mui/material';
import Image from 'next/image';

export const LoginContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.values.tablet}px) {
    height: 50vh;
  }
`;

export const LoginImage = styled(Image)`
  width: 310px;
  height: 50px;
  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.values.mobile}px) {
    width: 103px;
    height: 16px;
  }
`;
