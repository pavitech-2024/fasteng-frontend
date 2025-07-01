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
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import ABCP_SERVICE from '@/services/concrete/dosages/abcp/abcp.service';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { i18n } = useTranslation();
  const locale = i18n.language === 'en' ? 'en' : 'en-gb';

  const { pathname } = useRouter();
  const resetStores = useResetStores();
  const { hasHydrated } = useSuperpaveStore();

  const serviceMap = {
    superpave: new Superpave_SERVICE(),
    marshall: new Marshall_SERVICE(),
    ABCP: new ABCP_SERVICE(),
  };

  /**
   * Checks if the user is navigating to a new essay.
   * If so, reset all the stores that hold data for the essays.
   * This function is used when the user navigate from one essay to another,
   * so that the data of the previous
   * essay is not kept in memory.
   */
  useEffect(() => {
    if (!hasHydrated) return;

    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);

      if (!key) continue;

      const keyString = key.split('-')[1]; // ex: 'superpave' em 'asphalt-superpave-store'

      let storeName = null;

      // Verificar se o keyString é diferente de 'step', logo, é o nome do ensaio/dosagem
      if (keyString !== 'step') {
        // Obter o storeName
        storeName = keyString?.split('-')[0]; // ex: 'superpave' em 'asphalt-superpave-store'
      }

      let step = null;

      // Verificar se o keyString é 'step'
      if (keyString === 'step') {
        // Obter o step do sessionStorage
        step = sessionStorage.getItem(step);
      }

      // Encontrar o service correspondente ao keyString
      const service = serviceMap[storeName];

      // Obter o número total de steps
      const totalSteps = service?.info?.steps;

      // Verificar se o pathname atual inclui o keyString e se o step atual é o último
      if (!pathname.includes(storeName) && step === totalSteps - 1) {
        resetStores();
        sessionStorage.clear();
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
