import React from 'react';
import { Box, Typography } from '@mui/material';
import { CreatorsPageButton } from '@/components/styles/muis/creators';

const CreatorCard = ({ imageSrc, name, description, lattesLink }) => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '700px', 
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #ddd',
        borderRadius: '15px',
        overflow: 'hidden',
        margin: '10px',
        padding: '5vh',
        gap: '3vh',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        transition: '0.4s',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      }}
    >
      <Box
        sx={{
            flex: '0 0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            minWidth: '200px',
            borderRadius: '50%',
            width: '15vw',
            margin: '0 auto',
        }}
      >
        <img
          src={imageSrc}
          alt={`Foto de ${name}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '50%',
          }}
        />
      </Box>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: '10px' }}>
          {name}
        </Typography>
        <Typography variant="body2" sx={{ mb: '15px' }}>
          {description}
        </Typography>
        <CreatorsPageButton text={'➜ Currículo Lattes'} linkTo={lattesLink} target='_blank' />
      </Box>
    </Box>
  );
};

export default CreatorCard;
