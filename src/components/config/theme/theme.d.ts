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
