import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

export const StyledDataGrid = styled(DataGrid)({
  '& ::-webkit-scrollbar': {
    width: '5px',
  },
  '& ::-webkit-scrollbar-track': {
    background: '#e1cab3',
    borderRadius: '10px',
  },
  '& ::-webkit-scrollbar-thumb': {
    background: '#f29134',
    borderRadius: '10px',
  },
});
