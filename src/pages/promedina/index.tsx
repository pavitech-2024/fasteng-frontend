import LogoBlack from '@/assets/pro-medina/LogoBlack.png';
import { CardPromedinaApp } from '@/components/atoms/cards/promedinaCard';
import Image from 'next/image';
import concreteBinderAsphalt from '@/assets/pro-medina/concreteBinderAsphalt/concrete-binder-asphalt-image.png';
import granularLayersImage from '@/assets/pro-medina/granularLayers/granular-layers-image.png';
import stabilizedLayersImage from '@/assets/pro-medina/stabilizedLayers/stabilized-layers-image.png';

//import ProvSoils1Icon from '@/components/atoms/icons/provSoils1Icon';
// ProvSoils2Icon from '@/components/atoms/icons/provSoils2Icon';
//import ProvSoils3Icon from '@/components/atoms/icons/provSoils3Icon';
import { LoginImage } from '@/components/styles/styleds/login';
import { Container, Box, Typography } from '@mui/material';
import { Analytics, Assessment } from '@mui/icons-material';
import { t } from 'i18next';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

const Promedina: NextPage = () => {
  const Router = useRouter();

  const Applications = [
    {
      name: t('home.pm.granular'),
      icon: (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Image
            src={stabilizedLayersImage}
            alt="Asphalt"
            width={200}
            height={200}
            style={{ objectFit: 'contain' }}
          />
        </Box>
      ),
      path: '/promedina/granular-layers',
    },
    {
      name: t('home.pm.stabilized'),
      icon: (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Image
            src={granularLayersImage}
            alt="Asphalt"
            width={200}
            height={200}
            style={{ objectFit: 'contain' }}
          />
        </Box>
      ),
      path: '/promedina/stabilized-layers',
    },
    {
      name: t('home.pm.asphalt'),
      icon: (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Image
            src={concreteBinderAsphalt}
            alt="Asphalt"
            width={200}
            height={200}
            style={{ objectFit: 'contain' }}
          />
        </Box>
      ),
      path: '/promedina/binder-asphalt-concrete',
    },
    {
      name: t('home.pm.fwd'),
      icon: <Analytics sx={{ width: '100%', height: '100%' }} />, // Ícone do Material-UI
      path: '/promedina/fwd',
    },
    {
      name: 'Avaliação de Pavimentos',
      icon: <Assessment sx={{ width: '100%', height: '100%' }} />,
      path: '/promedina/IGG',
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
        p: '3vh 0',
        mt: '52px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: { mobile: '17.5%', notebook: '25%' },
          maxHeight: '250px',
        }}
      >
        <Box
          component="p"
          sx={{
            fontSize: { notebook: '1.25rem', mobile: '.85rem' },
            fontWeight: '700',
            color: 'primaryTons.lightGray',
            m: 0,
          }}
        >
          {t('home.welcome to')}
        </Box>

        <LoginImage alt="Promedina" src={LogoBlack} style={{ margin: '1vh 0' }} />
      </Box>
      <Box
        sx={{
          height: { mobile: '22.5%', notebook: '17.5%' },
          maxHeight: { mobile: 'none', ultrawide: '150px' },
          display: 'flex',
          alignItems: 'center',
          justifyItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: { mobile: '0 5vw', notebook: '0 15vw', ultrawide: '0 20vw' },
            m: 0,
            justifyItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: { desktop: '1.15rem', notebook: '1rem', mobile: '.85rem' },
              fontWeight: 400,
              color: 'primaryTons.darkGray',
              textAlign: 'center',
              maxWidth: '1395px',
            }}
          >
            {t('home.pm.description')}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: {
            mobile: '20px 0',
            notebook: '10px 20px',
          },
          justifyItems: 'center',
          justifyContent: 'center',
          flexDirection: { notebook: 'row', tablet: 'column', mobile: 'column' },
          width: '100%',
          minWidth: 'fit-content',
          maxWidth: '1400px',
          pt: '2vh',
          flexWrap: 'wrap', // Adicionado para melhor responsividade com mais itens

          '@media only screen and (min-width: 1024px)': {
            width: '70%', // Aumentei um pouco para acomodar mais itens
          },
        }}
      >
        {Applications.map((app) => (
          <CardPromedinaApp key={app.name} element={app} onClick={() => Router.push(app.path)} />
        ))}
      </Box>
    </Container>
  );
};

export default Promedina;