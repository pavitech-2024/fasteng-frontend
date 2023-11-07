import { row_results } from '@/stores/asphalt/angularity/angularity.store';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';

interface resultsAngularityProps {
  rows: row_results[];
  columns: GridColDef[];
}

const Angularity_resultsTable = ({ rows, columns }: resultsAngularityProps) => {
  return (
    <DataGrid
      sx={{
        mt: '1rem',
        borderRadius: '10px',
      }}
      density="standard"
      hideFooter
      showCellVerticalBorder
      showColumnVerticalBorder
      columns={columns.map((column) => ({
        ...column,
        disableColumnMenu: true,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
        minWidth: 300,
      }))}
      rows={
        rows !== null
          ? rows.map((row, index) => ({
              ...row,
              id: index,
            }))
          : []
      }
    />
  );
};

export default Angularity_resultsTable;
