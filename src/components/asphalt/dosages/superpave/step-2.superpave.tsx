import { EssayPageProps } from '@/components/templates/essay';
import { Box } from '@mui/material';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import CreateMaterialDosageTable from './tables/createMaterialDosageTable';
import AsphaltGranulometry_step2Table from '../../essays/granulometry/tables/step2-table.granulometry';
import { useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';

const Superpave_Step2 = ({ setNextDisabled, nextDisabled }: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const data = useSuperpaveStore((state) => state.granulometryEssayData);
  console.log("🚀 ~ constSuperpave_Step2= ~ data:", data)

  const [materials, setMaterials] = useState([]);
  console.log('🚀 ~ constSuperpave_Step2= ~ materials:', materials);

  const rows = data.granulometrys.map((granul) => ({ ...granul }));

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
          if (!rows) {
            return;
          }
          const { sieve_label } = row;
          const sieve_index = rows.findIndex((r) => r.sieve_label === sieve_label);
  
          return (
            <InputEndAdornment
              fullWidth
              adornment="%"
              type="number"
              inputProps={{ min: 0 }}
              value={rows[sieve_index]?.passant}
              required
              onChange={(e) => {
                if (e.target.value === null) return;
                const newRows = [...rows];
                const mass = data.material_mass;
                const current_passant = Number(e.target.value);
  
                const currentRows = sieve_index > 0 ? newRows.slice(0, sieve_index) : [];
                const initial_retained = 0;
                const accumulative_retained = currentRows.reduce(
                  (accumulator: number, current_value) => accumulator + current_value.retained,
                  initial_retained
                );
  
                const current_retained =
                  Math.round(100 * (mass !== 0 ? ((100 - current_passant) / 100) * mass - accumulative_retained : 0)) /
                  100;
  
                newRows[sieve_index].passant = current_passant;
                newRows[sieve_index].retained = current_retained;
                setData({ step: 1, key: 'passant', value: newRows });
                setData({ step: 1, key: 'retained', value: newRows });
  
                const nextRows = sieve_index > 0 ? newRows.slice(sieve_index) : [...rows];
  
                const new_current_accumulative_retained = accumulative_retained;
  
                nextRows.map(function (item, index) {
                  const row = item;
  
                  if (index > 0) {
                    const currentRows = nextRows.slice(0, index + 1);
  
                    const initial_retained = new_current_accumulative_retained;
                    const accumulative_retained = currentRows.reduce(
                      (accumulator: number, current_value) => accumulator + current_value.retained,
                      initial_retained
                    );
  
                    const retained =
                      Math.round(100 * (mass !== 0 ? ((100 - row.passant) / 100) * mass - accumulative_retained : 0)) /
                      100;
  
                    const passant =
                      Math.round(100 * (mass !== 0 ? (100 * (mass - accumulative_retained)) / mass : 0)) / 100;
  
                    newRows.map((e) => {
                      if (e.sieve_label === row.sieve_label) {
                        e.passant = passant;
                      }
                    });
                  }
                });
  
                setData({ step: 1, key: 'table_data', value: newRows });
              }}
            />
          );
        },
      },
      {
        field: 'retained',
        headerName: t('granulometry-asphalt.retained'),
        renderCell: ({ row }) => {
          if (!rows) {
            return;
          }
          const { sieve_label } = row;
          const sieve_index = rows.findIndex((r) => r.sieve_label === sieve_label);
  
          return (
            <InputEndAdornment
              fullWidth
              adornment="g"
              type="number"
              inputProps={{ min: 0 }}
              value={rows[sieve_index]?.retained}
              required
              onChange={(e) => {
                if (e.target.value === null) return;
                const newRows = [...rows];
                const mass = data.material_mass;
                const current_retained = Number(e.target.value);
  
                const currentRows = sieve_index > 0 ? newRows.slice(0, sieve_index) : [];
                const initial_retained = current_retained;
                const current_accumulative_retained = currentRows.reduce(
                  (accumulator: number, current_value) => accumulator + current_value.retained,
                  initial_retained
                );
  
                const current_passant =
                  Math.round(100 * (mass !== 0 ? (100 * (mass - current_accumulative_retained)) / mass : 0)) / 100;
                newRows[sieve_index].retained = current_retained;
                newRows[sieve_index].passant = current_passant;
                setData({ step: 1, key: 'retained', value: newRows });
                setData({ step: 1, key: 'passant', value: newRows });
  
                const nextRows = sieve_index > 0 ? newRows.slice(sieve_index) : [...rows];
  
                const new_current_accumulative_retained = current_accumulative_retained - current_retained;
  
                nextRows.map(function (item, index) {
                  const row = item;
  
                  if (index > 0) {
                    const currentRows = nextRows.slice(0, index + 1);
  
                    const initial_retained = new_current_accumulative_retained;
                    const accumulative_retained = currentRows.reduce(
                      (accumulator: number, current_value) => accumulator + current_value.retained,
                      initial_retained
                    );
  
                    const passant =
                      Math.round(100 * (mass !== 0 ? (100 * (mass - accumulative_retained)) / mass : 0)) / 100;
  
                    newRows.map((e) => {
                      if (e.sieve_label === row.sieve_label) {
                        e.passant = passant;
                      }
                    });
                  }
                });
  
                setData({ step: 1, key: 'table_data', value: newRows });
              }}
            />
          );
        },
      },
    ];

  return (
    <Box>
      <CreateMaterialDosageTable onMaterialCreation={(materials) => setMaterials(materials)} />
      <AsphaltGranulometry_step2Table rows={[]} columns={[]} />
    </Box>
  );
};

export default Superpave_Step2;
