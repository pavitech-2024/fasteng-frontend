import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useRtfoStore from '@/stores/asphalt/rtfo/rtfo.store';
import { Box, Button } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Rtfo_Calc = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { rtfoCalc: data, setData } = useRtfoStore();

  const [inputFields, setInputFields] = useState(data.list || [{}]);

  const inputs = [
    {
      key: 'sampleWeight',
      label: t('rtfo.sample-weight'),
      adornment: 'g',
    },
    {
      key: 'finalSampleWeight',
      label: t('rtfo.final-sample-weight'),
      adornment: 'g',
    },
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

  const hasEmptyValues = !data.list.every(item => {
    return Object.values(item).every(value => value !== 0 && value !== null);
  });
  
  useEffect(() => {
    if (nextDisabled) {
      setNextDisabled(hasEmptyValues);
    }
  }, [hasEmptyValues]);

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
            gap: '40px',
            alignItems: 'center',
          }}
        >
          {inputs.map((input) => (
            <InputEndAdornment
              key={input.key}
              sx={{
                marginY: '10px'
              }}
              label={input.label}
              fullWidth
              value={inputField[input.key] || 0}
              required
              onChange={(e) => {
                const newInputFields = [...inputFields];
                newInputFields[index][input.key] = Number(e.target.value);
                setInputFields(newInputFields);
                setData({ step: 1, key: 'list', value: newInputFields })
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
