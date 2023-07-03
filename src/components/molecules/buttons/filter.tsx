import { Box, Button } from '@mui/material';
import React from 'react';

export interface FilterOption {
  key: string;
  title: string;
  isSelected: boolean;
}

interface FilterProps {
  options: FilterOption[];
  callback: (key: string) => void;
}

const Filter = ({ options, callback }: FilterProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: { mobile: 'center', notebook: 'end' },
      }}
    >
      {options.map((option) => (
        <Button
          sx={{
            fontSize: { desktop: '.95rem', notebook: '.85rem', mobile: '.75rem' },
            lineHeight: { desktop: 'normal', notebook: '.85rem', mobile: '.75rem' },
            fontWeight: '700',
            maxWidth: { mobile: '85px', notebook: '100px', desktop: 'none' },
            borderRadius: '0',
            color: option.isSelected ? 'primaryTons.white' : 'primary.main',
            bgcolor: option.isSelected ? 'primary.main' : 'primaryTons.border',
            borderRight: '1px solid',
            borderColor: 'primaryTons.white',
            transition: 'all 0.3s ease-in-out',
            ':hover': {
              bgcolor: option.isSelected ? '#F2A255' : 'primary.main',
              color: 'primaryTons.white',
            },
            ':first-of-type': { borderRadius: '12px 0 0 12px' },
            ':last-child': { borderRadius: '0 12px 12px 0', borderRight: 'none' },
          }}
          key={option.key}
          variant="contained"
          onClick={() => callback(option.key)}
        >
          {option.title}
        </Button>
      ))}
    </Box>
  );
};

export default Filter;
