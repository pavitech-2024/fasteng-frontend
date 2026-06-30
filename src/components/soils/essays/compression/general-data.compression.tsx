import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import { SoilSample } from '@/interfaces/soils';
import COMPRESSION_SERVICE from '@/services/soils/essays/compression/compression.service';
import useCompressionStore from '@/stores/soils/compression/compression.store';
import { t } from 'i18next';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Box, TextField, Typography } from '@mui/material';
import Loading from '@/components/molecules/loading';
import DropDown from '@/components/atoms/inputs/dropDown';

const Compression_GeneralData = ({
  nextDisabled,
  setNextDisabled,
  compression,
}: EssayPageProps & { compression: COMPRESSION_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [samples, setSamples] = useState<SoilSample[]>([]);
  const { user } = useAuth();
  const { compressionGeneralData, setData } = useCompressionStore();

  useEffect(() => {
    toast.promise(
      async () => {
        const samples = await compression.getSamplesByUserId(user._id);

        /*setSamples(samples[0].materials);*/
        setSamples(samples?.[0]?.materials ?? []);        setLoading(false);
      },
      {
        pending: t('loading.samples.pending'),
        success: t('loading.samples.success'),
        error: t('loading.samples.error'),
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inputs = [
    { label: t('compression.experimentName'), value: compressionGeneralData.name, key: 'name', required: true },
    { label: t('compression.samples'), value: compressionGeneralData.sample, key: 'sample', required: true },
    { label: t('compression.operator'), value: compressionGeneralData.operator, key: 'operator', required: false },
    { label: t('compression.cauculist'), value: compressionGeneralData.cauculist, key: 'cauculist', required: false },
    {
      label: t('compression.observation'),
      value: compressionGeneralData.description,
      key: 'description',
      required: false,
    },
  ];

  const allRequiredFilled = inputs.every(({ required, value }) => {
    if (!required) return true;
    if (value === null || value === undefined) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    return true;
  });

  if (allRequiredFilled && nextDisabled) {
    setNextDisabled(false);
  }

  if (loading) {
    return <Loading />;
  }

  if (samples.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Nenhuma amostra disponível
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Verifique o console (F12) para mais detalhes.
        </Typography>
      </Box>
    );
  }

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
        {inputs.map((input) => {
          if (['name', 'operator', 'cauculist'].includes(input.key)) {
            return (
              <TextField
                variant="standard"
                key={input.key}
                label={input.label}
                value={input.value || ''}
                required={input.required}
                onChange={(e) => setData({ step: 0, key: input.key, value: e.target.value })}
              />
            );
          } else if (input.key === 'sample') {
            const selectedSample = compressionGeneralData.sample
              ? samples.find((s) => s._id === compressionGeneralData.sample._id)
              : null;

            const defaultValue = selectedSample
              ? {
                  label: selectedSample.name + ' | ' + t(`samples.${selectedSample.type}`),
                  value: selectedSample,
                }
              : { label: '', value: '' };

            return (
              <DropDown
                key={input.key}
                variant="standard"
                label={input.label}
                options={samples.map((sample: SoilSample) => ({
                  label: sample.name + ' | ' + t(`samples.${sample.type}`),
                  value: sample,
                }))}
                value={defaultValue}
                callback={(value) => setData({ step: 0, key: input.key, value })}
                size="medium"
                required={input.required}
              />
            );
          }
          return null;
        })}
      </Box>
      <TextField
        variant="standard"
        fullWidth
        label={inputs[inputs.length - 1].label}
        value={inputs[inputs.length - 1].value || ''}
        required={inputs[inputs.length - 1].required}
        onChange={(e) => setData({ step: 0, key: inputs[inputs.length - 1].key, value: e.target.value })}
      />
    </Box>
  );
};

export default Compression_GeneralData;