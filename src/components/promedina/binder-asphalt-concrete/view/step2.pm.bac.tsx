import { EssayPageProps } from '../../../templates/essay';
import { t } from 'i18next';
import { Box, TextField } from '@mui/material';
import useBinderAsphaltConcreteStore from '@/stores/promedina/granular-layers/granular-layers.store';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';

const BinderAsphaltConcrete_step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { step2Data, setData } = useBinderAsphaltConcreteStore();

  const inputsPavimentData = [
    {
      label: t('pm.binderAsphaltConcrete.identification'),
      value: step2Data.identification,
      key: 'identification',
      required: true,
    },
    {
      label: t('pm.binderAsphaltConcrete.section.type'),
      value: step2Data.sectionType,
      key: 'sectionType',
      required: true,
    },
    { label: t('pm.binderAsphaltConcrete.extension'), value: step2Data.extension, key: 'extension', required: true },
    {
      label: t('pm.binderAsphaltConcrete.initial.stake.meters'),
      value: step2Data.initialStakeMeters,
      key: 'initialStakeMeters',
      required: true,
    },
    { label: t('pm.binderAsphaltConcrete.latitudeI'), value: step2Data.latitudeI, key: 'latitudeI', required: true },
    { label: t('pm.binderAsphaltConcrete.longitudeI'), value: step2Data.longitudeI, key: 'longitudeI', required: true },
    {
      label: t('pm.binderAsphaltConcrete.final.stake.meters'),
      value: step2Data.finalStakeMeters,
      key: 'finalStakeMeters',
      required: true,
    },
    { label: t('pm.binderAsphaltConcrete.latitudeF'), value: step2Data.latitudeF, key: 'latitudeF', required: true },
    { label: t('pm.binderAsphaltConcrete.longitudeF'), value: step2Data.longitudeF, key: 'longitudeF', required: true },
    {
      label: t('pm.binderAsphaltConcrete.monitoring.phase'),
      value: step2Data.monitoringPhase,
      key: 'monitoringPhase',
      required: true,
    },
    {
      label: t('pm.binderAsphaltConcrete.observations'),
      value: step2Data.observation,
      key: 'observation',
      required: false,
    },
  ];

  const inputsPavimentPreparation = [
    { label: t('pm.binderAsphaltConcrete.milling'), value: step2Data.milling, key: 'milling', required: true },
    {
      label: t('pm.binderAsphaltConcrete.intervention.at.the.base'),
      value: step2Data.interventionAtTheBase,
      key: 'interventionAtTheBase',
      required: true,
    },
    { label: t('pm.binderAsphaltConcrete.sami'), value: step2Data.sami, key: 'sami', required: true },
    {
      label: t('pm.binderAsphaltConcrete.bonding.paint'),
      value: step2Data.bondingPaint,
      key: 'bondingPaint',
      required: true,
    },
    {
      label: t('pm.binderAsphaltConcrete.priming'),
      value: step2Data.priming,
      key: 'priming',
      required: true,
    },
  ];

  const inputsStructuralComposition = [
    { label: t('pm.binderAsphaltConcrete.layer'), value: step2Data.layer, key: 'layer', required: true },
    { label: t('pm.binderAsphaltConcrete.material'), value: step2Data.material, key: 'material', required: true },
    { label: t('pm.binderAsphaltConcrete.thickness'), value: step2Data.thickness, key: 'thickness', required: true },
  ];

   inputsPavimentData.every(({ required }) => {
     if (!required) return true;

  //   if (value === null) return false;

  //   if (typeof value === 'string' && value.trim() === '') return false;

     return true;
   }) &&
    inputsPavimentPreparation.every(({ required }) => {
       if (!required) return true;

  //     if (value === null) return false;

  //     if (typeof value === 'string' && value.trim() === '') return false;

      return true;
     }) &&
     inputsStructuralComposition.every(({ required }) => {
       if (!required) return true;

  //     if (value === null) return false;

  //     if (typeof value === 'string' && value.trim() === '') return false;

       return true;
     }) &&
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

export default BinderAsphaltConcrete_step2;
