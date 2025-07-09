import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import Head from 'next/head';
import Image from 'next/image';

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
import { TextField, Box, Container, Typography, ButtonBase } from '@mui/material';
import { JbrAnchor, LepAnchor } from '@/components/atoms/anchor/loginAnchors';
import axios from 'axios';
import ModalBase from '@/components/molecules/modals/modal';
import Api from '@/api';

import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login: NextPage = () => {
  const { signIn } = useAuth();

  const date = new Date();
  const year = date.getFullYear();

  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const roxApiUrl = 'https://minhaconta.fastengapp.com.br/api/forgot-password ';
  const [roxIsRunning, setRoxIsRunning] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      toast.promise(async () => await signIn(email, password), {
        pending: t('login.toast loading'),
        success: t('login.toast success'),
        error: t('login.toast error'),
      });
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    /**
     * Function to check if the Rox API is running
     * If the API is not running, then set the roxIsRunning state to false
     */
    const handleHealthCheck = async () => {
      try {
        const result = await Api.get('/app/health-check');

        if (result.data.status !== 'success') {
          setRoxIsRunning(false);
        }
      } catch (error) {
        console.error(error);
      }
    };
    handleHealthCheck();
  }, []);

  /**
   * Function to handle forgot password
   * @remarks
   * It makes a post request to the rox api with the email, and if the response is successful,
   * it closes the modal and shows a success toast. If the response is not successful, it shows
   * an error toast with the error message. If there is a network error, it shows a generic error
   * message.
   */
  const handleForgotPassword = () => {
    toast.promise(
      async () => {
        try {
          const { data } = await axios.post(`${roxApiUrl}`, { email });

          if (!data.status) {
            throw new Error(data.message);
          } else {
            setModalIsOpen(false);
          }
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || error.message || 'Erro desconhecido');
          } else if (error instanceof Error) {
            throw error;
          } else {
            throw new Error('Erro desconhecido');
          }
        }
      },
      {
        pending: t('forgot-password.pending'),
        success: t('forgot-password.success'),
        error: {
          render({ data }) {
            if (data instanceof Error) {
              return `${data.message}`;
            }
            return t('forgot-password.error');
          },
        },
      }
    );
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
<<<<<<< HEAD
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: { desktop: '2vh 0 1vh', notebook: '3vh 0 2vh', mobile: '2vh 0 1vh' },
              borderRadius: '0.5rem',
              width: { desktop: '30vw', mobile: '75vw' }, // Reduced width for mobile
              maxWidth: { desktop: '600px', notebook: '500px', mobile: '350px' }, // Reduced maxWidth for mobile
              height: { ultrawide: '30vh', desktop: '34vh', notebook: '30vh', mobile: '32vh' },
              maxHeight: { desktop: '280px', notebook: '410px', mobile: '280px' },
              bgcolor: 'primaryTons.background',
              position: { desktop: 'static', mobile: 'absolute' },
              zIndex: { desktop: 'auto', mobile: '3' },
              bottom: { desktop: 'auto', mobile: '15vh' },
            }}
          >
=======
          {roxIsRunning ? (
>>>>>>> 7f12cf5f2e99f9d77e1e8d2cd322fcb422582dad
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
                boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.25)',
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
                  //type="password"
                  type={showPassword ? 'text' : 'password'}
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
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
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
                  disabled={password === '' || email === '' || loading}
                  handleClick={() => handleLogin()}
                />

                <ButtonBase
                  onClick={() => setModalIsOpen(true)}
                  sx={{ color: 'primary.main', fontSize: { desktop: '1rem', mobile: '0.85rem' } }}
                >
                  {t('login.forget password')}
                </ButtonBase>
              </Box>
            </Box>
          ) : (
            <Box sx={{}}>
              <Image src="/favicon.ico" width={200} height={200} alt="" />
              <Typography>{t('home.maintenance')}</Typography>
            </Box>
          )}

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
      <ModalBase
        title={'Insira o e-mail cadastrado para recuperar a senha'}
        leftButtonTitle={'Cancelar'}
        rightButtonTitle={'Confirmar'}
        onSubmit={handleForgotPassword}
        onCancel={() => setModalIsOpen(false)}
        open={modalIsOpen}
        size={'small'}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginY: '2rem' }}>
          <TextField
            type="email"
            placeholder="Insira o e-mail cadastrado..."
            label="E-mail"
            variant="standard"
            sx={{ width: '100%' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Box>
      </ModalBase>
    </>
  );
};

export default Login;