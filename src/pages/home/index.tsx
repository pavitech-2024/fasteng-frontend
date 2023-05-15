import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { t } from 'i18next';

//SVGs
import { LogoBlack, AsphaltIcon, SoilsIcon, ConcreteIcon } from '@/assets';

//MUIs
import { Container, Box, Typography } from '@mui/material';
import { CardApp } from '@/components/styles/muis/home';

//Styleds
import { LoginImage } from '@/components/styles/styleds/login';

const Home: NextPage = () => {
  const Router = useRouter();

  const Applications = [
    {
      name: t('home.asphalt'),
      icon: <AsphaltIcon width="100%" height="100%" />,
      path: '/asphalt',
    },
    {
      name: t('home.soils'),
      icon: <SoilsIcon width="100%" height="100%" />,
      path: '/soils',
    },
    {
      name: t('home.concrete'),
      icon: <ConcreteIcon width="100%" height="100%" />,
      path: '/concrete',
    },
  ];

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 52px)',
        width: '100vw',
        padding: 0,
        position: 'absolute',
        zIndex: 2,
        top: '52px',
        left: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: { notebook: '30vh', mobile: '20vh' },
        }}
      >
        <Box
          component="p"
          sx={{
            fontSize: { desktop: '1.5rem', notebook: '1.25rem', mobile: '.85rem' },
            fontWeight: '700',
            color: 'primaryTons.lightGray',
            height: { desktop: '2.5rem', notebook: '1.75rem', mobile: '1.35rem' },
            margin: 0
          }}
        >
          {t('home.welcome to')}
        </Box>

        <LoginImage alt="Fasteng" src={LogoBlack} />

        <Box
          component="p"
          sx={{
            fontSize: { desktop: '1.5rem', notebook: '1.25rem', mobile: '.85rem' },
            fontWeight: 700,
            color: 'primaryTons.lightGray',
            textAlign: 'center',
            height: { desktop: '2.5rem', notebook: '1.75rem', mobile: '1.35rem' },
            margin: 0
          }}
        >
          {t('home.fast way to')}
        </Box>
        <Box
          component="p"
          sx={{
            height: { desktop: '20vh', mobile: '10vh' },
            display: 'flex',
            alignItems: 'center',
            padding: { mobile: '0 5vw', notebook: '0 10vw', ultrawide: '0 15vw' },
          }}
        >
          <Typography
            sx={{
              fontSize: { notebook: '1rem', mobile: '.85rem' },
              fontWeight: 500,
              color: 'primaryTons.darkGray',
              textAlign: 'center',
            }}
          >
            {t('home.description')}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: { mobile: 'center', notebook: 'start' },
          justifyContent: 'space-around',
          flexDirection: { notebook: 'row', mobile: 'column' },
          height: '50%',
          width: { mobile: '100%', desktop: '70%', ultrawide: '60%' },
          paddingTop: { mobile: '0', notebook: '2vh' },
        }}
      >
        <CardApp element={Applications[0]} onClick={() => Router.push(Applications[0].path)} />
        <CardApp element={Applications[1]} onClick={() => Router.push(Applications[1].path)} />
        <CardApp element={Applications[2]} onClick={() => Router.push(Applications[2].path)} />
      </Box>
    </Container>
  );
};

export default Home;
