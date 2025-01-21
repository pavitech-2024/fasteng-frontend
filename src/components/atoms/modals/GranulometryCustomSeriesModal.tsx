import { AddIcon, DeleteIcon } from '@/assets';
import AsphaltGranulometry_step2Table from '@/components/asphalt/essays/granulometry/tables/step2-table.granulometry';
import ModalBase from '@/components/molecules/modals/modal';
import { AllSieves, AllSieveSeries, Sieve } from '@/interfaces/common';
import { getSieveSeries } from '@/utils/sieves';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useCallback, useEffect, useMemo, useState } from 'react';

type Rows = {
  id: number;
  title: string;
  isSelected: boolean;
  label: string;
};

interface IGranulometryCustomSeriesModal {
  isOpen: boolean;
  setCloseModal: (isClose: boolean) => void;
  customSieveSeries: (customSieveSeries: Sieve[]) => void;
}

const GranulometryCustomSeriesModal = ({ isOpen, setCloseModal, customSieveSeries }: IGranulometryCustomSeriesModal) => {
  const [rows, setRows] = useState<Rows[]>([]);

  // Filters the rows dynamically
  const selectedRows = useMemo(() => rows.filter((row) => row.isSelected), [rows]);

  // Update the rows state on the component mount
  useEffect(() => {
    const updatedRows = getSieveSeries(0).sieves.map((sieve, idx) => ({
      id: idx,
      title: `${sieve.label}`,
      isSelected: false,
      label: `${sieve.label}`,
    }));
    setRows(updatedRows);
  }, []);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'title',
        headerName: 'Peneiras',
        width: 300,
      },
      {
        field: 'btn',
        headerName: 'Adicionar/Remover',
        width: 300,
        renderCell: (params) => (
          <Button
            sx={{
              display: 'flex',
              color: params.row.isSelected ? 'secondaryTons.green' : 'secondaryTons.red',
              gap: '1rem',
              ':hover': {
                color: 'secondaryTons.green',
                transform: 'scale(1.2)',
                transition: 'transform 0.1s ease-in-out, color 0.1s ease-in-out',
              },
            }}
            onClick={() => handleSelectSieve(params)}
          >
            {params.row.isSelected ? <DeleteIcon /> : <AddIcon />}
            <Typography variant="body1">{params.row.isSelected ? 'Remover' : 'Adicionar'}</Typography>
          </Button>
        ),
      },
    ],
    []
  );

  // Change a sieve selection
  const handleSelectSieve = useCallback((params) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === params.id
          ? { ...row, isSelected: !row.isSelected } // Toggle rows.isSelected value
          : row
      )
    );
  }, []);

  const handleConfirmSieveSelection = () => {
    const customSeries = AllSieves.filter((sieve) => {
      for(let i = 0; i < selectedRows.length; i++) {
        if (sieve.label === selectedRows[i].label) {
          return sieve;
        }
      }
    });

    customSieveSeries(customSeries);
    setCloseModal(false);
  }

  const handleClose = () => {
    setCloseModal(false);
  };

  return (
    <ModalBase
      title={'Selecione as peneiras que deseja utilizar neste ensaio'}
      leftButtonTitle={'Cancelar'}
      rightButtonTitle={'Confirmar'}
      onCancel={handleClose}
      onSubmit={() => handleConfirmSieveSelection()}
      open={isOpen}
      size={'large'}
    >
      <Box sx={{ marginTop: '1rem' }}>
        <Typography variant="body2">
          {`Número de peneiras selecionadas: ${selectedRows.length}`}
        </Typography>
      </Box>
      <DataGrid
        columns={columns.map((col) => ({
          ...col,
          flex: 1,
          width: 200,
          headerAlign: 'center',
          align: 'center',
        }))}
        rows={rows}
        hideFooter
        disableColumnMenu
      />
    </ModalBase>
  );
};

export default GranulometryCustomSeriesModal;
