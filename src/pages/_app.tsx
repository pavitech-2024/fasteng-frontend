import type { AppProps } from 'next/app';
import Pages from '@/components/config/pages';
import { AuthProvider } from '@/contexts/auth';
import { ThemeProvider as MuiTheme, Theme, StyledEngineProvider } from '@mui/material';
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
import useResetStores from '@/utils/hooks/useResetStores';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { i18n } = useTranslation();
  const locale = i18n.language === 'en' ? 'en' : 'en-gb';

  const { pathname } = useRouter();
  const resetStores = useResetStores();

  /**
   * Checks if the user is navigating to a new essay.
   * If so, reset all the stores that hold data for the essays.
   * This function is used when the user navigate from one essay to another,
   * so that the data of the previous
   * essay is not kept in memory.
   */
  useEffect(() => {
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);
      if (key) {
        const keyString = key.split('-')[1];

        if (!pathname.includes(keyString)) {
          resetStores();
          sessionStorage.clear();
        }
      }
    }
  }, [pathname]);

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
