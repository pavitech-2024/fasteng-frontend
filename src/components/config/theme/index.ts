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
    primaryTons: {
      white: '#FCFCFC',
      background: '#F2F2F2',
      border: '#E3E3E3',
      lightGray: '#383838',
      mainGray: '#212121',
      darkGray: '#121212',
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

  typography: {
    fontFamily: "'Roboto', sans-serif",
  },

  components: {
		MuiCssBaseline: {
			styleOverrides: {
				body: {
					margin: '0',
					padding: '0',
					boxSizing: 'border-box',
					backgroundColor: '#F2F2F2',
					color: '#2F3559',
					fontWeight: '400',
          overflowX: 'hidden'
				},

				button: {
					cursor: 'pointer'
				},

				a: {
					textDecoration: 'none'
				},

        'body::-webkit-scrollbar': {
          width: '12px'
        },

        'body::-webkit-scrollbar-track': {
          background: '#FCFCFC'
        },

        'body::-webkit-scrollbar-thumb': {
          backgroundColor: '#121212',
          borderRadius: '20px',
          border: '2px solid #F2F2F2'
        }
			}
		}
  }
});
