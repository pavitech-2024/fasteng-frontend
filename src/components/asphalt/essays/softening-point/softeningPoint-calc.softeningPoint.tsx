import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useSofteningPointStore from '@/stores/asphalt/softeningPoint/softeningPoint.store';
import { Box } from '@mui/material';
import { t } from 'i18next';

const SofteningPoint_Calc = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { softeningPointCalc: data, setData } = useSofteningPointStore();

  const inputs = [
    {
      key: 'temperature1',
      label: t('asphalt.softeningPoint.temperature1'),
      adornment: '°C',
      value: data.temperature1,
    },
    {
      key: 'temperature2',
      label: t('asphalt.softeningPoint.temperature2'),
      adornment: '°C',
      value: data.temperature2,
    },
  ];

  if (nextDisabled) {
    const hasEmptyValues = data.temperature1 && data.temperature2 !== null;
    if (hasEmptyValues) setNextDisabled(false);
  }

  return (
    <Box sx={{ width: '100%', marginX: 'auto' }}>
      {inputs.map((input, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '50%',
            marginX: 'auto',
            gap: '40px',
            alignItems: 'center',
          }}
        >
          <InputEndAdornment
            key={input.key}
            sx={{
              marginY: '10px',
            }}
            label={input.label}
            fullWidth
            value={input.value}
            required
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setData({ step: 1, key: `${[input.key]}`, value: value });
            }}
            adornment={input.adornment}
            type="number"
            inputProps={{ min: 0 }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default SofteningPoint_Calc;
