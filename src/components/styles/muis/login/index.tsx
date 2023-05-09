import { Button } from '@mui/material';

export const AboutButton = () => (
  <Button
    variant="contained"
    sx={{
      color: 'secondaryTons.main',
      bgcolor: 'primaryTons.darkGray',
      fontSize: '1rem',
      lineHeight: '1rem',
      fontWeight: '700',
      height: '28px',
      width: '136px',
      borderRadius: '10px',
      boxShadow: 'unset',
      border: '1px solid #F2A255',

      '&:hover': {
        bgcolor: 'primaryTons.darkerGray',
        border: '1px solid secondaryTons.main',
        boxShadow: 'unset',
      },

      '@media screen and (max-width: 1024px)': {
        fontSize: '0.85rem',
        lineHeight: '0.85rem',
        height: '24px',
        width: '112px',
      },
    }}
  >
    Saiba mais
  </Button>
);
