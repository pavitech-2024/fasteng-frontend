import React, { useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Library } from '@/interfaces/common';

interface CardContainerProps {
  children: JSX.Element | React.ReactNode;
}

interface VideoCardProps {
  data: Library;
  type: 'videos';
  hrefLink: string;
  target?: string;
  poster: string;
}

export const VideoCardContainer = ({ children }: CardContainerProps) => {
  return (
    <Container
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          mobile: 'repeat(auto-fill, minmax(400px, 1fr))',
          notebook: 'repeat(auto-fill, minmax(560px, 1fr))',
        },
        gridTemplateRows: {
          mobile: 'repeat(auto-fill, minmax(500px, 1fr))',
          notebook: 'repeat(auto-fill, minmax(540px, 1fr))',
        },
        gap: '20px',
        justifyContent: 'center',
        width: '100%',
        mb: '2vh',
        p: '0 2vw',
      }}
    >
      {children}
    </Container>
  );
};

export const VideoCard = ({ data }: VideoCardProps) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const toggleVideo = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '90%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'primaryTons.white',
        border: '0.00625rem solid',
        borderColor: 'primaryTons.border',
        borderRadius: '15px',
        animation: '0.4s ease 0s 1 normal none running fadeUp',
        transition: 'all 0.6s ease 0s',
        position: 'relative',
        ':hover': {
          borderColor: 'rgba(48, 48, 48, 0.15)',
          bgcolor: 'primaryTons.border',
          scale: '1.005'
        },
      }}
      onClick={toggleVideo}
    >
      <Box
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '7px',
          cursor: 'pointer',
        }}
      >
          <iframe
            width="640vw"
            height="420vh"
            src={data.link}
            title={data.title}
            allowFullScreen
          ></iframe>
      </Box>

      <Box
        sx={{
          height: '12vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'primaryTons.lightGray',
          color: 'primaryTons.white',
          borderRadius: '0 0 15px 15px',
        }}
      >
        <Typography
          sx={{
            textAlign: 'center',
            fontWeight: '500',
            fontSize: '1rem',
            lineHeight: '1.5rem',
            p: '5px',
          }}
        >
          {data.title}
        </Typography>
      </Box>
    </Box>
  );
};