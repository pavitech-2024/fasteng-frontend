import { Box, Typography } from '@mui/material';
import Link from 'next/link';

interface NavbarProps {
  open: boolean;
  type: string;
}

export default function Navbar({ open, type }: NavbarProps) {
  console.log(type, open);

  const Items = [
    { name: 'Início', icon: '', link: '/home', type: 'common' },
    { name: 'asphalt', icon: '', link: '/home', type: 'asphalt' },
    { name: 'soils', icon: '', link: '/home', type: 'soils' },
    { name: 'concrete', icon: '', link: '/home', type: 'concrete' },
  ];

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
      {Items.map((item) => {
        if (item.type === 'common' || item.type === type)
          return (
            <Link key={item.name} href={item.link}>
              <Box>
                <Typography variant="body1" sx={{ color: 'white.main', textDecoration: 'none' }}>
                  {item.name}
                </Typography>
              </Box>
            </Link>
          );
      })}
    </Box>
  );
}
