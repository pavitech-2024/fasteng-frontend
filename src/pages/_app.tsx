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
import useGranularLayersStore from '@/stores/promedina/granular-layers/granular-layers.store';
import { useRouter } from 'next/router';
import useStabilizedLayersStore from '@/stores/promedina/stabilized-layers/stabilized-layers.store';
import useBinderAsphaltConcreteStore from '@/stores/promedina/binder-asphalt-concrete/binder-asphalt-concrete.store';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { i18n } = useTranslation();
  const locale = i18n.language === 'en' ? 'en' : 'en-gb';
  const { pathname } = useRouter();

  useEffect(() => {
    // use effect to reload the page when the language is changed
  }, [i18n.language]);

  const clearGranularLayersStore = useGranularLayersStore((state) => state.clearStore);
  const clearStabilizedLayersStore = useStabilizedLayersStore((state) => state.clearStore);
  const clearConcreteBinderAsphaltStore = useBinderAsphaltConcreteStore((state) => state.clearStore);

  const clearAllStores = () => {
    clearGranularLayersStore();
    clearStabilizedLayersStore();
    clearConcreteBinderAsphaltStore();
  }

  useEffect(() => {
    // Itera sobre todas as chaves no sessionStorage
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);
      if (key) {
        // Extraindo a parte relevante da chave
        const keyString = key.split('-')[1];

        // Verificando se o pathname não contém a substring da chave
        if (!pathname.includes(keyString)) {
          sessionStorage.removeItem(key);
        }
      }
    }

    if (window.location.pathname === '/home') {
      clearAllStores();
    } else if((pathname.includes('promedina') && !pathname.includes('register'))) {
      clearAllStores()
    }
  }, [pathname, clearAllStores]);

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
