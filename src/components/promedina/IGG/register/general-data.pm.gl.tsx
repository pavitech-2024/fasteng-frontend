// components/promedina/IGG/register/general-data.pm.gl.tsx
import React, { useEffect } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { useIggStore } from '@/stores/promedina/igg/igg.store';
import { EssayPageProps } from '@/components/templates/essay'; // ← Importa a interface

const PRIMARY_GREEN = '#388e3c';

const IggGeneralData: React.FC<EssayPageProps> = ({ nextDisabled, setNextDisabled }) => {
  const { generalData, setGeneralData } = useIggStore();

  const handleChange = (field: string, value: string) => {
    setGeneralData({ ...generalData, [field]: value });
  };

  // ✅ VALIDAÇÃO: Habilita/desabilita o botão "Próximo"
  useEffect(() => {
    const isValid = !!(generalData.name && generalData.road && generalData.section && generalData.pavementType);
    setNextDisabled?.(!isValid); // Desabilita se inválido
  }, [generalData, setNextDisabled]);

  return (
    <Box sx={{ border: `1px solid ${PRIMARY_GREEN}`, borderRadius: 1, p: 3, position: 'relative' }}>
      <Typography
        variant="h6"
        sx={{
          color: PRIMARY_GREEN, fontWeight: 600, position: 'absolute', top: '-15px',
          left: '10px', backgroundColor: 'white', px: 1
        }}
      >
        DADOS GERAIS DO TRECHO
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3, mt: 2 }}>
        <TextField 
          fullWidth 
          label="Nome da Análise *" 
          value={generalData.name} 
          onChange={(e) => handleChange('name', e.target.value)} 
          required 
        />
        <TextField 
          fullWidth 
          label="Rodovia *" 
          value={generalData.road} 
          onChange={(e) => handleChange('road', e.target.value)} 
          required 
        />
        <TextField 
          fullWidth 
          label="Trecho/Local *" 
          value={generalData.section} 
          onChange={(e) => handleChange('section', e.target.value)} 
          required 
        />
        <TextField 
          fullWidth 
          label="Subtramo" 
          value={generalData.subtrack || ''} 
          onChange={(e) => handleChange('subtrack', e.target.value)} 
        />
        <TextField 
          fullWidth 
          label="Tipo de Revestimento *" 
          value={generalData.pavementType} 
          onChange={(e) => handleChange('pavementType', e.target.value)} 
          required 
        />
        <TextField 
          fullWidth 
          label="Data da Avaliação *" 
          type="date" 
          value={generalData.evaluationDate} 
          onChange={(e) => handleChange('evaluationDate', e.target.value)} 
          InputLabelProps={{ shrink: true }} 
          required 
        />
        
        {/* ✅ CAMPO OBSERVAÇÕES */}
        <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 3' } }}>
          <TextField 
            fullWidth 
            multiline 
            rows={3} 
            label="Observações" 
            value={generalData.description || ''} 
            onChange={(e) => handleChange('description', e.target.value)} 
          />
        </Box>
      </Box>
    </Box>
  );
};

export default IggGeneralData;