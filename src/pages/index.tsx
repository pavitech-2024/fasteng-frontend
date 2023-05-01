import { NextPage } from 'next';
import { useState } from 'react';
import Head from 'next/head';
// files
import { toast } from 'react-toastify';
import useAuth from '@/contexts/auth';
import { LogoWhite } from '@/assets';

//custom styles
import { LoginImage } from '@/components/styles/login';

//mui
import { TextField, Button, Box, Container, Typography } from '@mui/material';

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
        <Container
          sx={{
            bgcolor: 'secondary.main',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: { notebook: '100vh', mobile: '50vh' },
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '1rem',
              padding: '1rem',
              borderRadius: '0.5rem',
              width: 'calc(100% - 2rem)',
              placeItems: 'center',
            }}
          >
            <LoginImage alt="Fasteng" src={LogoWhite} />
            <Box sx={{ color: 'white', textAlign: 'center', fontSize: { notebook: '14px', mobile: '10px' } }}>
              Usar o FastEng é simples! Primeiramente, cadastre os materiais que serão usados no seu projeto de dosagem.
              Assim você pode criar um banco de dados para catologar seus materiais e suas informações. Calcule
              resultados de ensaios de caracterização que serão vinculados ao seus materiais e confira se estão
              adequados às especificações técnicas. Por fim, inicie seu projeto de dosagem. O FastEng te acompanha até a
              determinação do teor ótimo de ligante asfáltico.
            </Box>
            <Box
              mt={2.5}
              gap={2}
              width="fit-content"
              sx={{
                display: 'grid',
                placeItems: 'center',
                gridTemplateColumns: '1fr 1fr',
              }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={{ width: { notebook: '120px', mobile: '80px' } }}
                href="https://fastengapp.com.br/"
              >
                <Typography sx={{ fontSize: { notebook: '15px', mobile: '8px' } }}>Assine</Typography>
              </Button>
              <Button variant="outlined" color="primary" sx={{ width: { notebook: '120px', mobile: '80px' } }}>
                <Typography sx={{ fontSize: { notebook: '15px', mobile: '8px' } }}>Saiba Mais</Typography>
              </Button>
            </Box>
          </Box>
        </Container>
        <Container
          sx={{
            bgcolor: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: { notebook: '100vh', mobile: '50vh' },
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '1rem',
              padding: '1rem',
              borderRadius: '0.5rem',
              width: 'calc(100% - 2rem)',
              maxWidth: '600px',
            }}
          >
            <TextField
              label="Email"
              variant="outlined"
              value={email}
              placeholder="Digite seu email..."
              fullWidth
              onChange={(e) => setEmail(e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
              color="primary"
            />
            <TextField
              variant="outlined"
              label="Password"
              placeholder="Digite sua senha..."
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
              color="primary"
            />

            <Box
              mt={2.5}
              gap={2}
              width="100%"
              sx={{
                display: 'grid',
                placeItems: 'center',
                gridTemplateColumns: '1fr',
              }}
            >
              <Button
                fullWidth
                variant="contained"
                disabled={password === '' || email === ''}
                color="primary"
                onClick={() => handleLogin()}
              >
                Entrar
              </Button>
              <Button variant="text" color="primary" sx={{ width: 'fit-content' }}>
                <p>Esqueceu sua senha?</p>
              </Button>
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
