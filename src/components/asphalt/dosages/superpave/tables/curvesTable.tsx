import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { StyledDataGrid } from '@/components/molecules/tables/styledDataGrid';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { formatDecimal, parseDecimal } from '@/utils/granulometry-calc';
import { Box, Typography } from '@mui/material';
import { t } from 'i18next';
import React, { useEffect, useMemo, useState } from 'react';

const CURVE_INDEX: Record<string, number> = {
  lowerComposition: 0,
  averageComposition: 1,
  higherComposition: 2,
};

interface Props {
  materials: { name: string; _id: string }[];
  dnitBandsLetter: string;
  tableName: string;
  tableData: any[];
  /** @deprecated não é mais usado — o input escreve direto no store */
  tableInputs?: Record<string, string>;
  /** @deprecated não é mais usado — o input escreve direto no store */
  onChangeInputsTables?: (...args: any[]) => void;
}

/* -------------------------------------------------------------------------- */
/* Input de porcentagem no cabeçalho                                           */
/* -------------------------------------------------------------------------- */

interface PercentHeaderInputProps {
  value: number | null;
  error: boolean;
  onCommit: (value: number | null) => void;
}

/**
 * Fica fora do CurvesTable de propósito: assim o React preserva a instância
 * entre re-renders e o campo não perde o foco a cada tecla.
 */
const PercentHeaderInput = ({ value, error, onCommit }: PercentHeaderInputProps) => {
  const [draft, setDraft] = useState<string>(value === null || value === undefined ? '' : String(value));
  const [editing, setEditing] = useState(false);

  // Enquanto o usuário digita, o store não manda no campo.
  useEffect(() => {
    if (!editing) setDraft(value === null || value === undefined ? '' : String(value));
  }, [value, editing]);

  const commit = () => {
    setEditing(false);
    onCommit(parseDecimal(draft));
  };

  return (
    <InputEndAdornment
      adornment="%"
      type="text"
      inputProps={{ inputMode: 'decimal' }}
      value={draft}
      error={error}
      onFocus={() => setEditing(true)}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
      }}
    />
  );
};

/* -------------------------------------------------------------------------- */
/* Tabela da curva                                                             */
/* -------------------------------------------------------------------------- */

const CurvesTable: React.FC<Props> = ({ materials, dnitBandsLetter, tableName, tableData }) => {
  const { granulometryCompositionData: data, setData } = useSuperpaveStore();

  const curveIndex = CURVE_INDEX[tableName] ?? 0;
  const rowsSource: any[] = tableData ?? [];

  // Nunca indexar percentageInputs direto: ele pode voltar vazio do backend.
  const percentageInputs: Record<string, number | null> = data?.percentageInputs?.[curveIndex] ?? {};

  const setPercentage = (field: string, value: number | null) => {
    const current = Array.isArray(data?.percentageInputs) ? data.percentageInputs : [];
    const next = [0, 1, 2].map((i) => current[i] ?? {});
    next[curveIndex] = { ...next[curveIndex], [field]: value };
    setData({ step: 3, key: 'percentageInputs', value: next });
  };

  const sum = Object.values(percentageInputs).reduce((acc, value) => acc + (Number(value) || 0), 0);
  const hasAnyInput = Object.values(percentageInputs).some((value) => value !== null && value !== undefined);
  const sumIsValid = Math.abs(sum - 100) <= 0.01;

  const fieldsOf = (material: { _id: string }, index: number) => ({
    totalPassant: `totalPassant_${material._id}_${index + 1}`,
    material: `material_${material._id}_${index + 1}`,
    group: `group_${material._id}_${index + 1}`,
  });

  const columns = useMemo(
    () => [
      {
        field: 'peneira',
        headerName: t('asphalt.dosages.superpave.sieve'),
        width: 140,
        valueFormatter: ({ value }) => `${value}`,
      },
      ...(materials ?? []).flatMap((material, index) => {
        const fields = fieldsOf(material, index);

        return [
          {
            field: fields.totalPassant,
            headerName: t('asphalt.dosages.superpave.total-passant'),
            width: 125,
            valueFormatter: ({ value }) => `${value}`,
          },
          {
            field: fields.material,
            headerName: '',
            width: 100,
            valueFormatter: ({ value }) => `${value}`,
            renderHeader: () => (
              <PercentHeaderInput
                value={percentageInputs[fields.material] ?? null}
                error={hasAnyInput && !sumIsValid}
                onCommit={(value) => setPercentage(fields.material, value)}
              />
            ),
          },
        ];
      }),
      {
        field: 'project',
        headerName: t('asphalt.dosages.superpave.project'),
        valueFormatter: ({ value }) => `${value}`,
        width: 70,
      },
      { field: 'band1', headerName: '', valueFormatter: ({ value }) => `${value}`, width: 70 },
      { field: 'band2', headerName: '', valueFormatter: ({ value }) => `${value}`, width: 70 },
    ],
    [materials, percentageInputs, hasAnyInput, sumIsValid]
  );

  const rows = rowsSource.map((row, idx) => {
    const materialCells = (materials ?? []).reduce((acc, material, index) => {
      const fields = fieldsOf(material, index);
      const percents = data?.[tableName]?.percentsOfMaterials;

      return {
        ...acc,
        [fields.totalPassant]: row[`keyTotal${index}`] ?? '---',
        [fields.material]: percents?.[index]?.[idx]?.toFixed(2) ?? '---',
      };
    }, {} as Record<string, string>);

    const sumOfPercents = data?.[tableName]?.sumOfPercents;

    return {
      id: idx,
      peneira: row.peneira,
      ...materialCells,
      project: sumOfPercents?.[idx]?.toFixed(2) ?? '',
      band1: row.bandsCol1 ?? '',
      band2: row.bandsCol2 ?? '',
    };
  });

  const groupings = [
    ...(materials ?? []).map((material, index) => {
      const fields = fieldsOf(material, index);
      return {
        groupId: fields.group,
        headerName: material.name,
        headerAlign: 'center' as const,
        children: [{ field: fields.totalPassant }, { field: fields.material }],
      };
    }),
    {
      groupId: 'specification',
      headerName: t('asphalt.dosages.superpave.specification'),
      headerAlign: 'center' as const,
      children: [
        {
          groupId: `Faixa ${dnitBandsLetter ?? data?.bands?.letter ?? ''}`,
          headerAlign: 'center' as const,
          children: [{ field: 'band1' }, { field: 'band2' }],
        },
      ],
    },
  ];

  if (!materials?.length || rows.length === 0) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Typography
        variant="body2"
        sx={{ alignSelf: 'flex-end', color: hasAnyInput && !sumIsValid ? 'error.main' : 'text.secondary' }}
      >
        Soma das porcentagens: {formatDecimal(sum)}% de 100%
      </Typography>

      <StyledDataGrid
        rows={rows}
        columns={columns}
        hideFooter
        disableColumnMenu
        disableColumnFilter
        experimentalFeatures={{ columnGrouping: true }}
        columnGroupingModel={groupings}
        sx={{
          '& .MuiDataGrid-columnHeaders': { fontSize: '0.800rem' },
          '& .MuiDataGrid-cell': { fontSize: '0.75rem' },
        }}
      />
    </Box>
  );
};

export default CurvesTable;