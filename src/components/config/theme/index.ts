import { createTheme } from '@mui/material';

export const theme = createTheme({
  breakpoints: {
    values: {
      mobile: 0,
      tablet: 360,
      notebook: 768,
      desktop: 1366,
      ultrawide: 1920,
      containerMargin: 2016,
      infinity: 2048,
    },
  },

  palette: {
    primary: {
      main: '#f57e34',
    },
    secondary: {
      main: '#303030',
      light: '#404040',
    },
  },
});
