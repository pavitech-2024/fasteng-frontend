import { NoDataFound } from '@/components/util/tables';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import { AllSievesSuperpaveUpdatedAstm } from '@/interfaces/common';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

const AGGREGATE_TYPES = ['coarseAggregate', 'fineAggregate', 'filler'];
const BINDER_TYPES = ['asphaltBinder', 'CAP'];

interface ExistingMaterialsSelectorProps {
  /** Ex.: () => superpave.getmaterialsByUserId(user._id) */
  fetchMaterials: () => Promise<any>;
}

/**
 * Seleção de materiais já cadastrados no banco. Não cria nada no banco:
 * só monta, no store da dosagem, as mesmas estruturas que o "Novo Material" monta.
 * Os materiais escolhidos aqui recebem `fromRegistry: true`.
 */
const ExistingMaterialsSelector = ({ fetchMaterials }: ExistingMaterialsSelectorProps) => {
  const { granulometryEssayData: data, setData } = useSuperpaveStore();
  const [registry, setRegistry] = useState<AsphaltMaterial[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let active = true;

    fetchMaterials()
      .then((response) => {
        if (!active) return;
        setRegistry(Array.isArray(response) ? response : response?.materials ?? []);
      })
      .catch((error) => {
        console.error('Failed to load registered materials:', error);
        if (active) toast.error(t('loading.materials.error'));
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'name', headerName: t('asphalt.materials.name') },
      {
        field: 'type',
        headerName: t('asphalt.materials.type'),
        valueFormatter: ({ value }) => t(`asphalt.materials.${value}`),
      },
    ],
    []
  );

  // Materiais criados pelo "Novo Material" já estão na tabela principal: não repetir aqui.
  const options = useMemo(() => {
    const createdHere = new Set((data.materials ?? []).filter((m: any) => !m.fromRegistry).map((m) => m._id));
    return registry.filter((m) => !createdHere.has(m._id));
  }, [registry, data.materials]);

  const aggregates = options.filter((m) => AGGREGATE_TYPES.includes(m.type));
  const binders = options.filter((m) => BINDER_TYPES.includes(m.type));

  const selectedIds = (types: string[]) =>
    (data.materials ?? []).filter((m: any) => m.fromRegistry && types.includes(m.type)).map((m) => m._id);

  /* ------------------------------ adicionar ------------------------------- */

  const addMaterial = (material: AsphaltMaterial) => {
    const newMaterial: any = {
      _id: material._id,
      createdAt: material.createdAt,
      userId: material.userId,
      description: {
        source: material.description?.source,
        responsible: material.description?.responsible,
        aggregateNature: material.description?.aggregateNature,
        boughtDate: material.description?.boughtDate,
        observation: material.description?.observation,
      },
      name: material.name,
      type: material.type,
      data: [],
      materials: [],
      fromRegistry: true,
    };

    // Se a série de peneiras já foi escolhida, o material nasce com ela.
    const sieves: { label: string; value: number }[] = data.sieve_series?.length
      ? data.sieve_series
      : AllSievesSuperpaveUpdatedAstm.map((s) => ({ label: s.label, value: s.value }));

    const materials = [...(data.materials ?? [])];

    if (BINDER_TYPES.includes(material.type)) {
      // Só um ligante por dosagem: substitui o atual.
      const index = materials.findIndex((m) => BINDER_TYPES.includes(m.type));
      if (index !== -1) materials[index] = newMaterial;
      else materials.push(newMaterial);
    } else {
      materials.push(newMaterial);
    }

    setData({ step: 1, key: 'materials', value: materials });

    if (AGGREGATE_TYPES.includes(material.type)) {
      setData({
        step: 1,
        key: 'granulometrys',
        value: [
          ...(data.granulometrys ?? []),
          {
            material: newMaterial,
            material_mass: 0,
            table_data: sieves.map((s) => ({
              sieve_label: s.label,
              sieve_value: s.value,
              passant: 100,
              retained: 0,
            })),
            sieve_series: sieves.map((s) => ({ label: s.label, value: s.value })),
            bottom: 0,
          },
        ],
      });
    } else {
      setData({
        step: 1,
        key: 'viscosity',
        value: {
          material: newMaterial,
          dataPoints: [
            { id: 0, temperature: 135, viscosity: 0 },
            { id: 1, temperature: 150, viscosity: 0 },
            { id: 2, temperature: 177, viscosity: 0 },
          ],
        },
      });
    }
  };

  /* ------------------------------- remover -------------------------------- */

  /** Só tira da dosagem. Nunca apaga do banco. */
  const removeMaterial = (id: string) => {
    setData({ step: 1, key: 'materials', value: (data.materials ?? []).filter((m) => m._id !== id) });
    setData({
      step: 1,
      key: 'granulometrys',
      value: (data.granulometrys ?? []).filter((g) => g.material._id !== id),
    });
    if (data.viscosity?.material?._id === id) setData({ step: 1, key: 'viscosity', value: null });
  };

  const handleChange = (ids: string[], types: string[], single: boolean) => {
    const current = selectedIds(types);

    let next = ids;
    if (single && next.length > 1) next = next.filter((id) => !current.includes(id)).slice(0, 1);

    const added = next.filter((id) => !current.includes(id));
    const removed = current.filter((id) => !next.includes(id));

    if (added.length > 0) {
      // Um por vez: addMaterial lê o `data` do render atual.
      const material = registry.find((m) => m._id === added[0]);
      if (material) addMaterial(material);
      return;
    }

    if (removed.length > 0) removeMaterial(removed[0]);
  };

  /* -------------------------------- render -------------------------------- */

  const renderTable = (header: string, rows: AsphaltMaterial[], types: string[], single = false) => (
    <Box sx={{ p: '1rem', textAlign: 'center', border: '1px solid lightgray', borderRadius: '10px' }}>
      <h3>{header}</h3>

      <DataGrid
        sx={{
          borderRadius: '10px',
          height: 300,
          // Sem "selecionar todos": a seleção monta um material por vez.
          '& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root': { display: 'none' },
        }}
        checkboxSelection
        disableColumnSelector
        hideFooter
        getRowId={(row) => row._id}
        rows={rows}
        rowSelectionModel={selectedIds(types)}
        onRowSelectionModelChange={(ids) => handleChange([...(ids as string[])], types, single)}
        columns={columns.map((column) => ({
          ...column,
          disableColumnMenu: true,
          sortable: false,
          align: 'center',
          headerAlign: 'center',
          minWidth: 100,
          flex: 1,
        }))}
        slots={{
          noRowsOverlay: () => <NoDataFound message="Nenhum material encontrado" />,
          noResultsOverlay: () => <NoDataFound message="Nenhum material encontrado" />,
        }}
      />
    </Box>
  );

  const selectedCount = selectedIds(AGGREGATE_TYPES).length + selectedIds(BINDER_TYPES).length;

  return (
    <Box sx={{ marginY: '1rem' }}>
      <Button variant="outlined" onClick={() => setIsOpen(true)}>
        Usar materiais cadastrados{selectedCount > 0 ? ` (${selectedCount})` : ''}
      </Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} fullWidth>
        <DialogTitle>Usar materiais cadastrados</DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '0.5rem' }}>
            {renderTable(t('asphalt.materials.aggregates'), aggregates, AGGREGATE_TYPES)}
            {renderTable(t('asphalt.materials.binders'), binders, BINDER_TYPES, true)}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="contained" onClick={() => setIsOpen(false)}>
            Concluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExistingMaterialsSelector;
