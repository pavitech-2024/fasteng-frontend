import { EssayPageProps } from '@/components/templates/essay';
import useCoarseAggregateStore from '@/stores/concrete/coarseAggregate/coarseAggregate.store';
import { Box, TextField } from '@mui/material';
import { t } from 'i18next';

const CoarseAggregate_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { step2Data, setData } = useCoarseAggregateStore();

  const inputs = [
    {
      label: t('concrete.essays.coarseAggregate.drySampleMass'),
      value: step2Data.drySampleMass,
      key: 'drySampleMass',
      required: true,
    },
    {
      label: t('concrete.essays.coarseAggregate.saturatedSampleMass'),
      value: step2Data.saturatedSampleMass,
      key: 'saturatedSampleMass',
      required: true,
    },
    {
      label: t('concrete.essays.coarseAggregate.submergedMass'),
      value: step2Data.submergedMass,
      key: 'submergedMass',
      required: true,
    },
  ];

  inputs.every(({ required, value }) => {
    if (!required) return true;

    if (value === null) return false;

    if (value <= 0) return false;

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
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '5px 20px',
          }}
        >
          {inputs.map((input) => {
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
          })}
        </Box>
      </Box>
    </>
  );
};

export default CoarseAggregate_Step2;
