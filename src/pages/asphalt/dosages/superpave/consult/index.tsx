import { DeleteIcon, NextIcon, SuperpaveIcon } from '@/assets';
import Loading from '@/components/molecules/loading';
import Header from '@/components/organisms/header';
import useAuth from '@/contexts/auth';
import superpaveDosageService from '@/services/asphalt/dosages/superpave/superpave.consult.service';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { IconButton, Container, Box, Pagination } from '@mui/material';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const SuperpaveDosageConsult = () => {
  const { setData } = useSuperpaveStore();
  const { handleNext } = new Superpave_SERVICE();
  const [dosages, setDosages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { user } = useAuth();
  const [page, setPage] = useState<number>(0);
  const rowsPerPage = 10;
  const [dosageArrays, setDosageArrays] = useState([]);

  const progressTextMap = {
    1: t('general data'),
    2: t('superpave.material-selection'),
    3: t('superpave.granulometric-composition'),
    4: t('superpave.inserting-params'),
    5: t('superpave.dosage-resume'),
  };

  const rows = dosages.map((row) => ({
    name: row.generalData?.name,
    progress: `(${row.generalData?.step}/11) - ${progressTextMap[row.generalData?.step]}`,
    start: row.createdAt ? new Date(row.createdAt).toLocaleString() : '---',
    finish: row.updatedAt ? new Date(row.updatedAt).toLocaleString() : '---',
    id: row._id,
  }));

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          superpaveDosageService.getSuperpaveDosagesByUserId(user._id).then((response) => {
            const data = response.data;
            dosages.push(data);

            const rows = dosages[0]?.map((row) => ({
              name: row.generalData?.name,
              progress: `(${row.generalData?.step}/9) - ${progressTextMap[row.generalData?.step]}`,
              start: row.createdAt ? new Date(row.createdAt).toLocaleString() : '---',
              finish: row.updatedAt ? new Date(row.updatedAt).toLocaleString() : '---',
              id: row._id,
            }));

            const arraysMenores = dividirArrayEmArraysMenores(rows, rowsPerPage);

            setDosageArrays(arraysMenores);

            setLoading(false);
          });
        } catch (error) {
          setDosages([]);
          setLoading(false);
          throw error;
        }
      },
      {
        pending: t('loading.superpave.pending'),
        success: t('loading.superpave.success'),
        error: t('loading.superpave.error'),
      }
    );
  }, []);

  function dividirArrayEmArraysMenores(array, tamanho) {
    const arraysMenores = [];

    for (let i = 0; i < array.length; i += tamanho) {
      const arrayMenor = array.slice(i, i + tamanho).map((item) => ({ ...item }));
      arraysMenores.push(arrayMenor);
    }

    return arraysMenores;
  }

  useEffect(() => {
    if (rows.length > 0) {
      const arraysMenores = dividirArrayEmArraysMenores(rows, rowsPerPage);
      setDosageArrays(arraysMenores);
      setLoading(false);
    }
  }, []);

  const handleDeleteDosage = async (id: string) => {
    try {
      await superpaveDosageService.deleteSuperpaveDosage(id);
      // Recarregar a lista de dosagens após a exclusão
      const response = await superpaveDosageService.getSuperpaveDosagesByUserId(user._id);
      const updatedDosages = response.data.map((row) => ({
        name: row.generalData?.name,
        progress: `(${row.generalData?.step}/9) - ${progressTextMap[row.generalData?.step]}`,
        start: row.createdAt ? new Date(row.createdAt).toLocaleString() : '---',
        finish: row.updatedAt ? new Date(row.updatedAt).toLocaleString() : '---',
        id: row._id,
      }));

      // Atualizar dosages e dosageArrays
      setDosages(updatedDosages);

      // Recalcular os arrays menores
      const arraysMenores = dividirArrayEmArraysMenores(updatedDosages, rowsPerPage);
      setDosageArrays(arraysMenores);
    } catch (error) {
      console.error('Failed to delete dosage:', error);
    }
  };

  const handleVisualizeDosage = (id: string) => {
    const dosage = dosages[0]?.find((dosage) => {
      return dosage._id === id;
    });
    const step = dosage?.generalData.step;

    if (dosage) {
      setData({
        step: 12,
        value: dosage,
      });
    }
    sessionStorage.setItem('superpave-step', step?.toString());
    handleNext(step, dosage, true);
    if (step === 5) router.push(`/asphalt/dosages/superpave/create?consult=true`);
    router.push(`/asphalt/dosages/superpave/create`);
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('superpave.dosage-consult.name'),
    },
    {
      field: 'progress',
      headerName: t('superpave.dosage-consult.progress'),
    },
    {
      field: 'start',
      headerName: t('superpave.dosage-consult.start'),
    },
    {
      field: 'finish',
      headerName: t('superpave.dosage-consult.finish'),
    },
    {
      field: 'options',
      headerName: t('superpave.dosage-consult.options'),
      renderCell: (params) => (
        <>
          <IconButton aria-label="Excluir" onClick={() => handleDeleteDosage(params.row.id)}>
            <DeleteIcon />
          </IconButton>

          <IconButton aria-label="Visualizar" onClick={() => handleVisualizeDosage(params.row.id)}>
            <NextIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Container>
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <Container>
              <Box sx={{ margin: '3rem' }}>
                <Header title={t('superpave.dosage-title')} image={SuperpaveIcon} />
              </Box>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  pt: { mobile: 0, notebook: '0.5vh' },
                }}
              >
                <Box
                  sx={{
                    width: { mobile: '90%', notebook: '80%' },
                    maxWidth: '2200px',
                    padding: '2rem',
                    borderRadius: '20px',
                    bgcolor: 'primaryTons.white',
                    border: '1px solid',
                    borderColor: 'primaryTons.border',
                    marginBottom: '1rem',
                  }}
                >
                  {dosageArrays.length > 0 && (
                    <DataGrid
                      rows={dosageArrays.length > 0 ? dosageArrays[page] : []}
                      pagination
                      hideFooter
                      columns={columns.map((column) => ({
                        ...column,
                        disableColumnMenu: true,
                        sortable: false,
                        align: 'center',
                        headerAlign: 'center',
                        minWidth: 100,
                        flex: 1,
                      }))}
                    />
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50px' }}>
                    <Pagination
                      count={dosageArrays.length}
                      size="small"
                      onChange={(event, value) => setPage(value - 1)}
                    />
                  </Box>
                </Box>
              </Box>
            </Container>
          )}
        </Container>
      )}
    </>
  );
};

export default SuperpaveDosageConsult;
