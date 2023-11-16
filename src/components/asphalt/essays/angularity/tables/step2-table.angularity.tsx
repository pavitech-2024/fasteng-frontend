import { row_step2 } from '@/stores/asphalt/angularity/angularity.store';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';

interface step2GranulometryProps {
  rows: row_step2[];
  columns: GridColDef[];
}

const Angularity_step2Table = ({ rows, columns }: step2GranulometryProps) => {
  return (
    <DataGrid
      sx={{ mt: '1rem', borderRadius: '10px' }}
      density="compact"
      hideFooter
      showCellVerticalBorder
      showColumnVerticalBorder
      experimentalFeatures={{ columnGrouping: true }}
      columns={columns.map((column) => ({
        ...column,
        disableColumnMenu: true,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
        minWidth: 100,
        flex: 1,
      }))}
      rows={rows !== null ? rows.map((row, index) => ({ ...row, id: index })) : []}
    />
  );
};

export default Angularity_step2Table;
