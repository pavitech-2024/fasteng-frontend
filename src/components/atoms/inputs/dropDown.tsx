import { MenuItem, TextField } from '@mui/material';
import { useState } from 'react';

export interface DropDownOption {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}

interface DropDownProps {
  label: string;
  options: DropDownOption[];
  callback: (value: unknown, index?: number) => void;
  defaultValue?: DropDownOption;
  helperText?: string;
  sx?: { [key: string]: string | number | { [key: string]: string | number } };
  size?: 'small' | 'medium';
  variant?: 'standard' | 'outlined' | 'filled';
  required?: boolean;
  isEdit?: boolean;
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
  isEdit,
}: DropDownProps) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue?.value || '');

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    setSelectedValue(value);
    callback(value);
  };

  return (
    <TextField
      select
      label={label}
      defaultValue={defaultValue && defaultValue.value}
      value={defaultValue ? defaultValue.value : ''}
      onChange={handleChange}
      helperText={helperText ? helperText : null}
      sx={sx}
      size={size}
      color="primary"
      variant={variant}
      required={required}
      focused={isEdit}
    >
      {options?.map((option, index) => (
        <MenuItem key={index} value={option.value} onClick={() => callback(option.value, index)} sx={{ fontSize: '14px' }}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default DropDown;
