import styled from 'styled-components';

interface IBiColumn {
  width?: string;
  height?: string;
  columnsOnMobile: string;
  gap?: string;
}

const BiColumn = styled.div<IBiColumn>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  ${({ gap }) => gap && `gap: ${gap};`}
  align-items: center;

  ${({ width }) => width && `width: ${width};`}
  ${({ height }) => height && `height: ${height};`}

  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.values.tablet}px) {
    ${({ columnsOnMobile }) => columnsOnMobile && `grid-template-columns: ${columnsOnMobile};`}
  }
`;

interface IDoubleColumn {
  children: React.ReactNode;
  props: IBiColumn;
}

const DoubleColumn: React.FC<IDoubleColumn> = ({ children, props }: IDoubleColumn) => {
  return (
    <BiColumn width={props.width} height={props.height} columnsOnMobile={props.columnsOnMobile}>
      {children}
    </BiColumn>
  );
};

export default DoubleColumn;
