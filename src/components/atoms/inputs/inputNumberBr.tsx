// components/atoms/inputs/inputNumberBr.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FormControl, Input, InputLabel, InputAdornment as MuiInputAdornment } from '@mui/material';

/**
 * Converte qualquer string numérica (pt-BR, en-US ou colada do Excel) em number.
 * Regras:
 *  - "2,456"      -> 2.456   (vírgula = decimal)
 *  - "2.456"      -> 2.456   (ponto único = decimal, padrão do Excel/US)
 *  - "1.234.567"  -> 1234567 (mais de um ponto = separador de milhar)
 *  - "1.234,56"   -> 1234.56 (o último separador que aparece é o decimal)
 *  - "2,"         -> 2       (estado intermediário de digitação, não zera nada)
 */
export function parseNumberBr(raw: string | number | null | undefined): number | null {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : null;

  let s = String(raw)
    .trim()
    .replace(/[\s\u00A0]/g, ''); // espaços comuns e non-breaking space

  if (s === '' || s === '-' || s === ',' || s === '.') return null;

  const negative = s.startsWith('-');
  s = s.replace(/-/g, '');

  const hasComma = s.includes(',');
  const hasDot = s.includes('.');

  if (hasComma && hasDot) {
    const decSep = s.lastIndexOf(',') > s.lastIndexOf('.') ? ',' : '.';
    const thoSep = decSep === ',' ? '.' : ',';
    s = s.split(thoSep).join('').replace(decSep, '.');
  } else if (hasComma) {
    const parts = s.split(',');
    s = parts.length > 2 ? parts.join('') : parts.join('.');
  } else if (hasDot) {
    const parts = s.split('.');
    s = parts.length > 2 ? parts.join('') : parts.join('.');
  }

  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  return negative ? -n : n;
}

/** Mantém só o que pode existir num número, com o sinal apenas na frente. */
function sanitizeTyping(input: string): string {
  const negative = input.trim().startsWith('-');
  const body = input.replace(/[^0-9.,]/g, '');
  return (negative ? '-' : '') + body;
}

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
  /** casas decimais MÍNIMAS exibidas ao sair do campo (não corta o valor) */
  decimalPlaces?: number;
  /** teto de casas decimais exibidas ao sair do campo */
  maxDecimalPlaces?: number;
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
  maxDecimalPlaces = 10,
}) => {
  const [textValue, setTextValue] = useState('');
  const isFocusedRef = useRef(false);

  const format = useCallback(
    (n: number) =>
      n.toLocaleString('pt-BR', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: maxDecimalPlaces,
        useGrouping: false, // evita reintroduzir o "." ambíguo ao reeditar
      }),
    [decimalPlaces, maxDecimalPlaces]
  );

  // Sincroniza com o pai APENAS quando o campo não está em foco.
  // Sem isso, qualquer re-render/resposta do backend sobrescreve o que está sendo digitado.
  useEffect(() => {
    if (isFocusedRef.current) return;

    if (value === null || value === undefined || value === '') {
      setTextValue('');
      return;
    }

    const n = parseNumberBr(value);
    setTextValue(n === null ? '' : format(n));
  }, [value, format]);

  const handleFocus = () => {
    isFocusedRef.current = true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Guarda o texto EXATAMENTE como o usuário digitou/colou.
    // Nada de reescrever "." em "," no meio da digitação — é aí que dígito some.
    const sanitized = sanitizeTyping(e.target.value);
    setTextValue(sanitized);
    onChange?.(parseNumberBr(sanitized));
  };

  const handleBlurInternal = (e: React.FocusEvent<HTMLInputElement>) => {
    isFocusedRef.current = false;

    const n = parseNumberBr(textValue);
    setTextValue(n === null ? '' : format(n));
    onChange?.(n);

    onBlur?.(e);
  };

  return (
    <FormControl focused={focused} variant={variant} key={key} fullWidth={fullWidth} sx={sx}>
      {label ? <InputLabel htmlFor={`outlined-adornment-${key}`}>{label}</InputLabel> : <></>}
      <Input
        fullWidth={fullWidth}
        onFocus={handleFocus}
        onBlur={handleBlurInternal}
        required={required}
        placeholder={placeholder}
        id={`outlined-adornment-${key}`}
        endAdornment={adornment ? <MuiInputAdornment position="end">{adornment}</MuiInputAdornment> : undefined}
        value={textValue}
        onChange={handleChange}
        type="text"
        inputProps={{
          ...(inputProps as any),
          inputMode: 'decimal',
          autoComplete: 'off',
        }}
        readOnly={readOnly || false}
        disabled={disabled}
      />
    </FormControl>
  );
};

export default React.memo(InputNumberBr);