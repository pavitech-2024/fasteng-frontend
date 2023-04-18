import { NextPage } from 'next';
import { useRouter } from 'next/router';

// SVGs
import { LogoBlack, AsphaltIcon, SoilsIcon, ConcreteIcon } from '@/assets';

//MUIs
import { Container, Box, Typography } from '@mui/material';
import { CardApp } from '@/components/styles/muis/home';

//Styleds
import { HomeImage } from '@/components/styles/styleds/home';

const Home: NextPage = () => {
  const Router = useRouter();

  const Applications = [
    {
      name: 'Pavimentação',
      icon: <AsphaltIcon width="100%" height="100%" />,
      link: '/asphalt',
    },
    {
      name: 'Mecânica dos Solos',
      icon: <SoilsIcon width="100%" height="100%" />,
      link: '/soils',
    },
    {
      name: 'Cimento Portland',
      icon: <ConcreteIcon width="100%" height="100%" />,
      link: '/concrete',
    },
  ];

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        padding: '0'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: { desktop: '20%', mobile: '15%' }
        }}
      >
        <Typography
          sx={{
            fontSize: { desktop: '2.5vh', mobile: '1.65vh' },
            fontWeight: '700',
            color: 'primaryTons.mainGray' }}
        >
          BEM-VINDO AO
        </Typography>
        
        <HomeImage alt="Fasteng" src={LogoBlack} />

        <Typography
          sx={{
            fontSize: { desktop: '2.5vh', mobile: '1.65vh' },
            fontWeight: 700,
            color: 'primaryTons.mainGray',
            textAlign: 'center'
          }}
        >
          O CAMINHO MAIS RÁPIDO PARA A ENGENHARIA
        </Typography>
      </Box>

      <Box
        sx={{
          height: { desktop: '30%', mobile: '20%' },
          display: 'flex',
          alignItems: 'center',
          padding: { mobile: '0 5vw', notebook: '0 10vw', ultrawide: '0 15vw' }
        }}
      >
        <Typography
          sx={{
            fontSize: { notebook: '1.75vh', mobile: '1.5vh' },
            fontWeight: 700,
            color: 'primaryTons.darkerGray',
            textAlign: 'center'
          }}
        >
          O FASTENG é o seu auxiliar técnico em projetos de Engenharia Civil. Atualmente em nosso escopo contamos com
          aplicações em projetos geotécnicos de Pavimentação Asfáltica, Mecânica dos Solos, e Concreto Convencional.
          Qual aplicação você deseja utilizar agora?
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: {mobile: 'center', notebook: 'start' },
          justifyContent: 'space-around',
          flexDirection: { notebook: 'row', mobile: 'column' },
          height: { notebook: '60%', mobile: '55%' },
          width: { mobile: '100%', desktop: '80%', ultrawide: '60%' },
          paddingTop: { mobile: '0', notebook: '2vh'},
        }}
      >
        <CardApp element={Applications[0]} onClick={() => Router.push(Applications[0].link)} />
        <CardApp element={Applications[1]} onClick={() => Router.push(Applications[1].link)} />
        <CardApp element={Applications[2]} onClick={() => Router.push(Applications[2].link)} />
      </Box>
    </Container>
  );
};

export default Home;
