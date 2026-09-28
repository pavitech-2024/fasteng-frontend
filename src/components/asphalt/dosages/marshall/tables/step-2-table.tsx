import { NoDataFound } from '@/components/util/tables';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import useMarshallStore from '@/stores/asphalt/marshall/marshall.store';
import { Alert, Box } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';

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

const getRequiredEssayList = (materialType: string) => REQUIRED_ESSAYS[materialType] ?? [];

const getMissingEssayText = (missingEssays: string[] = []) => {
  if (!missingEssays.length) return 'Com ensaio';
  if (missingEssays.length === 1) return `Falta ${missingEssays[0]}`;
  return `Faltam ${missingEssays.join(', ')}`;
};

const getRowEssayStateClass = (row: { missingEssays?: string[] }) =>
  (row.missingEssays?.length ?? 0) > 0 ? 'missing-essay-row' : 'has-essay-row';

interface Step2Props {
  header?: string;
  rows: Array<{ _id: string; name: string; type: string; missingEssays?: string[] }>;
  columns: GridColDef[];
}

export const getRequiredEssayLabels = (materialType: string): string[] =>
  getRequiredEssayList(materialType).map(({ label }) => label);

export const buildMissingEssaySummary = (
  selectedRows: Array<{ _id: string; name: string; type: string; missingEssays?: string[] }>
): string => {
  const invalidRows = selectedRows.filter(({ missingEssays }) => (missingEssays ?? []).length > 0);

  if (invalidRows.length === 0) return '';

  return invalidRows
    .map(({ name, missingEssays = [] }) => `• ${name}: ${missingEssays.map((essay) => essay).join(', ')}`)
    .join('\n');
};

const Step2Table = ({ rows, columns, header }: Step2Props & { marshall: Marshall_SERVICE }) => {
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const { setData } = useMarshallStore();

  const selectedRows = useMemo(
    () =>
      rowSelectionModel
        .map((id) => rows.find((_, index) => index === id))
        .filter((row): row is { _id: string; name: string; type: string; missingEssays?: string[] } => Boolean(row)),
    [rowSelectionModel, rows]
  );

  const missingEssaySummary = buildMissingEssaySummary(selectedRows);

  return (
    <Box
      sx={{
        p: '1rem',
        textAlign: 'center',
        border: '1px solid lightgray',
        borderRadius: '10px',
      }}
    >
      <h3>{header}</h3>

      {missingEssaySummary && (
        <Alert severity="warning" sx={{ mb: 1.5, textAlign: 'left' }}>
          {missingEssaySummary}
        </Alert>
      )}

      <Box>
        <DataGrid
          sx={{
            borderRadius: '10px',
            height: 300,
            '& .has-essay-row': {
              backgroundColor: 'rgba(242, 145, 52, 0.08)',
              '&:hover': {
                backgroundColor: 'rgba(242, 145, 52, 0.12)',
              },
            },
            '& .missing-essay-row': {
              backgroundColor: 'rgba(255, 193, 7, 0.08)',
              '&:hover': {
                backgroundColor: 'rgba(255, 193, 7, 0.12)',
              },
            },
          }}
          getRowClassName={(params) => getRowEssayStateClass(params.row as { missingEssays?: string[] })}
          checkboxSelection
          onRowSelectionModelChange={(rowSelection) => {
            if (rows.some((element) => element.type === 'CAP' || element.type === 'asphaltBinder')) {
              if (rowSelection.length > 2) {
                rowSelection = [];
              } else if (rowSelection.length > 1) {
                rowSelection.shift();
              }

              const binder =
                rowSelection.length > 0 ? { name: rows[rowSelection[0]].name, _id: rows[rowSelection[0]]._id } : null;

              setData({ step: 1, key: 'binder', value: binder });
            } else {
              const aggregates = [];

              rowSelection.forEach((rowIndex) => {
                const row = rows[rowIndex];
                if (!row) return;

                aggregates.push({
                  _id: row._id,
                  name: row.name,
                });
              });

              setData({ step: 1, key: 'aggregates', value: aggregates });
            }
            setRowSelectionModel(rowSelection);
          }}
          rowSelectionModel={rowSelectionModel}
          disableColumnSelector
          columns={columns.map((column) => {
            if (column.field === 'name') {
              return {
                ...column,
                renderCell: ({ row }) => {
                  const missingEssayLabels = (row.missingEssays ?? []).map((essayKey: string) => {
                    const definition = getRequiredEssayList(row.type).find((requiredEssay) => requiredEssay.key === essayKey);
                    return definition?.label ?? essayKey;
                  });
                  const hasEssay = missingEssayLabels.length === 0;

                  return (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        width: '100%',
                        minHeight: '100%',
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          fontWeight: 700,
                          color: hasEssay ? 'primary.main' : 'text.primary',
                        }}
                      >
                        {row.name}
                      </Box>

                      <Box
                        component="span"
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '999px',
                          backgroundColor: hasEssay ? 'rgba(242, 145, 52, 0.15)' : 'rgba(255, 193, 7, 0.15)',
                          color: hasEssay ? 'primary.main' : '#8a6d3b',
                          border: hasEssay ? '1px solid rgba(242, 145, 52, 0.4)' : '1px solid rgba(217, 164, 0, 0.4)',
                          px: 1,
                          py: 0.25,
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {hasEssay ? 'Com ensaio' : getMissingEssayText(missingEssayLabels)}
                      </Box>
                    </Box>
                  );
                },
                disableColumnMenu: true,
                sortable: false,
                align: 'center',
                headerAlign: 'center',
                minWidth: 100,
                flex: 1,
              };
            }

            return {
              ...column,
              disableColumnMenu: true,
              sortable: false,
              align: 'center',
              headerAlign: 'center',
              minWidth: 100,
              flex: 1,
            };
          })}
          rows={
            rows !== null
              ? rows.map((row, index) => ({
                  ...row,
                  id: index,
                  missingEssays: row.missingEssays ?? [],
                }))
              : []
          }
          hideFooter
          slots={{
            noRowsOverlay: () => <NoDataFound message="Nenhum material encontrado" />,
            noResultsOverlay: () => <NoDataFound message="Nenhum material encontrado" />,
          }}
        />
      </Box>
    </Box>
  );
};

export default Step2Table;