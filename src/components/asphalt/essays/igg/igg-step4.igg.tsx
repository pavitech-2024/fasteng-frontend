import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useIggStore from '@/stores/asphalt/igg/igg.store';
import { Box, Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Igg_Step4 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { iggStep4: data, setData } = useIggStore();

  const [localRows, setLocalRows] = useState(data.sections.map((row, index) => ({ ...row, id: index })));
  useEffect(() => {
    if (nextDisabled) {
      const hasEmptyValues = localRows.some((item) => Object.values(item).some((value) => value === null));
      if (!hasEmptyValues) setNextDisabled(false);
    }
  }, [localRows, nextDisabled, setNextDisabled]);

  const handleAdd = () => {
    const maxId = localRows.length > 0 ? Math.max(...localRows.map((row) => row.id)) : 0;
    const newRow = {
      id: maxId + 1,
      initial: null,
      final: null,
    };
    const newRows = [...localRows, newRow];
    setData({ step: 3, key: 'sections', value: newRows });
    setLocalRows((prevRows) => [...prevRows, newRow]);
    setNextDisabled(false);
  };

  const handleErase = () => {
    try {
      if (localRows.length > 1) {
        const newRows = [...localRows];
        newRows.pop();
        setData({ step: 3, key: 'sections', value: newRows });
        setLocalRows((prevRows) => [...prevRows.slice(0, -1)]);
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

  const isFieldValid = (fieldValue: number) => {
    return fieldValue > 0;
  };

  const columns: GridColDef[] = [
    {
      field: 'initialStake',
      headerName: t('Estaca Inicial'),
      width: 100,
      renderCell: ({ row }) => {
        const { initial } = row;
        return (
          <InputEndAdornment
            adornment={''}
            type="number"
            value={initial === null ? '' : initial.toString()}
            onChange={(e) => {
              if (e.target.value === null || e.target.value === '0') return;
              const newValue = Number(e.target.value);
              if (!isFieldValid(newValue)) {
                throw t('igg.invalid.zero.value');
              }
              const newRows = localRows.map((r) => {
                if (r.id === row.id) {
                  return { ...r, initial: newValue };
                }
                return r;
              });

              setData({ step: 3, key: 'sections', value: newRows });
              setLocalRows(newRows);
            }}
          />
        );
      },
    },
    {
      field: 'finalStake',
      headerName: t('Estaca Final'),
      width: 100,
      renderCell: ({ row }) => {
        const { final } = row;
        return (
          <InputEndAdornment
            adornment={''}
            type="number"
            value={final === null ? '' : final.toString()}
            onChange={(e) => {
              if (e.target.value === null || e.target.value === '0') return;
              const newValue = Number(e.target.value);
              if (!isFieldValid(newValue)) {
                throw t('igg.invalid.zero.value');
              }
              const newRows = localRows.map((r) => {
                if (r.id === row.id) {
                  return { ...r, final: newValue };
                }
                return r;
              });
              setData({ step: 3, key: 'sections', value: newRows });
              setLocalRows(newRows);
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
          groupId: 'sections',
          headerName: 'Trecho',
          headerAlign: 'center',
          children: [{ field: 'initialStake' }, { field: 'finalStake' }],
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
      getRowId={(row) => row.id}
    />
  );
};

export default Igg_Step4;
