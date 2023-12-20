import { AbcpIcon } from "@/assets";
import Header from "@/components/organisms/header";
import useAuth from "@/contexts/auth";
import { AcpDosageData } from "@/interfaces/concrete/abcp";
import abcpDosageService from "@/services/concrete/dosages/abcp/abcp-consult.service";
import { Box, Container } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

const AbcpDosageConsult = () => {
  const [openModal, setOpenModal] = useState(false);
  const [dosages, setDosages] = useState<AcpDosageData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { user } = useAuth();

  useEffect(() => {
    console.log("🚀 ~ file: index.tsx:13 ~ AbcpDosageConsult ~ dosages:", dosages)
  }, [dosages]);

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

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Nome'
    },
    // {
    //   field: 'progress',
    //   headerName: 'Progresso'
    // },
    {
      field: 'start',
      headerName: 'Início'
    },
    {
      field: 'finish',
      headerName: 'Fim'
    },
  ];

  const rows = dosages;

  useEffect(() => {
    console.log("🚀 ~ file: index.tsx:13 ~ AbcpDosageConsult ~ rows:", rows)
  }, [rows])

  return (
    <Container>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        // <MaterialsTemplate
        //   materials={materials}
        //   types={types}
        //   title={t('concrete.materials.title')}
        //   handleOpenModal={() => setOpenModal(true)}
        //   handleDeleteMaterial={handleDeleteMaterial}
        //   modal={
        //     <NewConcreteMaterialModal
        //       openModal={openModal}
        //       handleCloseModal={() => setOpenModal(false)}
        //       updateMaterials={addNewMaterial}
        //       materials={materials}
        //     />
        //   }
        // />
        <Container>
          <Box sx={{ marginTop: '3rem' }}>
            <Header
            title={'Dosagens ABCP'}
            image={AbcpIcon}
          />
          </Box>
          
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              pt: { mobile: 0, notebook: '0.5vh' },
              marginTop: '3rem'
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
                rows={rows !== null ? rows.map((row, index) => (
                  { 
                    name: row.generalData.name, 
                    id: index 
                  })) : []} 
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