import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useConcreteRcStore from '@/stores/concrete/concreteRc/concreteRc.store';
import { Box, TextField, Typography } from '@mui/material';
import { t } from 'i18next';

const ConcreteRc_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { step2Data: data, setData } = useConcreteRcStore();

  const materialInputs = [
    {
      key: 'diammeter1',
      placeholder: t('concrete.essays.diammeter-1-label'),
      value: data.diammeter1,
      adornment: 'cm',
      type: 'number',
      label: t('concrete.essays.diammeter-1'),
    },
    {
      key: 'diammeter2',
      placeholder: t('concrete.essays.diammeter-2-label'),
      value: data.diammeter2,
      adornment: 'cm',
      type: 'number',
      label: t('concrete.essays.diammeter-2'),
    },
    {
      key: 'height',
      placeholder: t('concrete.essays.height-label'),
      value: data.height,
      adornment: 'cm',
      type: 'number',
      label: t('concrete.essays.height'),
    },
  ];

  if (
    nextDisabled &&
    data.diammeter1 !== null &&
    data.diammeter2 !== null &&
    !Object.values(data.age).some((value) => value === null) &&
    data.height !== null
  )
    setNextDisabled(false);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: { mobile: '1fr' },
        gap: '10px',
        mt: '20px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { mobile: 'column', notebook: 'row' },
          gap: { mobile: '2rem', notebook: '20rem' },
          width: '100%',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
          {materialInputs.map((input) => (
            <InputEndAdornment
              key={input.key}
              adornment={input.adornment}
              required
              placeholder={input.placeholder}
              label={input.label}
              type={input.type}
              value={input.value}
              onChange={(e) => {
                setData({ step: 1, key: input.key, value: Number(e.target.value) });
              }}
            />
          ))}
        </Box>

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
    </Box>
  );
};

export default ConcreteRc_Step2;
