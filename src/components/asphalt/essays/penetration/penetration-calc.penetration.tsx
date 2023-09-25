import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import usePenetrationStore from '@/stores/asphalt/penetration/penetration.store';
import { Box, Button, TextField } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import { toast } from 'react-toastify';

const Penetration_Calc = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { penetrationCalc: data, setData } = usePenetrationStore();

  const [inputFields, setInputFields] = useState(data.points || []); // Inicialize com o valor existente ou vazio

  const handleErase = () => {
    try {
      if (inputFields.length > 1) {
        const newInputFields = [...inputFields];
        newInputFields.pop();
        setInputFields(newInputFields);
        setData({ step: 1, key: 'points', value: newInputFields });
      } else {
        throw new Error(t('compression.error.minValue'));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAdd = () => {
    const newInputFields = [...inputFields, 0]; // Adicionar um novo input vazio
    setInputFields(newInputFields);
    setData({ step: 1, key: 'points', value: newInputFields });
    setNextDisabled(true);
  };

  if (nextDisabled) {
    // Verifica se pelo menos um campo da tabela possui um valor maior do que zero
    const hasValueGreaterThanZero = inputFields.some((value) => value > 0);
  
    if (
      hasValueGreaterThanZero &&
      data.points !== null
      // Adicione aqui outras validações necessárias antes de permitir avançar para o próximo passo
    ) {
      setNextDisabled(false);
    }
  }

  const ExpansionToolbar = () => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem', flexWrap: 'wrap' }}>
        <Button sx={{ color: 'secondaryTons.red' }} onClick={handleErase}>
          {t('erase')}
        </Button>
        <Button sx={{ color: 'secondaryTons.green' }} onClick={handleAdd}>
          {t('add')}
        </Button>
      </Box>
    );
  };

  return (
    <Box>

      {inputFields.map((input, index) => (
        <Box key={index} sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <InputEndAdornment
            fullWidth
            value={input}
            required={false}
            onChange={(e) => {
              const newInputFields = [...inputFields];
              newInputFields[index] = Number(e.target.value);
              setInputFields(newInputFields);
              setData({ step: 1, key: 'points', value: newInputFields });
            }}
            adornment="ddmm"
            type="number"
            inputProps={{ min: 0 }}
          />
        </Box>
      ))}

      <ExpansionToolbar />
    </Box>
  )
};

export default Penetration_Calc;
