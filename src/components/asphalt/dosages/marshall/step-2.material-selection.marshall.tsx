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

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          
          const response = await marshall.getmaterialsByUserId(user._id);
          
          
          let extractedMaterials: AsphaltMaterial[] = [];

          // Função para verificar se é um AsphaltMaterial
          const isAsphaltMaterial = (obj: any): boolean => {
            return obj && 
                   typeof obj === 'object' &&
                   obj._id && 
                   obj.name && 
                   obj.type && 
                   obj.userId;
          };

          // CASO 1: Resposta já é um array de AsphaltMaterial (como no seu log)
          if (Array.isArray(response)) {
            
            if (response.length > 0) {
              // Verifica se o primeiro item é um AsphaltMaterial
              if (isAsphaltMaterial(response[0])) {
                extractedMaterials = response as AsphaltMaterial[];
              }
              // Verifica se há uma propriedade aninhada (possivelmente .materials ou outra)
              else if (response[0] && typeof response[0] === 'object') {
                // Procura por qualquer propriedade que seja array
                const firstItem = response[0];
                const objectKeys = Object.keys(firstItem);
                
                for (const key of objectKeys) {
                  const value = firstItem[key];
                  if (Array.isArray(value) && value.length > 0 && isAsphaltMaterial(value[0])) {
                    extractedMaterials = value as AsphaltMaterial[];
                    break;
                  }
                }
              }
            }
          }
          // CASO 2: Resposta é um objeto
          else if (response && typeof response === 'object') {
            
            // Verifica se é um único AsphaltMaterial
            if (isAsphaltMaterial(response)) {
              extractedMaterials = [response as AsphaltMaterial];
            }
            // Procura por propriedades que contenham array de materiais
            else {
              const objectKeys = Object.keys(response);
              
              for (const key of objectKeys) {
                const value = (response as any)[key];
                if (Array.isArray(value) && value.length > 0 && isAsphaltMaterial(value[0])) {
                  extractedMaterials = value as AsphaltMaterial[];
                  break;
                }
              }
            }
          }

          
          // DEBUG: Mostrar a estrutura se estiver vazio
          if (extractedMaterials.length === 0) {
            console.warn('⚠ Nenhum material extraído. Estrutura da resposta:');
            console.warn('Resposta:', response);
            console.warn('Tipo:', typeof response);
            
            if (response && typeof response === 'object') {
              console.warn('Chaves do objeto:', Object.keys(response));
            }
          }

          setMaterials(extractedMaterials);
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
  }, [user._id, marshall]);

  // Resto do seu código permanece igual...
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