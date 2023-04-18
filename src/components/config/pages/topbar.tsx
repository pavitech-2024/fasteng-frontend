import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import useAuth from '@/contexts/auth';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Tooltip,
  Menu,
  MenuItem
} from '@mui/material';
import { LogoIcon } from '@/assets/';

interface TopbarProps {
  setOpenSidebar: (open) => void;
}

const Topbar = ({ setOpenSidebar }: TopbarProps) => {
  const { user, logout } = useAuth();
  const Router = useRouter();

  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [language, setLanguage] = useLocalStorage('language', 'PT');

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
      <AppBar
        position="static"
        sx={{
          bgcolor: "primaryTons.darkerGray",
          color: "primaryTons.mainWhite",
          height: "7vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          justifyContent: 'center',
          boxShadow: 'none',
          padding: { mobile: '0 2vw', notebook: '0 1vw' }
        }}
      >
        <Toolbar
          disableGutters
          style={{
            width: '100%',
            display: "flex",
            justifyContent: 'space-between',
            margin: '0'
          }}
        >
          <Box
            style={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Box
              onClick={() => setOpenSidebar((open) => !open)}
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <Image alt="Fasteng" src={LogoIcon} style={{ height: '5vh', width: 'auto' }}/>
            </Box>
            <Typography
              sx={{
                display: { mobile: 'none', tablet: 'flex' },
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '2.5vh',
                pl: { mobile: '5vw', notebook: '2vw' }
              }}
            >
              {pathname[1]}
            </Typography>
            <Typography
              sx={{
                mr: 2,
                display: { mobile: 'none', notebook: 'flex' },
                fontWeight: 500,
                textDecoration: 'none',
                fontSize: '2.5vh'
              }}
            >
              {pathname.length > 2 ? '| ' + pathname[2] : ''}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              cursor: 'pointer' }}
          >
              <Typography
                sx={{
                  margin: '0 1vw 0 0',
                  display: { mobile: 'none', notebook: 'flex' },
                  fontWeight: 500,
                  fontSize: '1.75vh',
                  lineHeight: '1.75vh',
                  textDecoration: 'none',
                }}
                onClick={() => setOpenSettings(() => !openSettings)}
              >
                {user?.name}
              </Typography>
              <Tooltip title="Configurações" onClick={() => setOpenSettings(() => !openSettings)}>
                <IconButton sx={{ p: 0 }}>
                  <Avatar alt="user photo" src={user?.photo} style={{ height: '40px', width: '40px' }} />
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
                  <Box
                    onClick={() => language === 'PT'
                      ? setLanguage('EN')
                      : setLanguage('PT')}
                  >
                    Idioma: {language}
                  </Box>
                </MenuItem>
                <MenuItem>
                  <Box onClick={() => logout()}>Sair</Box>
                </MenuItem>
              </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Topbar;
