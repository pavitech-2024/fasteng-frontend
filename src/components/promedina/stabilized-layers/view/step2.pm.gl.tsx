import { EssayPageProps } from '../../../templates/essay';
import { t } from 'i18next';
import { Box, TextField } from '@mui/material';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import useStabilizedLayersStore from '@/stores/promedina/stabilized-layers/stabilized-layers.store';

const StabilizedLayers_step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { step2Data, setData } = useStabilizedLayersStore();

  const inputsPavimentData = [
    {
      label: t('pm.granularLayer.identification'),
      value: step2Data.identification,
      key: 'identification',
      required: true,
    },
    { label: t('pm.granularLayer.section.type'), value: step2Data.sectionType, key: 'sectionType', required: true },
    { label: t('pm.granularLayer.extension'), value: step2Data.extension, key: 'extension', required: true },
    {
      label: t('pm.granularLayer.initial.stake.meters'),
      value: step2Data.initialStakeMeters,
      key: 'initialStakeMeters',
      required: true,
    },
    { label: t('pm.granularLayer.latitudeI'), value: step2Data.latitudeI, key: 'latitudeI', required: true },
    { label: t('pm.granularLayer.longitudeI'), value: step2Data.longitudeI, key: 'longitudeI', required: true },
    {
      label: t('pm.granularLayer.final.stake.meters'),
      value: step2Data.finalStakeMeters,
      key: 'finalStakeMeters',
      required: true,
    },
    { label: t('pm.granularLayer.latitudeF'), value: step2Data.latitudeF, key: 'latitudeF', required: true },
    { label: t('pm.granularLayer.longitudeF'), value: step2Data.longitudeF, key: 'longitudeF', required: true },
    {
      label: t('pm.granularLayer.monitoring.phase'),
      value: step2Data.monitoringPhase,
      key: 'monitoringPhase',
      required: true,
    },
    { label: t('pm.granularLayer.observations'), value: step2Data.observation, key: 'observation', required: false },
  ];

  const inputsPavimentPreparation = [
    { label: t('pm.granularLayer.milling'), value: step2Data.milling, key: 'milling', required: true },
    {
      label: t('pm.granularLayer.intervention.at.the.base'),
      value: step2Data.interventionAtTheBase,
      key: 'interventionAtTheBase',
      required: true,
    },
    { label: t('pm.granularLayer.sami'), value: step2Data.sami, key: 'sami', required: true },
    { label: t('pm.granularLayer.bonding.paint'), value: step2Data.bondingPaint, key: 'bondingPaint', required: true },
    {
      label: t('pm.granularLayer.priming'),
      value: step2Data.priming,
      key: 'priming',
      required: true,
    },
  ];

  const inputsStructuralComposition = [
    { label: t('pm.granularLayer.layer'), value: step2Data.layer, key: 'layer', required: true },
    { label: t('pm.granularLayer.material'), value: step2Data.material, key: 'material', required: true },
    { label: t('pm.granularLayer.thickness'), value: step2Data.thickness, key: 'thickness', required: true },
  ];

  // inputsPavimentData.every(({ required, value }) => {
  //   if (!required) return true;

  //   if (value === null) return false;

  //   if (typeof value === 'string' && value.trim() === '') return false;

  //   return true;
  // }) &&
  //   inputsPavimentPreparation.every(({ required, value }) => {
  //     if (!required) return true;

  //     if (value === null) return false;

  //     if (typeof value === 'string' && value.trim() === '') return false;

  //     return true;
  //   }) &&
  //   inputsStructuralComposition.every(({ required, value }) => {
  //     if (!required) return true;

  //     if (value === null) return false;

  //     if (typeof value === 'string' && value.trim() === '') return false;

  //     return true;
  //   }) &&
  nextDisabled && setNextDisabled(false);

  return (
    <>
      <FlexColumnBorder title={t('pm.paviment.data')} open={true} theme={'#07B811'}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              width: '100%',
              gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' },
              gap: '10px 20px',
              paddingBottom: '20px',
            }}
          >
            {inputsPavimentData.map((input) => {
              return (
                <TextField
                  key={input.key}
                  variant="standard"
                  label={input.label}
                  value={input.value}
                  required={input.required}
                  onChange={(e) => setData({ step: 0, key: input.key, value: e.target.value })}
                />
              );
            })}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title={t('pm.paviment.preparation')} open={true} theme={'#07B811'}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              width: '100%',
              gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' },
              gap: '5px 20px',
              paddingBottom: '20px',
            }}
          >
            {inputsPavimentPreparation.map((input) => {
              return (
                <TextField
                  key={input.key}
                  variant="standard"
                  label={input.label}
                  value={input.value}
                  required={input.required}
                  onChange={(e) => setData({ step: 0, key: input.key, value: e.target.value })}
                />
              );
            })}
          </Box>
        </Box>
      </FlexColumnBorder>
      <FlexColumnBorder title={t('pm.structural.composition')} open={true} theme={'#07B811'}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              width: '100%',
              gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' },
              gap: '5px 20px',
              paddingBottom: '20px',
            }}
          >
            {inputsStructuralComposition.map((input) => {
              return (
                <TextField
                  key={input.key}
                  variant="standard"
                  label={input.label}
                  value={input.value}
                  required={input.required}
                  onChange={(e) => setData({ step: 0, key: input.key, value: e.target.value })}
                />
              );
            })}
          </Box>
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default StabilizedLayers_step2;
