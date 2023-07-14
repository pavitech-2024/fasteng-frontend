import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useCompressionStore from '@/stores/soils/compression/compression.store';
import { Box } from '@mui/material';
import { t } from 'i18next';

const Compression_Step3 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { humidityDeterminationData: data, setData } = useCompressionStore();
  const inputs = [
    {
      label: t('compression.capsule_number_hum'),
      value: data.capsulesNumberHum,
      key: 'capsule_number_hum',
      required: true,
    },
    {
      label: t('compression.wet_gross_weights_capsule_hum'),
      value: data.wetGrossWeightsCapsuleHum,
      key: 'wet-gross-weights-capsule-hum',
      required: true,
      adornment: 'g',
    },
    {
      label: t('compression.wet_weights_capsules'),
      value: data.wetWeightsCapsules,
      key: 'wet-weights-capsules',
      required: true,
      adornment: 'g',
    },
    {
      label: t('compression.dry_weights_capsules'),
      value: data.dryWeightsCapsules,
      key: 'dry-weights-capsules',
      required: true,
      adornment: 'g',
    },
    {
      label: t('compression.capsules_weights_hum'),
      value: data.capsulesWeightsHum,
      key: 'capsules-weights-hum',
      required: true,
    },
  ];

  if (nextDisabled) {
    const humidity_determination_inputs_completed =
      data.capsulesNumberHum !== null &&
      data.wetGrossWeightsCapsuleHum !== null &&
      data.wetWeightsCapsules !== null &&
      data.dryWeightsCapsules !== null &&
      data.capsulesWeightsHum !== null;
    if (humidity_determination_inputs_completed) setNextDisabled(false);
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          display: 'flex',
          gap: '15px',
          justifyContent: { mobile: 'center', notebook: 'flex-start' },
          flexWrap: 'wrap',
        }}
      >
        {inputs.map((input) => (
          <Box key={input.key}>
            <InputEndAdornment
              label={input.label}
              value={input.value}
              required={input.required}
              onChange={(e) => setData({ step: 1, key: input.key, value: e.target.value })}
              adornment={input.adornment}
              type="number"
              inputProps={{ min: 0 }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Compression_Step3;
