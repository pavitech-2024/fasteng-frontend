import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import { Sample } from '@/interfaces/soils';
import COMPRESSION_SERVICE from '@/services/soils/essays/compression/compression.service';
import useCompressionStore from '@/stores/soils/compression/compression.store';
import { t } from 'i18next';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Box, TextField } from '@mui/material';
import Loading from '@/components/molecules/loading';
import DropDown from '@/components/atoms/inputs/dropDown';

const Compression_GeneralData = ({
  nextDisabled,
  setNextDisabled,
  compression,
}: EssayPageProps & { compression: COMPRESSION_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [samples, setSamples] = useState<Sample[]>([]);
  const { user } = useAuth();
  const { compressionGeneralData, setData } = useCompressionStore();
  useEffect(() => {
    toast.promise(
      async () => {
        const samples = await compression.getSamplesByUserId(user._id);

        setSamples(samples);
        setLoading(false);
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
    { label: t('Nome do Experimento'), value: compressionGeneralData.name, key: 'name', required: true },
    { label: t('Amostras'), value: compressionGeneralData.sample, key: 'sample', required: true },
    { label: t('Operador'), value: compressionGeneralData.operator, key: 'operator', required: false },
    { label: t('Calculista'), value: compressionGeneralData.cauculist, key: 'cauculist', required: false },
    { label: t('Observações'), value: compressionGeneralData.description, key: 'description', required: false },
  ];

  inputs.every(({ required, value }) => {
    if (!required) return true;

    if (value === null) return false;

    if (typeof value === 'string' && value.trim() === '') return false;

    return true;
  }) &&
    nextDisabled &&
    setNextDisabled(false);
    
    useEffect(() => console.log(compressionGeneralData), [compressionGeneralData])
    return (
      <>
        {loading ? (
          <Loading />
        ) : (
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
                      value={input.value}
                      required={input.required}
                      onChange={(e) => setData({ step: 0, key: input.key, value: e.target.value })}
                    />
                  );
                } else if (['sample'].includes(input.key)) {
                  const defaultValue = {
                    label: '',
                    value: '',
                  };
  
                  let sample;
  
                  if (input.value) {
                    sample = samples.find((sample) => sample._id == input.value['_id']);
                  }
  
                  if (sample) {
                    defaultValue.label = sample.name + ' | ' + t(`${'samples.' + sample.type}`);
                    defaultValue.value = sample;
                  }
  
                  return (
                    <DropDown
                      key={input.key}
                      variant="standard"
                      label={input.label}
                      options={samples.map((sample: Sample) => {
                        return { label: sample.name + ' | ' + t(`${'samples.' + sample.type}`), value: sample };
                      })}
                      defaultValue={defaultValue}
                      callback={(value) => setData({ step: 0, key: input.key, value })}
                      size="medium"
                      required={input.required}
                    />
                  );
                }
              })}
            </Box>
            <TextField
              variant="standard"
              fullWidth
              key={inputs[inputs.length - 1].key}
              label={inputs[inputs.length - 1].label}
              value={inputs[inputs.length - 1].value}
              required={inputs[inputs.length - 1].required}
              onChange={(e) => setData({ step: 0, key: inputs[inputs.length - 1].key, value: e.target.value })}
            />
          </Box>
        )}
      </>
    );
};

export default Compression_GeneralData;
