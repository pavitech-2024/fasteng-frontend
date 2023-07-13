import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import useCompressionStore from '@/stores/soils/compression/compression.store';
import { Box } from '@mui/material';
import { t } from 'i18next';

const Compression_Step2 = () => {
  const { hygroscopicData: data, setData } = useCompressionStore();
  const inputs = [
    {
      label: t('compression.capsule_number'),
      value: data.capsulesNumberHyg,
      key: 'capsule_number_hyg',
      required: true,
    },
    {
      label: t('compression.wet_gross_weights_capsule_hyg'),
      value: data.wetGrossWeightsCapsuleHyg,
      key: 'wet-gross-weights-capsule-hyg',
      required: true,
      adornment: 'g',
    },
    {
      label: t('compression.dry_gross_weights_hyg'),
      value: data.dryGrossWeightsHyg,
      key: 'dry-gross-weights-hyg',
      required: true,
      adornment: 'g',
    },
    {
      label: t('compression.capsules_weights'),
      value: data.capsulesWeightsHyg,
      key: 'capsules-weights',
      required: true,
      adornment: 'g',
    },
    {
      label: t('compression.mold_number'),
      value: data.moldNumber,
      key: 'mold-number',
      required: true,
    },
    {
      label: t('compression.mold_volume'),
      value: data.moldVolume,
      key: 'mold-volume',
      required: true,
      adornment: 'cm³',
    },
    {
      label: t('compression.mold_weight'),
      value: data.moldWeight,
      key: 'mold-weight',
      required: true,
      adornment: 'g',
    },
    {
      label: t('compression.socket-weight'),
      value: data.socketWeight,
      key: 'socket-weight',
      required: true,
      adornment: 'g',
    },
    {
      label: t('compression.space_disc_thickness'),
      value: data.spaceDiscThickness,
      key: 'space-disc-thickness',
      required: true,
      adornment: 'cm',
    },
    {
      label: t('compression.strokes_per_layer'),
      value: data.strokesPerLayer,
      key: 'strokes-per-layer',
      required: true,
    },
    {
      label: t('compression.layers'),
      value: data.layers,
      key: 'layers',
      required: true,
    },
  ];

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

export default Compression_Step2;
