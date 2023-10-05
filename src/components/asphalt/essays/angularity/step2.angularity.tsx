import DropDown from '@/components/atoms/inputs/dropDown';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useAngularityStore from '@/stores/asphalt/angularity/angularity.store';
import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import Angularity_step2Table from './tables/step2-table.angularity';

const Angularity_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { step2Data: data, setData } = useAngularityStore();

  const methodOptions = ['A', 'B', 'C'];

  if (data.method && data.determinations && data.determinations.length == 0) {
    const table_data = [];

    if (data.method == 'B') {
      table_data.push({
        diameter: t('angularity.diameter-1'),
        determination: t('angularity.determination-1'),
        cylinder_mass: null,
        cylinder_mass_plus_sample: null,
      });
      table_data.push({
        diameter: t('angularity.diameter-1'),
        determination: t('angularity.determination-2'),
        cylinder_mass: null,
        cylinder_mass_plus_sample: null,
      });

      table_data.push({
        diameter: t('angularity.diameter-2'),
        determination: t('angularity.determination-1'),
        cylinder_mass: null,
        cylinder_mass_plus_sample: null,
      });
      table_data.push({
        diameter: t('angularity.diameter-2'),
        determination: t('angularity.determination-2'),
        cylinder_mass: null,
        cylinder_mass_plus_sample: null,
      });

      table_data.push({
        diameter: t('angularity.diameter-3'),
        determination: t('angularity.determination-1'),
        cylinder_mass: null,
        cylinder_mass_plus_sample: null,
      });
      table_data.push({
        diameter: t('angularity.diameter-3'),
        determination: t('angularity.determination-2'),
        cylinder_mass: null,
        cylinder_mass_plus_sample: null,
      });
    } else {
      table_data.push({
        diameter: '-',
        determination: t('angularity.determination-1'),
        cylinder_mass: null,
        cylinder_mass_plus_sample: null,
      });
      table_data.push({
        diameter: '-',
        determination: t('angularity.determination-2'),
        cylinder_mass: null,
        cylinder_mass_plus_sample: null,
      });
    }

    setData({ step: 1, key: 'determinations', value: table_data });
  }

  const rows = data.determinations;

  const columns: GridColDef[] = [
    {
      field: 'diameter',
      headerName: '',
    },
    {
      field: 'determination',
      headerName: '',
    },
    {
      field: 'cylinder_mass',
      headerName: t('angularity.cylinder_mass'),
      renderCell: ({ row }) => {
        const { determination, diameter } = row;
        const determination_index = rows.findIndex((r) =>
          data.method === 'B'
            ? r.determination === determination && r.diameter === diameter
            : r.determination === determination
        );

        return (
          <InputEndAdornment
            fullWidth
            adornment="g"
            type="number"
            inputProps={{ min: 0 }}
            value={rows[determination_index].cylinder_mass}
            onChange={(e) => {
              const newRows = [...rows];
              newRows[determination_index].cylinder_mass = Number(e.target.value);
              setData({ step: 1, key: 'determinations', value: newRows });
            }}
          />
        );
      },
    },
    {
      field: 'cylinder_mass_plus_sample',
      headerName: t('angularity.cylinder_mass_plus_sample'),
      renderCell: ({ row }) => {
        const { determination, diameter } = row;
        const determination_index = rows.findIndex((r) =>
          data.method === 'B'
            ? r.determination === determination && r.diameter === diameter
            : r.determination === determination
        );

        return (
          <InputEndAdornment
            fullWidth
            adornment="g"
            type="number"
            inputProps={{ min: 0 }}
            value={rows[determination_index].cylinder_mass_plus_sample}
            onChange={(e) => {
              const newRows = [...rows];
              newRows[determination_index].cylinder_mass_plus_sample = Number(e.target.value);
              setData({ step: 1, key: 'determinations', value: newRows });
            }}
          />
        );
      },
    },
  ];

  if (nextDisabled && data.relative_density && data.cylinder_volume && data.method) setNextDisabled(false);

  return (
    <Box>
      <Box
        key={'top'}
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' },
          gap: '10px',
          mt: '20px',
        }}
      >
        <InputEndAdornment
          label={t('angularity.relative_density')}
          value={data.relative_density}
          onChange={(e) => {
            if (e.target.value === null) return;
            setData({ step: 1, key: 'relative_density', value: Number(e.target.value) });
          }}
          adornment={'g/cm³'}
          type="number"
          inputProps={{ min: 0 }}
          required
        />
        <InputEndAdornment
          label={t('angularity.cylinder_volume')}
          value={data.cylinder_volume}
          onChange={(e) => {
            if (e.target.value === null) return;
            setData({ step: 1, key: 'cylinder_volume', value: Number(e.target.value) });
          }}
          adornment={'cm³'}
          type="number"
          inputProps={{ min: 0 }}
          required
        />
        <DropDown
          key={'method'}
          variant="standard"
          label={t('angularity.method')}
          options={methodOptions.map((method) => {
            return { label: method, value: method };
          })}
          defaultValue={{ label: data.method ? data.method : '', value: data.method ? data.method : null }}
          callback={(value) => {
            setData({ step: 1, key: 'method', value });
            setData({ step: 1, key: 'determinations', value: [] });
          }}
          size="medium"
          required
        />
      </Box>
      <Angularity_step2Table rows={rows} columns={columns} />
    </Box>
  );
};

export default Angularity_Step2;
