import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Container, Box, Card, Typography } from '@mui/material';
import { LogoBlack, AsphaltIcon, SoilsIcon, ConcreteIcon } from '@/assets';
import { LoginImage } from '@/components/styles/styleds/login';
import { t } from 'i18next';

const Home: NextPage = () => {
  const Router = useRouter();

  const Aplications = [
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
        paddingTop: {
          mobile: '1.5rem',
          notebook: '3rem',
        },
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
        <Box
          component="p"
          sx={{ padding: '.3rem', fontSize: { notebook: '15px', mobile: '10px' }, fontWeight: 700, color: '#6e6d6d' }}
        >
          {t('home.welcome to')}
        </Box>
        <LoginImage alt="Fasteng" src={LogoBlack} />
        <Box
          component="p"
          sx={{
            padding: '.6rem',
            fontWeight: 700,
            color: '#6e6d6d',
            height: '1.8rem',
            maxWidth: {
              mobile: '224px',
              ultrawide: '310px',
            },
            textAlign: 'center',
            fontSize: { notebook: '15px', mobile: '8px' },
          }}
        >
          {t('home.fast way to')}
        </Box>
        <Box
          component="p"
          sx={{
            padding: '.7rem',
            fontSize: { notebook: '15px', mobile: '10px' },
            fontWeight: 700,
            color: 'secondary',
            textAlign: 'center',
            maxWidth: '930px',
            margin: '1rem 0',
            height: '2.3rem',
          }}
        >
          {t('home.description')}
        </Box>
      </Box>
      <Box
        sx={{
          display: 'grid',
          maxWidth: '100%',
          gridTemplateColumns: {
            mobile: '1fr',
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
              key={element.name}
              sx={{
                display: 'flex',
                flexDirection: {
                  mobile: 'row',
                  notebook: 'column',
                },
                justifyContent: 'center',
                alignItems: 'center',
                width: {
                  mobile: 'calc(90vw - 2rem)',
                  notebook: '300px',
                },
                maxWidth: '300px',
                height: {
                  mobile: '120px',
                  notebook: '300px',
                },
                bgcolor: 'secondaryTons.main',
                borderRadius: {
                  mobile: '10px',
                  notebook: '7%',
                },
                ':hover': {
                  cursor: 'pointer',
                },
              }}
            >
              <Box
                sx={{
                  width: { mobile: '45%', notebook: '100%' },
                  height: { mobile: '100%', notebook: '75%' },
                  bgcolor: 'primaryTons.darkGray',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Box sx={{ width: '60%', height: '60%' }}>{element.icon}</Box>
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
                  fontSize: { notebook: '20px', mobile: '12px' },
                  textTransform: 'uppercase',
                  textAlign: 'center',
                }}
              >
                {element.name}
              </Typography>
            </Card>
          );
        })}
      </Box>
    </Container>
  );
};

export default Home;