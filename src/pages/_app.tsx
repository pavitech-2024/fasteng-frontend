import type { AppProps } from 'next/app';
import Pages from '@/components/config/pages';
import { AuthProvider } from '@/contexts/auth';
import { ThemeProvider as MuiTheme } from '@mui/material';
import { ThemeProvider as StyledTheme } from 'styled-components';
import { theme } from '@/components/config/theme';
import { ToastContainer } from 'react-toastify';
import '../i18n';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/en-gb';
import 'dayjs/locale/en';
import CssBaseline from '@mui/material/CssBaseline';
import { useRouter } from 'next/router';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { i18n } = useTranslation();
  const locale = i18n.language === 'en' ? 'en' : 'en-gb';

  // const { pathname } = useRouter();

  // const clearStore = useSuperpaveStore((state) => state.clearStore);

  // useEffect(() => {
  //   // Itera sobre todas as chaves no sessionStorage
  //   for (let i = sessionStorage.length - 1; i >= 0; i--) {
  //     const key = sessionStorage.key(i);
  //     if (key) {
  //       // Extraindo a parte relevante da chave
  //       const keyString = key.split('-')[1];
  //       console.log('Substring da chave:', keyString);

  //       // Verificando se o pathname não contém a substring da chave
  //       if (!pathname.includes(keyString)) {
  //         sessionStorage.removeItem(key);
  //       }
  //     }
  //   }

  //   if (window.location.pathname === '/home') {
  //     clearStore();
  //   }
  // }, [pathname, clearStore]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
      <AuthProvider>
        <MuiTheme theme={theme}>
          <StyledTheme theme={theme}>
            <Pages>
              <>
                <ToastContainer position="top-right" autoClose={5000} closeOnClick theme="colored" />
                <CssBaseline />
                <Component {...pageProps} />
              </>
            </Pages>
          </StyledTheme>
        </MuiTheme>
      </AuthProvider>
    </LocalizationProvider>
  );
};

export default MyApp;
