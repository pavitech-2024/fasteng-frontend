import { Box, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';

interface FlexColumnBorderProps {
  children: React.ReactNode | JSX.Element;
  title?: string;
  flexDirection?: 'column' | 'row';
  hideBorder?: boolean;
  sx?: React.CSSProperties;
  sx_title?: { [key: string]: unknown };
  open?: boolean;
  generalData?: boolean;
  theme?: string;
}

const FlexColumnBorder = ({
  children,
  title,
  flexDirection,
  hideBorder,
  sx,
  sx_title,
  open,
  generalData,
  theme,
}: FlexColumnBorderProps) => {
  const [openTooltip, setOpenTooltip] = useState(false);
  return (
    <Box
      sx={{
        ...sx,
        display: 'flex',
        flexDirection: flexDirection || 'column',
        border: hideBorder ? 'none' : '2px solid',
        borderColor: theme ? theme : 'primary.main',
        padding: '10px',
        zIndex: 2,
        mt: generalData ? 0 : '2rem',
        borderRadius: '10px',
        height: open ? 'fit-content' : { mobile: '42px', notebook: '65px' },
      }}
    >
      {title && (
        <Typography
          sx={{
            width: 'fit-content',
            maxWidth: '100%',
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
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            display: 'block',
            position: 'relative',
            ...sx_title,
          }}
          variant="h6"
          onClick={() => {
            setOpenTooltip(true);
          }}
        >
          <Tooltip
            title={title}
            placement="top-start"
            leaveTouchDelay={3000}
            open={openTooltip}
            onClose={() => setOpenTooltip(false)}
            sx={{ display: { mobile: 'flex', notebook: 'hidden' } }}
          >
            <span>{title}</span>
          </Tooltip>
        </Typography>
      )}
      <Box>{children}</Box>
    </Box>
  );
};

export default FlexColumnBorder;
