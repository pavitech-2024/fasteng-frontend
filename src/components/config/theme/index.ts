// import { createTheme } from '@mui/material';

// import { adaptV4Theme } from '@mui/material/styles';

// export const theme = createTheme(adaptV4Theme({
//   breakpoints: {
//     values: {
//       mobile: 0,
//       tablet: 360,
//       notebook: 768,
//       desktop: 1025,
//       ultrawide: 1920,
//       containerMargin: 2016,
//     },
//   },

//   palette: {
//     primary: {
//       main: '#F29134',
//     },

//     primaryTons: {
//       white: '#FCFCFC',
//       background: '#F2F2F2',
//       border: '#E3E3E3',
//       lightGray: '#383838',
//       mainGray: '#212121',
//       darkGray: '#121212',
//     },

//     secondaryTons: {
//       blue: '#00A3FF',
//       blueClick: '#008BDA',
//       blueDisabled: '#7CD0FF',
//       red: '#F23434',
//       green: '#43D16B',
//       greenPM: '#07B811',
//       yellowWarning: '#f0cb67',
//     },
//   },

//   typography: {
//     fontFamily: "'Roboto', sans-serif",
//   },

//   components: {
//     MuiCssBaseline: {
//       styleOverrides: {
//         body: {
//           m: 0,
//           p: 0,
//           boxSizing: 'border-box',
//           backgroundColor: '#F2F2F2',
//           color: '#2F3559',
//           fontWeight: '400',
//           overflowX: 'hidden',
//         },

//         a: {
//           textDecoration: 'none',
//         },

//         'body::-webkit-scrollbar': {
//           width: '12px',
//         },

//         'body::-webkit-scrollbar-track': {
//           background: '#FCFCFC',
//         },

//         'body::-webkit-scrollbar-thumb': {
//           backgroundColor: '#121212',
//           borderRadius: '20px',
//           border: '2px solid #F2F2F2',
//         },
//       },
//     },

//     MuiContainer: {
//       styleOverrides: {
//         root: {
//           margin: 0,
//           padding: 0,
//         },
//       },
//     },

//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: '20px',
//           cursor: 'pointer',
//           boxShadow: 'unset',

//           ':hover': {
//             boxShadow: 'unset',
//           },
//         },
//       },
//     },
//   },
// }));
import { createTheme, ThemeOptions } from '@mui/material/styles';

// Estendendo o ThemeOptions para incluir suas propriedades customizadas
declare module '@mui/material/styles' {
  interface Palette {
    primaryTons?: {
      white: string;
      lightGray: string;
      mediumGray: string;
      darkGray: string;
      black: string;
    };
    secondaryTons?: {
      main: string;
      contrastText: string;
    };
  }

  interface PaletteOptions {
    primaryTons: {
      white: string;
      lightGray: string;
      mediumGray: string;
      darkGray: string;
      black: string;
    };
    secondaryTons: {
      main: string;
      contrastText: string;
    };
  }

  // Adicionando suas propriedades personalizadas ao theme
  interface Theme {
    customComponents?: Record<string, any>;
  }

  // Adicionando a tipagem correta para `ThemeOptions` para suportar `customComponents`
  interface ThemeOptions {
    customComponents?: Record<string, any>;
  }
}

// Criação do tema com as opções customizadas
export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    primaryTons: {
      white: '#ffffff',
      lightGray: '#f5f5f5',
      mediumGray: '#cccccc',
      darkGray: '#666666',
      black: '#000000',
    },
    secondaryTons: {
      main: '#ff4081',
      contrastText: '#ffffff',
    },
  },
  typography: {
    // Suas configurações de tipografia
  },
  customComponents: {
    // Suas customizações de componentes
  },
});
