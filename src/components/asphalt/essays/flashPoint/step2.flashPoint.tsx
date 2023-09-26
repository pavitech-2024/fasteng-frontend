import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useFlashPointStore from '@/stores/asphalt/flashPoint/flashPoint.store';
import { Box } from '@mui/material';
import { t } from 'i18next';

const FlashPoint_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { step2Data: data, setData } = useFlashPointStore();

  if (nextDisabled && data.ignition_temperature)
    setNextDisabled(false);

  return (
    <Box>
      <Box
        key={'top'}
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' },
          gap: '10px',
          mt: '20px',
        }}
      >
        <InputEndAdornment
          label={t('flashPoint.ignition_temperature')}
          value={data.ignition_temperature}
          onChange={(e) => {
            if (e.target.value === null) return;
            setData({ step: 1, key: 'ignition_temperature', value: e.target.value });
          }}
          adornment={'°C'}
          type="number"
          inputProps={{ min: 0 }}
          required
        />
      </Box>
    </Box>
  );
};

export default FlashPoint_Step2;
