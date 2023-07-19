import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useCompressionStore from '@/stores/soils/compression/compression.store';
import { Box } from '@mui/material';
import { t } from 'i18next';

const Compression_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { hygroscopicData: data, setData } = useCompressionStore();
  const inputs = [
    {
      label: t('Número de cápsulas'),
      value: data.capsulesNumberHyg,
      key: 'capsule_number_hyg',
      required: true,
    },
    {
      label: t('Peso bruto úmido'),
      value: data.wetGrossWeightsCapsuleHyg,
      key: 'wet-gross-weights-capsule-hyg',
      required: true,
      adornment: 'g',
    },
    {
      label: t('Peso bruto seco'),
      value: data.dryGrossWeightsHyg,
      key: 'dry-gross-weights-hyg',
      required: true,
      adornment: 'g',
    },
    {
      label: t('Peso da cápsula'),
      value: data.capsulesWeightsHyg,
      key: 'capsules-weights',
      required: true,
      adornment: 'g',
    },
    {
      label: t('Número de molde'),
      value: data.moldNumber,
      key: 'mold-number',
      required: true,
    },
    {
      label: t('Volume do molde'),
      value: data.moldVolume,
      key: 'mold-volume',
      required: true,
      adornment: 'cm³',
    },
    {
      label: t('Peso do molde'),
      value: data.moldWeight,
      key: 'mold-weight',
      required: true,
      adornment: 'g',
    },
    {
      label: t('Peso do soquete'),
      value: data.socketWeight,
      key: 'socket-weight',
      required: true,
      adornment: 'g',
    },
    {
      label: t('Espessura do disco espaçador'),
      value: data.spaceDiscThickness,
      key: 'space-disc-thickness',
      required: true,
      adornment: 'cm',
    },
    {
      label: t('Golpes/camada'),
      value: data.strokesPerLayer,
      key: 'strokes-per-layer',
      required: true,
    },
    {
      label: t('Número de camadas'),
      value: data.layers,
      key: 'layers',
      required: true,
    },
  ];

  if (nextDisabled) {
    const hygroscopic_inputs_completed =
      data.capsulesNumberHyg !== null &&
      data.wetGrossWeightsCapsuleHyg !== null &&
      data.dryGrossWeightsHyg !== null &&
      data.capsulesWeightsHyg !== null &&
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
