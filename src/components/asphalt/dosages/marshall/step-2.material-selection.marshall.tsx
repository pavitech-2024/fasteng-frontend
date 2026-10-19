import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import materialsService from '@/services/asphalt/asphalt-materials.service';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import useMarshallStore from '@/stores/asphalt/marshall/marshall.store';
import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import MaterialSelectionTable from './tables/step-2-table';



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

const AGGREGATE_TYPES = ['coarseAggregate', 'fineAggregate', 'filler', 'other'];
const BINDER_TYPES = ['CAP', 'asphaltBinder'];

const isAsphaltMaterial = (obj: any): boolean =>
  Boolean(obj && typeof obj === 'object' && obj._id && obj.name && obj.type && obj.userId);

/** A resposta do endpoint varia de formato; aqui ela é normalizada num array. */
const extractMaterials = (response: any): AsphaltMaterial[] => {
  if (Array.isArray(response)) {
    if (response.length === 0) return [];
    if (isAsphaltMaterial(response[0])) return response as AsphaltMaterial[];

    const nested = Object.values(response[0] ?? {}).find(
      (value) => Array.isArray(value) && value.length > 0 && isAsphaltMaterial(value[0])
    );

    return (nested as AsphaltMaterial[]) ?? [];
  }

  if (response && typeof response === 'object') {
    if (isAsphaltMaterial(response)) return [response as AsphaltMaterial];

    const nested = Object.values(response).find(
      (value) => Array.isArray(value) && value.length > 0 && isAsphaltMaterial(value[0])
    );

    return (nested as AsphaltMaterial[]) ?? [];
  }

  return [];
};

const Marshall_Step2_MaterialSelection = ({
  nextDisabled,
  setNextDisabled,
  marshall,
}: EssayPageProps & { marshall: Marshall_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [materials, setMaterials] = useState<AsphaltMaterial[]>([]);
  const [essaysByMaterial, setEssaysByMaterial] = useState<Record<string, string[]>>({});
  const [essaysLoading, setEssaysLoading] = useState<boolean>(true);

  const { materialSelectionData } = useMarshallStore();
  const { user } = useAuth();

  // StrictMode monta o componente duas vezes em dev: sem a trava, a lista de
  // materiais era buscada duas vezes a cada abertura.
  const materialsFetched = useRef(false);

  const renderCount = useRef(0);
renderCount.current += 1;
console.log('[step2] render', renderCount.current, 'mount?', renderCount.current === 1);

useEffect(() => {
  console.log('[step2] MONTOU');
  return () => console.log('[step2] DESMONTOU');
}, []);

  useEffect(() => {
    if (materialsFetched.current) return;
    materialsFetched.current = true;

    toast.promise(
      async () => {
        try {
          const response = await marshall.getmaterialsByUserId(user._id);
          setMaterials(extractMaterials(response));
        } catch (error) {
          console.error('Erro ao buscar materiais:', error);
          setMaterials([]);
          throw error;
        } finally {
          setLoading(false);
        }
      },
      {
        pending: t('loading.materials.pending'),
        success: t('loading.materials.success'),
        error: t('loading.materials.error'),
      }
    );
    // marshall fora das deps de propósito: se o pai recria a instância a cada
    // render, a dependência sozinha já reinicia a busca em loop.
  }, [user._id]);

  /**
   * Identidade da lista como string. Depender de `materials` (um array novo a
   * cada render) fazia o efeito rodar sem parar: cada busca chamava setState,
   * o setState re-renderizava, e o array virava outra referência — N
   * requisições por ciclo, sem fim.
   */
  const materialIds = useMemo(() => materials.map(({ _id }) => _id).join(','), [materials]);

  const essaysFetchedFor = useRef<string>('');

  useEffect(() => {
    if (essaysFetchedFor.current === materialIds) return;
    essaysFetchedFor.current = materialIds;

    if (!materialIds) {
      // Só troca o estado se houver algo para limpar: `setEssaysByMaterial({})`
      // incondicional cria objeto novo e provoca outro render.
      setEssaysByMaterial((prev) => (Object.keys(prev).length === 0 ? prev : {}));
      setEssaysLoading(false);
      return;
    }

    let isMounted = true;
    setEssaysLoading(true);

    Promise.all(
      materials.map(async (material) => {
        try {
          const response = await materialsService.getMaterial(material._id);
          const essays = Array.isArray(response?.data?.essays) ? response.data.essays : [];
          const names = essays.map((essay: { essayName?: string }) => essay.essayName).filter(Boolean);
          return [material._id, names] as const;
        } catch (error) {
          console.warn(`Não foi possível carregar ensaios do material ${material._id}:`, error);
          return [material._id, []] as const;
        }
      })
    )
      .then((entries) => {
        if (isMounted) setEssaysByMaterial(Object.fromEntries(entries));
      })
      .catch((error) => {
        console.error('Erro ao montar estado dos ensaios dos materiais:', error);
        // Libera nova tentativa quando a lista mudar.
        essaysFetchedFor.current = '';
      })
      .finally(() => {
        if (isMounted) setEssaysLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [materialIds]);

  const missingEssaysOf = (material: { _id: string; type: string }): string[] => {
    // Enquanto a consulta roda, não acusar falta: a tela piscava "sem ensaio"
    // em tudo e depois corrigia.
    if (essaysLoading) return [];

    const existing = essaysByMaterial[material._id] ?? [];
    return (REQUIRED_ESSAYS[material.type] ?? []).filter(({ key }) => !existing.includes(key)).map(({ key }) => key);
  };

  const rowsOf = (types: string[]) =>
    materials
      .filter(({ type }) => types.includes(type))
      .map(({ _id, name, type }) => ({ _id, name, type, missingEssays: missingEssaysOf({ _id, type }) }));

  const aggregateRows = useMemo(() => rowsOf(AGGREGATE_TYPES), [materials, essaysByMaterial, essaysLoading]);
  const binderRows = useMemo(() => rowsOf(BINDER_TYPES), [materials, essaysByMaterial, essaysLoading]);

  const columns: GridColDef[] = [
    { field: 'name', headerName: t('name'), valueFormatter: ({ value }) => `${value}` },
    { field: 'type', headerName: t('type'), valueFormatter: ({ value }) => t(`asphalt.materials.${value}`) },
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

  if (loading) return <Loading />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <MaterialSelectionTable
        rows={aggregateRows}
        columns={columns}
        header={t('asphalt.materials.aggregates')}
        essaysByMaterial={essaysByMaterial}
        essaysLoading={essaysLoading}
        marshall={marshall}
      />

      <MaterialSelectionTable
        rows={binderRows}
        columns={columns}
        header={t('asphalt.materials.binders')}
        essaysByMaterial={essaysByMaterial}
        essaysLoading={essaysLoading}
        marshall={marshall}
      />
    </Box>
  );
};

export default Marshall_Step2_MaterialSelection;