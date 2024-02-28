import { MenuItem, TextField } from '@mui/material';

export interface DropDownOption {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
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

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    callback(event.target.value);
  };

  return (
    <TextField
      select
      label={label}
      defaultValue={defaultValue && defaultValue.value}
      value={defaultValue ? defaultValue.value : ''} // Usando value ao invés de defaultValue
      onChange={handleChange}
      helperText={helperText ? helperText : null}
      sx={sx}
      size={size}
      color="primary"
      variant={variant}
      required={required}
    >
      {options.map((option, index) => (
        <MenuItem key={index} value={option.value} onClick={() => callback(option.value)} sx={{ fontSize: '14px' }}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default DropDown;
