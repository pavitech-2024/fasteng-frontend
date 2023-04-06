import { NextPage } from 'next';
import { useState } from 'react';
import Head from 'next/head';
// files
import { toast } from 'react-toastify';
import useAuth from '@/contexts/auth';
import { LogoWhite, LoginPhoto } from '@/assets';

//custom styles
import { LoginImage, LoginBackgroundPhoto } from '@/components/styles/styleds/login';
import { AboutButton } from '@/components/styles/muis/login';
import { MainButton } from '@/components/styles/global';

//mui
import { TextField, Box, Container, Typography } from '@mui/material';

const Login: NextPage = () => {
  const { signIn } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    try {
      toast.promise(async () => await signIn(email, password), {
        pending: 'Verificando usuário...',
        success: 'Login efetuado com sucesso!',
        error: 'Login inválido!',
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
          padding: 0,
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
              padding: { desktop: '10vh 4vw', mobile: '5vh 2vw 10vh' },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: { desktop: '18vh', tablet: '16vh' },
                marginTop: { desktop: '-5vh', mobile: '0' },
              }}
            >
              <LoginImage alt="Fasteng" src={LogoWhite} />
            </Box>
            <Box
              sx={{
                color: 'primaryTons.mainWhite',
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
                fontSize: { ultrawide: '0.95rem', desktop: '0.85rem', notebook: '1rem', mobile: '0.75rem' },
                height: { desktop: '16vh', mobile: '20vh' },
                padding: '0 2vw',
              }}
            >
              Usar o FastEng é simples! Primeiramente, cadastre os materiais que serão usados no seu projeto de dosagem.
              Assim você pode criar um banco de dados para catologar seus materiais e suas informações. Calcule
              resultados de ensaios de caracterização que serão vinculados ao seus materiais e confira se estão
              adequados às especificações técnicas. Por fim, inicie seu projeto de dosagem. O FastEng te acompanha até a
              determinação do teor ótimo de ligante asfáltico.
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-around',
                width: '100%',
                padding: '2vh 0',
              }}
            >
              <MainButton text="Assine" linkTo="https://fastengapp.com.br/" />
              <AboutButton />
            </Box>
          </Container>
        </Box>
        <Container
          sx={{
            bgcolor: 'primaryTons.mainWhite',
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
              padding: '1vh 0vw',
              borderRadius: '0.5rem',
              width: { desktop: '30vw', mobile: '80vw' },
              height: { desktop: '30vh', mobile: '30vh' },
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
                paddingTop: '2vh',
                height: '70%',
              }}
            >
              <TextField
                label="Email"
                variant="outlined"
                value={email}
                placeholder="Digite seu email..."
                sx={{
                  width: { desktop: '26vw', mobile: '70vw' },
                }}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                variant="outlined"
                label="Password"
                placeholder="Digite sua senha..."
                type="password"
                value={password}
                sx={{
                  width: { desktop: '26vw', mobile: '70vw' },
                }}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center',
                height: '30%',
                width: '100%',
              }}
            >
              <MainButton text="Entrar" disabled={password === '' || email === ''} handleClick={() => handleLogin()} />
              <Typography sx={{ color: 'secondaryTons.main', fontSize: { desktop: '1rem', mobile: '0.85rem' } }}>
                Esqueceu sua senha?
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
