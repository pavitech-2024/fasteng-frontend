import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import UNITMASS_SERVICE from '@/services/concrete/essays/unitMass/unitMass.service';
import useUnitMassStore from '@/stores/concrete/unitMass/unitMass.store';
import { Box, TextField } from '@mui/material';
import { t } from 'i18next';
import { useEffect } from 'react';

const UnitMass_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps & { unitMass: UNITMASS_SERVICE }) => {
  const { step2Data, setData } = useUnitMassStore();

  const inputs = [
    {
      key: 'containerVolume',
      label: t('unitMass.containerVolume'),
      value: step2Data.containerVolume,
      adornment: 'l',
    },
    {
      key: 'containerWeight',
      label: t('unitMass.containerWeight'),
      value: step2Data.containerWeight,
      adornment: 'Kg',
    },
    {
      key: 'sampleContainerWeight',
      label: t('unitMass.sampleContainerWeight'),
      value: step2Data.sampleContainerWeight,
      adornment: 'Kg',
    },
  ];

  useEffect(() => {
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
        {inputs.map((input) => (
          <InputEndAdornment
            key={input.key}
            label={input.label}
            value={input.value}
            onChange={(e) => setData({ step: 1, key: input.key, value: Number(e.target.value) })}
            type="number"
            adornment={input.adornment}
            sx={{ marginY: '10px' }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default UnitMass_Step2;
