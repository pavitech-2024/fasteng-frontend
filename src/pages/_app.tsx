import type { AppProps } from 'next/app';
import Pages from '@/components/config/pages';
import { AuthProvider } from '@/contexts/auth';
import { ThemeProvider } from '@mui/material';
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <Pages>
            <>
              <ToastContainer position="top-right" autoClose={5000} closeOnClick theme="colored" />
              <CssBaseline />
              <Component {...pageProps} />
            </>
          </Pages>
        </ThemeProvider>
      </AuthProvider>
    </LocalizationProvider>
  );
};

export default MyApp;