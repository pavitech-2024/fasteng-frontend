import { NoDataFound } from '@/components/util/tables';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';

interface Step3Props {
  rows: { [key: string]: number }[];
  columns: GridColDef[];
}

const Step3InputTable = ({ rows, columns }: Step3Props & { marshall: Marshall_SERVICE }) => {
  return (
    <Box>
      <DataGrid
        sx={{
          borderRadius: '10px',
        }}
        density="compact"
        hideFooter
        columns={
          columns !== null
            ? columns.map((column) => ({
                ...column,
                disableColumnMenu: true,
                sortable: false,
                align: 'center',
                headerAlign: 'center',
                minWidth: 100,
                flex: 1,
              }))
            : []
        }
        rows={
          rows !== null
            ? rows?.map((row, index) => ({
                ...row,
                id: index,
              }))
            : []
        }
        slots={{
          noRowsOverlay: () => <NoDataFound message="Nenhum dado encontrado" />,
          noResultsOverlay: () => <NoDataFound message="Nenhum dado encontrado" />,
        }}
      />
    </Box>
  );
};

export default Step3InputTable;
