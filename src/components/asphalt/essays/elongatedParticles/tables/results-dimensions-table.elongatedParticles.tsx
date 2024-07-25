import { ElongatedParticlesResultsDimensionsRow } from '@/stores/asphalt/elongatedParticles/elongatedParticles.store';
import { makeStyles, createStyles, Theme } from '@mui/material/styles'; 
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';

interface resultsElongatedParticlesProps {
  rows: ElongatedParticlesResultsDimensionsRow[];
  columns: GridColDef[];
}

const useStyle: any = makeStyles({
  root: {
    '& .MuiDataGrid-columnHeaderTitle': {
      overflow: 'visible',
      lineHeight: '1.43rem',
      whiteSpace: 'normal',
    },
  },
});

const ElongatedParticles_results_Dimensions_Table = ({ rows, columns }: resultsElongatedParticlesProps) => {
  const classes = useStyle();
  return (
    <DataGrid
      className={classes.root}
      sx={{ mt: '1rem', borderRadius: '10px' }}
      density="compact"
      hideFooter
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

export default ElongatedParticles_results_Dimensions_Table;
