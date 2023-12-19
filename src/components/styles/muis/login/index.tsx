import { Button } from '@mui/material';
import { NextPage } from 'next';
import React from 'react';

interface AboutButtonProps {
  text: string;
  href?: string; 
}

export const AboutButton: NextPage<AboutButtonProps> = ({ text, href }: AboutButtonProps) => (
  <Button
    variant="contained"
    component="a"
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    sx={{
      color: 'primary.main',
      bgcolor: 'primaryTons.mainGray',
      fontSize: '.95rem',
      lineHeight: '.95rem',
      fontWeight: '700',
      height: '28px',
      width: '126px',
      border: '1px solid #F2A255',

      '&:hover': {
        bgcolor: 'primaryTons.darkGray',
        border: '1px solid primary.main',
      },

      '@media screen and (max-width: 1024px)': {
        fontSize: '.85rem',
        lineHeight: '.85rem',
        height: '24px',
        width: '112px',
      },
    }}
  >
    {text}
  </Button>
);
