import { Container, Box, Typography } from '@mui/material';
import { Essay, Standard } from '@/interfaces/common';
import Image from 'next/image';
import Link from 'next/link';

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

// modifiquei essa interface para aceitar tanto os dados de essays quanto de standards(normas) para que esse componente se torne reaproveitável. Assim ele vai ler os dados do objeto de dados (função getStaticProps) correspondente a página em que o Card for chamado. Dessa forma é possível só adicionar mais types e datas quando novas telas semelhantes precisarem usar esses mesmos cards; A prop hrefLink precisou ser adicionada pois os cards têm comportamentos diferentes em cada página (essay redireciona o usuário ao link do card, standard abre o pdf do link em uma nova aba);
interface CardProps {
  data: Essay | Standard;
  type: 'essay' | 'standard';
  hrefLink: string;
  target: string;
}

export const Card = ({ data, type, hrefLink, target }: CardProps) => {
  return (
    <Link 
      href={hrefLink}
      passHref 
      style={{ textDecoration: 'none' }}
      target={target}
    >
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
          <Image src={data.icon} alt={data.key} width={100} height={100} />
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
          <Typography sx={{ textAlign: 'center', fontWeight: '700', fontSize: '13.5px' }}>{data.title}</Typography>
        </Box>
      </Box>
    </Link>
  );
};
