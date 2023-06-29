import { Box, Typography } from '@mui/material';

interface FlexColumnBorderProps {
  children: React.ReactNode | JSX.Element;
  title?: string;
  flexDirection?: 'column' | 'row';
  hideBorder?: boolean;
  sx?: React.CSSProperties;
  sx_title?: { [key: string]: unknown };
  open?: boolean;
  generalData?: boolean;
}

const FlexColumnBorder = ({
  children,
  title,
  flexDirection,
  hideBorder,
  sx,
  sx_title,
  open,
  generalData }: FlexColumnBorderProps) => {
  return (
    <Box
      sx={{
        ...sx,
        display: 'flex',
        flexDirection: flexDirection || 'column',
        border: hideBorder ? 'none' : '2px solid',
        borderColor: 'primary.main',
        padding: '10px',
        zIndex: 2,
        mt: generalData? 0 : '2rem',
        borderRadius: '10px',
        height: open ? 'fit-content' : { mobile: '42px', notebook: '65px' }
      }}
    >
      {title && (
        <Typography
          sx={{
            width: 'fit-content',
            bgcolor: 'primaryTons.white',
            ml: { mobile: '0', notebook: '2%' },
            paddingInline: { mobile: '5px', notebook: '10px' },
            transform: {
              mobile: 'translateY(-44.25px)',
              notebook: 'translateY(-32.5px)',
            },
            zIndex: 3,
            fontSize: { mobile: '1.25rem', notebook: '1.75rem' },
            color: 'primaryTons.darkGray',
            fontWeight: '700',
            whiteSpace: 'nowrap',
            mt: { notebook: 0, mobile: '1rem' },
            ...sx_title,
          }}
          variant="h6"
        >
          {title}
        </Typography>
      )}
      <Box>{children}</Box>
    </Box>
  );
};

export default FlexColumnBorder;