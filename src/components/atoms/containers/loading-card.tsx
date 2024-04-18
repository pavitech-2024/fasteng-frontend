import React from 'react';
import styled, { keyframes } from 'styled-components';

const loadingAnimation = keyframes`
  0% { opacity: 1; }
  20% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

const StyledParagraph = styled.p`
  color: gray;
  font-size: 20px;
  opacity: 1;
  font-weight: bold;
  animation: ${loadingAnimation} 2s linear 0s infinite normal;
`;
const StyledImg = styled.p`
  animation: ${loadingAnimation} 2s linear 0s infinite normal;
`;

export const LoadingText = ({ children }: { children: React.ReactNode }) => (
  <StyledParagraph>{children}</StyledParagraph>
);

export const LoadingImg = ({ children }: { children: React.ReactNode }) => <StyledImg>{children}</StyledImg>;
