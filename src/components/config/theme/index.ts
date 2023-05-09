import { createTheme } from '@mui/material';

export const theme = createTheme({
  breakpoints: {
    values: {
      mobile: 0,
      tablet: 360,
      notebook: 768,
      desktop: 1025,
      ultrawide: 1920,
      containerMargin: 2016,
    },
  },

  palette: {
    primary: {
      main: '#F29134', // orange
    },
    secondary: {
      main: '#212121', // darker gray
    },
    primaryTons: {
      mainWhite: '#FCFCFC',
      background: '#F2F2F2',
      border: '#CFCFCF',
      mainGray: '#383838',
      darkGray: '#212121',
      darkerGray: '#121212',
    },

    secondaryTons: {
      main: '#F29134',
      blue: '#00A3FF',
      blueClick: '#008BDA',
      blueDisabled: '#7CD0FF',
      red: '#F23434',
      green: '#43D16B',
    },
  },
});
