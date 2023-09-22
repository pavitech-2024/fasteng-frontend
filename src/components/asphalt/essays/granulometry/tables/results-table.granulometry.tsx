import { GridColDef, DataGrid } from "@mui/x-data-grid";

interface resultsGranulometryProps {
  rows: {
    sieve: string;
    passant_porcentage: number;
    passant: number;
    retained_porcentage: number;
    retained: number;
    accumulated_retained: number;
  }[];
  columns: GridColDef[];
}

const AsphaltGranulometry_resultsTable = ({ rows, columns }: resultsGranulometryProps) => {
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

export default AsphaltGranulometry_resultsTable;