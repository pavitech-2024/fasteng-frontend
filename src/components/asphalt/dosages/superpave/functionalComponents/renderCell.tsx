import { Box, Button, Typography } from '@mui/material';
import { useRef } from 'react';

const RenderCellComponent = ({ row, curve, data, addPlanilha }) => {
  const { id } = row;
  const index = data[curve].findIndex((r) => r.id === id);
  const fileInputRef = useRef(null);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Button
        onClick={() => fileInputRef.current.click()}
        variant="contained"
        sx={{ display: { xl: 'none', xs: 'block' }, color: 'white' }}
      >
        Upload
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={(e) => addPlanilha(curve, index, e)}
      />
      <Typography sx={{ textAlign: 'center' }}>{data[curve][index]?.planilha ? data[curve][index].document : `Vazio`}</Typography>
    </Box>
  );
};

export default RenderCellComponent;
