import styled from 'styled-components';
import Image from 'next/image';

export const LoginImage = styled(Image)`
  width: 310px;
  height: 50px;
  @media only screen and (min-width: ${({ theme }) => theme.breakpoints.values.mobile}px) {
    width: 155px;
    height: 25px;
  }
`;
