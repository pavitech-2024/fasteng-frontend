import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { t } from 'i18next';
import { useState, useEffect } from 'react';

const EditableCell = ({ row, field, adornment, rows, setData }) => {
  const index = rows.findIndex((r) => r.id === row.id);
  const [localValue, setLocalValue] = useState(row[field] || '');

  useEffect(() => {
    setLocalValue(row[field]); // Atualiza localValue caso os dados externos mudem
  }, [row[field]]);

  return (
    <InputEndAdornment
      fullWidth
      label={t(`pm.granularLayer.${field}`)}
      type="string"
      inputProps={{ min: 0 }}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={() => {
        const newRows = [...rows];
        newRows[index][field] = localValue;
        setData({ step: 1, key: 'structuralComposition', value: newRows });
      }}
      adornment={adornment}
    />
  );
};

export default EditableCell;
