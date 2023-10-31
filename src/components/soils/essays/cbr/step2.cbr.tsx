import { EssayPageProps } from '@/components/templates/essay';
import useCbrStore from '@/stores/soils/cbr/cbr.store';
import { t } from 'i18next';
import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';
import InputEndAdornment from '../../../atoms/inputs/input-endAdornment';

const CBR_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { step2Data: data, setData } = useCbrStore();

  const inputs = [
    {
      label: t('cbr.ring_constant'),
      value: data.ring_constant,
      key: 'ring_constant',
      required: true,
      adornment: 'kgf/mm',
    },
    {
      label: t('cbr.cylinder_height'),
      value: data.cylinder_height,
      key: 'cylinder_height',
      required: true,
      adornment: 'mm',
    },
  ];

  const rows = data.extended_reads;

  const columns: GridColDef[] = [
    {
      field: 'minimum_read',
      headerName: t('cbr.minimum_read'),
      valueFormatter: ({ value }) => `${value} min`,
    },
    { field: 'pol', headerName: t('cbr.pol'), valueFormatter: ({ value }) => `${value} pol` },
    { field: 'mm', headerName: t('cbr.mm'), valueFormatter: ({ value }) => `${value} mm` },
    {
      field: 'extended_read',
      headerName: t('cbr.extended_read'),
      renderCell: ({ row }) => {
        const { minimum_read } = row;
        const extended_reads_index = rows.findIndex((r) => r.minimum_read === minimum_read);

        return (
          <InputEndAdornment
            fullWidth
            adornment="mm"
            label={`${t('cbr.readingFor')} ${minimum_read} ${minimum_read > 10 ? 'seg' : 'min'}`}
            type="number"
            inputProps={{ min: 0 }}
            value={rows[extended_reads_index].extended_read}
            onChange={(e) => {
              const newRows = [...rows];
              newRows[extended_reads_index].extended_read = Number(e.target.value);
              setData({ step: 1, key: 'extended_reads', value: newRows });
            }}
          />
        );
      },
    },
  ];

  // Verifica se todos os campos da coluna extended_read estão preenchidos e também ring_constant e cylinder_height
  if (nextDisabled) {
    const extended_reads_completed = rows[3].extended_read !== null && rows[5].extended_read !== null;
    const ring_constant_completed = data.ring_constant !== null;
    const cylinder_height_completed = data.cylinder_height !== null;
    if (extended_reads_completed && ring_constant_completed && cylinder_height_completed) setNextDisabled(false);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          display: 'flex',
          gap: '15px',
          justifyContent: { mobile: 'center', notebook: 'flex-start' },
          flexWrap: 'wrap',
        }}
      >
        {inputs.map((input) => (
          <Box key={input.key}>
            <InputEndAdornment
              label={input.label}
              value={input.value}
              required={input.required}
              onChange={(e) => setData({ step: 1, key: input.key, value: e.target.value })}
              adornment={input.adornment}
              type="number"
              inputProps={{ min: 0 }}
            />
          </Box>
        ))}
      </Box>

      <DataGrid
        sx={{ mt: '1rem', borderRadius: '10px' }}
        density="compact"
        hideFooter
        showCellVerticalBorder
        showColumnVerticalBorder
        experimentalFeatures={{ columnGrouping: true }}
        columnGroupingModel={[
          {
            groupId: t('cbr.penetration'),
            children: [{ field: 'pol' }, { field: 'mm' }],
            headerAlign: 'center',
          },
        ]}
        columns={columns.map((column) => ({
          ...column,
          disableColumnMenu: true,
          sortable: false,
          align: 'center',
          headerAlign: 'center',
          minWidth: column.field === 'extended_read' ? 250 : 100,
          flex: 1,
        }))}
        rows={rows.map((row, index) => ({ ...row, id: index }))}
      />
    </Box>
  );
};

export default CBR_Step2;
