import { NoDataFound } from '@/components/util/tables';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';

interface Step4Props {
  rows: { _id: string; name: string }[];
  columns: GridColDef[];
}

const Step4Table = ({ rows, columns }: Step4Props & { marshall: Marshall_SERVICE }) => {
  return (
    <Box>
      <DataGrid
        sx={{
          borderRadius: '10px',
          height: 300,
        }}
        columns={columns.map((column) => ({
          ...column,
          disableColumnMenu: true,
          sortable: false,
          align: 'center',
          headerAlign: 'center',
          minWidth: 100,
          flex: 1,
        }))}
        rows={
          rows !== null
            ? rows.map((row, index) => ({
                ...row,
                id: index,
              }))
            : []
        }
        slots={{
          noRowsOverlay: () => <NoDataFound message="Nenhum material encontrado" />,
          noResultsOverlay: () => <NoDataFound message="Nenhum material encontrado" />,
        }}
      />
    </Box>
  );
};

export default Step4Table;
