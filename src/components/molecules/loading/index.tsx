import { Box, CircularProgress } from '@mui/material';

const Loading = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 'calc(100vh - calc(2 * 56px))',
      }}
    >
      <CircularProgress size={60} color="secondary" />
    </Box>
  );
};

export default Loading;
