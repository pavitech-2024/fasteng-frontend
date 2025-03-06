import { EssayPageProps } from '../../../templates/essay';
import { t } from 'i18next';
import { Box, TextField } from '@mui/material';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import useBinderAsphaltConcreteStore from '@/stores/promedina/binder-asphalt-concrete/binder-asphalt-concrete.store';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { useEffect } from 'react';

const BinderAsphaltConcrete_step1 = ({ setNextDisabled }: EssayPageProps) => {
  const { generalData, setData } = useBinderAsphaltConcreteStore();

  const inputs = [
    { label: t('pm.binderAsphaltConcrete.name'), value: generalData?.name, key: 'name', required: true },
    { label: t('pm.binderAsphaltConcrete.zone'), value: generalData?.zone, key: 'zone', required: true },
    { label: t('pm.binderAsphaltConcrete.highway'), value: generalData?.highway, key: 'highway', required: true },
    { label: t('pm.binderAsphaltConcrete.layer'), value: generalData?.layer, key: 'layer', required: true },
    { label: t('pm.binderAsphaltConcrete.cityState'), value: generalData?.cityState, key: 'cityState', required: true },
    {
      label: t('pm.granularLayer.guideLineSpeed'),
      value: generalData?.guideLineSpeed,
      key: 'guideLineSpeed',
      required: true,
    },
    {
      label: t('pm.binderAsphaltConcrete.observations'),
      value: generalData?.observations,
      key: 'observations',
      required: false,
    },
  ];

  useEffect(() => {
    if (generalData?.name !== null && generalData?.name !== '') setNextDisabled(false);
    else setNextDisabled(true);
  }, [generalData?.name]);

  return (
    <>
      <FlexColumnBorder title={t('pm.general.data')} open={true} theme={'#07B811'}>
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
              display: 'flex',
              width: '100%',
              flexWrap: 'wrap',
              '& > *': {
                width: 'calc(50% - 10px)',
              },
              gap: '5px 20px',
              marginBottom: '10px',
              marginTop: '-20px',
            }}
          >
            {inputs?.map((input) => {
              if (input.key === 'guideLineSpeed') {
                return (
                  <InputEndAdornment
                    adornment={'km/h'}
                    type="number"
                    key={input.key}
                    value={generalData?.guideLineSpeed?.toString()}
                    label={input.label}
                    required={input.required}
                    onChange={(e) => setData({ step: 0, key: input.key, value: e.target.value })}
                  />
                );
              } else {
                return (
                  <TextField
                    key={input.key}
                    variant="standard"
                    label={input.label}
                    value={input.value}
                    sx={input.key === 'observations' && { width: '100%' }}
                    multiline={input.key === 'observations'}
                    required={input.required}
                    onChange={(e) => setData({ step: 0, key: input.key, value: e.target.value })}
                  />
                );
              }
            })}
          </Box>
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default BinderAsphaltConcrete_step1;
