import { NoDataFound } from '@/components/util/tables';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';

interface Step3Props {
  rows: any[];
  columns: GridColDef[];
  columnGrouping: GridColumnGroupingModel;
}

const Step3Table = ({ rows, columns, columnGrouping }: Step3Props & { superpave: Superpave_SERVICE }) => {
  return (
    <Box>
      <DataGrid
        sx={{
          borderRadius: '10px',
          height: 300,
        }}
        density="compact"
        hideFooter
        experimentalFeatures={{ columnGrouping: true }}
        columnGroupingModel={columnGrouping}
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

export default Step3Table;
