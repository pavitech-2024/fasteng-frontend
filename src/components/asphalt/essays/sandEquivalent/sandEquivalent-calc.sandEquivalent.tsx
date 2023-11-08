import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useSandEquivalentStore from '@/stores/asphalt/sandEquivalent/sandEquivalent.store';
import { Box } from '@mui/material';
import { t } from 'i18next';

const SandEquivalent_Calc = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { sandEquivalentCalc: data, setData } = useSandEquivalentStore();

  const inputs = [
    {
      key: 'sandLevel',
      label: t('sandEquivalent.sand-level'),
      adornment: 'cm',
      value: data.sandLevel,
    },
    {
      key: 'clayLevel',
      label: t('sandEquivalent.clay-level'),
      adornment: 'cm',
      value: data.clayLevel,
    },
  ];

  if (nextDisabled) {
    const hasEmptyValues = data.sandLevel && data.clayLevel !== null;
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
              setData({ step: 1, key: `${[input.key]}`, value: e.target.value });
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

export default SandEquivalent_Calc;
