import { Box, Typography } from '@mui/material';

interface FlexColumnBorderProps {
  children: React.ReactNode | JSX.Element;
  title?: string;
  flexDirection?: 'column' | 'row';
  hideBorder?: boolean;
  sx?: React.CSSProperties;
  sx_title?: { [key: string]: unknown };
}

const FlexColumnBorder = ({ children, title, flexDirection, hideBorder, sx, sx_title }: FlexColumnBorderProps) => {
  return (
    <Box
      sx={{
        ...sx,
        display: 'flex',
        flexDirection: flexDirection || 'column',
        border: hideBorder ? 'none' : '1px solid',
        borderColor: 'primaryTons.border',
        padding: '10px',
        zIndex: 2,
        mt: '1.5rem',
        borderRadius: '10px',
      }}
    >
      {title && (
        <Typography
          sx={{
            width: 'fit-content',
            bgcolor: 'primaryTons.mainWhite',
            ml: { mobile: '0', notebook: '6%' },
            paddingInline: '10px',
            transform: {
              mobile: 'translateY(calc(-20px - 14.25px))',
              notebook: 'translateY(calc(-20px - 7.5px))',
            },
            zIndex: 3,
            textTransform: 'uppercase',
            fontSize: { mobile: '12px', notebook: '20px' },
            color: 'primaryTons.mainGray',
            opacity: 0.8,
            fontWeight: '600',
            whiteSpace: 'nowrap',
            letterSpacing: '0.1rem',
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