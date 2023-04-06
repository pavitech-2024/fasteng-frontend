import { Button } from '@mui/material';

interface ButtonProps {
  text: string;
  disabled?: boolean;
  linkTo?: string;
  handleClick?: () => void;
}

export const MainButton = (props: ButtonProps) => (
  <Button
    href={props.linkTo}
    variant="contained"
    onClick={props.handleClick}
    disabled={props.disabled}
    sx={{
      color: 'primaryTons.mainWhite',
      bgcolor: 'secondaryTons.main',
      fontSize: '1rem',
      lineHeight: '1rem',
      fontWeight: '700',
      height: '28px',
      width: '126px',
      borderRadius: '20px',
      boxShadow: 'unset',

      '&:hover': {
        bgcolor: '#F2A255',
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
    {props.text}
  </Button>
);
