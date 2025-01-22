import { AddIcon, DeleteIcon } from '@/assets';
import AsphaltGranulometry_step2Table from '@/components/asphalt/essays/granulometry/tables/step2-table.granulometry';
import ModalBase from '@/components/molecules/modals/modal';
import { AllSieves, AllSieveSeries, Sieve } from '@/interfaces/common';
import { getSieveSeries } from '@/utils/sieves';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
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

const GranulometryCustomSeriesModal = ({
  isOpen,
  setCloseModal,
  customSieveSeries,
}: IGranulometryCustomSeriesModal) => {
  const [rows, setRows] = useState<Rows[]>([]);

  // Filters the rows dynamically
  const selectedRows = useMemo(() => rows.filter((row) => row.isSelected), [rows]);

  const hasInsuficientSieves = selectedRows.length < 4;

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

  const scrollToTop = () => {
    const sievesQuantityElement = document.querySelector('#sieves-quantity') as HTMLElement;
    if (sievesQuantityElement) {
      sievesQuantityElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleConfirmSieveSelection = () => {
    if (selectedRows.length >= 4) {
      const customSeries = AllSieves.filter((sieve) => {
        for (let i = 0; i < selectedRows.length; i++) {
          if (sieve.label === selectedRows[i].label) {
            return sieve;
          }
        }
      });

      customSieveSeries(customSeries);
      setCloseModal(false);
    } else {
      scrollToTop();
    }
  };

  const handleClose = () => {
    setCloseModal(false);
  };

  return (
    <ModalBase
      title={t('graulometry.custom-sieves-modal-title')}
      leftButtonTitle={'Cancelar'}
      rightButtonTitle={'Confirmar'}
      onCancel={handleClose}
      onSubmit={() => handleConfirmSieveSelection()}
      open={isOpen}
      size={'large'}
    >
      <Box 
        id={'sieves-quantity'} 
        sx={{ marginTop: '1rem' }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            color: hasInsuficientSieves ? 'secondaryTons.red' : '', 
            marginY: '1rem',
            transition: 'font-size 3s ease',
          }}
        >
          {`${t('graulometry.sieves-quantity')}: ${selectedRows.length}`}
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
