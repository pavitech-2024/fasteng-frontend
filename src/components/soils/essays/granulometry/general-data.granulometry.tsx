import { Box, TextField } from '@mui/material';
import { t } from 'i18next';
import DropDown from '@/components/atoms/inputs/dropDown';
import SoilsGranulometry_SERVICE from '@/services/soils/essays/granulometry/granulometry.service';
import Loading from '@/components/molecules/loading';
import { SoilSample } from '@/interfaces/soils';
import { useEffect, useState } from 'react';
import useAuth from '@/contexts/auth';
import useSoilsGranulometryStore from '@/stores/soils/granulometry/granulometry.store';
import { toast } from 'react-toastify';
import { EssayPageProps } from '@/components/templates/essay';

const SoilsGranulometry_GeneralData = ({
  nextDisabled,
  setNextDisabled,
  granulometry,
}: EssayPageProps & { granulometry: SoilsGranulometry_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [samples, setSamples] = useState<SoilSample[]>([]);
  const { user } = useAuth();
  const { generalData, setData } = useSoilsGranulometryStore();

  useEffect(() => {
    toast.promise(
      async () => {
        const samples = await granulometry.getSamplesByUserId(user._id);

        setSamples(samples[0].materials);
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
    { label: t('soils.experimentName'), value: generalData.name, key: 'name', required: true },
    { label: t('soils.samples'), value: generalData.sample, key: 'sample', required: true },
    { label: t('soils.operator'), value: generalData.operator, key: 'operator', required: false },
    { label: t('soils.calculist'), value: generalData.calculist, key: 'calculist', required: false },
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
                    options={samples.map((sample: SoilSample) => {
                      return { label: sample.name + ' | ' + t(`${'samples.' + sample.type}`), value: sample };
                    })}
                    value={defaultValue}
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

export default SoilsGranulometry_GeneralData;
