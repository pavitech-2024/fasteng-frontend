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
import useResetStores from '@/utils/hooks/useResetStores';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { i18n } = useTranslation();
  const locale = i18n.language === 'en' ? 'en' : 'en-gb';

  const { pathname } = useRouter();
  const resetStores = useResetStores();
  const { hasHydrated } = useSuperpaveStore();

  /**
   * Resets stores and clears session storage when navigating to a different essay.
   * This is necessary because Next.js does not clear session storage when navigating
   * between pages, and some stores are not designed to be reset. So, this will reset
   * any essay or dosage in case the user navigates to a different essay or homepage.
   *
   * @param {string} pathname - The current pathname.
   * @param {boolean} hasHydrated - Whether the store has been hydrated.
   */
  // useEffect(() => {
  //   if (!hasHydrated) return;

  //   const essayKeys = Object.keys(sessionStorage)
  //     .filter((key) => key.includes('-store'))
  //     .map((key) => {
  //       return key.split('-')[1];
  //     });

  //   const currentEssay = essayKeys.find((essay) => pathname.includes(essay));

  //   if (!currentEssay) {
  //     resetStores();
  //     sessionStorage.clear();
  //   }
  // }, [pathname]);

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
