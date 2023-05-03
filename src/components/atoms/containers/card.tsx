import { Container, Box, Typography } from '@mui/material';
import { Essay } from '@/interfaces/common';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface CardContainerProps {
  children: JSX.Element | React.ReactNode;
}

export const CardContainer = ({ children }: CardContainerProps) => {
  return (
    <Container
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, 200px)',
        gridTemplateRows: 'repeat(auto-fill, 220px)',
        gap: '5px',
        padding: 0,
        justifyContent: 'center',
        bgcolor: 'primary',
        pt: { mobile: '2rem', notebook: '0' },
      }}
    >
      {children}
    </Container>
  );
};

interface CardProps {
  essay: Essay;
}

export const Card = ({ essay }: CardProps) => {
  const app = useRouter().pathname.split('/')[1];

  return (
    <Link href={`/${app}/essays/${essay.key}`} passHref style={{ textDecoration: 'none' }}>
      <Box
        sx={{
          width: 'calc(200px - 2rem)',
          height: 'calc(220px - 2rem)',
          display: 'flex',
          flexDirection: 'column',
          color: 'secondary.light',
          bgcolor: 'white',
          border: '0.0625rem solid rgba(0, 0, 0, 0.125)',
          borderRadius: '0.3125rem',
          animation: '0.4s ease 0s 1 normal none running fadeUp',
          transition: 'all 0.6s ease 0s',
          padding: '1rem',
          ':hover': {
            bgcolor: 'rgba(245, 126, 52, 0.15)',
            cursor: 'pointer',
            border: '0.0625rem solid',
            borderColor: 'secondary.light',
          },
        }}
      >
        <Box sx={{ height: '60%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image src={essay.icon} alt={essay.key} width={100} height={100} />
        </Box>
        <Box
          sx={{
            height: '40%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography sx={{ textAlign: 'center', fontWeight: '700', fontSize: '13.5px' }}>{essay.title}</Typography>
        </Box>
      </Box>
    </Link>
  );
};
