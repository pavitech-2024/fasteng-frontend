import { EssayPageProps } from '@/components/templates/essay';
import CONCRETE_RT_SERVICE from '@/services/concrete/essays/concreteRt/concreteRt.service';
import useConcreteRtStore from '@/stores/concrete/concreteRt/concreteRt.store';
import { Box, TextField } from '@mui/material';
import { t } from 'i18next';

const ConcreteRt_GeneralData = ({
  nextDisabled,
  setNextDisabled,
}: EssayPageProps & { concreteRT: CONCRETE_RT_SERVICE }) => {
  const { generalData, setData } = useConcreteRtStore();

  const inputs = [
    { label: t('concrete.experimentName'), value: generalData.name, key: 'name', required: true },
    { label: t('concrete.operator'), value: generalData.operator, key: 'operator', required: false },
    { label: t('concrete.calculist'), value: generalData.calculist, key: 'calculist', required: false },
    { label: t('concrete.comments'), value: generalData.description, key: 'description', required: false },
  ];

  // verificar se todos os required estão preenchidos, se sim setNextDisabled(false)
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
            if (['name', 'operator', 'calculist'].includes(input.key)) {
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

export default ConcreteRt_GeneralData;
