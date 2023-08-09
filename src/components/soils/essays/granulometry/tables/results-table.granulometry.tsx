import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';

interface resultsGranulometryProps {
  rows: { 
    sieve: string; 
    passant_porcentage: number; 
    passant: number; 
    retained_porcentage: number; 
    retained: number; 
    accumulated_retained: number 
}[];
  columns: GridColDef[];
}

const Granulometry_resultsTable = ({ rows, columns }: resultsGranulometryProps) => {
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
      rows={rows !== null ? rows.map((row, index) => ({ 
        ...row, 
        id: index
    })) : []}
    />
  );
};

export default Granulometry_resultsTable;