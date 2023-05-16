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
        justifyContent: 'start',
        alignItems: 'center',
        height: 'calc(100vh - 52px)',
        width: '100vw',
        padding: '3vh 0',
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
          justifyContent: 'center',
          alignItems: 'center',
          height: { mobile: '17.5%', notebook: '25%' }
        }}
      >
        <Box
          component="p"
          sx={{
            fontSize: { notebook: '1.25rem', mobile: '.85rem' },
            fontWeight: '700',
            color: 'primaryTons.lightGray',
            margin: 0
          }}
        >
          {t('home.welcome to')}
        </Box>

        <LoginImage alt="Fasteng" src={LogoBlack} style={{ margin: '1vh 0'}} />

        <Box
          component="p"
          sx={{
            fontSize: { notebook: '1.25rem', mobile: '.85rem' },
            fontWeight: 700,
            color: 'primaryTons.lightGray',
            textAlign: 'center',
            margin: 0
          }}
        >
          {t('home.fast way to')}
        </Box>
      </Box>
      <Box
        sx={{
          height: { mobile: '22.5%', notebook: '17.5%' },
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Box
          component="p"
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: { mobile: '0 5vw', notebook: '0 15vw', ultrawide: '0 20vw' },
            margin: 0
          }}
        >
          <Typography
            sx={{
              fontSize: { desktop: '1.15rem', notebook: '1rem', mobile: '.85rem' },
              fontWeight: 400,
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
          display: 'grid',
          gridTemplateColumns: {
            mobile: '1fr',
            notebook: '1fr 1fr 1fr' 
          },
          gap: {
            mobile: '20px 0',
            notebook: '0 20px'
          },
          justifyItems: 'center',
          flexDirection: { notebook: 'row', mobile: 'column' },
          width: { mobile: '100%', ultrawide: '60%' },
          minWidth: 'fit-content',
          paddingTop: { mobile: '0', notebook: '2vh' },

          '@media only screen and (min-width: 1024px)': {
            width: '70%'
          }
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
