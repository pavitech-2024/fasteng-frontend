import styled from 'styled-components';
import Image from 'next/image';

//Images
export const LoginImage = styled(Image)`
  width: 250px;
  height: auto;

  @media only screen and (min-width: 768px) {
    width: 480px;
  }

  @media only screen and (min-width: 1025px) {
    width: 400px;
  }

  @media only screen and (min-width: 1366px) {
    width: 500px;
  }
`;

export const LoginBackgroundPhoto = styled(Image)`
  position: absolute;
  z-index: 1;
  top: 0;

  height: 60vh;
  width: 100vw;

  @media only screen and (min-width: 1025px) {
    height: 100vh;
    width: 50vw;
  }
`;
