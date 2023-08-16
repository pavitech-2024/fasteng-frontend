import { EssayPageProps } from '@/components/templates/essay';
import useSandIncreaseStore from '@/stores/concrete/sandIncrease/sandIncrease.store';
import { Box } from '@mui/material';
import { t } from 'i18next';

const SandIncrease_Step2 = ({}: // nextDisabled,
// setNextDisabled
EssayPageProps) => {
  const { unitMassDeterminationData: data, setData } = useSandIncreaseStore();
  console.log('🚀 ~ file: step2.sandIncrease.tsx:13 ~ setData:', setData);

  const inputs = [
    {
      label: t('sandIncrease.container_volume'),
      value: data.containerVolume,
      key: 'containerVolume',
      required: true,
    },
    {
      label: t('sandIncrease.container_weight'),
      value: data.containerWeight,
      key: 'containerWeight',
      required: true,
    },
  ];
  console.log('🚀 ~ file: step2.sandIncrease.tsx:29 ~ inputs:', inputs);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          display: 'flex',
          gap: '15px',
          justifyContent: { mobile: 'center', notebook: 'center' },
          flexWrap: 'wrap',
        }}
      ></Box>
    </Box>
  );
};

export default SandIncrease_Step2;
