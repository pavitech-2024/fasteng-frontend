import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import useAuth from '@/contexts/auth';
import { useLocalStorage } from '@/hooks/useLocalStorage';
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
import { LogoSmall } from '@/assets/';

interface TopbarProps {
  setOpenSidebar: (open) => void;
}

const Topbar = ({ setOpenSidebar }: TopbarProps) => {
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
        <Container maxWidth="ultrawide" sx={{ pl: '1.8rem' }}>
          <Toolbar disableGutters>
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: 15,
              }}
              onClick={() => setOpenSidebar((open) => !open)}
            >
              <Image alt="Fasteng" src={LogoSmall} width={200} height={28} style={{ transform: 'translateX(-18px)' }} />
            </Box>
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                ml: 5,
                display: { mobile: 'none', tablet: 'flex' },
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
                display: { mobile: 'none', notebook: 'flex' },
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
                  display: { mobile: 'none', notebook: 'flex' },
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
                <MenuItem>
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
