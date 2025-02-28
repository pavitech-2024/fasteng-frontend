import DropDown from '@/components/atoms/inputs/dropDown';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useDduiStore from '@/stores/asphalt/ddui/ddui.store';
import { Box } from '@mui/material';
import { t } from 'i18next';

const Ddui_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { dduiStep2: data, setData } = useDduiStore();

  const inputs = [
    {
      key: 'sampleOrigin',
      label: t('asphalt.ddui.sample-origin'),
      value: data.sampleOrigin,
      type: 'text',
    },
    {
      key: 'pressSpecification',
      label: t('asphalt.ddui.press-specification'),
      value: data.pressSpecification,
      type: 'number',
    },
    {
      key: 'pressConstant',
      label: t('asphalt.ddui.press-constant'),
      value: data.pressConstant,
      type: 'number',
    },
    {
      key: 'sampleVoidVolume',
      label: t('asphalt.ddui.sample-void-volume'),
      value: data.sampleVoidVolume,
      type: 'number',
    },
    {
      key: 'minRrt',
      label: t('asphalt.ddui.minRrt'),
      value: data.minRrt,
      type: 'number',
    },
  ];

  if (nextDisabled) {
    const hasEmptyValues =
      data.dnitRange &&
      data.pressConstant &&
      data.pressSpecification &&
      data.sampleOrigin &&
      data.minRrt &&
      data.sampleVoidVolume !== null;
    if (hasEmptyValues) setNextDisabled(false);
  }

  return (
    <Box sx={{ width: '100%', marginX: 'auto' }}>
      {inputs.map((input) => (
        <Box
          key={input.key}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: { mobile: '100%', notebook: '50%' },
            marginX: 'auto',
            gap: '5px 20px',
            alignItems: 'center',
          }}
        >
          <InputEndAdornment
            variant="standard"
            fullWidth
            type={input.type}
            key={input.key}
            label={input.label}
            value={input.value}
            onChange={(e) => {
              const formattedValue = input.key !== 'sampleOrigin' ? Number(e.target.value) : e.target.value;
              setData({ step: 1, key: input.key, value: formattedValue });
            }}
            adornment={input.key === 'sampleVoidVolume' ? '%' : ''}
          />
        </Box>
      ))}

      <Box
        sx={{
          width: '100%',
        }}
      >
        <DropDown
          label={t('asphalt.ddui.DNIT')}
          variant="standard"
          size="medium"
          sx={{
            display: 'flex',
            marginX: 'auto',
            width: { mobile: '100%', notebook: '50%' },
          }}
          options={[
            { value: 'A', label: 'A' },
            { value: 'B', label: 'B' },
            { value: 'C', label: 'C' },
            { value: 'D', label: 'D' },
            { value: 'E', label: 'E' },
          ]}
          callback={(value) => setData({ step: 1, key: 'dnitRange', value })}
        />
      </Box>
    </Box>
  );
};

export default Ddui_Step2;
