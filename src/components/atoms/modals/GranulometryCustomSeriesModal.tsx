import AsphaltGranulometry_step2Table from '@/components/asphalt/essays/granulometry/tables/step2-table.granulometry';
import ModalBase from '@/components/molecules/modals/modal';
import { AllSieveSeries } from '@/interfaces/common';
import { getSieveSeries } from '@/utils/sieves';
import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface IGranulometryCustomSeriesModal {
  isOpen: boolean;
  setCloseModal: (isClose: boolean) => void;
}

const GranulometryCustomSeriesModal = ({ isOpen, setCloseModal }: IGranulometryCustomSeriesModal) => {

  const rows = getSieveSeries(0).sieves.map((sieve, idx) => ({
    id: idx,
    title: `${sieve.label}`,
  }));

  console.log("🚀 ~ rows ~ rows:", rows)

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Peneiras',
      width: 300,
    },
  ];

  const handleClose = () => {
    setCloseModal(false);
  };

  return (
    <ModalBase
      title={'Selecione as peneiras que deseja utilizar neste ensaio'}
      leftButtonTitle={'Cancelar'}
      rightButtonTitle={'Confirmar'}
      onCancel={handleClose}
      open={isOpen}
      size={'large'}
    >
      <DataGrid
        columns={columns.map((col) => ({
          ...col,
          flex: 1,
          width: 200,
          headerAlign: 'center',
          align: 'center',
        }))}
        rows={rows}
      />
      <Box>Teste</Box>
    </ModalBase>
  );
};

export default GranulometryCustomSeriesModal;
