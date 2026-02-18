// components/atoms/inputs/InputBrFinalStyled.tsx - VERSÃO CORRIGIDA
import React, { useState, useEffect } from 'react';
import { FormControl, Input, InputLabel, InputAdornment as MuiInputAdornment } from '@mui/material';

interface InputBrFinalStyledProps {
  value: number | string | null | undefined;
  onChange: (value: number | null) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  variant?: 'standard' | 'outlined' | 'filled';
  key?: string;
  label?: string;
  placeholder?: string;
  adornment: string;
  type?: string;
  inputProps?: unknown;
  required?: boolean;
  sx?: unknown;
  fullWidth?: boolean;
  readOnly?: boolean;
  focused?: boolean;
  disabled?: boolean;
  decimalPlaces?: number;
}

const InputNumberBr: React.FC<InputBrFinalStyledProps> = ({
  value,
  onChange,
  onBlur,
  variant = 'standard',
  key,
  label,
  placeholder,
  adornment,
  type,
  inputProps,
  required,
  sx,
  fullWidth = true,
  readOnly,
  focused,
  disabled = false,
  decimalPlaces = 2,
}) => {
  const [textValue, setTextValue] = useState('');

  useEffect(() => {
    if (value === null || value === undefined) {
      setTextValue('');
    } else if (typeof value === 'number') {
      setTextValue(value.toString().replace('.', ','));
    } else {
      setTextValue(value?.toString() || '');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    let processed = input.replace(/[^0-9,.-]/g, '');
    
    if (processed.includes('.') && !processed.includes(',')) {
      processed = processed.replace('.', ',');
    }
    
    if (processed.includes('.') && processed.includes(',')) {
      processed = processed.replace(/\./g, '');
    }
    
    const parts = processed.split(',');
    if (parts.length > 2) {
      processed = parts[0] + ',' + parts.slice(1).join('');
    }
    
    
    setTextValue(processed);
    
    const normalized = processed.replace(',', '.').replace(/[^0-9.-]/g, '');
    const num = normalized ? parseFloat(normalized) : null;
    
    if (onChange) {
      onChange(num);
    }
  };

  const handleBlurInternal = (e: React.FocusEvent<HTMLInputElement>) => {
    if (textValue) {
      const normalized = textValue.replace(',', '.').replace(/[^0-9.-]/g, '');
      const num = normalized ? parseFloat(normalized) : null;
      
      if (num !== null && !isNaN(num)) {
        setTextValue(num.toLocaleString('pt-BR', {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: 10, // Permite até 10 casas na exibição
        }));
      } else {
        setTextValue('');
      }
    }
    
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <FormControl 
      focused={focused} 
      variant={variant} 
      key={key} 
      fullWidth={fullWidth}
      sx={sx}
    >
      {label ? <InputLabel htmlFor={`outlined-adornment-${key}`}>{label}</InputLabel> : <></>}
      <Input
        fullWidth={fullWidth}
        onBlur={handleBlurInternal}
        required={required}
        placeholder={placeholder}
        id={`outlined-adornment-${key}`}
        endAdornment={<MuiInputAdornment position="end">{adornment}</MuiInputAdornment>}
        value={textValue}
        onChange={handleChange}
        type="text" 
        inputProps={{
          ...(inputProps as any),
          inputMode: 'decimal',
        }}
        readOnly={readOnly || false}
        disabled={disabled}
      />
    </FormControl>
  );
};

export default React.memo(InputNumberBr);