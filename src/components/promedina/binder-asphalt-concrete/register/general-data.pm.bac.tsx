import { EssayPageProps } from '../../../templates/essay';
import { t } from 'i18next';
import { Box, TextField } from '@mui/material';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import useBinderAsphaltConcreteStore from '@/stores/promedina/binder-asphalt-concrete/binder-asphalt-concrete.store';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { useEffect } from 'react';

const BinderAsphaltConcrete_step1 = ({ setNextDisabled }: EssayPageProps) => {
  const { generalData, setData } = useBinderAsphaltConcreteStore();

  // DADOS GERAIS
  const inputs = [
    { label: 'NOME', value: generalData?.name, key: 'name', required: true },
    { label: 'RODOVIA', value: generalData?.highway, key: 'highway', required: true },
    { label: 'MUNICÍPIO/ESTADO', value: generalData?.cityState, key: 'cityState', required: true },
    { label: 'OBSERVAÇÕES', value: generalData?.observations, key: 'observations', required: false },
  ];

  // LOCAL E CAMADA
  const locationInputs = [
    { label: 'LOCAL', value: generalData?.zone, key: 'zone', required: true },
    { label: 'CAMADA', value: generalData?.layer, key: 'layer', required: true },
    {
      label: 'VELOCIDADE DIRETRIZ DA VIA',
      value: generalData?.guideLineSpeed,
      key: 'guideLineSpeed',
      required: true,
      adornment: 'km/h',
      type: 'number'
    },
  ];

  useEffect(() => {
    if (generalData?.name !== null && generalData?.name !== '') setNextDisabled(false);
    else setNextDisabled(true);
  }, [generalData?.name]);

  return (
    <>
      {/* DADOS GERAIS */}
      <FlexColumnBorder title="DADOS GERAIS" open={true} theme={'#07B811'}>
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
              if (input.key === 'observations') {
                return (
                  <TextField
                    key={input.key}
                    variant="standard"
                    label={input.label}
                    value={input.value || ''}
                    sx={{ width: '100%' }}
                    multiline
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
                    value={input.value || ''}
                    required={input.required}
                    onChange={(e) => setData({ step: 0, key: input.key, value: e.target.value })}
                  />
                );
              }
            })}
          </Box>
        </Box>
      </FlexColumnBorder>

      {/* LOCAL E CAMADA */}
      <FlexColumnBorder title="LOCAL E CAMADA" open={true} theme={'#07B811'}>
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
            {locationInputs?.map((input) => {
              if (input.key === 'guideLineSpeed') {
                return (
                  <InputEndAdornment
                    adornment={input.adornment || ''}
                    type={input.type || 'text'}
                    key={input.key}
                    value={generalData?.guideLineSpeed?.toString() || ''}
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
                    value={input.value || ''}
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