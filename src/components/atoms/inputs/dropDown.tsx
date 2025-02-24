import { MenuItem, TextField } from '@mui/material';

export interface DropDownOption {
  label: string;
  value: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface DropDownProps {
  label: string;
  options: DropDownOption[];
  callback: (value: unknown, index?: number) => void;
  value?: DropDownOption;
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
  value,
  helperText,
  callback,
  sx,
  size,
  variant,
  required,
  isEdit,
}: DropDownProps) => {
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedValue = event.target.value;
    const selectedIndex = options.findIndex((option) => option.value === selectedValue);
    callback(selectedValue, selectedIndex);
  };

  return (
    <TextField
      select
      label={label}
      value={value?.value ?? ''} // Exibe o valor controlado externamente
      onChange={handleChange}
      helperText={helperText || null}
      sx={sx}
      size={size}
      color="primary"
      variant={variant}
      required={required}
      focused={isEdit}
    >
      {options?.map((option, index) => (
        <MenuItem
          key={index}
          value={option.value}
          onClick={() => callback(option.value, index)}
          sx={{ fontSize: '14px' }}
        >
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default DropDown;
