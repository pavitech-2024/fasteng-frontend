import { NextPage } from 'next';
import { useState } from 'react';
// files
import useAuth from '../contexts/auth';

//mui
import { TextField, Button, Box } from '@mui/material';

//atoms
import DoubleColumn from '@/components/common/atoms/doubleColumn';
import { LoginContainer, LoginImage } from '../components/styles/login';
import LogoWhite from '@/assets/fasteng/LOGOWHITE.svg';

const Login: NextPage = () => {
  const { signIn } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  return (
    <DoubleColumn props={{ width: '100vw', height: '100vh', columnsOnMobile: '1fr' }}>
      <LoginContainer sx={{ bgcolor: 'secondary.main' }}>
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
          <Box sx={{ color: 'white', textAlign: 'center', fontSize: '14px' }}>
            Usar o FastEng é simples! Primeiramente, cadastre os materiais que serão usados no seu projeto de dosagem.
            Assim você pode criar um banco de dados para catologar seus materiais e suas informações. Calcule resultados
            de ensaios de caracterização que serão vinculados ao seus materiais e confira se estão adequados às
            especificações técnicas. Por fim, inicie seu projeto de dosagem. O FastEng te acompanha até a determinação
            do teor ótimo de ligante asfáltico.
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
            <Button variant="contained" color="primary" sx={{ width: '120px' }}>
              <p>Assine</p>
            </Button>
            <Button variant="outlined" color="primary" sx={{ width: '120px' }}>
              <p>Saiba Mais</p>
            </Button>
          </Box>
        </Box>
      </LoginContainer>
      <LoginContainer sx={{ bgcolor: 'white.main' }}>
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
          />
          <TextField
            variant="outlined"
            label="Password"
            placeholder="Digite sua senha..."
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
              onClick={async () => await signIn(email, password)}
            >
              Entrar
            </Button>
            <Button variant="text" color="primary" sx={{ width: 'fit-content' }}>
              <p>Esqueceu sua senha?</p>
            </Button>
          </Box>
        </Box>
      </LoginContainer>
    </DoubleColumn>
  );
};

export default Login;
