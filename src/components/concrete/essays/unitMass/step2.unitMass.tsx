/* eslint-disable @typescript-eslint/no-unused-vars */
import { EssayPageProps } from '@/components/templates/essay';
import UNITMASS_SERVICE from '@/services/concrete/essays/unitMass/unitMass.service';
import useUnitMassStore from '@/stores/concrete/unitMass/unitMass.store';
import { Box, TextField } from '@mui/material';
import { t } from 'i18next';
import { useEffect } from 'react';

const UnitMass_Step2 = ({
  nextDisabled,
  setNextDisabled,
  unitMass,
}: EssayPageProps & { unitMass: UNITMASS_SERVICE }) => {
  const { step2Data, setData } = useUnitMassStore();

  useEffect(() => {
    console.log(step2Data);
    if (
      step2Data.containerVolume !== null &&
      step2Data.containerWeight !== null &&
      step2Data.sampleContainerWeight !== null
    ) {
      nextDisabled && setNextDisabled(false);
    }
  }, [step2Data, nextDisabled, setNextDisabled]);

  return (
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
        {/** Volume do Container */}
        <TextField
          variant="standard"
          key="containerVolume"
          label={t('unitMass.containerVolume')}
          value={step2Data.containerVolume}
          required
          onChange={(e) => setData({ step: 1, key: 'containerVolume', value: e.target.value })}
          size="medium"
          type='number'
        />

        {/** Peso do Container */}
        <TextField
          variant="standard"
          key="containerWeight"
          label={t('unitMass.containerWeight')}
          value={step2Data.containerWeight}
          required
          onChange={(e) => setData({ step: 1, key: 'containerWeight', value: e.target.value })}
          size="medium"
          type='number'
        />

        {/** Peso do Container + Amostra */}
        <TextField
          variant="standard"
          key="sampleContainerWeight"
          label={t('unitMass.sampleContainerWeight')}
          value={step2Data.sampleContainerWeight}
          required
          onChange={(e) => setData({ step: 1, key: 'sampleContainerWeight', value: e.target.value })}
          size="medium"
          type='number'
        />
      </Box>
    </Box>
  );
};

export default UnitMass_Step2;
