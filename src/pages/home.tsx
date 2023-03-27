import { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Container, Box, Card, Typography } from '@mui/material';
import LogoBlack from '@/assets/fasteng/LogoBlack.png';
import { LoginImage } from '@/components/styles/login';
import SoilsLogo from '@/assets/apps/soils.svg';
import ConcreteLogo from '@/assets/apps/concrete.svg';
import AsphaltLogo from '@/assets/apps/asphalt.svg';

const Home: NextPage = () => {
  const Router = useRouter();

  const Aplications = [
    {
      title: 'Pavimentação',
      photo: AsphaltLogo,
      path: '/asphalt',
    },
    {
      title: 'Mecânica dos Solos',
      photo: SoilsLogo,
      path: '/soils',
    },
    {
      title: 'Cimento Portland',
      photo: ConcreteLogo,
      path: '/concrete',
    },
  ];

  return (
    <Container
      sx={{
        display: 'flex',
        paddingTop: '3rem',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box component="p" sx={{ padding: '.3rem', fontSize: '15px', fontWeight: 700, color: '#6e6d6d' }}>
          BEM-VINDO AO
        </Box>
        <LoginImage alt="Fasteng" src={LogoBlack} />
        <Box
          component="p"
          sx={{
            padding: '.6rem',
            fontWeight: 700,
            color: '#6e6d6d',
            maxWidth: {
              mobile: '224px',
              ultrawide: '310px',
            },
            textAlign: 'center',
            fontSize: '15px',
          }}
        >
          O CAMINHO MAIS RÁPIDO PARA A ENGENHARIA
        </Box>
        <Box
          component="p"
          sx={{
            padding: '.7rem',
            fontSize: '15px',
            fontWeight: 700,
            color: 'secondary',
            textAlign: 'center',
            maxWidth: '930px',
            marginTop: '1rem',
          }}
        >
          O FASTENG é o seu auxiliar técnico em projetos de Engenharia Civil. Atualmente em nosso escopo contamos com
          aplicações em projetos geotécnicos de Pavimentação Asfáltica, Mecânica dos Solos, e Concreto Convencional.
          Qual aplicação você deseja utilizar agora?
        </Box>
      </Box>
      <Box
        sx={{
          display: 'grid',
          maxWidth: '100%',
          gridTemplateColumns: {
            mobile: 'repeat(auto-fit, minmax(224px, 1fr))',
            notebook: 'repeat(auto-fit, minmax(300px, 1fr))',
          },
          gridTemplateRows: {
            mobile: 'repeat(auto-fit, minmax(200px, 1fr))',
            notebook: 'repeat(auto-fit, minmax(300px, 1fr))',
          },
          gap: '1rem',
          placeItems: 'center',
          padding: '2rem',
        }}
      >
        {Aplications.map((element) => {
          return (
            <Card
              onClick={() => Router.push(element.path)}
              key={element.title}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: {
                  mobile: '224px',
                  notebook: '300px',
                },
                height: {
                  mobile: '200px',
                  notebook: '300px',
                },
                bgcolor: 'primary.main',
                borderRadius: '7%',
                ':hover': {
                  cursor: 'pointer',
                },
              }}
            >
              <Box
                sx={{ width: '100%', height: '75%', bgcolor: 'secondary.main', display: 'grid', placeItems: 'center' }}
              >
                <Image src={element.photo} alt={element.title} width={180} height={120} />
              </Box>
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                sx={{
                  height: '25%',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  fontSize: '22px',
                }}
              >
                {element.title}
              </Typography>
            </Card>
          );
        })}
      </Box>
    </Container>
  );
};

export default Home;
