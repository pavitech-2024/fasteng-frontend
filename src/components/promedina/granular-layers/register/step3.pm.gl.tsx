import { EssayPageProps } from '../../../templates/essay';
import { t } from 'i18next';
import { Box, TextField } from '@mui/material';
import useGranularLayersStore from '@/stores/promedina/granular-layers/granular-layers.store';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';

const GranularLayers_step3 = ({ setNextDisabled }: EssayPageProps) => {
  const { step3Data, setData } = useGranularLayersStore();

  const inputsPavimentData = [
    { label: t('pm.granularLayer.mctGroup'), value: step3Data.mctGroup, key: 'mctGroup', required: true },
    {
      label: t('pm.granularLayer.mctCoefficientC'),
      value: step3Data.mctCoefficientC,
      key: 'mctCoefficientC',
      required: true,
    },
    {
      label: t('pm.granularLayer.mctIndexE'),
      value: step3Data.mctIndexE,
      key: 'mctIndexE',
      required: true,
    },
    {
      label: t('pm.granularLayer.especific.mass'),
      value: step3Data.especificMass,
      key: 'especificMass',
      required: true,
    },
    {
      label: t('pm.granularLayer.compressionEnergy'),
      value: step3Data.compressionEnergy,
      key: 'compressionEnergy',
      required: true,
    },
    { label: t('pm.granularLayer.abrasionLA'), value: step3Data.abrasionLA, key: 'abrasionLA', required: true },
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
    {
      label: t('pm.granularLayer.mf.observations'),
      value: step3Data.observations,
      key: 'observations',
      required: false,
    },
  ];

  const inputsResilienceModule = [
    { label: t('pm.granularLayer.rs.k1'), value: step3Data.k1, key: 'k1', required: true },
    { label: t('pm.granularLayer.rs.k2'), value: step3Data.k2, key: 'k2', required: true },
    { label: t('pm.granularLayer.rs.k3'), value: step3Data.k3, key: 'k3', required: true },
    { label: t('pm.granularLayer.rs.k4'), value: step3Data.k4, key: 'k4', required: true },
  ];

  const inputsPermanentDeformation = [
    { label: t('pm.granularLayer.k1.psi1'), value: step3Data.k1psi1, key: 'k1psi1', required: true },
    { label: t('pm.granularLayer.k2.psi2'), value: step3Data.k2psi2, key: 'k2psi2', required: true },
    { label: t('pm.granularLayer.k3.psi3'), value: step3Data.k3psi3, key: 'k3psi3', required: true },
    { label: t('pm.granularLayer.k4.psi4'), value: step3Data.k4psi4, key: 'k4psi4', required: true },
  ];

  setNextDisabled(false);

  return (
    <>
      <FlexColumnBorder 
        title={t('pm.paviment.data')} 
        open={true} 
        theme={'#07B811'} 
        sx_title={{ whiteSpace: 'wrap' }}
      >
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
                  onChange={(e) => setData({ step: 2, key: input.key, value: e.target.value })}
                />
              );
            })}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder 
        title={t('pm.resilience.module')} 
        open={true} 
        theme={'#07B811'}
        sx_title={{ fontSize: { mobile: '1rem' }, whiteSpace: 'wrap' }}
      >
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
              gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' },
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
                  onChange={(e) => setData({ step: 2, key: input.key, value: e.target.value })}
                />
              );
            })}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder 
        title={t('pm.permanent.deformation')} 
        open={true} 
        theme={'#07B811'}
        sx_title={{ fontSize: { mobile: '1rem' }, whiteSpace: 'wrap' }}
      >
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
              gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' },
              gap: '10px 20px',
              paddingBottom: '20px',
            }}
          >
            {inputsPermanentDeformation.map((input) => {
              return (
                <TextField
                  key={input.key}
                  variant="standard"
                  label={input.label}
                  value={input.value}
                  required={input.required}
                  onChange={(e) => setData({ step: 2, key: input.key, value: e.target.value })}
                />
              );
            })}
          </Box>
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default GranularLayers_step3;
