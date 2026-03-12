import { WelcomeData } from '@/components/templates/welcome';
import { Card, Box } from '@mui/material';
import Link from 'next/link';

export const CardMenuOptions = ({ path, icon, name }: WelcomeData) => (
  <Card
    sx={{
      height: '75px',
      width: { mobile: '300px', notebook: '325px', desktop: '300px' },
      bgcolor: 'primaryTons.mainGray',
      color: 'primaryTons.white',
      borderRadius: '20px',
      border: 'none',
      boxShadow: 'unset',
      cursor: 'pointer',
      transition: 'all .3s',
      ':hover': {
        bgcolor: 'primaryTons.lightGray',
      },
    }}
  >

    <Link href={path} style={{ textDecoration: 'none', display: 'flex', height: '100%', width: '100%' }}>
      <Box
        sx={{
          height: '100%',
          width: '75px',
          bgcolor: 'primary.main',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
      <Box
        sx={{
          height: '100%',
          width: { mobile: '210px', notebook: '235px', desktop: '210px' },
          color: 'primaryTons.white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'start',
          fontSize: '1rem',
          fontWeight: '700',
          ml: '15px',
        }}
      >
        {name}
      </Box>
    </Link>
  </Card>
);
