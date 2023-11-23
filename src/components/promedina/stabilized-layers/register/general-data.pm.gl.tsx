import { EssayPageProps } from '../../../templates/essay';
import { t } from 'i18next';
import { Box, TextField } from '@mui/material';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import useStabilizedLayersStore from '@/stores/promedina/stabilized-layers/stabilized-layers.store';

const StabilizedLayers_step1 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { generalData, setData } = useStabilizedLayersStore();
  
  const inputs = [
    { label: t('pm.granularLayer.name'), value: generalData.name, key: 'name', required: true },
    { label: t('pm.granularLayer.zone'), value: generalData.zone, key: 'zone', required: true },
    { label: t('pm.granularLayer.highway'), value: generalData.highway, key: 'highway', required: true },
    { label: t('pm.granularLayer.layer'), value: generalData.layer, key: 'layer', required: true },
    { label: t('pm.granularLayer.cityState'), value: generalData.cityState, key: 'cityState', required: true },
    {
      label: t('pm.granularLayer.observations'),
      value: generalData.observations,
      key: 'observations',
      required: false,
    },
  ];

  inputs.every(({ required, value }) => {
    if (!required) return true;

    if (value === null) return false;

    if (typeof value === 'string' && value.trim() === '') return false;

    return true;
  }) &&
    nextDisabled &&
    setNextDisabled(false);

  // useEffect(() => nextDisabled && setNextDisabled(false), [nextDisabled, setNextDisabled]);

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

export default StabilizedLayers_step1;
