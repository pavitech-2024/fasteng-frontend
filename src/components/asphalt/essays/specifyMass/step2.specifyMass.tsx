import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useSpecifyMassStore from '@/stores/asphalt/specifyMass/specifyMass.store';
import { Box } from '@mui/material';
import { t } from 'i18next';

const SpecifyMass_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { step2Data: data, setData } = useSpecifyMassStore();

  if (nextDisabled && data.dry_mass != null && data.submerged_mass != null && data.surface_saturated_mass != null)
    setNextDisabled(false);

  return (
    <Box>
      <Box
        key={'top'}
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' },
          gap: '10px',
          mt: '20px',
        }}
      >
        <InputEndAdornment
          label={t('specifyMass.dry_mass')}
          value={data.dry_mass}
          onChange={(e) => {
            if (e.target.value === null) return;
            setData({ step: 1, key: 'dry_mass', value: Number(e.target.value) });
          }}
          adornment={'g'}
          type="number"
          inputProps={{ min: 0 }}
          required
        />
        <InputEndAdornment
          label={t('specifyMass.submerged_mass')}
          value={data.submerged_mass}
          onChange={(e) => {
            if (e.target.value === null) return;
            setData({ step: 1, key: 'submerged_mass', value: Number(e.target.value) });
          }}
          adornment={'g'}
          type="number"
          inputProps={{ min: 0 }}
          required
        />
        <InputEndAdornment
          label={t('specifyMass.surface_saturated_mass')}
          value={data.surface_saturated_mass}
          onChange={(e) => {
            if (e.target.value === null) return;
            setData({ step: 1, key: 'surface_saturated_mass', value: Number(e.target.value) });
          }}
          adornment={'g'}
          type="number"
          inputProps={{ min: 0 }}
          required
        />
      </Box>
    </Box>
  );
};

export default SpecifyMass_Step2;
