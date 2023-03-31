import type { AppProps } from 'next/app';
import Pages from '@/components/config/pages';
import { AuthProvider } from '@/contexts/auth';
import { ThemeProvider as MuiTheme } from '@mui/material';
import { ThemeProvider as StyledTheme } from 'styled-components';
import { theme } from '@/components/config/theme';
import { ToastContainer } from 'react-toastify';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <MuiTheme theme={theme}>
        <StyledTheme theme={theme}>
          <Pages>
            <>
              <ToastContainer position="top-right" autoClose={5000} closeOnClick theme="colored" />
              <Component {...pageProps} />
            </>
          </Pages>
        </StyledTheme>
      </MuiTheme>
    </AuthProvider>
  );
};

export default MyApp;
