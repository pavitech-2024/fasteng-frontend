import { Box, Button, Divider } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface LanguagesProps {
  right?: number;
  top?: number;
  left?: number;
  bottom?: number;
  selectedColor?: string;
  unSelectedColor?: string;
}

const Languages = ({ right, top, left, bottom, selectedColor, unSelectedColor }: LanguagesProps) => {
  const { i18n } = useTranslation();
  const lngOptions = [
    {
      name: 'PT-BR',
      value: 'ptBR',
    },
    {
      name: ' ENG',
      value: 'en',
    },
  ];
  return (
    <Box
      sx={{
        position: 'absolute',
        right: right && right,
        top: top && top,
        left: left && left,
        bottom: bottom && bottom,
        display: 'grid',
        gridTemplateColumns: '60px 2px 60px',
        placeItems: 'center',
      }}
    >
      {lngOptions.map((lng) => {
        const selected = i18n.language === lng.value;
        const divider = lng === lngOptions[lngOptions.length - 1];

        return (
          <React.Fragment key={lng.value}>
            <Button
              sx={{
                color: selected
                  ? selectedColor
                    ? selectedColor
                    : 'secondaryTons.main'
                  : unSelectedColor
                  ? unSelectedColor
                  : 'primaryTons.lightGray',
              }}
              onClick={() => i18n.changeLanguage(lng.value)}
            >
              {lng.name}
            </Button>
            {!divider && <Divider orientation="vertical" flexItem variant="middle" />}
          </React.Fragment>
        );
      })}
    </Box>
  );
};

export default Languages;
