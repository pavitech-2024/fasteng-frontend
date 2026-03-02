import { Box, Button, TextField, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

// ✅ Definir tipos localmente se não quiser importar
type FatigueCurveData = {
  k1?: number;
  k2?: number;
  observacoes?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type ResilienceModuleData = {
  moduloMedio?: number;
  moduloInstantaneo?: number;
  observacoes?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type Props = {
  title: string;
  fields: { name: keyof FatigueCurveData | keyof ResilienceModuleData; label: string }[];
  initialValues?: Record<string, any>;
  onConfirm: (data: Record<string, string>) => void;
};

const FatigueOrResilienceCard = ({ title, fields, initialValues = {}, onConfirm }: Props) => {
  // ... resto do componente igual
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      const formattedValues: Record<string, string> = {};
      Object.entries(initialValues).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formattedValues[key] = String(value);
        }
      });
      setValues(formattedValues);
    }
  }, [initialValues]);

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirm = () => {
    const hasValues = Object.values(values).some(value => value && value.trim() !== '');
    if (hasValues) {
      onConfirm(values);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        border: '2px solid #F29134',
        borderRadius: '16px',
        padding: '32px 24px 24px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '-12px',
          left: '16px',
          backgroundColor: 'white',
          paddingX: '8px',
        }}
      >
        <Typography fontSize="22px" fontWeight={600}>
          {title}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' },
          gap: '16px',
        }}
      >
        {fields.map((field) => {
          let inputType = 'text';
          if (field.name === 'k1' || field.name === 'k2' || 
              field.name === 'moduloMedio' || field.name === 'moduloInstantaneo') {
            inputType = 'number';
          }

          return (
            <TextField
              key={String(field.name)}
              label={field.label}
              variant="standard"
              fullWidth
              value={values[String(field.name)] || ''}
              onChange={(e) => handleChange(String(field.name), e.target.value)}
              type={inputType}
              multiline={field.name === 'observacoes'}
              rows={field.name === 'observacoes' ? 3 : 1}
              inputProps={inputType === 'number' ? { step: 'any' } : undefined}
            />
          );
        })}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#F29134',
            '&:hover': { backgroundColor: '#d97f2e' },
          }}
          onClick={handleConfirm}
          disabled={!Object.values(values).some(value => value && value.trim() !== '')}
        >
          Confirmar
        </Button>
      </Box>
    </Box>
  );
};

export default FatigueOrResilienceCard;