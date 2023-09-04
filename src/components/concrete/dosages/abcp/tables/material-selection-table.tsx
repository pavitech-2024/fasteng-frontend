import { NoDataFound } from '@/components/util/tables';
import { Box, Stack } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface MaterialSelectionProps {
  header?: string;
  rows: { name?: string; type?: string; resistance?: string }[];
  columns: GridColDef[];
}

const MaterialSelectionTable = ({ rows, columns, header }: MaterialSelectionProps) => {
  return (
    <Box
      sx={{
        p: '1rem',
        textAlign: 'center',
        border: '1px solid lightgray',
        borderRadius: '10px',
      }}
    >
      <h3>{header}</h3>
      <Box
        sx={{
          display: 'flex',
          msFlex: 'none',
          gap: '1rem',
          m: 'auto',
        }}
      ></Box>
      <Box
        sx={{
          mt: '1rem',
        }}
      >
        <DataGrid
          sx={{
            borderRadius: '10px',
            height: 300,
          }}
          checkboxSelection
          disableRowSelectionOnClick
          disableColumnSelector
          columns={columns.map((column) => ({
            ...column,
            disableColumnMenu: true,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
            minWidth: 100,
            maxWidth: 250,
            flex: 1,
          }))}
          rows={rows !== null ? rows.map((row, index) => ({ ...row, id: index })) : []}
          slots={{
            noRowsOverlay: () => <NoDataFound message="Nenhum material encontrado" />,
            noResultsOverlay: () => <NoDataFound message="Nenhum material encontrado" />,
          }}
        />
      </Box>
    </Box>
  );
};

export default MaterialSelectionTable;
