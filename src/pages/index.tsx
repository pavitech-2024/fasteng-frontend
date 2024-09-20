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
import { TextField, Box, Container, Typography, ButtonBase, Input } from '@mui/material';
import { JbrAnchor, LepAnchor } from '@/components/atoms/anchor/loginAnchors';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Login: NextPage = () => {
  const { signIn } = useAuth();

  const date = new Date();
  const year = date.getFullYear();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { push } = useRouter();

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
              <Box
                sx={{
                  scale: { mobile: '0.7' },
                  marginTop: { mobile: '1.5rem' },
                }}
              >
                <LoginImage alt="Fasteng" src={LogoWhite} />
              </Box>
            </Box>
            <Box
              sx={{
                color: 'primaryTons.white',
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
                marginTop: { mobile: '1.5rem' },
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
                marginTop: { mobile: '0.5rem' },
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
                padding: { mobile: '10px 0 0 0' },
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
                inputProps={{
                  style: { height: '7px' },
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
                inputProps={{
                  style: { height: '7px' },
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
              <Link
                href={'https://minhaconta.fastengapp.com.br/forgot-password'}
                passHref
                target="_blank"
                rel="noopener noreferrer"
              >
                <ButtonBase sx={{ color: 'primary.main', fontSize: { desktop: '1rem', mobile: '0.85rem' } }}>
                  {t('login.forget password')}
                </ButtonBase>
              </Link>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              width: '50%',
              justifyContent: 'space-between',
              alignItems: 'end',
              height: 'fit-content',
            }}
          >
            <LepAnchor />
            <JbrAnchor />
          </Box>
          <Box
            sx={{
              position: 'absolute',
              bottom: 10,
            }}
          >
            <Typography sx={{ fontSize: { notebook: '15px', mobile: '8px' } }}>© {year} | Pavitech</Typography>
          </Box>
        </Container>
      </Container>
    </>
  );
};

export default Login;
