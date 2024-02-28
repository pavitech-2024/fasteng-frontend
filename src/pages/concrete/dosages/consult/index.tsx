import { AbcpIcon, AbcpLogo, DeleteIcon, NextIcon } from '@/assets';
import Header from '@/components/organisms/header';
import useAuth from '@/contexts/auth';
import { AcpDosageData } from '@/interfaces/concrete/abcp';
import abcpDosageService from '@/services/concrete/dosages/abcp/abcp-consult.service';
import { Box, Container, IconButton, Pagination } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import useABCPStore from '@/stores/concrete/abcp/abcp.store';
import ABCP_SERVICE from '@/services/concrete/dosages/abcp/abcp.service';
import { toast } from 'react-toastify';
import Loading from '@/components/molecules/loading';

const AbcpDosageConsult = () => {

  const { setData } = useABCPStore();
  const { handleNext } = new ABCP_SERVICE();
  const [dosages, setDosages] = useState<AcpDosageData[]>([]);
  console.log("🚀 ~ AbcpDosageConsult ~ dosages:", dosages)
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { user } = useAuth();
  const [page, setPage] = useState<number>(0);
  const rowsPerPage = 10;

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          abcpDosageService
            .getAbcpDosagesByUserId(user._id)
            .then((response) => {
              setDosages(response.data);
              setLoading(false);
            })
        } catch (error) {
          setDosages([]);
          setLoading(false);
          throw error;
        }
      }, {
      pending: t('loading.abcp.pending'),
      success: t('loading.abcp.success'),
      error: t('loading.abcp.error'),
    }
    )
  }, []);

  const handleDeleteDosage = async (id: string) => {
    console.log("🚀 ~ handleDeleteDosage ~ id:", id)
    try {
      await abcpDosageService.deleteAbcpDosage(id);
      const updatedDosages = dosages.filter((dosage) => dosage._id !== id);
      setDosages(updatedDosages);
    } catch (error) {
      console.error('Failed to delete dosage:', error);
    }
  };

  const addNewDosage = () => {
    setLoading(true);
    abcpDosageService
      .getAbcpDosagesByUserId(user._id)
      .then((response) => {
        setDosages(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load dosages:', error);
      });
  };

  const handleVisualizeDosage = (id: string) => {
    const dosage = dosages.find((dosage) => {
      return dosage._id === id
    })
    const step = dosage.generalData.step;
    if (dosage) {
      setData({
        step: 5,
        value: dosage
      });
    }
    sessionStorage.setItem('abcp-step', (step).toString());
    handleNext(step, dosage, true);
    if (step === 4) router.push(`/concrete/dosages/abcp?consult=true`);
    router.push(`/concrete/dosages/abcp`);
  };

  const progressTextMap = {
    1: t('general data'),
    2: t('abcp.material-selection'),
    3: t('abcp.essay-selection'),
    4: t('abcp.inserting-params'),
    5: t('abcp.dosage-resume'),
  };

  const rows = dosages.map((row) => ({
    name: row.generalData.name,
    progress: `(${row.generalData.step}/5) - ${progressTextMap[row.generalData.step]}`,
    start: row.createdAt ? new Date(row.createdAt).toLocaleString() : '---',
    finish: row.updatedAt ? new Date(row.updatedAt).toLocaleString() : '---',
    id: row._id,
  }));

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Nome',
    },
    {
      field: 'progress',
      headerName: 'Progresso',
    },
    {
      field: 'start',
      headerName: 'Início',
    },
    {
      field: 'finish',
      headerName: 'Fim',
    },
    {
      field: 'options',
      headerName: 'Opções',
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
                <Header title={'Dosagens ABCP'} image={AbcpLogo} />
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
                  <DataGrid
                    rows={rows}
                    pagination
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
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50px' }}>
                    <Pagination
                      count={Math.ceil(rows.length / rowsPerPage)}
                      size="small"
                      disabled={rows.length < rowsPerPage}
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

export default AbcpDosageConsult;
