import { ShapeIndexReadRow } from '@/stores/asphalt/shapeIndex/shapeIndex.store';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';

interface step2ShapeIndexProps {
  rows: ShapeIndexReadRow[];
  columns: GridColDef[];
  footer: any;
}

const ShapeIndex_step2_Reads_Table = ({ rows, columns, footer }: step2ShapeIndexProps) => {
  return (
    <DataGrid
      sx={{ mt: '1rem', borderRadius: '10px' }}
      density="compact"
      slots={{ footer: footer }}
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

export default ShapeIndex_step2_Reads_Table;