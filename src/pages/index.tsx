import { NextPage } from 'next';
import { useState } from 'react';
import { t } from 'i18next';
import Head from 'next/head';

// files
import { toast } from 'react-toastify';
import useAuth from '@/contexts/auth';
import Languages from '../components/molecules/buttons/languages';
import { LogoWhite, LoginPhoto } from '@/assets';

//custom styles
import { LoginImage, LoginBackgroundPhoto } from '@/components/styles/styleds/login';
import { AboutButton } from '@/components/styles/muis/login';
import { MainButton as Button } from '@/components/styles/global';

//mui
import { TextField, Box, Container, Typography } from '@mui/material';

const Login: NextPage = () => {
  const { signIn } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    try {
      toast.promise(async () => await signIn(email, password), {
        pending: t('login.toast loading'),
        success: t('login.toast success'),
        error: t('login.toast error'),
      });
    } catch (error) {}
  };

  return (
    <>
      <Head>
        <title>FastEng - Login</title>
      </Head>
      <Container
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'grid',
          gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr', alignItems: 'center' },
        }}
      >
        <Box>
          <LoginBackgroundPhoto alt="Background Image" src={LoginPhoto} />
          <Container
            sx={{
              bgcolor: 'rgba(18, 18, 18, 0.85)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              zIndex: '2',
              top: '0',
              height: { desktop: '100vh', mobile: '60vh' },
              width: { desktop: '50vw', mobile: '100vw' },
              p: { desktop: '10vh 4vw', mobile: '5vh 2vw 10vh' },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: { desktop: '18vh', tablet: '16vh' },
                maxHeight: '200px',
                mt: { desktop: '-5vh', mobile: '0' },
              }}
            >
              <Languages left={10} top={10} unSelectedColor="primaryTons.border" />
              <LoginImage alt="Fasteng" src={LogoWhite} />
            </Box>
            <Box
              sx={{
                color: 'primaryTons.white',
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
                fontSize: {
                  ultrawide: '0.95rem',
                  desktop: '0.85rem',
                  notebook: '0.9rem',
                  mobile: '0.7rem',
                },
                height: { ultrawide: '16vh', desktop: '24vh', mobile: '20vh' },
                maxHeight: '220px',
                maxWidth: '980px',
                p: '0 2vw',
              }}
            >
              {t('login.fasteng description')}
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-around',
                width: '100%',
                maxWidth: '980px',
                p: '2vh 0',
              }}
            >
              <Button text="Assine" linkTo="https://fastengapp.com.br/" />
              <AboutButton text="Saiba mais" href="/creators" />
            </Box>
          </Container>
        </Box>
        <Container
          sx={{
            bgcolor: 'primaryTons.white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: { desktop: 'static', mobile: 'absolute' },
            height: { desktop: '100vh', mobile: '40vh' },
            width: { desktop: '50vw', mobile: '100vw' },
            bottom: '0',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: { desktop: '2vh 0 1vh', notebook: '3vh 0 2vh', mobile: '2vh 0 1vh' },
              borderRadius: '0.5rem',
              width: { desktop: '30vw', mobile: '80vw' },
              maxWidth: { desktop: '600px', notebook: '500px', mobile: '600px' },
              height: { ultrawide: '30vh', desktop: '34vh', notebook: '30vh', mobile: '32vh' },
              maxHeight: { desktop: '280px', notebook: '410px', mobile: '280px' },
              bgcolor: 'primaryTons.background',
              position: { desktop: 'static', mobile: 'absolute' },
              zIndex: { desktop: 'auto', mobile: '3' },
              bottom: { desktop: 'auto', mobile: '15vh' },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-around',
                height: '70%',
                width: '100%',
                gap: '10px',
              }}
            >
              <TextField
                label="Email"
                variant="outlined"
                value={email}
                placeholder={t('login.email placeholder')}
                sx={{
                  width: '85%',
                  bgcolor: 'primaryTons.white',
                }}
                onChange={(e) => setEmail(e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                variant="outlined"
                label={t('login.password')}
                placeholder={t('login.password placeholder')}
                type="password"
                value={password}
                sx={{
                  width: '85%',
                  bgcolor: 'primaryTons.white',
                }}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center',
                height: '28%',
                width: '100%',
              }}
            >
              <Button
                text={t('login.enter')}
                disabled={password === '' || email === ''}
                handleClick={() => handleLogin()}
              />
              <Typography sx={{ color: 'primary.main', fontSize: { desktop: '1rem', mobile: '0.85rem' } }}>
                {t('login.forget password')}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              bottom: 10,
            }}
          >
            <Typography sx={{ fontSize: { notebook: '15px', mobile: '8px' } }}>© 2020 | Pavitech</Typography>
          </Box>
        </Container>
      </Container>
    </>
  );
};

export default Login;
