import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useCompressionStore from '@/stores/soils/compression/compression.store';
import { Box } from '@mui/material';
import { t } from 'i18next';

const Compression_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { hygroscopicData: data, setData } = useCompressionStore();
  const inputs = [
    //tabela
    // {
    //   label: t('compression.capsules_number_hyg'),
    //   value: data.capsulesNumberHyg,
    //   key: 'capsulesNumberHyg',
    //   required: true,
    // },
    // {
    //   label: t('compression.wet_gross_weights_capsule_hyg'),
    //   value: data.wetGrossWeightsCapsuleHyg,
    //   key: 'wetGrossWeightsCapsuleHyg',
    //   required: true,
    //   adornment: 'g',
    // },
    // {
    //   label: t('compression.dry_gross_weight_hyg'),
    //   value: data.dryGrossWeightsHyg,
    //   key: 'dryGrossWeightsHyg',
    //   required: true,
    //   adornment: 'g',
    // },
    // {
    //   label: t('compression.capsules_weights_hyg'),
    //   value: data.capsulesWeightsHyg,
    //   key: 'capsulesWeightsHyg',
    //   required: true,
    //   adornment: 'g',
    // },
    //
    {
      label: t('compression.mold_number'),
      value: data.moldNumber,
      key: 'moldNumber',
      required: true,
    },
    {
      label: t('compression.mold_volume'),
      value: data.moldVolume,
      key: 'moldVolume',
      required: true,
      adornment: 'cm³',
    },
    {
      label: t('compression.mold_weight'),
      value: data.moldWeight,
      key: 'moldWeight',
      required: true,
      adornment: 'g',
    },
    {
      label: t('compression.socket_weight'),
      value: data.socketWeight,
      key: 'socketWeight',
      required: true,
      adornment: 'g',
    },
    {
      label: t('compression.space_disc_thickness'),
      value: data.spaceDiscThickness,
      key: 'spaceDiscThickness',
      required: true,
      adornment: 'cm',
    },
    {
      label: t('compression.strokes_per_layer'),
      value: data.strokesPerLayer,
      key: 'strokesPerLayer',
      required: true,
    },
    {
      label: t('compression.layers'),
      value: data.layers,
      key: 'layers',
      required: true,
    },
  ];

  if (nextDisabled) {
    const hygroscopic_inputs_completed =
      // data.capsulesNumberHyg !== null &&
      // data.wetGrossWeightsCapsuleHyg !== null &&
      // data.dryGrossWeightsHyg !== null &&
      // data.capsulesWeightsHyg !== null &&
      data.moldNumber !== null &&
      data.moldVolume !== null &&
      data.moldWeight !== null &&
      data.socketWeight !== null &&
      data.spaceDiscThickness !== null &&
      data.strokesPerLayer !== null &&
      data.layers !== null;
    if (hygroscopic_inputs_completed) setNextDisabled(false);
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

export default Compression_Step2;
