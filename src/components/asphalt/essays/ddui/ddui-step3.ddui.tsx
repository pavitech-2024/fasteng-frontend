import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useDduiStore from '@/stores/asphalt/ddui.store';
import { Box, Button, Switch } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import Ddui_Step3Table from './tables/ddui_step2Table';

const Ddui_Step3 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { dduiStep3: data, setData } = useDduiStore();

  const rows = data.ddui_data;

  useEffect(() => {
    if (nextDisabled) {
      const hasEmptyValues = data.ddui_data.some((item) => Object.values(item).some((value) => value === null));
      if (!hasEmptyValues) setNextDisabled(false);
    }
  }, [data.ddui_data, nextDisabled, setNextDisabled]);

  const handleAdd = () => {
    const newRows = [...rows];
    newRows.push({
      id: rows.length,
      sampleName: null,
      condicionamento: false,
      d1: null,
      d2: null,
      d3: null,
      h1: null,
      h2: null,
      h3: null,
      pressReading: null,
    });
    setData({ step: 2, key: 'ddui_data', value: newRows });
    setNextDisabled(true);
  };

  const handleErase = () => {
    try {
      if (rows.length > 1) {
        const newRows = [...rows];
        newRows.pop();
        setData({ step: 2, key: 'ddui_data', value: newRows });
      } else throw t('ddui.error.minReads');
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

  const columns: GridColDef[] = [
    {
      field: 'sampleName',
      headerName: 'Nome do corpo de prova',
      width: 110,
      renderCell: ({ row }) => {
        const { sampleName } = row;
        const index = rows.findIndex((r) => r.sampleName === sampleName);
        return (
          <InputEndAdornment
            adornment={''}
            type="text"
            value={rows[index].sampleName}
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...rows];
              newRows[index].sampleName = e.target.value;
              setData({ step: 2, key: 'ddui_data', value: newRows });
            }}
          />
        );
      },
    },
    {
      field: 'condicionamento',
      headerName: 'Condicionamento',
      width: 110,
      renderCell: ({ row }) => {
        const { h1 } = row;
        const index = rows.findIndex((r) => r.h1 === h1);
        return (
          <Switch
            value={rows[index].condicionamento}
            onChange={() => {
              const newRows = [...rows];
              rows[index].condicionamento = !rows[index].condicionamento;
              setData({ step: 2, key: 'ddui_data', value: newRows });
            }}
          />
        );
      },
    },
    {
      field: 'h1',
      headerName: 'h1',
      type: 'number',
      width: 80,
      renderCell: ({ row }) => {
        const { h1 } = row;
        const index = rows.findIndex((r) => r.h1 === h1);
        return (
          <InputEndAdornment
            adornment={''}
            type="number"
            value={rows[index].h1}
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...rows];
              newRows[index].h1 = Number(e.target.value);
              setData({ step: 2, key: 'ddui_data', value: newRows });
            }}
          />
        );
      },
    },
    {
      field: 'h2',
      headerName: 'h2',
      type: 'number',
      width: 80,
      renderCell: ({ row }) => {
        const { h2 } = row;
        const index = rows.findIndex((r) => r.h2 === h2);
        return (
          <InputEndAdornment
            adornment={''}
            type="number"
            value={rows[index].h2}
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...rows];
              newRows[index].h2 = Number(e.target.value);
              setData({ step: 2, key: 'ddui_data', value: newRows });
            }}
          />
        );
      },
    },
    {
      field: 'h3',
      headerName: 'h3',
      type: 'number',
      width: 80,
      renderCell: ({ row }) => {
        const { h3 } = row;
        const index = rows.findIndex((r) => r.h3 === h3);
        return (
          <InputEndAdornment
            adornment={''}
            type="number"
            value={rows[index].h3}
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...rows];
              newRows[index].h3 = Number(e.target.value);
              setData({ step: 2, key: 'ddui_data', value: newRows });
            }}
          />
        );
      },
    },
    {
      field: 'd1',
      headerName: 'd1',
      type: 'number',
      width: 80,
      renderCell: ({ row }) => {
        const { d1 } = row;
        const index = rows.findIndex((r) => r.d1 === d1);
        return (
          <InputEndAdornment
            adornment={''}
            type="number"
            value={rows[index].d1}
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...rows];
              newRows[index].d1 = Number(e.target.value);
              setData({ step: 2, key: 'ddui_data', value: newRows });
            }}
          />
        );
      },
    },
    {
      field: 'd2',
      headerName: 'd2',
      type: 'number',
      width: 80,
      renderCell: ({ row }) => {
        const { d2 } = row;
        const index = rows.findIndex((r) => r.d2 === d2);
        return (
          <InputEndAdornment
            adornment={''}
            type="number"
            value={rows[index].d2}
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...rows];
              newRows[index].d2 = Number(e.target.value);
              setData({ step: 2, key: 'ddui_data', value: newRows });
            }}
          />
        );
      },
    },
    {
      field: 'd3',
      headerName: 'd3',
      type: 'number',
      width: 80,
      renderCell: ({ row }) => {
        const { d3 } = row;
        const index = rows.findIndex((r) => r.d3 === d3);
        return (
          <InputEndAdornment
            adornment={''}
            type="number"
            value={rows[index].d3}
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...rows];
              newRows[index].d3 = Number(e.target.value);
              setData({ step: 2, key: 'ddui_data', value: newRows });
            }}
          />
        );
      },
    },
    {
      field: 'pressReading',
      headerName: 'Leitura da prensa',
      type: 'number',
      width: 110,
      renderCell: ({ row }) => {
        const { pressReading } = row;
        const index = rows.findIndex((r) => r.pressReading === pressReading);
        return (
          <InputEndAdornment
            adornment={''}
            type="number"
            value={rows[index].pressReading}
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...rows];
              newRows[index].pressReading = Number(e.target.value);
              setData({ step: 2, key: 'ddui_data', value: newRows });
            }}
          />
        );
      },
    },
  ];

  return <Ddui_Step3Table rows={rows} columns={columns} footer={ExpansionToolbar} />;
};

export default Ddui_Step3;
