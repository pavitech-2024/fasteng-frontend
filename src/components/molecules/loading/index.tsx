import { Box, CircularProgress } from '@mui/material';

interface ILoading {
  size?: number;
  color?: 'secondary' | 'inherit' | 'info' | 'success' | 'warning' | 'error' | 'primary';
}

const Loading = ({size=60, color="secondary"}: ILoading) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <CircularProgress size={size} color={color} />
    </Box>
  );
};

export default Loading;
