import { Box } from '@mui/material';
import { EssayPageProps } from '../../../templates/essay';
import { t } from 'i18next';
import useChapmanStore from '@/stores/concrete/chapman/chapman.store';
import InputEndAdornment from '../../../atoms/inputs/input-endAdornment';

const CHAPMAN_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { step2Data: data, setData } = useChapmanStore();

  const inputs = [
    {
      label: t('chapman.displaced_volume'),
      adornment: 'L',
      key: 'displaced_volume',
      value: data.displaced_volume,
      required: true,
    },
  ];

  // verificar se todos os required estão preenchidos, se sim setNextDisabled(false)
  inputs.every(({ required, value }) => {
    if (!required) return true;

    if (value === null) return false;

    return true;
  }) &&
    nextDisabled &&
    setNextDisabled(false);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {inputs.map((input) => (
        <InputEndAdornment
          sx={{ maxWidth: '300px', width: { mobile: '100%', notebook: '300px' } }}
          adornment={input.adornment || ''}
          variant="standard"
          key={input.key}
          label={input.label}
          value={input.value}
          required={input.required}
          onChange={(e) => setData({ step: 1, key: input.key, value: e.target.value })}
        />
      ))}
    </Box>
  );
};

export default CHAPMAN_Step2;
