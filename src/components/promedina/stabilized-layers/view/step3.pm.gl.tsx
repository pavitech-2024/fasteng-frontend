import { EssayPageProps } from '../../../templates/essay';
import { t } from 'i18next';
import { Box, TextField } from '@mui/material';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import useStabilizedLayersStore from '@/stores/promedina/stabilized-layers/stabilized-layers.store';

const StabilizedLayers_step3 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { step3Data, setData } = useStabilizedLayersStore();

  const inputsPavimentData = [
    { label: t('pm.granularLayer.stabilizer'), value: step3Data.stabilizer, key: 'stabilizer', required: true },
    { label: t('pm.granularLayer.tenor'), value: step3Data.tenor, key: 'tenor', required: true },
    {
      label: t('pm.granularLayer.especific.mass'),
      value: step3Data.especificMass,
      key: 'especificMass',
      required: true,
    },
    { label: t('pm.granularLayer.rtcd'), value: step3Data.rtcd, key: 'rtcd', required: true },
    { label: t('pm.granularLayer.rtf'), value: step3Data.rtf, key: 'rtf', required: true },
    { label: t('pm.granularLayer.rcs'), value: step3Data.rcs, key: 'rcs', required: true },
    {
      label: t('pm.granularLayer.granulometric.range'),
      value: step3Data.granulometricRange,
      key: 'granulometricRange',
      required: true,
    },
    {
      label: t('pm.granularLayer.optimal.humidity'),
      value: step3Data.optimalHumidity,
      key: 'optimalHumidity',
      required: true,
    },
  ];

  const inputsResilienceModule = [
    { label: t('pm.granularLayer.rs.initial'), value: step3Data.rsInitial, key: 'rsInitial', required: true },
    { label: t('pm.granularLayer.rs.final'), value: step3Data.rsFinal, key: 'rsFinal', required: true },
    { label: t('pm.granularLayer.constant.A'), value: step3Data.constantA, key: 'constantA', required: true },
    { label: t('pm.granularLayer.constant.B'), value: step3Data.constantB, key: 'constantB', required: true },
  ];

  const inputsMaterialFatigue = [
    { label: t('pm.granularLayer.k1.psi1'), value: step3Data.k1psi1, key: 'k1psi1', required: true },
    { label: t('pm.granularLayer.k2.psi2'), value: step3Data.k2psi2, key: 'k2psi2', required: true },
    {
      label: t('pm.granularLayer.mf.observations'),
      value: step3Data.observations,
      key: 'observations',
      required: false,
    },
  ];

  inputsPavimentData.every(({ required, value }) => {
    if (!required) return true;

    if (value === null) return false;

    if (typeof value === 'string' && value.trim() === '') return false;

    return true;
  }) &&
    inputsResilienceModule.every(({ required, value }) => {
      if (!required) return true;

      if (value === null) return false;

      if (typeof value === 'string' && value.trim() === '') return false;

      return true;
    }) &&
    inputsMaterialFatigue.every(({ required, value }) => {
      if (!required) return true;

      if (value === null) return false;

      if (typeof value === 'string' && value.trim() === '') return false;

      return true;
    }) &&
    nextDisabled &&
    setNextDisabled(false);

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

      <FlexColumnBorder title={t('pm.resilience.module')} open={true} theme={'#07B811'}>
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
            {inputsResilienceModule.map((input) => {
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

      <FlexColumnBorder title={t('pm.material.fatigue')} open={true} theme={'#07B811'}>
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
            {inputsMaterialFatigue.map((input) => {
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

export default StabilizedLayers_step3;
