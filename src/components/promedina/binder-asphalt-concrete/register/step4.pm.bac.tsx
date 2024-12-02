import { EssayPageProps } from '../../../templates/essay';
import { t } from 'i18next';
import { Box, TextField } from '@mui/material';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import useBinderAsphaltConcreteStore from '@/stores/promedina/binder-asphalt-concrete/binder-asphalt-concrete.store';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';

const BinderAsphaltConcrete_step4 = ({ setNextDisabled }: EssayPageProps) => {
  const { step4Data, generalData, step2Data, step3Data, setData } = useBinderAsphaltConcreteStore();

  const inputsPavimentData = [
    {
      label: t('pm.binderAsphaltConcrete.granulometricRange'),
      value: step4Data?.granulometricRange,
      key: 'granulometricRange',
      required: true,
      type: 'text',
    },
    { label: t('pm.binderAsphaltConcrete.tmn'), value: step4Data?.tmn, key: 'tmn', required: true },
    {
      label: t('pm.binderAsphaltConcrete.asphaltTenor'),
      value: step4Data?.asphaltTenor,
      key: 'asphaltTenor',
      required: true,
      input: 'text'
    },
    {
      label: t('pm.binderAsphaltConcrete.specificMass'),
      value: step4Data?.specificMass,
      key: 'specificMass',
      required: true,
      input: 'text'
    },
    {
      label: t('pm.binderAsphaltConcrete.volumeVoids'),
      value: step4Data?.volumeVoids,
      key: 'volumeVoids',
      required: true,
      input: 'text'
    },
    {
      label: t('pm.binderAsphaltConcrete.rt'),
      value: step4Data?.rt,
      key: 'rt',
      required: true,
      input: 'text'
    },
    {
      label: t('pm.binderAsphaltConcrete.flowNumber'),
      value: step4Data?.flowNumber,
      key: 'flowNumber',
      required: true,
      input: 'text'
    },
    {
      label: t('pm.binderAsphaltConcrete.abrasionLA'),
      value: step4Data?.abrasionLA,
      key: 'abrasionLA',
      required: true,
      input: 'number'
    },
    {
      label: t('pm.binderAsphaltConcrete.mr'),
      value: step4Data?.mr,
      key: 'mr',
      required: true,
      input: 'text'
    },
  ];

  const inputsDiametralCompressionFatigueCurve = [
    {
      label: t('pm.binderAsphaltConcrete.fatigueCurve_n_cps'),
      value: step4Data?.fatigueCurve_n_cps,
      key: 'fatigueCurve_n_cps',
      required: true,
    },
    {
      label: t('pm.binderAsphaltConcrete.fatigueCurve_k1'),
      value: step4Data?.fatigueCurve_k1,
      key: 'fatigueCurve_k1',
      required: true,
    },
    {
      label: t('pm.binderAsphaltConcrete.fatigueCurve_k2'),
      value: step4Data?.fatigueCurve_k2,
      key: 'fatigueCurve_k2',
      required: true,
    },
    {
      label: t('pm.binderAsphaltConcrete.fatigueCurve_r2'),
      value: step4Data?.fatigueCurve_r2,
      key: 'fatigueCurve_r2',
      required: true,
    },
    {
      label: t('pm.binderAsphaltConcrete.observations'),
      value: step4Data?.observations,
      key: 'observations',
      required: false,
    },
  ];

  setNextDisabled(false);

  return (
    <>
      <FlexColumnBorder title={t('pm.paviment.data')} open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
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
            {inputsPavimentData.map((input) => (
              <TextField
                key={input.key}
                variant="standard"
                type={input.type}
                label={input.label}
                value={input.value}
                required={input.required}
                onChange={(e) => {
                  const newStep4Data = { ...step4Data, [input.key]: e.target.value };
                  const newData = { generalData, step2Data, step3Data, step4Data: newStep4Data };
                  setData({ step: 3, value: newData })
                }}
              />
            ))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder
        title={t('pm.diametral.compression.fatigue.curve')}
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
            {inputsDiametralCompressionFatigueCurve.map((input) => {
              return (
                <TextField
                  key={input.key}
                  variant="standard"
                  label={input.label}
                  value={input.value}
                  required={input.required}
                  onChange={(e) => {
                    const newStep4Data = { ...step4Data, [input.key]: e.target.value };
                    const newData = { generalData, step2Data, step3Data, step4Data: newStep4Data };
                    setData({ step: 3, value: newData })
                  }}
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
