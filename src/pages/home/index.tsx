import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from '@mui/material/Link';
import lep from '../../assets/logos/lep.jpg';
import jbr from '../../assets/logos/jbr.jpg';

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

        <LoginImage alt="Fasteng" src={LogoBlack} style={{ margin: '1vh 0' }} />

        <Box
          component="p"
          sx={{
            fontSize: { notebook: '1.25rem', mobile: '.85rem' },
            fontWeight: 700,
            color: 'primaryTons.lightGray',
            textAlign: 'center',
            m: 0,
          }}
        >
          {t('home.fast way to')}
        </Box>
      </Box>
      <Box
        sx={{
          height: { mobile: '22.5%', notebook: '17.5%' },
          maxHeight: { mobile: 'none', ultrawide: '150px' },
          display: 'flex',
          alignItems: 'center',
          m: '1.5rem 0 0',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: { mobile: '0 5vw', notebook: '0 15vw', ultrawide: '0 20vw' },
            m: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: { desktop: '1.15rem', notebook: '1rem', mobile: '.9rem' },
              fontWeight: 400,
              color: 'primaryTons.darkGray',
              textAlign: 'center',
              maxWidth: '1395px',
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
            tablet: '1fr',
            notebook: '1fr 1fr 1fr',
          },
          gap: {
            mobile: '10px 0',
            notebook: '10px 15px',
          },
          justifyItems: 'center',
          marginRight: { notebook: '55px', mobile: '0px' },
          marginLeft: { notebook: '55px', mobile: '0px' },
          padding: { mobile: '0 0 40px' },
          height: { mobile: '18rem' },
          flexDirection: { notebook: 'row', tablet: 'column', mobile: 'column' },
          justifyContent: 'center',
          scale: { mobile: '0.85' },
          minWidth: 'fit-content',
          maxWidth: '1400px',
          pt: '2vh',

          '@media only screen and (min-width: 768px)': {
            width: '60%',
          },
        }}
      >
        {Applications.map((app) => (
          <CardApp key={app.name} element={app} onClick={() => Router.push(app.path)} />
        ))}
      </Box>
      <Box sx = {{position: 'relative', width: '100%'}}>

        {/* alinhar icones lep e jbr */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 60,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            width: '6%',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            height: 'fit-content',
          }}
        >
          
          <Link
            href="https://lepufcg.com.br/"
            sx={{
              padding: '1rem',
              textAlign: 'end',
              position: 'absolute',
              bottom: 0,
              left: 0,
            }}
          >
            {/* <!--realinhar icones lep e jbr-->  */}  
            <Image 
              style={{
                borderRadius: '100%',
                width: '50px',
                height: '50px',
              }}
              width={60}
              height={60}
              alt="LEP"
              src={lep}
            />
          </Link>
        </Box>
        <Box>
          <Link
            href="https://www.jbr.eng.br/site/"
            style={{ padding: '1rem', textAlign: 'end', position: 'absolute', bottom: 0, right: 0 }}
          >
            <Image
              style={{
                borderRadius: '100%',
                width: '50px',
                height: '50px',
              }}
              width={40}
              height={40}
              alt="JBR"
              src={jbr}
            />
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;