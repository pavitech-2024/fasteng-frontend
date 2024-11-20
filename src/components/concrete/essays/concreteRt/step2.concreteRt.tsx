import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useConcreteRtStore from '@/stores/concrete/concreteRt/concreteRt.store';
import { Box, Button } from '@mui/material';
import { DataGrid, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const ConcreteRt_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { step2Data: data, setData } = useConcreteRtStore();

  const columns: GridColDef[] = [
    {
      field: 'sampleName',
      headerName: t('concrete.essays.sample-name'),
      width: 100,
      renderCell: ({ row }) => {
        const { id } = row;
        return (
          <InputEndAdornment
          adornment=''
            type="text"
            value={data.samples[id - 1].sampleName}
            onChange={(e) => {
              const newData = [...data.samples];
              newData[id - 1].sampleName = e.target.value;
              setData({ step: 1, key: 'samples', value: newData });
            }}
          />
        );
      },
    },
    {
      field: 'ageHours',
      headerName: t('concrete.essays.hours'),
      width: 100,
      renderCell: ({ row }) => {
        const { id } = row;
        return (
          <InputEndAdornment
            adornment="hr"
            type="number"
            value={data.samples[id - 1].age.hours}
            onChange={(e) => {
              const newData = [...data.samples];
              newData[id - 1].age.hours = Number(e.target.value);
              setData({ step: 1, key: 'samples', value: newData });
            }}
          />
        );
      },
    },
    {
      field: 'ageMinutes',
      headerName: t('concrete.essays.minutes'),
      width: 100,
      renderCell: ({ row }) => {
        const { id } = row;
        return (
          <InputEndAdornment
            adornment="min"
            type="number"
            value={data.samples[id - 1].age.minutes}
            onChange={(e) => {
              const newData = [...data.samples];
              newData[id - 1].age.minutes = Number(e.target.value);
              setData({ step: 1, key: 'samples', value: newData });
            }}
          />
        );
      },
    },
    {
      field: 'toleranceHours',
      headerName: t('concrete.essays.hours'),
      width: 100,
      renderCell: ({ row }) => {
        const { id } = row;
        return (
          <InputEndAdornment
            adornment="hr"
            type="number"
            value={data.samples[id - 1].tolerance.hours}
            onChange={(e) => {
              const newData = [...data.samples];
              newData[id - 1].tolerance.hours = Number(e.target.value);
              setData({ step: 1, key: 'samples', value: newData });
            }}
          />
        );
      },
    },
    {
      field: 'toleranceMinutes',
      headerName: t('concrete.essays.minutes'),
      width: 100,
      renderCell: ({ row }) => {
        const { id } = row;
        return (
          <InputEndAdornment
            adornment="min"
            type="number"
            value={data.samples[id - 1].tolerance.minutes}
            onChange={(e) => {
              const newData = [...data.samples];
              newData[id - 1].tolerance.minutes = Number(e.target.value);
              setData({ step: 1, key: 'samples', value: newData });
            }}
          />
        );
      },
    },
    {
      field: 'appliedCharge',
      headerName: t('concrete.essays.applied-charge'),
      width: 120,
      renderCell: ({ row }) => {
        const { id } = row;
        return (
          <InputEndAdornment
            adornment="N"
            type="number"
            value={data.samples[id - 1].appliedCharge}
            onChange={(e) => {
              const newData = [...data.samples];
              newData[id - 1].appliedCharge = Number(e.target.value);
              setData({ step: 1, key: 'samples', value: newData });
            }}
          />
        );
      },
    },
    {
      field: 'supportDistance',
      headerName: t('concrete.essays.supports-distance'),
      width: 120,
      renderCell: ({ row }) => {
        const { id } = row;
        return (
          <InputEndAdornment
            adornment="mm"
            type="number"
            value={data.samples[id - 1].supportDistance}
            onChange={(e) => {
              const newData = [...data.samples];
              newData[id - 1].supportDistance = Number(e.target.value);
              setData({ step: 1, key: 'samples', value: newData });
            }}
          />
        );
      },
    }
  ];

  const columnGrouping: GridColumnGroupingModel = [
    {
      groupId: 'age',
      headerName: t('concrete.essays.age'),
      headerAlign: 'center',
      children: [{ field: 'ageHours' }, { field: 'ageMinutes' }],
    },
    {
      groupId: 'tolerance',
      headerName: t('concrete.essays.used-tolerance'),
      headerAlign: 'center',
      children: [{ field: 'toleranceHours' }, { field: 'toleranceMinutes' }],
    },
  ];

  const handleAdd = () => {
    const newRows = [...data.samples];
    newRows.push({
      id: data.samples.length + 1,
      sampleName: null,
      age: { hours: null, minutes: null },
      tolerance: { hours: null, minutes: null },
      appliedCharge: null,
      supportDistance: null
    });
    setData({ step: 1, key: 'samples', value: newRows });
    setNextDisabled(true);
  };

  const handleErase = () => {
    try {
      if (data.samples.length > 1) {
        const newRows = [...data.samples];
        newRows.pop();
        setData({ step: 1, key: 'samples', value: newRows });
      } else throw t('igg.error.minReads');
    } catch (error) {
      toast.error(error);
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

  useEffect(() => {
    if (
      nextDisabled &&
      !Object.values(data.samples).some(
        (value) =>
          value.sampleName === null        ||
          value.age.hours === null         ||
          value.age.minutes === null       ||
          value.tolerance.hours === null   ||
          value.tolerance.minutes === null ||
          value.appliedCharge === null     ||
          value.supportDistance === null
      )
    )
      setNextDisabled(false);
  }, [data.samples, nextDisabled, setNextDisabled]);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: { mobile: '1fr' },
        gap: '10px',
        mt: '20px',
      }}
    >
      <DataGrid
        columns={columns.map((column) => ({
          ...column,
          sortable: false,
          disableColumnMenu: true,
          align: 'center',
          headerAlign: 'center',
          minWidth: 70,
          flex: 1,
        }))}
        rows={data.samples}
        experimentalFeatures={{ columnGrouping: true }}
        columnGroupingModel={columnGrouping}
        slots={{ footer: ExpansionToolbar }}
      />
    </Box>
  );
};

export default ConcreteRt_Step2;
