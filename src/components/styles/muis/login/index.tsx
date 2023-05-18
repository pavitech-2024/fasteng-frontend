import { Button } from '@mui/material';

export const AboutButton = () => (
  <Button
    variant="contained"
    sx={{
      color: 'primary.main',
      bgcolor: 'primaryTons.mainGray',
      fontSize: '.95rem',
      lineHeight: '.95rem',
      fontWeight: '700',
      height: '28px',
      width: '126px',
      border: '1px solid #F2A255',

      '&:hover': {
        bgcolor: 'primaryTons.darkGray',
        border: '1px solid primary.main',
      },

      '@media screen and (max-width: 1024px)': {
        fontSize: '.85rem',
        lineHeight: '.85rem',
        height: '24px',
        width: '112px',
      },
    }}
  >
    Saiba mais
  </Button>
);
