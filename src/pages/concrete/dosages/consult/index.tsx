import { AbcpIcon, AbcpLogo, DeleteIcon, NextIcon } from '@/assets';
import Header from '@/components/organisms/header';
import useAuth from '@/contexts/auth';
import { AcpDosageData } from '@/interfaces/concrete/abcp';
import abcpDosageService from '@/services/concrete/dosages/abcp/abcp-consult.service';
import { Box, Container, IconButton } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const AbcpDosageConsult = () => {
  const [openModal, setOpenModal] = useState(false);
  const [dosages, setDosages] = useState<AcpDosageData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const { user } = useAuth();

  useEffect(() => {
    abcpDosageService
      .getAbcpDosagesByUserId(user._id)
      .then((response) => {
        setDosages(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load dosages:', error);
      });
  }, [user]);

  const handleDeleteDosage = async (id: string) => {
    try {
      await abcpDosageService.deleteAbcpDosage(id);
      const updatedDosages = dosages.filter((dosage) => dosage._id !== id);
      setDosages(updatedDosages);
    } catch (error) {
      console.error('Failed to delete material:', error);
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
    router.push(`/concrete/dosages/consult/data/${id}`);
  };

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

  const rows = dosages.map((row, index) => ({
    name: row.generalData.name,
    progress: '---',
    start: '---',
    finish: '---',
    id: row._id,
  }));

  useEffect(() => {
    console.log('🚀 ~ file: index.tsx:13 ~ AbcpDosageConsult ~ rows:', rows);
  }, [rows]);

  return (
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
            </Box>
          </Box>
        </Container>
      )}
    </Container>
  );
};

export default AbcpDosageConsult;
