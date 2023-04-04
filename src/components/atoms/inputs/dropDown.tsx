import { MenuItem, TextField } from '@mui/material';

export interface DropDownOption {
  label: string;
  value: string;
}

interface DropDownProps {
  label: string;
  options: DropDownOption[];
  callback: (value: unknown) => void;
  defaultValue?: DropDownOption;
  helperText?: string;
  sx?: { [key: string]: string | number | { [key: string]: string | number } };
  size?: 'small' | 'medium';
}

const DropDown = ({ label, options, defaultValue, helperText, callback, sx, size }: DropDownProps) => {
  return (
    <TextField
      select
      label={label}
      defaultValue={defaultValue && defaultValue.value}
      helperText={helperText ? helperText : null}
      sx={sx}
      size={size}
      color="secondary"
    >
      {options.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          onClick={() => callback(option.value)}
          sx={{ fontSize: '14px' }}
        >
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default DropDown;
