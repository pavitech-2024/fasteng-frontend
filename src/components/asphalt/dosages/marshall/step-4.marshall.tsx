import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import useMarshallStore from '@/stores/asphalt/marshall/marshall.store';
import { Box, Button } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';

const Marshall_Step4 = ({
  nextDisabled,
  setNextDisabled,
  marshall,
}: EssayPageProps & { marshall: Marshall_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { binderTrialData, granulometryCompositionData: data2, setData } = useMarshallStore();
  const { submitBinderTrialData } = marshall;

  const { user } = useAuth();

  const handleCalculate = async () => {

    const { trial } = binderTrialData;
    const { percentsOfMaterials } = data2;

    const data = {
      trial,
      percentsOfMaterials
    }

    const result = await submitBinderTrialData(data, user._id,);
    console.log("🚀 ~ handleCalculate ~ result:", result)
  }


  nextDisabled && setNextDisabled(false);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <Box key={'initial_binder'}>
            <InputEndAdornment
            label={t('marshall.initial-binder')}
            value={binderTrialData.trial}
            onChange={(e) => setData({ step: 3, key: 'trial', value: Number(e.target.value) })}
            adornment={'g'}
            type="number"
            inputProps={{ min: 0 }}
            required
          />
          <Button onClick={handleCalculate}>Calcular</Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Marshall_Step4;
