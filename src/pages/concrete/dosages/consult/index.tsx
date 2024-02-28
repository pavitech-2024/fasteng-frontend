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
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { user } = useAuth();
  const [page, setPage] = useState<number>(0);
  const rowsPerPage = 10;
  const [ dosageArrays, setDosageArrays ] = useState([])

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

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          abcpDosageService
            .getAbcpDosagesByUserId(user._id)
            .then((response) => {
              setDosages(response.data);
            })
            if (rows.length > 0) {
              const arraysMenores = dividirArrayEmArraysMenores(rows, rowsPerPage);
              setDosageArrays(arraysMenores);
              setLoading(false)
            } else {
              setDosageArrays([[]]); // Define um array vazio como padrão se rows ainda não foi definido
            }
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

  function dividirArrayEmArraysMenores(array, tamanho) {
    const arraysMenores = [];
    
    for (let i = 0; i < array.length; i += tamanho) {
      const arrayMenor = array.slice(i, i + tamanho).map(item => ({ ...item })); // Copia cada item para garantir que a propriedade `id` seja preservada
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
    console.log("🚀 ~ handleDeleteDosage ~ id:", id)
    try {
      await abcpDosageService.deleteAbcpDosage(id);
      const updatedDosages = dosages.filter((dosage) => dosage._id !== id);
      setDosages(updatedDosages);
    } catch (error) {
      console.error('Failed to delete dosage:', error);
    }
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

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('abcp.dosage-consult.name'),
    },
    {
      field: 'progress',
      headerName: t('abcp.dosage-consult.progress'),
    },
    {
      field: 'start',
      headerName: t('abcp.dosage-consult.start'),
    },
    {
      field: 'finish',
      headerName: t('abcp.dosage-consult.finish'),
    },
    {
      field: 'options',
      headerName: t('abcp.dosage-consult.options'),
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
                <Header title={t('abcp.dosage-title')} image={AbcpLogo} />
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

export default AbcpDosageConsult;
