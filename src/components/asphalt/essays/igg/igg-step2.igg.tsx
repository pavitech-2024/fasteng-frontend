import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useIggStore from '@/stores/asphalt/igg/igg.store';
import { Box } from '@mui/material';
import { t } from 'i18next';
import { useEffect } from 'react';

const Igg_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { iggStep2: data, setData } = useIggStore();

  const inputs = [
    {
      key: 'work',
      label: t('asphalt.igg.work'),
      value: data.work,
      type: 'text',
    },
    {
      key: 'section',
      label: t('asphalt.igg.section'),
      value: data.section,
      type: 'text',
    },
    {
      key: 'initialStake',
      label: t('asphalt.igg.initial-stake'),
      value: data.initialStake,
      type: 'number',
    },
    {
      key: 'initialSide',
      label: t('asphalt.igg.initial-side'),
      value: data.initialSide,
      type: 'text',
    },
    {
      key: 'finalStake',
      label: t('asphalt.igg.final-stake'),
      value: data.finalStake,
      type: 'number',
    },
    {
      key: 'finalSide',
      label: t('asphalt.igg.final-side'),
      value: data.finalSide,
      type: 'text',
    },
  ];

  useEffect(() => {
    if (nextDisabled) {
      const hasEmptyValues =
        data.work &&
        data.section &&
        data.initialStake &&
        data.initialSide &&
        data.finalStake &&
        data.finalSide !== null;
      if (hasEmptyValues) setNextDisabled(false);
    }
  }, [nextDisabled, setNextDisabled, data]);

  return (
    <Box sx={{ width: '100%', marginX: 'auto', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
      {inputs.map((input, index) => (
        <InputEndAdornment
          key={input.key}
          variant="standard"
          fullWidth
          type={input.type}
          label={input.label}
          value={input.value}
          onChange={(e) => {
            const formattedValue = e.target.value;
            setData({ step: 1, key: input.key, value: formattedValue });
          }}
          adornment={''}
          sx={{ gridColumn: index % 3 === 0 ? '1' : '2' }}
        />
      ))}
    </Box>
  );
};

export default Igg_Step2;
