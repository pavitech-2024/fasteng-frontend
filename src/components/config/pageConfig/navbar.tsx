import { Box } from '@mui/material';

interface NavbarProps {
  open: boolean;
  type: string;
}

export default function Navbar({ open, type }: NavbarProps) {
  console.log(type, open);

  return (
    <Box
      sx={{
        position: 'absolute',
        display: { mobile: `${open ? 'flex' : 'none'}`, tablet: `${open ? 'flex' : 'none'}`, notebook: 'flex' },
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: '2rem 0rem 1rem 1rem',
        gap: '20px',
        width: `${open ? '225px' : '64px'}`,
        bgcolor: 'secondary.light',
        height: 'calc(100vh - calc(3rem + 56px))',
        transition: 'width 0.5s',
        ':hover': {
          width: '225px',
        },
      }}
      component="nav"
    >
      <Box>Item</Box>
      <Box>Item</Box>
      <Box>Item</Box>
      <Box>Item</Box>
    </Box>
  );
}
