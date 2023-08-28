import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';

interface step2SucsProps {
  rows: { sieve: string; passant: number }[];
  columns: GridColDef[];
}

const Sucs_step2Table = ({ rows, columns }: step2SucsProps) => {
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
        minWidth: column.field === 'extended_read' ? 250 : 100,
        flex: 1,
      }))}
      rows={rows.map((row, index) => ({ ...row, id: index }))}
    />
  );
};

export default Sucs_step2Table;
