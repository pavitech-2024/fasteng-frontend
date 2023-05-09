import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import useAuth from '@/contexts/auth';
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
  ListItemIcon,
  Divider,
} from '@mui/material';
import { LogoSmall, SettingsIcon, LogoutIcon } from '@/assets/';
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
      <AppBar position="static" color="secondary">
        <Container maxWidth="ultrawide" sx={{ pl: '1.8rem' }}>
          <Toolbar disableGutters>
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: 15,
                ':hover': {
                  cursor: 'pointer',
                },
              }}
              onClick={() => {
                const welcome = Router.pathname.includes(`${Router.pathname.split('/')[1]}/`);

                if (window.innerWidth < 968) return welcome ? setOpenSidebar((open) => !open) : Router.push(`/home`);
                else return Router.push(`/home`);
              }}
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
              {t(`topbar.${pathname[1].toLowerCase()}`).toUpperCase()}
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
              {pathname.length > 2 ? '| ' + t(`topbar.${pathname[2].toLowerCase()}`).toUpperCase() : ''}
            </Typography>
            <Tooltip title={t('settings')}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  position: 'absolute',
                  right: 0,
                  transition: 'all .2s ease-in-out',
                  ':hover': {
                    cursor: 'pointer',
                    opacity: 0.8,
                  },
                }}
                onClick={(e) => setAnchorEl(e.currentTarget)}
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
                <IconButton sx={{ p: 0 }}>
                  <Avatar alt="user photo" src={user?.photo} />
                </IconButton>
              </Box>
            </Tooltip>
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
        </Container>
      </AppBar>
    </>
  );
};

export default Topbar;
