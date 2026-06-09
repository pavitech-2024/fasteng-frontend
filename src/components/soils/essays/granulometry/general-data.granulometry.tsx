import { Box, TextField, Typography } from '@mui/material';
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
        try {
          // 🔥 A resposta REAL (vista no console) é SoilSample[]
          // Mas o TypeScript acha que é { materials: SoilSample[] }[]
          // Vamos tratar a resposta como "unknown" primeiro e depois verificar
          const response: unknown = await granulometry.getSamplesByUserId(user._id);
          
          console.log('📦 Resposta da API (Granulometria):', response);
          
          let samplesList: SoilSample[] = [];
          
          // 🔥 Verifica o formato real da resposta
          if (Array.isArray(response)) {
            // É um array
            if (response.length === 0) {
              samplesList = [];
            }
            // Verifica se o primeiro item tem 'name' (é SoilSample direto)
            else if ('name' in response[0] && 'type' in response[0]) {
              console.log('✅ Array direto de SoilSample');
              samplesList = response as SoilSample[];
            }
            // Verifica se o primeiro item tem 'materials'
            else if ('materials' in response[0] && Array.isArray(response[0].materials)) {
              console.log('✅ Array com objeto materials');
              samplesList = response[0].materials as SoilSample[];
            }
            else {
              console.warn('⚠️ Array com formato desconhecido:', response[0]);
              samplesList = [];
            }
          } else if (typeof response === 'object' && response !== null && 'materials' in response) {
            // É um objeto com materials
            const materials = (response as any).materials;
            if (Array.isArray(materials)) {
              console.log('✅ Objeto com materials');
              samplesList = materials;
            }
          }
          
          console.log('✅ Lista final de amostras:', samplesList.length);
          setSamples(samplesList);
          setLoading(false);
        } catch (error) {
          console.error('❌ Erro ao buscar amostras:', error);
          setSamples([]);
          setLoading(false);
          throw error;
        }
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
    { label: t('soils.experimentName'), value: generalData.name, key: 'name', required: true },
    { label: t('soils.samples'), value: generalData.sample, key: 'sample', required: true },
    { label: t('soils.operator'), value: generalData.operator, key: 'operator', required: false },
    { label: t('soils.calculist'), value: generalData.calculist, key: 'calculist', required: false },
    { label: t('samples.comments'), value: generalData.description, key: 'description', required: false },
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
          Verifique o console (F12) para mais detalhes sobre o erro.
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
          if (['name', 'operator', 'calculist'].includes(input.key)) {
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
            const selectedSample = generalData.sample
              ? samples.find((s) => s._id === generalData.sample._id)
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

export default SoilsGranulometry_GeneralData;