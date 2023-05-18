import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import useAuth from '@/contexts/auth';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from '@mui/material';
import { LogoIcon, SettingsIcon, LogoutIcon } from '@/assets/';
import Languages from '../../molecules/buttons/languages';
import { t } from 'i18next';

interface TopbarProps {
  setOpenSidebar: (open) => void;
}

const Topbar = ({ setOpenSidebar }: TopbarProps) => {
  const { user, logout } = useAuth();
  const Router = useRouter();

  const pathname = Router.pathname.toUpperCase().split('/');
  pathname.length > 3 && pathname.splice(2, 1);

  const PageTitle = (pathname.length > 2 ? pathname[2] : pathname[1]).toLowerCase();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  return (
    <>
      <Head>
        <title>FastEng - {t(`topbar.${PageTitle}`)}</title>
      </Head>
      <AppBar
        position="absolute"
        sx={{
          bgcolor: 'primaryTons.darkGray',
          color: 'primaryTons.white',
          height: '52px',
          width: `window.innerHeight > 100vh ? calc(100vw - 12px) : 100vw`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxShadow: 'unset',
          p: { mobile: '0 2vw', notebook: '0 1vw' },
          zIndex: '100'
        }}
      >
        <Toolbar
          disableGutters
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            margin: '0',
          }}
        >
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              onClick={() => {
                const welcome = Router.pathname.includes(`${Router.pathname.split('/')[1]}/`);

                if (window.innerWidth < 968) return welcome ? setOpenSidebar((open) => !open) : Router.push(`/home`);
                else return Router.push(`/home`);
              }}
            >
              <Image alt="Fasteng" src={LogoIcon} height={28} style={{ cursor: 'pointer' }} />
            </Box>
            <Typography
              sx={{
                display: { mobile: 'none', tablet: 'flex' },
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '1.25rem',
                pl: { mobile: '5vw', notebook: '1.5vw' },
                cursor: 'pointer'
              }}
              onClick={() => Router.push(`/${pathname[1].toLowerCase()}`)}
            >
              {t(`topbar.${pathname[1].toLowerCase()}`).toUpperCase()}
            </Typography>
            {pathname.length > 2 ?
              <>
                <Box
                  sx={{
                    display: { notebook: 'flex', mobile: 'none' },
                    width: '1.5px',
                    height: '20px',
                    bgcolor: 'primaryTons.white',
                    m: { desktop: '0 0.75vw', notebook: '0 2vw' }
                  }}
                />
                <Typography
                  sx={{
                    display: { mobile: 'none', notebook: 'flex' },
                    textAlign: 'center',
                    fontWeight: 400,
                    textDecoration: 'none',
                    fontSize: '1rem',
                    lineHeight: '1rem',
                    m: '-1px'
                  }}
                >
                  {t(`topbar.${pathname[2].toLowerCase()}`).toUpperCase()}
                </Typography>
              </>
              :
              ''
            }
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'all .2s ease-in-out',

              ':hover': {
                cursor: 'pointer',
                opacity: 0.9,
              },
            }}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <Tooltip title={t('settings')}>
              <>
                <Typography
                  sx={{
                    m: '0 1vw 0 0',
                    display: { mobile: 'none', notebook: 'flex' },
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    lineHeight: '0.95rem',
                    textDecoration: 'none',
                  }}
                >
                  {user?.name}
                </Typography>
                <IconButton sx={{ p: 0 }}>
                  <Avatar alt="user photo" src={user?.photo} style={{ height: '40px', width: '40px' }} />
                </IconButton>
              </>
            </Tooltip>
          </Box>
            <Menu
              PaperProps={{
                sx: {
                  width: { mobile: '70%', tablet: '20rem' },
                },
              }}
              anchorEl={anchorEl}
              open={openMenu}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
            >
              <MenuItem>
                <Languages />
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  Router.push('/settings');
                  setAnchorEl(null);
                }}
              >
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                {t('settings')}
              </MenuItem>
              <MenuItem onClick={() => logout()}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                {t('logout')}
              </MenuItem>
            </Menu>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Topbar;
