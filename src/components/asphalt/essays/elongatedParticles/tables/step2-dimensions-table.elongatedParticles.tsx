import { ElongatedParticlesDimensionsRow } from '@/stores/asphalt/elongatedParticles/elongatedParticles.store';
import styled from '@mui/material/styles/styled';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';

interface Step2ElongatedParticlesProps {
  rows: ElongatedParticlesDimensionsRow[];
  columns: GridColDef[];
}

// Aplicando os estilos diretamente ao DataGrid com `styled`
const StyledDataGrid = styled(DataGrid)({
  '& .MuiDataGrid-columnHeaderTitle': {
    overflow: 'visible',
    lineHeight: '1.43rem',
    whiteSpace: 'normal',
  },
  marginTop: '1rem',
  borderRadius: '10px',
});

const ElongatedParticlesStep2DimensionsTable: React.FC<Step2ElongatedParticlesProps> = ({ rows, columns }) => {
  return (
    <StyledDataGrid
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

export default ElongatedParticlesStep2DimensionsTable;
