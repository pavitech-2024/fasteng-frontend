import { EssayPageProps } from '../../../templates/essay';
import { t } from 'i18next';
import { Box, TextField } from '@mui/material';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import useBinderAsphaltConcreteStore from '@/stores/promedina/binder-asphalt-concrete/binder-asphalt-concrete.store';

const BinderAsphaltConcrete_step4 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { step4Data, setData } = useBinderAsphaltConcreteStore();

  const inputsPavimentData = [
    {
      label: t('pm.binderAsphaltConcrete.granulometricRange'),
      value: step4Data.granulometricRange,
      key: 'granulometricRange',
      required: true,
    },
    { label: t('pm.binderAsphaltConcrete.tmn'), value: step4Data.tmn, key: 'tmn', required: true },
    {
      label: t('pm.binderAsphaltConcrete.asphaltTenor'),
      value: step4Data.asphaltTenor,
      key: 'asphaltTenor',
      required: true,
    },
    {
      label: t('pm.binderAsphaltConcrete.specificMass'),
      value: step4Data.specificMass,
      key: 'specificMass',
      required: true,
    },
    {
      label: t('pm.binderAsphaltConcrete.volumeVoids'),
      value: step4Data.volumeVoids,
      key: 'volumeVoids',
      required: true,
    },
    {
      label: t('pm.binderAsphaltConcrete.rt'),
      value: step4Data.rt,
      key: 'rt',
      required: true,
    },
    {
      label: t('pm.binderAsphaltConcrete.flowNumber'),
      value: step4Data.flowNumber,
      key: 'flowNumber',
      required: true,
    },
    {
      label: t('pm.binderAsphaltConcrete.mr'),
      value: step4Data.mr,
      key: 'mr',
      required: true,
    },
  ];

  const inputsDiametralCompressionFatigueCurve = [
    {
      label: t('pm.binderAsphaltConcrete.fatigueCurve_n_cps'),
      value: step4Data.fatigueCurve_n_cps,
      key: 'fatigueCurve_n_cps',
      required: true,
    },
    {
      label: t('pm.binderAsphaltConcrete.fatigueCurve_k1'),
      value: step4Data.fatigueCurve_k1,
      key: 'fatigueCurve_k1',
      required: true,
    },
    {
      label: t('pm.binderAsphaltConcrete.fatigueCurve_k2'),
      value: step4Data.fatigueCurve_k2,
      key: 'fatigueCurve_k2',
      required: true,
    },
    {
      label: t('pm.binderAsphaltConcrete.fatigueCurve_r2'),
      value: step4Data.fatigueCurve_r2,
      key: 'fatigueCurve_r2',
      required: true,
    },
    {
      label: t('pm.binderAsphaltConcrete.observations'),
      value: step4Data.observations,
      key: 'observations',
      required: false,
    },
  ];

  if (nextDisabled) {
    inputsPavimentData.every(({ required, value }) => {
      if (!required) return true;
      if (value === null) return false;
      if (typeof value === 'string' && value.trim() === '') return false;
      return true;
    }) &&
      inputsDiametralCompressionFatigueCurve.every(({ required, value }) => {
        if (!required) return true;
        if (value === null) return false;
        if (typeof value === 'string' && value.trim() === '') return false;
        return true;
      }) &&
      setNextDisabled(false);
  }

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
              gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' },
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
                  onChange={(e) => setData({ step: 3, key: input.key, value: e.target.value })}
                />
              );
            })}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title={t('pm.diametral.compression.fatigue.curve')} open={true} theme={'#07B811'}>
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
            {inputsDiametralCompressionFatigueCurve.map((input) => {
              return (
                <TextField
                  key={input.key}
                  variant="standard"
                  label={input.label}
                  value={input.value}
                  required={input.required}
                  onChange={(e) => setData({ step: 3, key: input.key, value: e.target.value })}
                />
              );
            })}
          </Box>
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default BinderAsphaltConcrete_step4;
