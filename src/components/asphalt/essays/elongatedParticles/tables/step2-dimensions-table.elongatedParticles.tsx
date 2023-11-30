import { ElongatedParticlesDimensionsRow } from '@/stores/asphalt/elongatedParticles/elongatedParticles.store';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';
import { makeStyles } from '@material-ui/core';

interface step2ElongatedParticlesProps {
  rows: ElongatedParticlesDimensionsRow[];
  columns: GridColDef[];
}

const useStyle = makeStyles({
  root: {
    '& .MuiDataGrid-columnHeaderTitle': {
      overflow: 'visible',
      lineHeight: '1.43rem',
      whiteSpace: 'normal',
    },
  },
});

const ElongatedParticles_step2_Dimensions_Table = ({ rows, columns }: step2ElongatedParticlesProps) => {
  const classes = useStyle();
  return (
    <DataGrid
      className={classes.root}
      sx={{ mt: '1rem', borderRadius: '10px' }}
      density="compact"
      hideFooter
      columnHeaderHeight={150}
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

export default ElongatedParticles_step2_Dimensions_Table;
