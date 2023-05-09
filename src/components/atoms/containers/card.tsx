import { Container, Box, Typography } from '@mui/material';
import { Essay, Standard } from '@/interfaces/common';
import Image from 'next/image';
import Link from 'next/link';
import { PDFIcon } from '@/assets';

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
        gap: '10px',
        justifyContent: 'center',
        bgcolor: 'primary',
        pt: { mobile: '3rem', notebook: '0' },
      }}
    >
      {children}
    </Container>
  );
};
interface CardProps {
  data: Essay | Standard;
  type: 'essay' | 'standard';
  hrefLink: string;
  target: string;
}

export const Card = ({ data, type, hrefLink, target }: CardProps) => {
  return (
    <Link href={hrefLink} passHref style={{ textDecoration: 'none' }} target={target}>
      <Box
        sx={{
          width: '200px',
          height: '220px',
          display: 'flex',
          flexDirection: 'column',
          color: 'secondary.light',
          bgcolor: 'white',
          border: '0.0625rem solid rgba(0, 0, 0, 0.125)',
          borderRadius: '10px',
          animation: '0.4s ease 0s 1 normal none running fadeUp',
          transition: 'all 0.6s ease 0s',
          ':hover': {
            bgcolor: 'rgba(48, 48, 48, 0.15)',
            cursor: 'pointer',
            border: '0.0625rem solid',
            borderColor: 'secondary.light',
          },
        }}
      >
        <Box
          sx={{
            height: '60%',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '10px',
          }}
        >
          <Image src={data.icon} alt={data.key} width={100} height={100} />
        </Box>

        <Box
          sx={{
            height: '40%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#383838',
            borderRadius: '0 0 10px 10px',
            color: '#FFFFFF',
          }}
        >
          <Typography
            sx={{
              textAlign: 'center',
              fontWeight: '700',
              fontSize: '13.5px',
            }}
          >
            {data.title}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 1,
              width: '100%',
            }}
          >
            {type === 'standard' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '0 10px' }}>
                <Typography sx={{ textAlign: 'center', fontWeight: '400', fontSize: '12px' }}>
                  {'standard' in data ? data.standard : null}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                  <PDFIcon sx={{ fontSize: 20, color: 'red' }} />
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Link>
  );
};
