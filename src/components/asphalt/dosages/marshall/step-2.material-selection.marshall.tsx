import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import materialsService from '@/services/asphalt/asphalt-materials.service';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import useMarshallStore from '@/stores/asphalt/marshall/marshall.store';
import { Box } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import MaterialSelectionTable from './tables/step-2-table';
import { GridColDef } from '@mui/x-data-grid';

const REQUIRED_ESSAYS: Record<string, { key: string; label: string }[]> = {
  coarseAggregate: [
    { key: 'granulometry', label: 'granulometria' },
    { key: 'specificMass', label: 'massa específica' },
  ],
  fineAggregate: [
    { key: 'granulometry', label: 'granulometria' },
    { key: 'specificMass', label: 'massa específica' },
  ],
  filler: [
    { key: 'granulometry', label: 'granulometria' },
    { key: 'specificMass', label: 'massa específica' },
  ],
  CAP: [{ key: 'viscosityRotational', label: 'viscosidade rotacional' }],
  asphaltBinder: [{ key: 'viscosityRotational', label: 'viscosidade rotacional' }],
};

const Marshall_Step2_MaterialSelection = ({
  nextDisabled,
  setNextDisabled,
  marshall,
}: EssayPageProps & { marshall: Marshall_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [materials, setMaterials] = useState<AsphaltMaterial[]>([]);
  const [materialEssayMap, setMaterialEssayMap] = useState<Record<string, string[]>>({});
  const { materialSelectionData } = useMarshallStore();

  const { user } = useAuth();

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          const response = await marshall.getmaterialsByUserId(user._id);

          let extractedMaterials: AsphaltMaterial[] = [];

          const isAsphaltMaterial = (obj: any): boolean => {
            return obj && typeof obj === 'object' && obj._id && obj.name && obj.type && obj.userId;
          };

          if (Array.isArray(response)) {
            if (response.length > 0) {
              if (isAsphaltMaterial(response[0])) {
                extractedMaterials = response as AsphaltMaterial[];
              } else if (response[0] && typeof response[0] === 'object') {
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
          } else if (response && typeof response === 'object') {
            if (isAsphaltMaterial(response)) {
              extractedMaterials = [response as AsphaltMaterial];
            } else {
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

  useEffect(() => {
    if (!materials.length) {
      setMaterialEssayMap({});
      return;
    }

    let isMounted = true;

    Promise.all(
      materials.map(async (material) => {
        try {
          const response = await materialsService.getMaterial(material._id);
          const essays = Array.isArray(response?.data?.essays) ? response.data.essays : [];
          const essayNames = essays.map((essay: { essayName?: string }) => essay.essayName).filter(Boolean);
          return [material._id, essayNames] as const;
        } catch (error) {
          console.warn(`Não foi possível carregar ensaios do material ${material._id}:`, error);
          return [material._id, []] as const;
        }
      })
    )
      .then((entries) => {
        if (!isMounted) return;
        setMaterialEssayMap(Object.fromEntries(entries));
      })
      .catch((error) => {
        console.error('Erro ao montar estado dos ensaios dos materiais:', error);
      });

    return () => {
      isMounted = false;
    };
  }, [materials]);

  const getMaterialMissingEssays = (material: AsphaltMaterial): string[] => {
    const existingEssayNames = materialEssayMap[material._id] ?? [];
    const requiredEssays = REQUIRED_ESSAYS[material.type] ?? [];

    return requiredEssays
      .filter(({ key }) => !existingEssayNames.includes(key))
      .map(({ key }) => key);
  };

  const aggregateRows = materials
    .map((material) => ({
      _id: material._id,
      name: material.name,
      type: material.type,
      missingEssays: getMaterialMissingEssays(material),
    }))
    .filter(({ type }) => ['coarseAggregate', 'fineAggregate', 'filler', 'other'].includes(type));

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
    .map((material) => ({
      _id: material._id,
      name: material.name,
      type: material.type,
      missingEssays: getMaterialMissingEssays(material),
    }))
    .filter(({ type }) => ['CAP', 'asphaltBinder'].includes(type));

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