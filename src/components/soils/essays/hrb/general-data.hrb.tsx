import React, { useState, useEffect } from 'react';
import { EssayPageProps } from '../../../templates/essay';
import HRB_SERVICE from '../../../../services/soils/essays/hrb/hrb.service';
import useAuth from '../../../../contexts/auth';
import { t } from 'i18next';
import { toast } from 'react-toastify';
import useHrbStore from '../../../../stores/soils/hrb/hrb.store';
import { SoilSample } from '../../../../interfaces/soils';
import Loading from '../../../molecules/loading';
import { Box, Dialog, TextField, Typography } from '@mui/material';
import DropDown from '../../../atoms/inputs/dropDown';
import Image from 'next/image';
import { HrbTableImage } from '../../../../assets';

const HRB_GeneralData = ({ nextDisabled, setNextDisabled, hrb }: EssayPageProps & { hrb: HRB_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [samples, setSamples] = useState<SoilSample[]>([]);
  const { user } = useAuth();
  const { generalData, setData } = useHrbStore();

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          const response = await hrb.getSamplesByUserId(user._id);
          
          console.log('📦 Resposta da API (HRB):', response); // Debug
          
          // 🔥 Lógica flexível para extrair o array de SoilSample[]
          let samplesList: SoilSample[] = [];
          
          if (!response) {
            console.warn('⚠️ Resposta vazia');
            samplesList = [];
          } else if (Array.isArray(response)) {
            // Se for array
            if (response.length > 0) {
              // Verifica se o primeiro item tem 'materials'
              if (response[0]?.materials && Array.isArray(response[0].materials)) {
                samplesList = response[0].materials;
              } else {
                // É um array direto de SoilSample
                samplesList = response;
              }
            }
          } else if (typeof response === 'object' && 'materials' in response) {
            // Se for um objeto com propriedade materials
            const materials = (response as any).materials;
            if (Array.isArray(materials)) {
              samplesList = materials;
            }
          }
          
          console.log('✅ Lista de amostras (HRB):', samplesList); // Debug
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

  // verificar se todos os required estão preenchidos
  const allRequiredFilled = inputs.every(({ required, value }) => {
    if (!required) return true;
    if (value === null || value === undefined) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    return true;
  });

  if (allRequiredFilled && nextDisabled) {
    setNextDisabled(false);
  }

  // Se ainda está carregando
  if (loading) {
    return <Loading />;
  }

  // Se não há amostras disponíveis
  if (samples.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Nenhuma amostra disponível
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Certifique-se de que existem amostras cadastradas para este usuário.
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
            // Encontra a amostra selecionada na store (se houver)
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
                options={samples.map((sample: SoilSample) => {
                  return { label: sample.name + ' | ' + t(`samples.${sample.type}`), value: sample };
                })}
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

      <Image
        src={HrbTableImage}
        alt="hrb-table"
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: '100%', height: 'auto', marginTop: '20px' }}
        onClick={() => setOpen(true)}
      />
      
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Image
          src={HrbTableImage}
          alt="hrb-table"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: '100%', height: 'auto', marginTop: '20px' }}
        />
      </Dialog>
    </Box>
  );
};

export default HRB_GeneralData;