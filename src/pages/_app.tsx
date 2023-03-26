import type { AppProps } from 'next/app';
import PageConfig from '@/components/config/pageConfig';
import { AuthProvider } from '@/contexts/auth';
import { ThemeProvider as MuiTheme } from '@mui/material';
import { ThemeProvider as StyledTheme } from 'styled-components';
import { theme } from '@/components/config/theme';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <PageConfig>
      <AuthProvider>
        <MuiTheme theme={theme}>
          <StyledTheme theme={theme}>
            <Component {...pageProps} />
          </StyledTheme>
        </MuiTheme>
      </AuthProvider>
    </PageConfig>
  );
};

export default MyApp;
