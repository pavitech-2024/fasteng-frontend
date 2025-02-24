import DropDown from '@/components/atoms/inputs/dropDown';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useRtcdStore from '@/stores/asphalt/rtcd/rtcd.store';
import { Box } from '@mui/material';
import { t } from 'i18next';

const Rtcd_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { rtcdStep2: data, setData } = useRtcdStore();

  const inputs = [
    {
      key: 'sampleOrigin',
      label: t('asphalt.rtcd.sample-origin'),
      value: data.sampleOrigin,
      required: false,
    },
    {
      key: 'pressSpecification',
      label: t('asphalt.rtcd.press-specification'),
      value: data.pressSpecification,
      required: false,
    },
    {
      key: 'pressConstant',
      label: t('asphalt.rtcd.press-constant'),
      value: data.pressConstant,
      required: true,
    },
    {
      key: 'sampleVoidVolume',
      label: t('asphalt.rtcd.sample-void-volume'),
      value: data.sampleVoidVolume,
      required: false,
    },
  ];

  if (nextDisabled) {
    const hasEmptyValues =
      data.pressConstant && data.pressSpecification && data.sampleOrigin && data.sampleVoidVolume !== null;
    if (hasEmptyValues) setNextDisabled(false);
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
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
        {inputs.map((input) => (
          <Box
            key={input.key}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '40px',
            }}
          >
            <InputEndAdornment
              variant="standard"
              fullWidth
              type="text"
              key={input.key}
              label={input.label}
              value={input.value}
              onChange={(e) => {
                const inputValue = e.target.value;

                const isNumeric = !isNaN(parseFloat(inputValue)) && inputValue !== '';
                // Adicione exceções para 'sampleOrigin' e 'pressSpecification'
                const isSpecialField = input.key === 'sampleOrigin' || input.key === 'pressSpecification';

                let formattedValue = inputValue;

                if (isNumeric) {
                  formattedValue = Number(inputValue).toString();
                } else if (isSpecialField) {
                  // Se for um campo especial e não for numérico, mantenha o valor original
                  formattedValue = inputValue;
                } else {
                  // Se não for numérico e não é um campo especial, defina o valor como vazio ('')
                  formattedValue = '';
                }

                setData({ step: 1, key: input.key, value: formattedValue });
              }}
              adornment={input.key === 'sampleVoidVolume' ? '%' : ''}
            />
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          width: '49%',
          alignItems: 'flex-start',
          justifyContent: 'flex-start', // Adicione esta linha
        }}
      >
        <DropDown
          label={'Faixa do DNIT'}
          variant="standard"
          size="medium"
          sx={{
            width: '100%',
            display: 'flex',
            marginX: 'auto',
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

export default Rtcd_Step2;
