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
  const { setAllData } = useSuperpaveStore();
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
    2: t('asphalt.dosages.superpave.material_selection'),
    3: t('asphalt.dosages.superpave.granulometry_composition'),
    4: t('asphalt.dosages.superpave.initial_binder'),
    5: t('asphalt.dosages.superpave.first_compression'),
    6: t('asphalt.dosages.superpave.first_compression_parameters'),
    7: t('asphalt.dosages.superpave.chosen_curve_percentages'),
    8: t('asphalt.dosages.superpave.second_compression'),
    9: t('asphalt.dosages.superpave.second_compression_parameters'),
    10: t('asphalt.dosages.superpave.confirmation_compression'),
    11: t('asphalt.dosages.superpave.dosage_resume'),
  };

  const rows = dosages.map((row) => ({
    name: row.generalData?.name,
    progress: `(${row.generalData?.step + 1}/11) - ${progressTextMap[row.generalData?.step]}`,
    start: row.createdAt ? new Date(row.createdAt).toLocaleString() : '---',
    finish: row.updatedAt ? new Date(row.updatedAt).toLocaleString() : '---',
    id: row._id,
  }));

  /**
   * Effect hook to fetch and load Superpave dosages.
   *
   * Fetches the Superpave dosages for the current user and updates the state.
   * Displays a toast notification for the loading status.
   */
  useEffect(() => {
    toast.promise(
      async () => {
        try {
          const response = await superpaveDosageService.getSuperpaveDosagesByUserId(user._id);
          const data = response.data;
          dosages.push(data);

          const rows = dosages[0]?.map((row) => ({
            name: row.generalData?.name,
            progress: `(${row.generalData?.step + 1}/11) - ${progressTextMap[row.generalData?.step]}`,
            start: row.createdAt ? new Date(row.createdAt).toLocaleString() : '---',
            finish: row.updatedAt ? new Date(row.updatedAt).toLocaleString() : '---',
            id: row._id,
          }));

          const arraysMenores = dividirArrayEmArraysMenores(rows, rowsPerPage);

          setDosageArrays(arraysMenores);
          setLoading(false);
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

  /**
   * Handles the deletion of a dosage.
   *
   * Deletes the dosage with the given `id` and reloads the list of dosages.
   * The list of dosages and the `dosageArrays` state are updated.
   *
   * @param id - The ID of the dosage to delete.
   */
  const handleDeleteDosage = async (id: string) => {
    try {
      await superpaveDosageService.deleteSuperpaveDosage(id);

      const response = await superpaveDosageService.getSuperpaveDosagesByUserId(user._id);

      // Map the response data to the desired format
      const updatedDosages = response.data.map((row) => ({
        name: row.generalData?.name,
        progress: `(${row.generalData?.step}/11) - ${progressTextMap[row.generalData?.step]}`,
        start: row.createdAt ? new Date(row.createdAt).toLocaleString() : '---',
        finish: row.updatedAt ? new Date(row.updatedAt).toLocaleString() : '---',
        id: row._id,
      }));

      setDosages(updatedDosages);

      // Split the updated dosages into smaller arrays for pagination
      const arraysMenores = dividirArrayEmArraysMenores(updatedDosages, rowsPerPage);
      setDosageArrays(arraysMenores);
    } catch (error) {
      console.error('Failed to delete dosage:', error);
    }
  };

  const handleVisualizeDosage = async (id: string) => {
    const dosage = dosages[0]?.find((dosage) => {
      return dosage._id === id;
    });

    const step = dosage?.generalData.step;

    if (dosage) {
      setAllData(dosage);

      await new Promise((resolve) => {
        requestAnimationFrame(() => setTimeout(resolve, 0));
      });
    }

    sessionStorage.setItem('superpave-step', step?.toString());

    handleNext(step, dosage, true);

    if (step === 5) {
      router.push(`/asphalt/dosages/superpave/create?consult=true`);
    } else {
      router.push(`/asphalt/dosages/superpave/create`);
    }
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
      /**
       * Function to render cell content for the "options" column.
       * Shows two buttons: one for deleting the dosage and one for visualizing it.
       * @param {GridCellParams} params - Parameters for the cell being rendered.
       * @returns {ReactNode} JSX for the cell content.
       */
      renderCell: (params) => (
        <>
          <IconButton aria-label="Excluir" onClick={() => handleDeleteDosage(params.row.id)} size="large">
            <DeleteIcon />
          </IconButton>

          <IconButton aria-label="Visualizar" onClick={() => handleVisualizeDosage(params.row.id)} size="large">
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
                <Header title={t('asphalt.essays.superpave')} image={SuperpaveIcon} />
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
