import { point } from '@/components/config/breakpoints';
import styled from 'styled-components';

export const BiColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  align-items: center;

  @media only screen and (${point.tablet}) {
    grid-template-columns: 1fr;
  }
`;
