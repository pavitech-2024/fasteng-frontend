import { Box, TextField } from '@mui/material';
import { t } from 'i18next';
import DropDown from '@/components/atoms/inputs/dropDown';
import Granulometry_SERVICE from '@/services/soils/essays/granulometry/granulometry.service';
import Loading from '@/components/molecules/loading';
import { Sample } from '@/interfaces/soils';
import { useEffect, useState } from 'react';
import useAuth from '@/contexts/auth';
import useGranulometryStore from '@/stores/soils/granulometry/granulometry.store';
import { toast } from 'react-toastify';
import { EssayPageProps } from '@/components/templates/essay';

const Granulometry_GeneralData = ({ nextDisabled, setNextDisabled, granulometry }: EssayPageProps & { granulometry: Granulometry_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [samples, setSamples] = useState<Sample[]>([]);
  const { user } = useAuth();
  const { generalData, setData } = useGranulometryStore();

  useEffect(() => {
    toast.promise(
      async () => {
        const samples = await granulometry.getSamplesByUserId(user._id);

        setSamples(samples);
        setLoading(false);
      },
      {
        pending: t('loading.samples.pending'),
        success: t('loading.samples.success'),
        error: t('loading.samples.error'),
      }
    );
    // se não deixar o array vazio ele vai ficar fazendo requisições infinitas
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inputs = [
    { label: t('cbr.experimentName'), value: generalData.name, key: 'name', required: true },
    { label: t('cbr.samples'), value: generalData.sample, key: 'sample', required: true },
    { label: t('cbr.operator'), value: generalData.operator, key: 'operator', required: false },
    { label: t('cbr.calculist'), value: generalData.calculist, key: 'calculist', required: false },
    { label: t('samples.comments'), value: generalData.description, key: 'description', required: false },
  ];

  // verificar se todos os required estão preenchidos, se sim setNextDisabled(false)
  inputs.every(({ required, value }) => {
    if (!required) return true;

    if (value === null) return false;

    if (typeof value === 'string' && value.trim() === '') return false;

    return true;
  }) &&
    nextDisabled &&
    setNextDisabled(false);

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
              if (['name', 'operator', 'calculist'].includes(input.key)) {
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

                // se existir uma sample no store, seta ela como default
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

export default Granulometry_GeneralData;
