import { FormControl, Input, InputLabel, InputAdornment, InputBaseComponentProps } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import React from 'react';

interface Props {
  id?: string;
  variant?: 'standard' | 'outlined' | 'filled';
  label?: string;
  placeholder?: string;
  adornment: string;
  value: unknown;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  type?: string;
  inputProps?: InputBaseComponentProps;
  required?: boolean;
  sx?: SxProps<Theme>;
  fullWidth?: boolean;
  readOnly?: boolean;
  focused?: boolean;
  disabled?: boolean;
  error?: boolean;
}

const InputEndAdornment = ({
  id,
  variant,
  label,
  placeholder,
  adornment,
  value,
  onChange,
  onBlur,
  onFocus,
  onKeyDown,
  type,
  inputProps,
  required,
  sx,
  fullWidth,
  readOnly = false,
  focused,
  disabled = false,
  error = false,
}: Props) => {
  const inputId = `adornment-${id ?? label ?? adornment}`;

  return (
    <FormControl focused={focused} variant={variant} fullWidth={fullWidth} error={error} disabled={disabled}>
      {label && <InputLabel htmlFor={inputId}>{label}</InputLabel>}
      <Input
        id={inputId}
        fullWidth={fullWidth}
        required={required}
        placeholder={placeholder}
        endAdornment={<InputAdornment position="end">{adornment}</InputAdornment>}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        type={type}
        inputProps={inputProps}
        sx={sx}
        readOnly={readOnly}
        disabled={disabled}
        error={error}
      />
    </FormControl>
  );
};

export default React.memo(InputEndAdornment);