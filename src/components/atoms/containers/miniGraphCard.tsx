import { Card, CardContent } from '@mui/material';

const CardMiniGrafico = ({ children }) => {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '2%',
        width: '40vw',
        height: '50vh',
        borderRadius: '2px',
        textAlign: 'center',
        animationDuration: '1.5s',
        animationName: 'fadeIn',
        animationFillMode: 'forwards',
        '@media (max-width:600px)': {
          width: '300px',
          height: '250px',
        },
        '@media (min-width:1200px)': {
          width: '30vw',
          height: '50vh',
        },
      }}
    >
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default CardMiniGrafico;
