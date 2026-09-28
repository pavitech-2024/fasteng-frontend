import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import NumericCell from '@/components/atoms/inputs/numeric-cell';
import GranulometryCustomSeriesModal from '@/components/atoms/modals/GranulometryCustomSeriesModal';
import { EssayPageProps } from '@/components/templates/essay';
import { Sieve } from '@/interfaces/common';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import {
  GranulometryRow,
  buildEmptyTable,
  formatDecimal,
  parseDecimal,
  recalcFromPassant,
  recalcFromRetained,
  setPassantAt,
  setRetainedAt,
  validateGranulometry,
} from '@/utils/granulometry-calc';
import { Alert, Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import CreateMaterialDosageTable from './tables/createMaterialDosageTable';

const AGGREGATE_TYPES = ['coarseAggregate', 'fineAggregate', 'filler'];
const BINDER_TYPES = ['asphaltBinder', 'CAP'];

type Validation = ReturnType<typeof validateGranulometry>;

/* -------------------------------------------------------------------------- */
/* Tabela de um material                                                       */
/* -------------------------------------------------------------------------- */

interface MaterialGranulometryProps {
  granulometry: any;
  validation: Validation;
  onMassChange: (raw: string) => void;
  onCommitRows: (result: { rows: GranulometryRow[]; bottom: number }) => void;
  onEditKind: (kind: 'retained' | 'passant') => void;
  containerRef: (el: HTMLElement | null) => void;
}

const MaterialGranulometry = ({
  granulometry,
  validation,
  onMassChange,
  onCommitRows,
  onEditKind,
  containerRef,
}: MaterialGranulometryProps) => {
  const rows: GranulometryRow[] = granulometry.table_data ?? [];
  const mass = granulometry.material_mass ?? 0;
  const disabled = !(mass > 0);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'sieve_label',
        headerName: t('granulometry-asphalt.sieves'),
        valueFormatter: ({ value }) => `${value}`,
      },
      {
        field: 'passant',
        headerName: t('granulometry-asphalt.passant'),
        renderCell: ({ row }) => {
          const index = rows.findIndex((r) => r.sieve_label === row.sieve_label);
          if (index < 0) return null;

          return (
            <NumericCell
              adornment="%"
              value={rows[index].passant}
              error={validation.invalidRows.includes(index)}
              disabled={disabled}
              onCommit={(value) => {
                onEditKind('passant');
                onCommitRows(setPassantAt(rows, mass, index, value));
              }}
            />
          );
        },
      },
      {
        field: 'retained',
        headerName: t('granulometry-asphalt.retained'),
        renderCell: ({ row }) => {
          const index = rows.findIndex((r) => r.sieve_label === row.sieve_label);
          if (index < 0) return null;

          return (
            <NumericCell
              adornment="g"
              value={rows[index].retained}
              error={validation.invalidRows.includes(index)}
              disabled={disabled}
              onCommit={(value) => {
                onEditKind('retained');
                onCommitRows(setRetainedAt(rows, mass, index, value));
              }}
            />
          );
        },
      },
    ],
    [rows, mass, disabled, validation, onCommitRows, onEditKind]
  );

  const totalRetained = rows.reduce((sum, r) => sum + (r.retained || 0), 0);

  const handleClearTable = () => {
    if (rows.length === 0) return;
    onEditKind('retained');
    onCommitRows(recalcFromRetained(rows.map((r) => ({ ...r, retained: 0 })), mass));
  };

  return (
    <Box sx={{ marginY: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }} ref={containerRef}>
      <Typography variant="h5">
        {granulometry.material.name} | {t('asphalt.materials.' + granulometry.material.type)}
      </Typography>

      <Box
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' },
          gap: '10px',
        }}
      >
        <InputEndAdornment
          id={`material_mass_${granulometry.material._id}`}
          label={t('granulometry-asphalt.material_mass')}
          value={granulometry.material_mass ?? ''}
          onChange={(e) => onMassChange(e.target.value)}
          adornment="g"
          type="text"
          inputProps={{ inputMode: 'decimal' }}
          required
        />
      </Box>

      {rows.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Button size="small" variant="outlined" onClick={handleClearTable} disabled={disabled}>
            Zerar tabela
          </Button>

          <Typography variant="body2" sx={{ ml: 'auto' }}>
            Retido total: {formatDecimal(totalRetained)} g de {formatDecimal(mass)} g
          </Typography>
        </Box>
      )}

      {validation.messages.length > 0 && rows.length > 0 && (
        <Alert severity="warning">{validation.messages.join(' ')}</Alert>
      )}

      {rows.length > 0 && (
        <DataGrid
          sx={{ borderRadius: '10px' }}
          density="compact"
          showCellVerticalBorder
          showColumnVerticalBorder
          hideFooter
          getRowId={(row) => row.sieve_label}
          rows={rows}
          columns={columns.map((column) => ({
            ...column,
            sortable: false,
            disableColumnMenu: true,
            align: 'center',
            headerAlign: 'center',
            minWidth: 150,
            flex: 1,
          }))}
        />
      )}

      <Box
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' },
          gap: '10px',
        }}
      >
        <InputEndAdornment
          id={`bottom_${granulometry.material._id}`}
          label={t('granulometry-asphalt.bottom')}
          variant="filled"
          value={formatDecimal(granulometry.bottom)}
          adornment="g"
          type="text"
          readOnly
          focused
        />
      </Box>
    </Box>
  );
};

/* -------------------------------------------------------------------------- */
/* Step 2                                                                      */
/* -------------------------------------------------------------------------- */

const Superpave_Step2_GranulometryEssay = ({ setNextDisabled }: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const data = useSuperpaveStore((state) => state.granulometryEssayData);
  const setData = useSuperpaveStore((state) => state.setData);

  const myRef = useRef<any>({});
  // Qual coluna foi editada por último, por material. Só decide o que preservar
  // quando a massa muda: os gramas medidos ou a curva de passantes.
  const lastEdited = useRef<Record<string, 'retained' | 'passant'>>({});

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const granulometrys: any[] = data.granulometrys ?? [];

  // Índices reais dentro de data.granulometrys. Nunca reindexar a lista filtrada:
  // era daí que vinha o descasamento entre material_mass e table_data.
  const aggregateIndexes = useMemo(
    () => granulometrys.map((g, i) => (AGGREGATE_TYPES.includes(g?.material?.type) ? i : -1)).filter((i) => i >= 0),
    [granulometrys]
  );

  /* ----------------------------- série de peneiras ------------------------ */

  // Uma série só, personalizada, compartilhada por todos os agregados.
  // O fallback lê a série do primeiro agregado para não perder dosagem antiga.
  const sieveSeries: Sieve[] = data.sieve_series ?? granulometrys[aggregateIndexes[0]]?.sieve_series ?? [];
  const hasSeries = sieveSeries.length > 0;

  /**
   * Aplica a série a TODOS os agregados de uma vez. Os gramas já digitados são
   * preservados por peneira: quem continua na nova série mantém o valor, quem
   * sai é descartado, quem entra começa zerado.
   */
  const applySeries = (sieves: Sieve[]) => {
    if (sieves.length === 0) return;

    const next = granulometrys.map((granulometry) => {
      if (!AGGREGATE_TYPES.includes(granulometry?.material?.type)) return granulometry;

      const previous = new Map<string, number>(
        (granulometry.table_data ?? []).map((row: GranulometryRow) => [row.sieve_label, row.retained])
      );

      const table = buildEmptyTable(sieves).map((row) => ({
        ...row,
        retained: previous.get(row.sieve_label) ?? 0,
      }));

      const result = recalcFromRetained(table, granulometry.material_mass ?? 0);

      return { ...granulometry, sieve_series: sieves, table_data: result.rows, bottom: result.bottom };
    });

    setData({ step: 1, key: 'granulometrys', value: next });
    setData({ step: 1, key: 'sieve_series', value: sieves });
  };

  /* -------------------------------- validação ----------------------------- */

  const validations = useMemo(() => {
    const map: Record<number, Validation> = {};
    aggregateIndexes.forEach((i) => {
      const g = granulometrys[i];
      map[i] = validateGranulometry(g.table_data ?? [], g.material_mass ?? 0, g.bottom ?? 0);
    });
    return map;
  }, [granulometrys, aggregateIndexes]);

  /** Único ponto de escrita das granulometrias no store. */
  const updateGranulometry = (index: number, patch: Record<string, any>) => {
    const next = granulometrys.map((g, i) => (i === index ? { ...g, ...patch } : g));
    setData({ step: 1, key: 'granulometrys', value: next });
  };

  const commitRows = (index: number, result: { rows: GranulometryRow[]; bottom: number }) =>
    updateGranulometry(index, { table_data: result.rows, bottom: result.bottom });

  const handleMassChange = (index: number, raw: string) => {
    const newMass = parseDecimal(raw);
    const granulometry = granulometrys[index];
    const rows: GranulometryRow[] = granulometry.table_data ?? [];

    if (rows.length === 0 || newMass === null) {
      updateGranulometry(index, { material_mass: newMass ?? 0 });
      return;
    }

    const kind = lastEdited.current[granulometry.material._id] ?? 'retained';
    const result = kind === 'retained' ? recalcFromRetained(rows, newMass) : recalcFromPassant(rows, newMass);

    // Uma escrita só: massa e tabela saem sempre coerentes entre si.
    updateGranulometry(index, { material_mass: newMass, table_data: result.rows, bottom: result.bottom });
  };

  /* ---------------------------------- CAP --------------------------------- */

  const binderRows = data.viscosity?.dataPoints ?? [];

  const setBinderPoints = (dataPoints: any[]) =>
    setData({ step: 1, key: 'viscosity', value: { ...data.viscosity, dataPoints } });

  const updateBinderPoint = (id: number, key: 'temperature' | 'viscosity', value: number | null) =>
    setBinderPoints(binderRows.map((point) => (point.id === id ? { ...point, [key]: value } : point)));

  const binderIsComplete = binderRows.every(
    (point) => point.temperature !== null && point.temperature !== undefined && point.viscosity
  );

  const handleAdd = () => {
    const nextId = binderRows.length > 0 ? Math.max(...binderRows.map((p) => p.id)) + 1 : 0;
    setBinderPoints([...binderRows, { id: nextId, temperature: null, viscosity: null }]);
  };

  const handleErase = () => {
    if (binderRows.length <= 1) {
      toast.error(t('saybolt-furol.error.minValue'));
      return;
    }
    setBinderPoints(binderRows.slice(0, -1));
  };

  const binderColumns: GridColDef[] = [
    {
      field: 'temperature',
      headerName: t('saybolt-furol.temperature'),
      renderCell: ({ row }) => (
        <NumericCell
          adornment="°C"
          value={row.temperature}
          error={row.temperature === null || row.temperature === undefined}
          onCommit={(value) => updateBinderPoint(row.id, 'temperature', value)}
        />
      ),
    },
    {
      field: 'viscosity',
      headerName: t('asphalt.essays.viscosityRotational.viscosity'),
      renderCell: ({ row }) => (
        <NumericCell
          adornment="Poise"
          value={row.viscosity}
          error={!row.viscosity}
          onCommit={(value) => updateBinderPoint(row.id, 'viscosity', value)}
        />
      ),
    },
  ];

  const ExpansionToolbar = () => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem', flexWrap: 'wrap' }}>
      <Button sx={{ color: 'secondaryTons.red' }} onClick={handleErase}>
        {t('erase')}
      </Button>
      <Button sx={{ color: 'secondaryTons.green' }} onClick={handleAdd}>
        {t('add')}
      </Button>
    </Box>
  );

  /* ------------------------------ liberação ------------------------------- */

  useEffect(() => {
    const hasCoarseAggregate = data.materials?.some((m) => m.type === 'coarseAggregate');
    const hasFineAggregate = data.materials?.some((m) => m.type === 'fineAggregate');
    const hasBinder = data.materials?.some((m) => BINDER_TYPES.includes(m.type));

    const tablesAreValid =
      aggregateIndexes.length > 0 &&
      aggregateIndexes.every((i) => (granulometrys[i].table_data?.length ?? 0) > 0 && validations[i]?.isValid);

    setNextDisabled(
      !(hasSeries && hasCoarseAggregate && hasFineAggregate && hasBinder && tablesAreValid && binderIsComplete)
    );
  }, [data.materials, hasSeries, aggregateIndexes, validations, granulometrys, binderIsComplete, setNextDisabled]);

  const handleClickedMaterial = (row: any) => {
    const targetRef = myRef.current[row.name];
    if (targetRef) targetRef.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box>
      <CreateMaterialDosageTable onRowClick={(row: any) => handleClickedMaterial(row)} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', mt: '20px' }}>
        <Button variant="outlined" onClick={() => setModalIsOpen(true)}>
          {hasSeries ? 'Editar peneiras' : 'Selecionar peneiras'}
        </Button>

        {hasSeries && (
          <Typography variant="body2">
            {sieveSeries.length} peneiras selecionadas, aplicadas a todos os agregados
          </Typography>
        )}
      </Box>

      {!hasSeries && (
        <Alert severity="info" sx={{ mt: '12px' }}>
          Selecione as peneiras do ensaio. A mesma série vale para todos os agregados desta dosagem.
        </Alert>
      )}

      {hasSeries &&
        aggregateIndexes.map((index) => {
          const granulometry = granulometrys[index];
          return (
            <MaterialGranulometry
              key={granulometry.material._id ?? index}
              granulometry={granulometry}
              validation={validations[index]}
              onMassChange={(raw) => handleMassChange(index, raw)}
              onCommitRows={(result) => commitRows(index, result)}
              onEditKind={(kind) => {
                lastEdited.current[granulometry.material._id] = kind;
              }}
              containerRef={(el) => {
                if (el) myRef.current[granulometry.material.name] = el;
              }}
            />
          );
        })}

      {binderRows.length > 0 && data.viscosity?.material && (
        <Box
          sx={{ marginY: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
          ref={(el) => {
            if (el) myRef.current[data.viscosity.material.name] = el;
          }}
        >
          <Typography variant="h5">
            {data.viscosity.material.name} | {t('asphalt.materials.' + data.viscosity.material.type)}
          </Typography>

          {!binderIsComplete && (
            <Alert severity="warning">Preencha temperatura e viscosidade em todos os pontos do ligante.</Alert>
          )}

          <DataGrid
            sx={{ borderRadius: '10px' }}
            density="compact"
            showCellVerticalBorder
            showColumnVerticalBorder
            slots={{ footer: ExpansionToolbar }}
            rows={binderRows}
            columns={binderColumns.map((column) => ({
              ...column,
              sortable: false,
              disableColumnMenu: true,
              align: 'center',
              headerAlign: 'center',
              minWidth: 150,
              flex: 1,
            }))}
          />
        </Box>
      )}

      <GranulometryCustomSeriesModal
        setCloseModal={(isClosed: boolean) => setModalIsOpen(isClosed)}
        isOpen={modalIsOpen}
        customSieveSeries={applySeries}
      />
    </Box>
  );
};

export default Superpave_Step2_GranulometryEssay;