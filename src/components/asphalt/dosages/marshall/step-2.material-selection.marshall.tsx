import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import useMarshallStore from '@/stores/asphalt/marshall/marshall.store';
import { Box } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import MaterialSelectionTable from './tables/step-2-table';
import { GridColDef } from '@mui/x-data-grid';

const Marshall_Step2_MaterialSelection = ({
  nextDisabled,
  setNextDisabled,
  marshall,
}: EssayPageProps & { marshall: Marshall_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [materials, setMaterials] = useState<AsphaltMaterial[]>([]);
  const { materialSelectionData } = useMarshallStore();

  const { user } = useAuth();

  // Função para verificar se material tem ensaios (baseado na lógica do backend)
  const checkMaterialTests = (material: AsphaltMaterial): boolean => {
    // Se o material tiver algum ensaio cadastrado (ajuste conforme sua estrutura real)
    // Você pode verificar se há propriedades específicas ou fazer uma requisição
    // Por enquanto, vamos assumir que todos têm ensaios ou o backend vai lidar
    return true; // Temporário - ajuste conforme sua lógica
  };

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          console.log('🔄 Buscando materiais para user:', user._id);
          
          const data : any = await marshall.getmaterialsByUserId(user._id);
          
          console.log('📦 Dados retornados do backend:', data);
          console.log('Tipo dos dados:', typeof data);
          console.log('É array?', Array.isArray(data));
          
          let newMaterials: AsphaltMaterial[] = [];

          if (Array.isArray(data)) {
            console.log('✅ É um array');
            
            if (Array.isArray(data[0]?.materials)) {
              console.log('📊 Usando data[0].materials');
              newMaterials = data[0].materials;
            } else if (
              data.length > 0 &&
              data.every(item => item._id && item.name && item.type)
            ) {
              console.log('📊 Usando array direto de materiais');
              newMaterials = data;
            }
          } else if (Array.isArray(data?.materials)) {
            console.log('📊 Usando data.materials');
            newMaterials = data.materials;
          } else if (data && data._id && data.name && data.type) {
            console.log('📊 Usando material único');
            newMaterials = [data];
          }

          console.log('🎯 Materiais finais:', newMaterials);
          console.log('Quantidade:', newMaterials.length);
          
          setMaterials(newMaterials);
          setLoading(false);
            
        } catch (error) {
          console.error('💥 Erro ao buscar materiais:', error);
          setMaterials([]);
          setLoading(false);
          throw error;
        }
      },
      {
        pending: t('loading.materials.pending'),
        success: t('loading.materials.success'),
        error: t('loading.materials.error'),
      }
    );
  }, []);

  const aggregateRows = materials
    .map(({ _id, name, type }) => ({
      _id,
      name,
      type,
    }))
    .filter(({ type }) => {
      return (
        type === 'coarseAggregate' ||
        type === 'fineAggregate' ||
        type === 'filler' ||
        type === 'other'
      );
    });

  const aggregateColumns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('name'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'type',
      headerName: t('type'),
      valueFormatter: ({ value }) => t(`asphalt.materials.${value}`),
    },
  ];

  const binderRows = materials
    .map(({ _id, name, type }) => {
      return {
        _id,
        name,
        type,
      };
    })
    .filter(({ type }) => {
      return type === 'CAP' || type === 'asphaltBinder';
    });

  const binderColumns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('asphalt.materials.name'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'type',
      headerName: t('asphalt.materials.type'),
      valueFormatter: ({ value }) => t(`asphalt.materials.${value}`),
    },
  ];

  useEffect(() => {
    if (
      materialSelectionData.binder &&
      materialSelectionData.aggregates &&
      materialSelectionData.aggregates.length > 0 &&
      nextDisabled
    ) {
      setNextDisabled(false);
    }
  }, [materialSelectionData, nextDisabled, setNextDisabled]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <MaterialSelectionTable
            rows={aggregateRows}
            columns={aggregateColumns}
            header={t('asphalt.materials.aggregates')}
            marshall={marshall}
          />
          <MaterialSelectionTable
            rows={binderRows}
            columns={binderColumns}
            header={t('asphalt.materials.binders')}
            marshall={marshall}
          />
        </Box>
      )}
    </>
  );
};

export default Marshall_Step2_MaterialSelection;