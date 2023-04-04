import styled from 'styled-components';
import Image from 'next/image';

//Images
export const LoginImage = styled(Image)`
  width: 304px;
  height: 42px;

  @media only screen and (min-width: 768px) {
    width: 576px;
    height: 79px;
  }

  @media only screen and (min-width: 1024px) {
    width: 400px;
    height: 55px;
  }

  @media only screen and (min-width: 1366px) {
    width: 576px;
    height: 79px;
  }
`;

export const LoginBackgroundPhoto = styled(Image)`
  position: absolute;
  z-index: 1;
  top: 0;

  height: 60vh;
  width: 100vw;

  @media only screen and (min-width: 1024px) {
    height: 100vh;
    width: 50vw;
  }
`