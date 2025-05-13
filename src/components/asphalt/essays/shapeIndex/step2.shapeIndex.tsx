import DropDown, { DropDownOption } from '@/components/atoms/inputs/dropDown';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useShapeIndexStore from '@/stores/asphalt/shapeIndex/shapeIndex.store';
import { Box, Button } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import ShapeIndex_step2_Circular_Sieve_Table from './tables/step2-circular-sieve-table.shapeIndex';
import ShapeIndex_step2_Sieve_Table from './tables/step2-sieve-table.shapeIndex';
import { AllSieves } from '@/interfaces/common';
import ShapeIndex_step2_Reads_Table from './tables/step2-reads-table.shapeIndex';
import { toast } from 'react-toastify';

const ShapeIndex_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { step2Data: data, setData } = useShapeIndexStore();

  const methodOptions: DropDownOption[] = [
    { label: t('shapeIndex.circular_sieve'), value: 'sieve' },
    { label: t('shapeIndex.pachymeter'), value: 'pachymeter' },
  ];

  const graduationOptions: DropDownOption[] = [
    { label: 'A', value: 'A' },
    { label: 'B', value: 'B' },
    { label: 'C', value: 'C' },
    { label: 'D', value: 'D' },
  ];

  const sieveOptions: DropDownOption[] = data.sieves_table_data.map((row) => {
    return { label: row.label, value: row.label };
  });

  if (data.method && data.method == 'sieve' && data.graduation && data.circular_sieves_table_data.length == 0) {
    const table_data = [];

    if (data.graduation === 'A') {
      table_data.push({
        label: '76,0 - 63,5',
        sieve1: null,
        sieve2: null,
      });
      table_data.push({
        label: '63,5 - 50,0',
        sieve1: null,
        sieve2: null,
      });
      table_data.push({
        label: '50,0 - 38,0',
        sieve1: null,
        sieve2: null,
      });
      table_data.push({
        label: '38,0 - 32,0',
        sieve1: null,
        sieve2: null,
      });
    }

    if (data.graduation === 'B') {
      table_data.push({
        label: '32,0 - 25,0',
        sieve1: null,
        sieve2: null,
      });
      table_data.push({
        label: '25,0 - 19,0',
        sieve1: null,
        sieve2: null,
      });
      table_data.push({
        label: '19,0 - 16,0',
        sieve1: null,
        sieve2: null,
      });
    }

    if (data.graduation === 'C') {
      table_data.push({
        label: '19,0 - 16,0',
        sieve1: null,
        sieve2: null,
      });
      table_data.push({
        label: '16,0 - 12,7',
        sieve1: null,
        sieve2: null,
      });
      table_data.push({
        label: '12,7 - 9,5',
        sieve1: null,
        sieve2: null,
      });
    }

    if (data.graduation === 'D') {
      table_data.push({
        label: '12,7 - 9,5',
        sieve1: null,
        sieve2: null,
      });
      table_data.push({
        label: '9,5 - 6,3',
        sieve1: null,
        sieve2: null,
      });
    }

    setData({ step: 1, key: 'circular_sieves_table_data', value: table_data });
  }

  if (data.method && data.method == 'pachymeter' && data.sieves_table_data.length == 0) {
    const table_data = [];

    AllSieves.map((sieve) => {
      table_data.push({
        label: sieve.label,
        retained_mass: null,
        grains_count: 0,
      });
    });

    setData({ step: 1, key: 'sieves_table_data', value: table_data });
  }

  const circular_sieve_rows = data.circular_sieves_table_data;

  const circular_sieve_columns: GridColDef[] = [
    {
      field: 'label',
      headerName: t('shapeIndex.circular_sieves'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'sieve1',
      headerName: t('shapeIndex.circular_sieve') + ' 1',
      renderCell: ({ row }) => {
        const { label } = row;
        const label_index = circular_sieve_rows.findIndex((r) => r.label === label);

        return (
          <InputEndAdornment
            fullWidth
            adornment=""
            type="number"
            inputProps={{ min: 0 }}
            value={circular_sieve_rows[label_index].sieve1}
            onChange={(e) => {
              const newRows = [...circular_sieve_rows];
              newRows[label_index].sieve1 = Number(e.target.value);
              setData({ step: 1, key: 'circular_sieves_table_data', value: newRows });
            }}
          />
        );
      },
    },
    {
      field: 'sieve2',
      headerName: t('shapeIndex.circular_sieve') + ' 2',
      renderCell: ({ row }) => {
        const { label } = row;
        const label_index = circular_sieve_rows.findIndex((r) => r.label === label);

        return (
          <InputEndAdornment
            fullWidth
            adornment=""
            type="number"
            inputProps={{ min: 0 }}
            value={circular_sieve_rows[label_index].sieve2}
            onChange={(e) => {
              const newRows = [...circular_sieve_rows];
              newRows[label_index].sieve2 = Number(e.target.value);
              setData({ step: 1, key: 'circular_sieves_table_data', value: newRows });
            }}
          />
        );
      },
    },
  ];

  const sieve_rows = data.sieves_table_data;

  const sieve_columns: GridColDef[] = [
    {
      field: 'label',
      headerName: t('shapeIndex.sieve'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'retained_mass',
      headerName: t('shapeIndex.retained_mass'),
      renderCell: ({ row }) => {
        const { label } = row;
        const label_index = sieve_rows.findIndex((r) => r.label === label);

        return (
          <InputEndAdornment
            fullWidth
            adornment="g"
            type="number"
            inputProps={{ min: 0 }}
            value={sieve_rows[label_index].retained_mass}
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...sieve_rows];
              const mass = data.total_mass;
              const retained_mass = Number(e.target.value);

              const grains_count = Math.floor(
                mass !== 0 && retained_mass !== 0 ? 200 / ((retained_mass / mass) * 100) : 0
              );

              newRows[label_index].retained_mass = retained_mass;
              newRows[label_index].grains_count = grains_count;
              setData({ step: 1, key: 'sieves_table_data', value: newRows });
            }}
          />
        );
      },
    },
    {
      field: 'grains_count',
      headerName: t('shapeIndex.grains_count'),
      valueFormatter: ({ value }) => `${value}`,
    },
  ];

  const reads_rows = data.reads_table_data;

  const reads_columns: GridColDef[] = [
    {
      field: 'sieve',
      headerName: t('shapeIndex.sieve'),
      valueFormatter: ({ value }) => `${value}`,
      renderCell: ({ row }) => {
        const { id } = row;
        const index = reads_rows.findIndex((r) => r.id === id);

        return (
          <DropDown
            key={'sieve'}
            variant="standard"
            label={''}
            options={sieveOptions.filter((option) => {
              const grains_count = data.sieves_table_data.find((sieve) => option.label === sieve.label).grains_count;
              if (grains_count > 0) return { label: option.label, value: option.value };
            })}
            callback={(value) => {
              const newRows = [...reads_rows];
              newRows[index].sieve = String(value);
              setData({ step: 1, key: 'reads_table_data', value: newRows });
            }}
            size="medium"
          />
        );
      },
    },
    {
      field: 'length',
      headerName: t('shapeIndex.length'),
      valueFormatter: ({ value }) => `${value}`,
      renderCell: ({ row }) => {
        const { id } = row;
        const index = reads_rows.findIndex((r) => r.id === id);

        return (
          <InputEndAdornment
            fullWidth
            adornment="mm"
            type="number"
            inputProps={{ min: 0 }}
            value={row.length}
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...reads_rows];
              newRows[index].length = Number(e.target.value);
              setData({ step: 1, key: 'reads_table_data', value: newRows });
            }}
          />
        );
      },
    },
    {
      field: 'thickness',
      headerName: t('shapeIndex.thickness'),
      valueFormatter: ({ value }) => `${value}`,
      renderCell: ({ row }) => {
        const { id } = row;
        const index = reads_rows.findIndex((r) => r.id === id);

        return (
          <InputEndAdornment
            fullWidth
            adornment="mm"
            type="number"
            inputProps={{ min: 0 }}
            value={row.thickness}
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...reads_rows];
              newRows[index].thickness = Number(e.target.value);
              setData({ step: 1, key: 'reads_table_data', value: newRows });
            }}
          />
        );
      },
    },
  ];

  const handleAdd = () => {
    try {
      const init_value = 0;
      const total_grains_count: number = sieve_rows.reduce((accumulator: number, current_sieve) => {
        return Number(accumulator + current_sieve.grains_count);
      }, init_value);
      if (total_grains_count - reads_rows.length > 0) {
        const newRows = [...reads_rows];
        newRows.push({
          id: reads_rows.length,
          sieve: null,
          length: null,
          thickness: null,
        });
        setData({ step: 1, key: 'reads_table_data', value: newRows });
        setNextDisabled(true);
      } else throw t('shapeIndex.error.grains-count-value');
    } catch (error) {
      toast.error(error);
    }
  };

  const handleErase = () => {
    if (reads_rows.length > 0) {
      const newRows = [...reads_rows];
      newRows.pop();
      setData({ step: 1, key: 'reads_table_data', value: newRows });
    }
  };

  const ExpansionToolbar = () => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem', flexWrap: 'wrap' }}>
        <Button sx={{ color: 'secondaryTons.red' }} onClick={handleErase}>
          {t('erase')}
        </Button>
        <Button sx={{ color: 'secondaryTons.green' }} onClick={handleAdd}>
          {t('add')}
        </Button>
      </Box>
    );
  };

  if (nextDisabled && data.method && data.total_mass && (data.method === 'sieve' ? data.graduation : true))
    setNextDisabled(false);

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
        <DropDown
          key={'essay_method'}
          variant="standard"
          label={t('shapeIndex.choose-method')}
          value={data.method ? { label: data.method, value: data.method } : null}
          options={methodOptions.map((method) => {
            return { label: method.label, value: method.value };
          })}
          callback={(value) => {
            setData({ step: 1, key: 'method', value });
            setData({ step: 1, key: 'graduation', value: null });
            setData({ step: 1, key: 'circular_sieves_table_data', value: [] });
            setData({ step: 1, key: 'sieves_table_data', value: [] });
            setData({ step: 1, key: 'reads_table_data', value: [] });
          }}
          size="medium"
          required
        />
        <InputEndAdornment
          label={t('shapeIndex.total_mass')}
          value={data.total_mass}
          onChange={(e) => {
            if (e.target.value === null) return;
            const mass = Number(e.target.value);

            setData({ step: 1, key: 'total_mass', value: mass });

            const newRows = [...sieve_rows];
            data.sieves_table_data.forEach((sieve, index) => {
              const retained_mass = sieve.retained_mass;
              if (retained_mass) {
                const grains_count = Math.floor(
                  mass !== 0 && retained_mass !== 0 ? 200 / ((retained_mass / mass) * 100) : 0
                );
                newRows[index].grains_count = grains_count;
              }
            });
            setData({ step: 1, key: 'sieves_table_data', value: newRows });
          }}
          adornment={'g'}
          type="number"
          inputProps={{ min: 0 }}
          required
        />
        {data.method === 'sieve' ? (
          <DropDown
            key={'graduation'}
            variant="standard"
            label={t('shapeIndex.choose-graduation')}
            value={data.graduation ? { label: data.graduation, value: data.graduation } : null}
            options={graduationOptions.map((graduation) => {
              return { label: graduation.label, value: graduation.value };
            })}
            callback={(value) => {
              if (data.graduation !== value) setData({ step: 1, key: 'circular_sieves_table_data', value: [] });
              setData({ step: 1, key: 'graduation', value });
            }}
            size="medium"
            required
          />
        ) : (
          <></>
        )}
      </Box>
      {data.method ? (
        data.method === 'sieve' ? (
          <ShapeIndex_step2_Circular_Sieve_Table rows={circular_sieve_rows} columns={circular_sieve_columns} />
        ) : (
          <>
            <ShapeIndex_step2_Sieve_Table rows={sieve_rows} columns={sieve_columns} />
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                mt: '20px',
                p: '1rem',
                borderRadius: '10px',
                border: '#e0e0e0 solid 1px',
              }}
            >
              <span style={{ fontWeight: '700', textAlign: 'center' }}>{t('shapeIndex.reads')}</span>
              <ShapeIndex_step2_Reads_Table rows={reads_rows} columns={reads_columns} footer={ExpansionToolbar} />
            </Box>
          </>
        )
      ) : (
        <></>
      )}
    </Box>
  );
};

export default ShapeIndex_Step2;
