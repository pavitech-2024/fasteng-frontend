/* eslint-disable @typescript-eslint/no-unused-vars */
import useAuth from '@/contexts/auth';
import { useRouter } from 'next/router';
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Button,
} from '@mui/material';
import Head from 'next/head';
import Image from 'next/image';
import LogoSmall from '@/assets/fasteng/LogoSmall.svg';
import { useState } from 'react';
import { useLocalStorage } from '../../../hooks/useLocalStorage';

const Topbar = () => {
  const { user, logout } = useAuth();
  const Router = useRouter();

  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [language, setLanguage] = useLocalStorage('language', 'BR');

  const pathname = Router.pathname.toUpperCase().split('/');
  pathname.length > 3 && pathname.splice(2, 1);

  const PageTitle =
    pathname.length > 2
      ? pathname[2].charAt(0) + pathname[2].slice(1).toLowerCase()
      : pathname[1].charAt(0) + pathname[1].slice(1).toLowerCase();

  return (
    <>
      <Head>
        <title>FastEng - {PageTitle}</title>
      </Head>
      <AppBar position="static" color="secondary">
        <Container maxWidth="ultrawide">
          <Toolbar disableGutters>
            <Box sx={{ position: 'absolute', left: 0, top: 15 }}>
              <Image alt="Fasteng" src={LogoSmall} width={150} height={30} />
            </Box>
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                ml: 5,
                display: { mobile: 'none', tablet: 'flex', notebook: 'flex', desktop: 'flex', ultrawide: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              {pathname[1]}
            </Typography>
            <Typography
              variant="subtitle1"
              noWrap
              sx={{
                mr: 2,
                display: { mobile: 'none', tablet: 'none', notebook: 'flex', desktop: 'flex', ultrawide: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              {pathname.length > 2 ? '| ' + pathname[2] : ''}
            </Typography>
            <Box
              sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute', right: 0 }}
              onClick={() => setOpenSettings((prev) => !prev)}
            >
              <Typography
                variant="subtitle1"
                noWrap
                sx={{
                  mr: 2,
                  display: { mobile: 'none', tablet: 'none', notebook: 'flex', desktop: 'flex', ultrawide: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.1rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                {user?.name}
              </Typography>
              <Tooltip title="Configurações">
                <IconButton sx={{ p: 0 }}>
                  <Avatar alt="user photo" src={user?.photo} />
                </IconButton>
              </Tooltip>

              <Menu
                sx={{ mt: '40px' }}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(openSettings)}
                onClose={() => setOpenSettings(false)}
              >
                <MenuItem sx={{ ':hover': { bgColor: 'primary.main' } }}>
                  <Box onClick={() => logout()}>Sair</Box>
                </MenuItem>
              </Menu>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                right: 0,
                top: 60,
                display: 'grid',
                gridTemplateColumns: '60px 2px 60px',
                placeItems: 'center',
              }}
            >
              <Button
                onClick={() => setLanguage('ENG')}
                sx={
                  language === 'ENG'
                    ? { color: 'primary.main', width: 'fit-content' }
                    : { color: 'secondary.main', width: 'fit-content' }
                }
              >
                ENG
              </Button>
              <Typography sx={{ width: 'fit-content', color: 'secondary.main' }}> | </Typography>
              <Button
                onClick={() => setLanguage('BR')}
                sx={
                  language === 'BR'
                    ? { color: 'primary.main', width: 'fit-content' }
                    : { color: 'secondary.main', width: 'fit-content' }
                }
              >
                PT-BR
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Topbar;
