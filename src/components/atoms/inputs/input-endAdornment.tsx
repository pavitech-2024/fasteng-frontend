import { FormControl, Input, InputLabel, InputAdornment } from '@mui/material';
import React from 'react';

interface Props {
  onBlur?: (e) => void;
  variant?: 'standard' | 'outlined' | 'filled';
  key?: string;
  label?: string;
  placeholder?: string;
  adornment: string;
  value: unknown;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  inputProps?: unknown;
  required?: boolean;
  sx?: unknown;
  fullWidth?: boolean;
  readOnly?: boolean;
  focused?: boolean;
}

const InputEndAdornment = ({
  variant,
  key,
  label,
  placeholder,
  adornment,
  value,
  onChange,
  onBlur,
  type,
  inputProps,
  required,
  sx,
  fullWidth,
  readOnly,
  focused,
}: Props) => {
  console.log("🚀 ~ sx:", sx)
  return (
    <FormControl focused={focused} variant={variant} key={key} fullWidth={fullWidth}>
      {label ? <InputLabel htmlFor={`outlined-adornment-${key}`}>{label}</InputLabel> : <></>}
      <Input
        fullWidth={fullWidth}
        onBlur={onBlur}
        required={required}
        placeholder={placeholder}
        id={`outlined-adornment-${key}`}
        endAdornment={<InputAdornment position="end">{adornment}</InputAdornment>}
        value={value}
        onChange={onChange}
        type={type}
        inputProps={inputProps}
        sx={sx}
        readOnly={readOnly ? readOnly : false}
      />
    </FormControl>
  );
};

export default React.memo(InputEndAdornment);
