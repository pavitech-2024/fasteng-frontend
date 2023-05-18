import { Card, Box } from '@mui/material';
import { NextPage } from 'next';

interface Props {
  element: {
    name: string;
    icon: JSX.Element;
    path: string;
  };
  onClick: () => Promise<boolean>;
}

export const CardApp: NextPage<Props> = ({ element, onClick }) => (
  <Card
    onClick={onClick}
    sx={{
      width: {
        mobile: '320px',
        notebook: '220px',
        desktop: '280px',
        ultrawide: '320px' },
      height: {
        mobile: '90px',
        notebook: '220px',
        desktop: '260px',
        ultrawide: '300px' },
      borderRadius: '20px',
      boxShadow: 'unset',
      display: 'flex',
      flexDirection: { mobile: 'row', notebook: 'column' },
      cursor: 'pointer',
      backgroundColor: 'white',
    }}
  >
    <Box
      sx={{
        backgroundColor: 'primaryTons.darkGray',
        height: { mobile: '100%', notebook: '75%' },
        width: { mobile: '90px', notebook: '100%' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          height: {
            mobile: '50px',
            notebook: '110px',
            desktop: '130px'
          },
          width: 'auto',
        }}
      >
        {element.icon}
      </Box>
    </Box>
    <Box
      sx={{
        backgroundColor: 'primary.main',
        height: { mobile: '100%', notebook: '25%' },
        width: { mobile: '230px', notebook: '100%' },
        display: 'flex',
        textAlign: { mobile: 'left', notebook: 'center' },
        justifyContent: { mobile: 'start', notebook: 'center' },
        alignItems: 'center',
        padding: { mobile: '0 4vw', notebook: '0 2vw' },
        fontSize: {
          mobile: '1.25rem',
          notebook: '1.35rem',
          desktop: '1.45rem',
          ultrawide: '1.8rem',
        },
        fontWeight: '500',
        color: 'primaryTons.white',
        lineHeight: {
          mobile: 'auto',
          notebook: '1.35rem',
          desktop: '1.5rem',
          ultrawide: '2rem',
        },
      }}
    >
      {element.name}
    </Box>
  </Card>
);
