import DropDown from '@/components/atoms/inputs/dropDown';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import NumericCell from '@/components/atoms/inputs/numeric-cell';
import GranulometryCustomSeriesModal from '@/components/atoms/modals/GranulometryCustomSeriesModal';
import { EssayPageProps } from '@/components/templates/essay';
import { Sieve, SieveSeries } from '@/interfaces/common';
import useAsphaltGranulometryStore from '@/stores/asphalt/granulometry/asphalt-granulometry.store';
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
import { getSieveSeries } from '@/utils/sieves';
import { Alert, Box, Button, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import AsphaltGranulometry_step2Table from './tables/step2-table.granulometry';

const AsphaltGranulometry_Step2 = ({ setNextDisabled }: EssayPageProps) => {
  const { step2Data: data, setData } = useAsphaltGranulometryStore();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [dropdownDefaultValue, setDropdownDefaultValue] = useState({ label: '', value: [] as Sieve[] });

  // Guarda qual coluna foi editada por último. Só serve para decidir o que
  // preservar quando a massa muda: os gramas medidos ou a curva de passantes.
  const lastEdited = useRef<'retained' | 'passant'>('retained');

  const sievesSeries = useMemo(
    () => [
      getSieveSeries(0),
      getSieveSeries(1),
      getSieveSeries(2),
      getSieveSeries(3),
      getSieveSeries(4),
      getSieveSeries(6),
    ],
    []
  );

  const rows: GranulometryRow[] = data.table_data ?? [];
  const mass = data.material_mass ?? 0;

  /** Único ponto de escrita no store. Tudo passa por aqui. */
  const commitRows = (result: { rows: GranulometryRow[]; bottom: number }) => {
    setData({ step: 1, key: 'table_data', value: result.rows });
    setData({ step: 1, key: 'bottom', value: result.bottom });
  };

  // Monta a tabela quando a série muda. Em useEffect, não durante o render.
  useEffect(() => {
    if (data.sieve_series?.length > 0 && rows.length === 0) {
      commitRows(recalcFromRetained(buildEmptyTable(data.sieve_series), mass));
    }
  }, [data.sieve_series]);

  const validation = useMemo(() => validateGranulometry(rows, mass, data.bottom ?? 0), [rows, mass, data.bottom]);

  useEffect(() => {
    setNextDisabled(!(rows.length > 0 && validation.isValid));
  }, [rows.length, validation.isValid, setNextDisabled]);

  const handleMassChange = (raw: string) => {
    const newMass = parseDecimal(raw);
    setData({ step: 1, key: 'material_mass', value: newMass ?? 0 });

    if (rows.length === 0 || newMass === null) return;

    const result =
      lastEdited.current === 'retained' ? recalcFromRetained(rows, newMass) : recalcFromPassant(rows, newMass);
    commitRows(result);
  };

  const columns: GridColDef[] = [
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
            disabled={!(mass > 0)}
            onCommit={(value) => {
              lastEdited.current = 'passant';
              commitRows(setPassantAt(rows, mass, index, value));
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
            disabled={!(mass > 0)}
            onCommit={(value) => {
              lastEdited.current = 'retained';
              commitRows(setRetainedAt(rows, mass, index, value));
            }}
          />
        );
      },
    },
  ];

  const handleShowCustomSeries = (customSieveSeries: Sieve[]) => {
    if (customSieveSeries.length === 0) return;
    setData({ step: 1, key: 'sieve_series', value: customSieveSeries });
    commitRows(recalcFromRetained(buildEmptyTable(customSieveSeries), mass));
    setDropdownDefaultValue({ label: t('granulometry-asphalt.custom-series'), value: [] });
  };

  const handleSelectSeries = (_value: Sieve[], index: number) => {
    if (index === sievesSeries.length - 1) {
      setModalIsOpen(true);
      setDropdownDefaultValue({ label: t('granulometry-asphalt.custom-series'), value: [] });
      return;
    }

    const selectedSeries = sievesSeries[index];
    setData({ step: 1, key: 'sieve_series', value: selectedSeries.sieves });
    commitRows(recalcFromRetained(buildEmptyTable(selectedSeries.sieves), mass));
    setDropdownDefaultValue({ label: selectedSeries.label, value: selectedSeries.sieves });
  };

  const handleClearTable = () => {
    if (rows.length === 0) return;
    lastEdited.current = 'retained';
    commitRows(recalcFromRetained(rows.map((r) => ({ ...r, retained: 0 })), mass));
  };

  const totalRetained = rows.reduce((sum, r) => sum + r.retained, 0);

  return (
    <Box>
      <Box
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' },
          gap: '10px',
          mt: '20px',
        }}
      >
        <InputEndAdornment
          id="material_mass"
          label={t('granulometry-asphalt.material_mass')}
          value={data.material_mass ?? ''}
          onChange={(e) => handleMassChange(e.target.value)}
          adornment="g"
          type="text"
          inputProps={{ inputMode: 'decimal' }}
          required
        />

        <DropDown
          key="sieve_series"
          variant="standard"
          label={t('granulometry-asphalt.choose-series')}
          value={dropdownDefaultValue}
          options={sievesSeries.map((s: SieveSeries) => ({ label: s.label, value: s.sieves }))}
          callback={(value: Sieve[], index?: number) => {
            if (index !== undefined) handleSelectSeries(value, index);
          }}
          size="medium"
          required
        />
      </Box>

      {rows.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', mt: '20px' }}>
          <Button size="small" variant="outlined" onClick={handleClearTable}>
            Zerar tabela
          </Button>

          <Typography variant="body2" sx={{ ml: 'auto' }}>
            Retido total: {formatDecimal(totalRetained)} g de {formatDecimal(mass)} g
          </Typography>
        </Box>
      )}

      {validation.messages.length > 0 && rows.length > 0 && (
        <Alert severity="warning" sx={{ mt: '12px' }}>
          {validation.messages.join(' ')}
        </Alert>
      )}

      {rows.length > 0 && <AsphaltGranulometry_step2Table rows={rows} columns={columns} />}

      <Box
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' },
          gap: '10px',
          mt: '20px',
        }}
      >
        <InputEndAdornment
          id="bottom"
          label={t('granulometry-asphalt.bottom')}
          variant="filled"
          value={formatDecimal(data.bottom)}
          adornment="g"
          type="text"
          readOnly
          focused
        />
      </Box>

      <GranulometryCustomSeriesModal
        setCloseModal={(isClosed: boolean) => setModalIsOpen(isClosed)}
        isOpen={modalIsOpen}
        customSieveSeries={handleShowCustomSeries}
      />
    </Box>
  );
};

export default AsphaltGranulometry_Step2;