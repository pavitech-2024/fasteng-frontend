import { Container, Box, Typography } from '@mui/material';
import { Essay, Library, Standard } from '@/interfaces/common';
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
        gridTemplateColumns: {
          mobile: 'repeat(auto-fill, 150px)',
          notebook: 'repeat(auto-fill, 170px)',
        },
        gridTemplateRows: {
          mobile: 'repeat(auto-fill, 200px)',
          notebook: 'repeat(auto-fill, 220px)',
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
interface CardProps {
  data: Essay | Standard | Library;
  type: 'essay' | 'standard' | 'library';
  hrefLink: string;
  target?: string;
}

export const Card = ({ data, type, hrefLink, target }: CardProps) => {
  return (
    <Link href={hrefLink} passHref style={{ textDecoration: 'none' }} target={target ? target : ''}>
      <Box
        sx={{
          width: { mobile: '150px', notebook: '170px' },
          height: { mobile: '200px', notebook: '220px' },
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
            height: '65%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image src={data.icon} alt={data.key} width={95} height={95} />
        </Box>

        <Box
          sx={{
            height: '35%',
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
              fontSize: '.85rem',
              lineHeight: '.95rem',
              p: '5px',
            }}
          >
            {data.title}
          </Typography>
          {type === 'standard' && (
            <>
              <PDFIcon
                sx={{
                  fontSize: 20,
                  color: 'secondaryTons.red',
                  position: 'absolute',
                  right: 10,
                  top: 10,
                }}
              />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: '2px 4px',
                  borderRadius: '5px 0 0 5px',
                  bgcolor: 'primary.main',
                  position: 'absolute',
                  right: 0,
                  bottom: { mobile: '65px', notebook: '72px' },
                }}
              >
                <Typography
                  sx={{ textAlign: 'center', fontWeight: '400', fontSize: '12px', color: 'primaryTons.white' }}
                >
                  {'standard' in data ? data.standard : null}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Link>
  );
};
