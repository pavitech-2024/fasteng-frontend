import { Box, Fade, Typography } from '@mui/material';
import React from 'react';
import { CloseIcon, InfoIcon } from '@/assets';

interface StepDescriptionProps {
  text: string;
}

const StepDescription = ({ text }: StepDescriptionProps) => {
  const [open, setOpen] = React.useState(true);
  return (
    <Fade in={open} unmountOnExit>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid',
          borderColor: 'primaryTons.border',
          borderRadius: '15px',
          padding: '.5rem 1rem',
          mb: '32px',
          bgcolor: 'secondaryTons.blueDisabled',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            borderRight: '1.5px solid',
            borderColor: 'primaryTons.white',
            pr: '1rem',
            width: '100%',
          }}
        >
          <InfoIcon sx={{ fontSize: '2rem', color: 'primaryTons.white' }} />
          <Typography variant="body1" sx={{ textAlign: 'start', color: 'primaryTons.mainGray' }}>
            {text}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            height: '100%',
            alignItems: {
              mobile: 'start',
              notebook: 'center',
            },
            justifyContent: {
              mobile: 'end',
              notebook: 'center',
            },
          }}
        >
          <CloseIcon
            sx={{
              fontSize: '2rem',
              color: 'primaryTons.white',
              cursor: 'pointer',
              pl: '1rem',
            }}
            onClick={() => setOpen(false)}
          />
        </Box>
      </Box>
    </Fade>
  );
};

export default StepDescription;