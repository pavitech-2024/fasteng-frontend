
import { EssayPageProps } from '@/components/templates/essay';
import UNITMASS_SERVICE from '@/services/concrete/essays/unitMass/unitMass.service';
import useUnitMassStore from '@/stores/concrete/unitMass/unitMass.store';
import { Box, TextField } from '@mui/material';
import { t } from 'i18next';

const UnitMass_GeneralData = ({
  // nextDisabled,
  // setNextDisabled,
  // unitMass,
}: EssayPageProps & { unitMass: UNITMASS_SERVICE }) => {
  const { generalData, setData } = useUnitMassStore();

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
            gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr' },
            gap: '5px 20px',
          }}
        >
          <TextField
            variant="standard"
            key="experimentName"
            label={t('unitMass.experimentName')}
            value={generalData.experimentName}
            required
            onChange={(e) => setData({ step: 0, key: 'experimentName', value: e.target.value })}
          />
        </Box>
      </Box>
    </>
  );
};

export default UnitMass_GeneralData;
