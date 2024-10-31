import DropDown from '@/components/atoms/inputs/dropDown';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import { SieveSeries } from '@/interfaces/common';
import useConcreteRtStore from '@/stores/concrete/concreteRt/concreteRt.store';
import { getSieveSeries } from '@/utils/sieves';
import { Box, TextField, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';

const ConcreteRt_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { step2Data: data, setData } = useConcreteRtStore();

  if (
    nextDisabled &&
    !Object.values(data.age).some((value) => value === null)
  )
    setNextDisabled(false);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Typography>{t('concrete.essays.age')}</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
          <Box>
            <TextField
              label={t('concrete.essays.hours')}
              type="number"
              required
              value={data.age.hours}
              onChange={(e) => {
                const newData = { ...data };
                newData.age.hours = Number(e.target.value);
                setData({ step: 1, value: { ...data, value: newData } });
              }}
              variant="outlined"
              size="medium"
              sx={{ width: '7rem' }}
            />
          </Box>

          <Box>
            <TextField
              label={t('concrete.essays.minutes')}
              type="number"
              value={data.age.minutes}
              onChange={(e) => {
                const newData = { ...data };
                newData.age.minutes = Number(e.target.value);
                setData({ step: 1, value: { ...data, value: newData } });
              }}
              variant="outlined"
              size="medium"
              sx={{ width: '7rem' }}
            />
          </Box>
        </Box>

        <Typography>{t('concrete.essays.used-tolerance')}</Typography>

        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
          <Box>
            <TextField
              label={t('concrete.essays.hours')}
              type="number"
              value={data.tolerance.hours}
              onChange={(e) => {
                const newData = { ...data };
                newData.tolerance.hours = Number(e.target.value);
                setData({ step: 1, value: { ...data, value: newData } });
              }}
              variant="outlined"
              size="medium"
              sx={{ width: '7rem' }}
            />
          </Box>

          <Box>
            <TextField
              label={t('concrete.essays.minutes')}
              type="number"
              value={data.tolerance.minutes}
              onChange={(e) => {
                const newData = { ...data };
                newData.tolerance.minutes = Number(e.target.value);
                setData({ step: 1, value: { ...data, value: newData } });
              }}
              variant="outlined"
              size="medium"
              sx={{ width: '7rem' }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ConcreteRt_Step2;
