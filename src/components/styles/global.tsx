import { Button, StepConnector, stepConnectorClasses, styled } from '@mui/material';
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
      color: 'primaryTons.white',
      bgcolor: 'primary.main',
      fontSize: '.95rem',
      lineHeight: '.95rem',
      fontWeight: '700',
      height: '28px',
      width: '126px',
      display: 'flex',
      textAlign: 'center',

      '&:hover': {
        bgcolor: '#F2A255',
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

export const QontoConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#F29134', // theme.palette.primary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#43D16B', //theme.palette.secondaryTons.green,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: '#E3E3E3', //theme.palette.primaryTons.border,
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

export const QontoWelcomeConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#43D16B', //theme.palette.secondaryTons.green,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#43D16B', //theme.palette.secondaryTons.green,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: '#43D16B', //theme.palette.secondaryTons.green
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));
