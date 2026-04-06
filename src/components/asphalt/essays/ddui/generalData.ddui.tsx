import { EssayPageProps } from '@/components/templates/essay';
import Ddui_SERVICE from '@/services/asphalt/essays/ddui/ddui.service';
import useDduiStore from '@/stores/asphalt/ddui/ddui.store';
import { Box, TextField } from '@mui/material';
import { t } from 'i18next';

const Ddui_GeneralData = ({ nextDisabled, setNextDisabled, ddui }: EssayPageProps & { ddui: Ddui_SERVICE }) => {
  const { generalData, setData } = useDduiStore();

  const inputs = [
    { label: t('asphalt.experimentName'), value: generalData.name, key: 'name', required: true },
    { label: t('asphalt.operator'), value: generalData.operator, key: 'operator', required: false },
    { label: t('asphalt.calculist'), value: generalData.calculist, key: 'calculist', required: false },
    { label: t('asphalt.materials.comments'), value: generalData.description, key: 'description', required: false },
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

export default Ddui_GeneralData;
