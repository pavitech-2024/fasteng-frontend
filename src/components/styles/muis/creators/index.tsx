import { Button } from '@mui/material';
interface ButtonProps {
  text: string;
  linkTo?: string;
}

export const CreatorsPageButton = (props: ButtonProps) => (
  <Button
    href={props.linkTo}
    variant="contained"
    sx={{
      color: 'primaryTons.white',
      bgcolor: 'primary.main',
      fontSize: '.95rem',
      lineHeight: '.95rem',
      fontWeight: '700',
      height: '28px',
      width: '200px',
      display: 'flex',
      textAlign: 'center',

      '&:hover': {
        bgcolor: '#F2A255',
      },

      '@media screen and (max-width: 1024px)': {
        fontSize: '0.85rem',
        lineHeight: '0.85rem',
        height: '28px',
        width: '180px',
      },
    }}
  >
    {props.text}
  </Button>
);
