import { MenuItem, TextField } from '@mui/material';

export interface DropDownOption {
  label: string;
  value: string | number;
}

interface DropDownProps {
  label: string;
  options: DropDownOption[];
  callback: (value: unknown) => void;
  defaultValue?: DropDownOption;
  helperText?: string;
  sx?: { [key: string]: string | number | { [key: string]: string | number } };
  size?: 'small' | 'medium';
  variant?: 'standard' | 'outlined' | 'filled';
  required?: boolean;
}

const DropDown = ({
  label,
  options,
  defaultValue,
  helperText,
  callback,
  sx,
  size,
  variant,
  required,
}: DropDownProps) => {
  return (
    <TextField
      select
      label={label}
      defaultValue={defaultValue && defaultValue.value}
      helperText={helperText ? helperText : null}
      sx={sx}
      size={size}
      color="primary"
      variant={variant}
      required={required}
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
