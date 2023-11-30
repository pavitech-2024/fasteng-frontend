import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface RtfoTableProps {
  rows: {
    id: number;
    weightLoss: string;
  }[];
  columns: GridColDef[];
}

const Rtfo_resultsTable = ({ rows, columns }: RtfoTableProps) => {
  return (
    <DataGrid
      sx={{
        mt: '1rem',
        borderRadius: '10px',
      }}
      density="standard"
      hideFooter
      showCellVerticalBorder
      showColumnVerticalBorder
      columns={columns.map((column) => ({
        ...column,
        disableColumnMenu: true,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
        minWidth: 200,
      }))}
      rows={
        rows !== null
          ? rows.map((row, index) => ({
              ...row,
              id: index,
            }))
          : []
      }
    />
  );
};

export default Rtfo_resultsTable;
