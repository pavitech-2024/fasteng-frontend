import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: false;
    sm: false;
    md: false;
    lg: false;
    xl: false;
    mobile: true;
    tablet: true;
    notebook: true;
    desktop: true;
    ultrawide: true;
    containerMargin: true;
  }
}

declare module '@mui/material' {
  export interface PaletteOptions {
    primaryTons: {
      white: string;
      background: string;
      border: string;
      lightGray: string;
      mainGray: string;
      darkGray: string;
    };

    secondaryTons: {
      blue: string;
      blueClick: string;
      blueDisabled: string;
      red: string;
      green: string;
      yellowWarning: string;
    };
  }
}
