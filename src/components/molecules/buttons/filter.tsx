import { Box, Button, Typography } from '@mui/material';
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
        width: { mobile: 'calc(100% - 100px)', tablet: '100%' },
        padding: { mobile: '0.5rem' },
        justifyContent: { mobile: 'center', notebook: 'end' },
      }}
    >
      {options.map((option) => (
        <Button
          sx={{
            borderRadius: '0',
            color: option.isSelected ? 'white' : 'secondary.main',
            borderRight: '1px solid',
            borderColor: 'white',
            transition: 'all 0.3s ease-in-out',
            boxShadow: 'none',
            ':first-of-type': { borderRadius: '12px 0 0 12px' },
            ':last-child': { borderRadius: '0 12px 12px 0', borderRight: 'none' },
          }}
          key={option.key}
          variant="contained"
          color={option.isSelected ? 'primary' : 'inherit'}
          onClick={() => callback(option.key)}
        >
          <Typography
            sx={{
              fontSize: { desktop: '14px', notebook: '11px', tablet: '8px', mobile: '7px' },
              fontWeight: '600',
            }}
          >
            {option.title + '  '}
          </Typography>
        </Button>
      ))}
    </Box>
  );
};

export default Filter;
