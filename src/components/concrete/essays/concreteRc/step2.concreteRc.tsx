import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useConcreteRcStore from '@/stores/concrete/concreteRc/concreteRc.store';
import { Box, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Direction } from 'react-toastify/dist/utils';

const ConcreteRc_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { step2Data: data, setData } = useConcreteRcStore();

  const [hoursInputs, setHoursInputs] = useState({
    age: {
      hours: 0,
      minutes: 0,
    },
    tolerance: {
      hours: 0,
      minutes: 0,
    },
  });

  const materialInputs = [
    {
      key: 'diammeter1',
      placeholder: 'Inserir o diametro 1',
      value: data.diammeter1,
      adornment: 'cm',
      type: 'number',
      label: 'Diametro 1',
    },
    {
      key: 'diammeter2',
      placeholder: 'Inserir o diametro 2',
      value: data.diammeter2,
      adornment: 'cm',
      type: 'number',
      label: 'Diametro 2',
    },
    {
      key: 'height',
      placeholder: 'Inserir a altura do corpo de prova',
      value: data.height,
      adornment: 'cm',
      type: 'number',
      label: 'altura do corpo de prova',
    },
  ];

  if (
    nextDisabled &&
    data.diammeter1 !== null &&
    data.diammeter2 !== null &&
    data.age !== null &&
    data.height !== null &&
    data.tolerance !== null
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
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: '20rem', width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
          {materialInputs.map((input) => (
            <InputEndAdornment
              key={input.key}
              adornment={input.adornment}
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
          <Typography>Idade do corpo de prova</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
            <Box>
              <TextField
                label="Horas"
                type="number"
                value={data.age.hours}
                onChange={(e) => {
                  const newData = { ...data };
                  newData.age.hours = Number(e.target.value);
                  setData({ step: 1, value: { ...data, value: newData } });
                }}
                variant="outlined"
                size="medium"
                sx={{ width: '7rem' }}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <MenuItem key={i} value={i}>
                    {i}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box>
              <TextField
                label="Minutos"
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
              >
                {Array.from({ length: 60 }, (_, i) => (
                  <MenuItem key={i} value={i}>
                    {i}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>

          <Typography>Tolerância utilizada</Typography>

          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
            <Box>
              <TextField
                label="Horas"
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
                label="Minutos"
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