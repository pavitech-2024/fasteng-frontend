import styled from 'styled-components';
import Image from 'next/image';

export const HomeImage = styled(Image)`
  height: 5vh;
  width: auto;

  @media only screen and (min-width: 1025px) {
    height: auto;
    width: 30vw;
  }
`;
