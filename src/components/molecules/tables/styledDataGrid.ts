import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

export const StyledDataGrid = styled(DataGrid)({
  '& ::-webkit-scrollbar': {
    width: '5px',
  },
  '& ::-webkit-scrollbar-track': {
    background: '#f1c40f',
    borderRadius: '10px',
  },
  '& ::-webkit-scrollbar-thumb': {
    background: '#121212',
    borderRadius: '10px',
  },
});
