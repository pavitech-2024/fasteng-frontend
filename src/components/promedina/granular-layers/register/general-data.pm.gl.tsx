import { EssayPageProps } from '../../../templates/essay';
import { t } from 'i18next';
import { Box, TextField } from '@mui/material';
import useGranularLayersStore from '@/stores/promedina/granular-layers/granular-layers.store';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { useEffect } from 'react';

const GranularLayers_step1 = ({ setNextDisabled }: EssayPageProps) => {
  const { generalData, setData } = useGranularLayersStore();
  console.log("🚀 ~ generalData:", generalData)

  const inputs = [
    { label: t('pm.granularLayer.name'), value: generalData.name, key: 'name', required: true },
    { label: t('pm.granularLayer.zone'), value: generalData.zone, key: 'zone', required: true },
    { label: t('pm.granularLayer.highway'), value: generalData.highway, key: 'highway', required: true },
    { label: t('pm.granularLayer.layer'), value: generalData.layer, key: 'layer', required: true },
    { label: t('pm.granularLayer.cityState'), value: generalData.cityState, key: 'cityState', required: true },
    {
      label: t('pm.granularLayer.guideLineSpeed'),
      value: generalData.guideLineSpeed,
      key: 'guideLineSpeed',
      required: true,
    },
    {
      label: t('pm.granularLayer.observations'),
      value: generalData.observations,
      key: 'observations',
      required: false,
    },
  ];

  // useEffect(async () => {
  //   const result  = await samplesService.getSample();
  // },[]);

  useEffect(() => {
    if (generalData?.name !== null && generalData?.name !== '') setNextDisabled(false);
    else setNextDisabled(true);
  }, [generalData.name]);

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
              display: 'grid',
              width: '100%',
              gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr' },
              gap: '5px 20px',
              marginBottom: '10px',
              marginTop: '-20px',
            }}
          >
            {inputs.map((input) => {
              if (input.key === 'guideLineSpeed') {
                return (
                  <InputEndAdornment
                    adornment={'km/h'}
                    type="number"
                    variant="standard"
                    key={input.key}
                    value={generalData.guideLineSpeed?.toString()}
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

export default GranularLayers_step1;
