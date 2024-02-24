import { t } from 'i18next';
import { EssayPageProps } from '@/components/templates/essay';
import { Box, TextField } from '@mui/material';
import useABCPStore from '@/stores/concrete/abcp/abcp.store';
import { useEffect } from 'react';

const ABCP_GeneralData = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {

  const { generalData, storedData, setData } = useABCPStore();
  const data = storedData?.generalData ? storedData?.generalData : generalData;

  useEffect(() => {
    if (storedData?.generalData) {
      const generalDataWithoutStep = { ...storedData?.generalData, step: 0}
      setData({ step: 0, value: generalDataWithoutStep })
    } 
  },[storedData])

  const inputs = [
    { 
      label: t('experiment-name'), 
      value: data.name, 
      key: 'name', 
      required: true 
    },
    { 
      label: t('laboratory'), 
      value: data.laboratory, 
      key: 'laboratory', 
      required: false },
    { 
      label: t('operator'), 
      value: data.operator, 
      key: 'operator', 
      required: false 
    },
    { 
      label: t('calculist'), 
      value: data.calculist, 
      key: 'calculist', 
      required: false 
    },
    { 
      label: t('samples.comments'), 
      value: data.description, 
      key: 'description', 
      required: false 
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
  return (
    <>
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
          }}
        >
          {inputs.map((input) => {
            if (['name', 'laboratory', 'operator', 'calculist'].includes(input.key)) {
              return (
                <TextField
                  variant="standard"
                  key={input.key}
                  label={input.label}
                  value={input.value}
                  required={input.required}
                  onChange={(e) => setData({ step: 0, key: input.key, value: e.target.value })}
                />
              );
            }
          })}
        </Box>
        <TextField
          variant="standard"
          fullWidth
          key={inputs[inputs.length - 1].key}
          label={inputs[inputs.length - 1].label}
          value={inputs[inputs.length - 1].value}
          required={inputs[inputs.length - 1].required}
          onChange={(e) => setData({ step: 0, key: inputs[inputs.length - 1].key, value: e.target.value })}
        />
      </Box>
    </>
  );
};

export default ABCP_GeneralData;
