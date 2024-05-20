import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import Step3InputTable from './tables/step-3-input-table';
import Step3Table from './tables/step-3-table';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';

const Superpave_Step3 = ({
  nextDisabled,
  setNextDisabled,
  superpave,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { 
    granulometryCompositionData: data, 
    materialSelectionData,
    setData
  } = useSuperpaveStore();

  const { user } = useAuth();

  const inputRows: { [key: string]: number }[] = data?.percentageInputs;
  const inputColumns: GridColDef[] = [];

  // Tabela de dados
  const rows = data?.table_data?.table_rows;
  const columnGrouping = [];
  const columns: GridColDef[] = [];

  if (data?.percentageInputs && data?.percentageInputs?.length === 0) {
    const table_data = [];

    const aggregates_percentages = {};

    materialSelectionData.aggregates.forEach((aggregate) => {
      const { _id } = aggregate;
      aggregates_percentages['percentage_'.concat(_id)] = null;
    });

    table_data?.push({ ...aggregates_percentages });

    setData({ step: 2, key: 'percentageInputs', value: table_data });
  }

  materialSelectionData.aggregates.forEach((aggregate) => {
    const { _id, name } = aggregate;

    inputColumns.push({
      field: 'percentage_'.concat(_id),
      headerName: name,
      valueFormatter: ({ value }) => `${value}`,
      renderCell: ({ row }) => {
        if (!inputRows) {
          return;
        }

        return (
          <InputEndAdornment
            adornment={'%'}
            type="number"
            value={inputRows[0] ? inputRows[0]['percentage_'.concat(_id)] : ''}
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...inputRows];
              newRows[0]['percentage_'.concat(_id)] = Number(e.target.value);
              setData({ step: 2, key: 'percentageInputs', value: newRows });
            }}
          />
        );
      },
    });
  });

  nextDisabled && setNextDisabled(false);

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
          <Typography>
            Escolha as curvas desejadas e insira as porcentagens de cada agregado na composição da mistura.
          </Typography>

          <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
            <FormControlLabel control={<Checkbox />} label="curva inferior" />
            <FormControlLabel control={<Checkbox />} label="curva intermediária" />
            <FormControlLabel control={<Checkbox />} label="curva superior" />
          </FormGroup>

          {data?.percentageInputs?.length > 0 && (
            <Step3InputTable rows={inputRows} columns={inputColumns} superpave={superpave} />
          )}

          <Step3Table rows={rows} columns={columns} columnGrouping={columnGrouping} superpave={superpave} />
        </Box>
      )}
    </>
  );
};

export default Superpave_Step3;
