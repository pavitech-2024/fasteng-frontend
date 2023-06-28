/* eslint-disable @typescript-eslint/no-unused-vars */
import CBR_SERVICE from '@/services/soils/essays/cbr/cbr.service';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import useCbrStore from '@/stores/soils/cbr/cbr.store';
import { t } from 'i18next';
import { Box, TextField } from '@mui/material';

const CBR_Step2 = ({ nextDisabled, setNextDisabled, cbr }: EssayPageProps & { cbr: CBR_SERVICE }) => {
  const { user } = useAuth();
  const { step2Data: data, setData } = useCbrStore();

  const inputs = [
    { label: t('cbr.ringConstant'), value: data.ringConstant, key: 'ringConstante', required: true },
    { label: t('cbr.cilinderHeight'), value: data.cilinderHeight, key: 'cilinderHeight', required: true },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box>
        {inputs.map((input) => (
          <TextField
            variant="standard"
            key={input.key}
            label={input.label}
            value={input.value}
            required={input.required}
            onChange={(e) => setData({ step: 1, key: input.key, value: e.target.value })}
          />
        ))}
      </Box>
    </Box>
  );
};

export default CBR_Step2;