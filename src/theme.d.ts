// src/theme.d.ts
import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    primaryTons: PrimaryTons;
    secondaryTons: SecondaryTons;
  }

  interface PaletteOptions {
    primaryTons?: PrimaryTons;
    secondaryTons?: SecondaryTons;
  }

  interface PrimaryTons {
    white: string;
    background: string;
    border: string;
    lightGray: string;
    mainGray: string;
    darkGray: string;
  }

  interface SecondaryTons {
    blue: string;
    blueClick: string;
    blueDisabled: string;
    red: string;
    green: string;
    greenPM: string;
    yellowWarning: string;
  }
}

// Extend the Button colors
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    primaryTons: true;
    secondaryTons: true;
  }
}