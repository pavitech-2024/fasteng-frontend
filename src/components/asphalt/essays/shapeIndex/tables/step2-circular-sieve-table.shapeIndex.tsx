import { ShapeIndexCircularSieveRow } from '@/stores/asphalt/shapeIndex/shapeIndex.store';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';

interface step2GranulometryProps {
  rows: ShapeIndexCircularSieveRow[];
  columns: GridColDef[];
}

const ShapeIndex_step2_Circular_Sieve_Table = ({ rows, columns }: step2GranulometryProps) => {
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

export default ShapeIndex_step2_Circular_Sieve_Table;
