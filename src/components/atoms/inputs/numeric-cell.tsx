/**
 * components/atoms/inputs/numeric-cell.tsx
 *
 * Input numérico para células de tabela.
 *
 * O ponto principal: enquanto o campo está focado, quem manda é o `draft`
 * (string local). O store só recebe valor no blur/Enter. Isso resolve de uma vez:
 *  - apagar o campo sem ele "pular" para outro número;
 *  - digitar por cima de um 0 (o onFocus já seleciona tudo);
 *  - digitar "12," ou "0." sem o valor ser reescrito no meio da digitação;
 *  - não depender das setinhas (type="text" + inputMode="decimal", sem spinner).
 */

import { useState } from 'react';
import InputEndAdornment from './input-endAdornment';
import { formatDecimal, parseDecimal } from '@/utils/granulometry-calc';

interface NumericCellProps {
  value: number | null;
  adornment: string;
  onCommit: (value: number | null) => void;
  decimals?: number;
  error?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

const NumericCell = ({
  value,
  adornment,
  onCommit,
  decimals = 2,
  error = false,
  disabled = false,
  readOnly = false,
}: NumericCellProps) => {
  const [draft, setDraft] = useState<string | null>(null);

  const display = draft !== null ? draft : formatDecimal(value, decimals);

  const commit = () => {
    if (draft === null) return;
    onCommit(parseDecimal(draft));
    setDraft(null);
  };

  const cancel = () => setDraft(null);

  return (
    <InputEndAdornment
      fullWidth
      adornment={adornment}
      type="text"
      inputProps={{ inputMode: 'decimal', autoComplete: 'off' }}
      value={display}
      error={error}
      disabled={disabled}
      readOnly={readOnly}
      onFocus={(e) => e.target.select()}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          commit();
          (e.target as HTMLInputElement).blur();
        }
        if (e.key === 'Escape') {
          cancel();
          (e.target as HTMLInputElement).blur();
        }
      }}
    />
  );
};

export default NumericCell;
