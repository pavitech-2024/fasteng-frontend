import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Link from 'next/link';
import { PlayArrow } from '@mui/icons-material';
import { Library } from '@/interfaces/common';

interface CardContainerProps {
  children: JSX.Element | React.ReactNode;
}

interface VideoCardProps {
  data: Library;
  type: 'videos';
  hrefLink: string;
  target?: string;
  thumb?: string
}

export const CardContainer = ({ children }: CardContainerProps) => {
  return (
    <Container
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          mobile: 'repeat(auto-fill, minmax(400px, 1fr))', // Aumente o tamanho mínimo para 400px
          notebook: 'repeat(auto-fill, minmax(440px, 1fr))', // Aumente o tamanho mínimo para 440px
        },
        gridTemplateRows: {
          mobile: 'repeat(auto-fill, minmax(500px, 1fr))', // Aumente o tamanho mínimo para 500px
          notebook: 'repeat(auto-fill, minmax(540px, 1fr))', // Aumente o tamanho mínimo para 540px
        },
        gap: '10px',
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
  return (
    <Link href={data.link} passHref style={{ textDecoration: 'none' }}>
      <Box
        sx={{
          width: '100%',
          height: '60vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'primaryTons.white',
          border: '0.0625rem solid',
          borderColor: 'primaryTons.border',
          borderRadius: '15px',
          animation: '0.4s ease 0s 1 normal none running fadeUp',
          cursor: 'pointer',
          transition: 'all 0.6s ease 0s',
          position: 'relative',
          ':hover': {
            bgcolor: 'primaryTons.border',
            borderColor: 'rgba(48, 48, 48, 0.15)',
          },
        }}
      >
        <Box
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PlayArrow sx={{ fontSize: 150, color: 'primary.main' }} /> {/* Aumente o tamanho do ícone */}
        </Box>

        <Box
          sx={{
            height: '15%', 
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
    </Link>
  );
};
