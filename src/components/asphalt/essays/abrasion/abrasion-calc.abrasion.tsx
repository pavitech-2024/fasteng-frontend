import DropDown from '@/components/atoms/inputs/dropDown';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useAbrasionStore from '@/stores/asphalt/abrasion.store';
import { Box } from '@mui/material';
import { t } from 'i18next';

const Abrasion_Calc = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { abrasionCalc: data, setData } = useAbrasionStore();

  if (nextDisabled) {
    if (data.initialMass && data.finalMass !== null) {
      setNextDisabled(false);
    }
  }

  const inputs = [
    {
      key: 'initialMass',
      adornment: 'g',
      value: data.initialMass,
      label: t('asphalt.essays.abrasion.initial-mass'),
    },
    {
      key: 'finalMass',
      adornment: 'g',
      value: data.finalMass,
      label: t('asphalt.essays.abrasion.final-mass'),
    },
  ];

  const graduations = ['A', 'B', 'C', 'D', 'E'];

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginX: 'auto',
        marginY: '20px',
        gap: '15px',
      }}
    >
      <DropDown
        sx={{
          width: '25%',
          display: 'flex',
        }}
        variant="standard"
        size="medium"
        label={t('asphalt.essays.abrasion.graduation')}
        options={graduations.map((grad) => ({ label: grad, value: grad }))}
        callback={(value) => {
          setData({ step: 1, key: 'graduation', value });
        }}
        required
      />

      {inputs.map((item) => (
        <Box
          key={item.key}
          sx={{
            width: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginX: 'auto',
            marginY: '10px',
            gap: '15px',
          }}
        >
          <InputEndAdornment
            fullWidth
            label={item.label}
            type="number"
            required
            inputProps={{ min: 0 }}
            adornment={'g'}
            value={item.value}
            onChange={(e) => {
              setData({ step: 1, key: item.key, value: e.target.value });
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default Abrasion_Calc;
