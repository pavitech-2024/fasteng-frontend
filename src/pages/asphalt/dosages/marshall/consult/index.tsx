import { DeleteIcon, MarshallIconPng, NextIcon } from '@/assets';
import Loading from '@/components/molecules/loading';
import Header from '@/components/organisms/header';
import useAuth from '@/contexts/auth';
import marshallDosageService from '@/services/asphalt/dosages/marshall/marshall.consult.service';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import useMarshallStore from '@/stores/asphalt/marshall/marshall.store';
import { IconButton, Container, Box, Pagination } from '@mui/material';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const MarshallDosageConsult = () => {
  const { setData } = useMarshallStore();
  const { handleNext } = new Marshall_SERVICE();
  const [dosages, setDosages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { user } = useAuth();
  const [page, setPage] = useState<number>(0);
  const rowsPerPage = 10;
  const [dosageArrays, setDosageArrays] = useState([]);

  const progressTextMap = {
    1: t('general data'),
    2: t('asphalt.dosages.marshall.material_selection'),
    3: t('asphalt.dosages.marshall.granulometry_composition'),
    4: t('asphalt.dosages.marshall.initial_binder'),
    5: t('asphalt.dosages.marshall.max_density'),
    6: t('asphalt.dosages.marshall.volumetric_parameters'),
    7: t('asphalt.dosages.marshall.optimal_binder'),
    8: t('asphalt.dosages.marshall.confirm_compression'),
    9: t('asphalt.dosages.marshall.dosage_resume'),
  };

useEffect(() => {
  if (!user?._id) return;
  
  toast.promise(
    async () => {
      setLoading(true);
      const response = await marshallDosageService.getMarshallDosagesByUserId(user._id);
      const data = response.data;
      
      // 🔥 CORRIGE O STEP NO FRONTEND MESMO
      const correctedData = data.map(dosage => {
        // Se tem dados do último passo, step = 9
        if (dosage.confirmationCompressionData && dosage.generalData?.step !== 9) {
          return {
            ...dosage,
            generalData: {
              ...dosage.generalData,
              step: 9
            }
          };
        }
        return dosage;
      });
      
      setDosages(correctedData);
      
      const rows = correctedData.map((row) => ({
        name: row.generalData?.name,
        progress: `(${row.generalData?.step || 0}/9) - ${
          row.generalData?.step === 9 
            ? t('asphalt.dosages.marshall.dosage_resume')
            : progressTextMap[row.generalData?.step] || 'undefined'
        }`,
        start: row.createdAt ? new Date(row.createdAt).toLocaleString() : '---',
        finish: row.updatedAt ? new Date(row.updatedAt).toLocaleString() : '---',
        id: row._id,
      }));

      const arraysMenores = dividirArrayEmArraysMenores(rows, rowsPerPage);
      setDosageArrays(arraysMenores);
      setLoading(false);
    },
    {
      pending: t('loading.marshall.pending'),
      success: t('loading.marshall.success'),
      error: t('loading.marshall.error'),
    }
  );
}, [user?._id]);

  function dividirArrayEmArraysMenores(array, tamanho) {
    const arraysMenores = [];
    for (let i = 0; i < array.length; i += tamanho) {
      const arrayMenor = array.slice(i, i + tamanho).map((item) => ({ ...item }));
      arraysMenores.push(arrayMenor);
    }
    return arraysMenores;
  }

  const handleDeleteDosage = async (id: string) => {
    try {
      await marshallDosageService.deleteMarshallDosage(id);
      // Recarregar a lista de dosagens após a exclusão
      const response = await marshallDosageService.getMarshallDosagesByUserId(user._id);
      const data = response.data;
      
      setDosages(data);
      
      const rows = data.map((row) => ({
        name: row.generalData?.name,
        progress: `(${row.generalData?.step || 0}/9) - ${
          row.generalData?.step === 9 
            ? t('asphalt.dosages.marshall.dosage_resume')
            : progressTextMap[row.generalData?.step] || 'undefined'
        }`,
        start: row.createdAt ? new Date(row.createdAt).toLocaleString() : '---',
        finish: row.updatedAt ? new Date(row.updatedAt).toLocaleString() : '---',
        id: row._id,
      }));

      const arraysMenores = dividirArrayEmArraysMenores(rows, rowsPerPage);
      setDosageArrays(arraysMenores);
    } catch (error) {
      console.error('Failed to delete dosage:', error);
    }
  };

  const handleVisualizeDosage = (id: string) => {
    const dosage = dosages.find((dosage) => dosage._id === id); // 👈 CORRIGIDO: remove o [0]
    if (!dosage) return;
    
    const step = dosage.generalData.step - 1;
    setData({ step: 10, value: dosage });
    sessionStorage.setItem('marshall-step', step.toString());
    handleNext(step, dosage, true);
    router.push(`/asphalt/dosages/marshall/create`);
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('marshall.dosage-consult.name'),
    },
    {
      field: 'progress',
      headerName: t('marshall.dosage-consult.progress'),
    },
    {
      field: 'start',
      headerName: t('marshall.dosage-consult.start'),
    },
    {
      field: 'finish',
      headerName: t('marshall.dosage-consult.finish'),
    },
    {
      field: 'options',
      headerName: t('marshall.dosage-consult.options'),
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
          <Box sx={{ margin: '3rem' }}>
            <Header title={t('marshall.dosage-title')} image={MarshallIconPng} />
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
    </>
  );
};

export default MarshallDosageConsult;