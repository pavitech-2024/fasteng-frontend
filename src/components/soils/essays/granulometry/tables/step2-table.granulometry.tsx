import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';

interface step2GranulometryProps {
  rows: { sieve: string; passant: number; retained: number }[];
  columns: GridColDef[];
}

const SoilsGranulometry_step2Table = ({ rows, columns }: step2GranulometryProps) => {
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
      rows={rows !== null ? rows.map((row, index) => ({ ...row, id: index })) : []}
    />
  );
};

export default SoilsGranulometry_step2Table;
