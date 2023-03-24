import { BiColumn } from './doubleColumnStyle';

interface IDoubleColumn {
  children: React.ReactNode;
}

const DoubleColumn: React.FC<IDoubleColumn> = ({ children }: IDoubleColumn) => {
  return <BiColumn>{children}</BiColumn>;
};

export default DoubleColumn;
