import styled from 'styled-components';
import Image from 'next/image';

export const LoginImage = styled(Image)`
  width: 310px;
  height: 50px;
  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.values.notebook}px) {
    width: 155px;
    height: 25px;
  }
`;
