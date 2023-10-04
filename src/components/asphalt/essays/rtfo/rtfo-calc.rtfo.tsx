import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useRtfoStore from '@/stores/asphalt/rtfo/rtfo.store';
import { Box, Button } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import { toast } from 'react-toastify';

const Rtfo_Calc = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { rtfoCalc: data, setData } = useRtfoStore();

  const [inputFields, setInputFields] = useState(data.points || [{}]);

  const inputs = [
    {
      key: 'sampleWeight',
      label: 'Massa do frasco + amostra',
      value: '',
      adornment: 'g',
    },
    {
      key: 'finalSampleWeight',
      label: 'Massa do frasco + amostra após envelhecimento',
      value: '',
      adornment: 'g',
    }
  ];

  const handleErase = () => {
    try {
      if (inputFields.length > 1) {
        const newInputFields = [...inputFields];
        newInputFields.pop();
        setInputFields(newInputFields);
        setData({ step: 1, key: 'list', value: newInputFields });
      } else {
        throw new Error(t('compression.error.minValue'));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAdd = () => {
    const newInputFields = [...inputFields, {}];
    setInputFields(newInputFields);
    setData({ step: 1, key: 'list', value: newInputFields });
  };

  if (nextDisabled) {
    const hasValueGreaterThanZero = inputFields.some((value) => value > 0);

    if (hasValueGreaterThanZero && data.points !== null) {
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
    <Box sx={{ width: '100%', marginX: 'auto' }}>
      {inputFields.map((inputField, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            marginX: 'auto',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          {inputs.map((input) => (
            <InputEndAdornment
              key={input.key}
              label={input.label}
              fullWidth
              value={inputField[input.key] || ''}
              required
              onChange={(e) => {
                const newInputFields = [...inputFields];
                newInputFields[index][input.key] = e.target.value;
                setInputFields(newInputFields);
              }}
              adornment={input.adornment}
              type="number"
              inputProps={{ min: 0 }}
            />
          ))}
        </Box>
      ))}
      <ExpansionToolbar />
    </Box>
  );
};

export default Rtfo_Calc;
