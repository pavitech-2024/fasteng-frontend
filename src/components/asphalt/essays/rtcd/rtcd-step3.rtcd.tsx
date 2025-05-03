import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useRtcdStore from '@/stores/asphalt/rtcd/rtcd.store';
import { Box, Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Rtcd_Step3 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { rtcdStep3: data, setData } = useRtcdStore();

  const [localRows, setLocalRows] = useState(data.rtcd_data); // Define the 'localRows' variable

  useEffect(() => {
    if (nextDisabled) {
      const hasEmptyValues = localRows.some((item) => Object.values(item).some((value) => value === null));
      if (!hasEmptyValues) setNextDisabled(false);
    }
  }, [localRows, nextDisabled, setNextDisabled]);

  const handleAdd = () => {
    const newRows = [...localRows];
    newRows.push({
      id: localRows.length,
      sampleName: null,
      d1: null,
      d2: null,
      d3: null,
      h1: null,
      h2: null,
      h3: null,
      pressReading: null,
    });
    setData({ step: 2, key: 'data', value: newRows });
    setLocalRows(newRows);
    setNextDisabled(false);
  };

  const handleErase = () => {
    try {
      if (localRows.length > 1) {
        const newRows = [...localRows];
        newRows.pop();
        setData({ step: 2, key: 'data', value: newRows });
        setLocalRows(newRows);
      } else throw t('rtcd.error.minReads');
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

  const isFieldValid = (fieldValue: number) => {
    return fieldValue > 0;
  };

  const columns: GridColDef[] = [
    {
      field: 'sampleName',
      headerName: t('Nome do corpo de prova'),
      width: 110,
      renderCell: ({ row }) => {
        const { sampleName } = row;
        const index = localRows.findIndex((r) => r.sampleName === sampleName);
        return (
          <InputEndAdornment
            adornment={''}
            type="text"
            value={localRows[index].sampleName}
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...localRows];
              newRows[index].sampleName = e.target.value;
              setData({ step: 2, key: 'data', value: newRows });
            }}
          />
        );
      },
    },
    {
      field: 'h1',
      headerName: 'h1',
      width: 80,
      renderCell: ({ row }) => {
        const { h1 } = row;
        const index = localRows.findIndex((r) => r.h1 === h1);
        return (
          <InputEndAdornment
            adornment={''}
            type="number"
            value={localRows[index].h1}
            onChange={(e) => {
              if (e.target.value === null || e.target.value === '0') return;
              const newRows = [...localRows];
              if (!isFieldValid(Number(e.target.value))) {
                throw t('rtcd.invalid.zero.value');
              }
              newRows[index].h1 = Number(e.target.value);
              setData({ step: 2, key: 'data', value: newRows });
            }}
          />
        );
      },
    },
    {
      field: 'h2',
      headerName: 'h2 (mm)',
      width: 80,
      renderCell: ({ row }) => {
        const { h2 } = row;
        const index = localRows.findIndex((r) => r.h2 === h2);
        return (
          <InputEndAdornment
            adornment={''}
            type="number"
            value={localRows[index].h2}
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...localRows];
              if (!isFieldValid(Number(e.target.value))) {
                throw t('rtcd.invalid.zero.value');
              }
              newRows[index].h2 = Number(e.target.value);
              setData({ step: 2, key: 'data', value: newRows });
            }}
          />
        );
      },
    },
    {
      field: 'h3',
      headerName: 'h3 (mm)',
      width: 80,
      renderCell: ({ row }) => {
        const { h3 } = row;
        const index = localRows.findIndex((r) => r.h3 === h3);
        return (
          <InputEndAdornment
            adornment={''}
            type="number"
            value={localRows[index].h3}
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...localRows];
              if (!isFieldValid(Number(e.target.value))) {
                throw t('rtcd.invalid.zero.value');
              }
              newRows[index].h3 = Number(e.target.value);
              setData({ step: 2, key: 'data', value: newRows });
            }}
          />
        );
      },
    },
    {
      field: 'd1',
      headerName: 'd1 (mm)',
      width: 80,
      renderCell: ({ row }) => {
        const { d1 } = row;
        const index = localRows.findIndex((r) => r.d1 === d1);
        return (
          <InputEndAdornment
            adornment={''}
            type="number"
            value={localRows[index].d1}
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...localRows];
              if (!isFieldValid(Number(e.target.value))) {
                throw t('rtcd.invalid.zero.value');
              }
              newRows[index].d1 = Number(e.target.value);
              setData({ step: 2, key: 'data', value: newRows });
            }}
          />
        );
      },
    },
    {
      field: 'd2',
      headerName: 'd2 (mm)',
      width: 80,
      renderCell: ({ row }) => {
        const { d2 } = row;
        const index = localRows.findIndex((r) => r.d2 === d2);
        return (
          <InputEndAdornment
            adornment={''}
            type="number"
            value={localRows[index].d2}
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...localRows];
              if (!isFieldValid(Number(e.target.value))) {
                throw t('rtcd.invalid.zero.value');
              }
              newRows[index].d2 = Number(e.target.value);
              setData({ step: 2, key: 'data', value: newRows });
            }}
          />
        );
      },
    },
    {
      field: 'd3',
      headerName: 'd3 (mm)',
      width: 80,
      renderCell: ({ row }) => {
        const { d3 } = row;
        const index = localRows.findIndex((r) => r.d3 === d3);
        return (
          <InputEndAdornment
            adornment={''}
            type="number"
            value={localRows[index].d3}
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...localRows];
              if (!isFieldValid(Number(e.target.value))) {
                throw t('rtcd.invalid.zero.value');
              }
              newRows[index].d3 = Number(e.target.value);
              setData({ step: 2, key: 'data', value: newRows });
            }}
          />
        );
      },
    },
    {
      field: 'pressReading',
      headerName: 'Leitura da prensa (Kgf)',
      width: 110,
      renderCell: ({ row }) => {
        const { pressReading } = row;
        const index = localRows.findIndex((r) => r.pressReading === pressReading);
        return (
          <InputEndAdornment
            adornment={''}
            type="number"
            value={localRows[index].pressReading}
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...localRows];
              if (!isFieldValid(Number(e.target.value))) {
                throw t('rtcd.invalid.zero.value');
              }
              newRows[index].pressReading = Number(e.target.value);
              setData({ step: 2, key: 'data', value: newRows });
            }}
          />
        );
      },
    },
  ];

  return (
    <DataGrid
      experimentalFeatures={{ columnGrouping: true }}
      showCellVerticalBorder
      showColumnVerticalBorder
      slots={{ footer: ExpansionToolbar }}
      columnGroupingModel={[
        {
          groupId: 'Alturas',
          headerName: 'Alturas',
          headerAlign: 'center',
          children: [{ field: 'h1' }, { field: 'h2' }, { field: 'h3' }],
        },
        {
          groupId: 'Diametros',
          headerName: 'Diametros',
          headerAlign: 'center',
          children: [{ field: 'd1' }, { field: 'd2' }, { field: 'd3' }],
        },
        {
          groupId: 'results',
          headerName: 'Resultados',
          headerAlign: 'center',
          children: [{ field: 'pressReading' }, { field: 'rtMpa' }, { field: 'rtKgf' }],
        },
      ]}
      columns={columns.map((column) => ({
        ...column,
        sortable: false,
        disableColumnMenu: true,
        align: 'center',
        headerAlign: 'center',
        minWidth: 70,
        flex: 1,
      }))}
      rows={localRows}
    />
  );
};

export default Rtcd_Step3;
