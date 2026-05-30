import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useSucsStore from '@/stores/soils/sucs/sucs.store';
import { Box, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import Sucs_step2Table from './tables/step2-table.sucs';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Granulometry_SERVICE from '@/services/soils/essays/granulometry/granulometry.service';
import Loading from '@/components/molecules/loading';

const SUCS_Step2 = ({
  nextDisabled,
  setNextDisabled,
  granulometry_serv,
}: EssayPageProps & { granulometry_serv: Granulometry_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const { generalData, step2Data: data, setData } = useSucsStore();

  // 🔥 CORREÇÃO 1: useEffect com array de dependências e tratamento de erro
  useEffect(() => {
    // 🔥 CORREÇÃO 2: Verificar se tem sample antes de fazer a requisição
    if (!generalData?.sample?._id) {
      console.warn('⚠️ Nenhuma amostra selecionada');
      setLoading(false);
      return;
    }

    const fetchGranulometry = async () => {
      try {
        const _id = generalData.sample._id;
        console.log('🔍 Buscando granulometria para amostra:', _id);
        
        const granulometry = await granulometry_serv.getGranulometryBySampleId(_id);

        console.log('📦 Resposta da granulometria:', granulometry);

        // 🔥 CORREÇÃO 3: Verificar se a resposta tem os dados esperados
        if (granulometry?.results) {
          if (granulometry.results.cc !== undefined && granulometry.results.cc !== null) {
            setData({ step: 1, key: 'cc', value: granulometry.results.cc });
          }
          
          if (granulometry.results.cnu !== undefined && granulometry.results.cnu !== null) {
            setData({ step: 1, key: 'cnu', value: granulometry.results.cnu });
          }
        } else {
          console.warn('⚠️ Granulometria não tem resultados:', granulometry);
          toast.warning(t('loading.granulometry.error'));
        }

        setLoading(false);
      } catch (error) {
        console.error('❌ Erro ao carregar granulometria:', error);
        setLoading(false);
        toast.error(t('loading.granulometry.error'));
      }
    };

    fetchGranulometry();
    // 🔥 CORREÇÃO 4: Array de dependências correto
  }, [generalData?.sample?._id]); // Só executa quando o ID da amostra mudar

  // 🔥 CORREÇÃO 5: Verificar se data existe antes de acessar
  if (data) {
    data.organic_matter = generalData?.sample?.type === 'organicSoil';
  }

  const inputs = [
    {
      label: 'LL',
      value: data.liquidity_limit,
      key: 'liquidity_limit',
      required: true,
      adornment: '%',
    },
    {
      label: 'LP',
      value: data.plasticity_limit,
      key: 'plasticity_limit',
      required: true,
      adornment: '%',
    },
  ];

  const rows = data?.sieves || [];

  const columns: GridColDef[] = [
    {
      field: 'sieve',
      headerName: t('sucs.sieves'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'passant',
      headerName: t('sucs.passant'),
      renderCell: ({ row }) => {
        const { sieve } = row;
        const sieve_index = rows.findIndex((r) => r.sieve === sieve);

        return (
          <InputEndAdornment
            fullWidth
            adornment="%"
            type="number"
            inputProps={{ min: 0 }}
            value={rows[sieve_index].passant}
            required
            onChange={(e) => {
              const newRows = [...rows];
              newRows[sieve_index].passant = Number(e.target.value);
              setData({ step: 1, key: 'passant', value: newRows });
            }}
          />
        );
      },
    },
  ];

  // 🔥 CORREÇÃO 6: Verificação segura do nextDisabled
  const allFieldsFilled = 
    data?.liquidity_limit != null &&
    data?.plasticity_limit != null &&
    data?.sieves?.every((row) => row.passant !== null);

  if (allFieldsFilled && nextDisabled) {
    setNextDisabled(false);
  }

  // 🔥 Se estiver carregando
  if (loading) {
    return <Loading />;
  }

  // 🔥 Se não tiver dados
  if (!data || rows.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Dados não disponíveis
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Selecione uma amostra na etapa anterior para carregar os dados de granulometria.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Sucs_step2Table rows={rows} columns={columns} />
      <Box
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' },
          gap: '10px',
          mt: '20px',
        }}
      >
        {inputs.map((input) => (
          <Box key={input.key}>
            <InputEndAdornment
              label={input.label}
              value={input.value}
              required={input.required}
              onChange={(e) => setData({ step: 1, key: input.key, value: Number(e.target.value) })}
              adornment={input.adornment}
              type="number"
              inputProps={{ min: 0 }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SUCS_Step2;