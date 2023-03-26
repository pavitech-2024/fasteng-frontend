import styled from 'styled-components';

const Hide = styled.div<{ width: string }>`
  ${({ width }) => width && `@media (max-width: ${width}) { display: none; };`}
`;

export const DisplayNone = ({ children, width }: { children: React.ReactNode; width: string }) => {
  return <Hide width={width}>{children}</Hide>;
};
