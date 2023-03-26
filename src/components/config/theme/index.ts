import { createTheme } from '@mui/material';

export const theme = createTheme({
  breakpoints: {
    values: {
      mobile: 360,
      tablet: 768,
      notebook: 1366,
      desktop: 1920,
      ultrawide: 2560,
    },
  },

  palette: {
    primary: {
      main: '#f57e34',
    },
    secondary: {
      main: '#303030',
    },
  },
});
