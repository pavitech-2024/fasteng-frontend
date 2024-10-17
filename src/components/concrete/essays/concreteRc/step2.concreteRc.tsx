import DropDown from '@/components/atoms/inputs/dropDown';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import { SieveSeries } from '@/interfaces/common';
import useConcreteRcStore from '@/stores/concrete/concreteRc/concreteRc.store';
import { getSieveSeries } from '@/utils/sieves';
import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect, useState } from 'react';

const ConcreteRc_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { step2Data: data, setData } = useConcreteRcStore();

  const [ageInput, setAgeInput] = useState(data.age);
  const [toleranceInput, setToleranceInput] = useState(data.tolerance);

  const [timeInutsValues, setTimeInputsValues] = useState({
    age: data.age,
    tolerance: data.tolerance,
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

  const timeInputs = [
    {
      key: 'age',
      placeholder: 'Inserir a idade do corpo de prova',
      value: timeInutsValues.age,
      adornment: 'hr',
      type: 'time',
      label: 'Idade do corpo de prova',
    },
    {
      key: 'tolerance',
      placeholder: 'Inserir a tolerância utilizada',
      value: timeInutsValues.tolerance,
      adornment: 'hr',
      type: 'time',
      label: 'Tolerância utilizada',
    },
  ];

  const handleTimeInputs = (e: any, key: string) => {
    const timeString = e.target.value;
    const [hours, minutes] = timeString.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;

    setTimeInputsValues({
      ...timeInutsValues,
      [key]: e.target.value,
    });

    setData({ step: 1, key, value: totalMinutes });
  };

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

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
          {timeInputs.map((input) => (
            <InputEndAdornment
              key={input.key}
              adornment={input.adornment}
              placeholder={input.placeholder}
              label={input.label}
              type={input.type}
              value={input.value}
              onChange={(e) => {
                handleTimeInputs(e, input.key);
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ConcreteRc_Step2;
