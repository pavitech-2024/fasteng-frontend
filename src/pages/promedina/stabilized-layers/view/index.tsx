import { UnitMassIcon } from '@/assets';
import FilterTable from '@/components/molecules/filter/filter-table';
import Loading from '@/components/molecules/loading';
import Header from '@/components/organisms/header';
import useAuth from '@/contexts/auth';
import samplesService from '@/services/soils/soils-samples.service';
import { Box, Container } from '@mui/material';
import { useState, useEffect } from 'react';

const StabilizedLayers_view = () => {
  const { user } = useAuth();
  const [samples, setSamples] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    samplesService
      .getSamplesByUserId(user._id)
      .then((response) => {
        setSamples(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load samples:', error);
      });
  }, [user]);

  const handleDeleteSample = async (id: string) => {
    try {
      await samplesService.deleteSample(id);
      // deleta a amostra do estado
      const updatedSamples = samples.filter((sample) => sample._id !== id);
      setSamples(updatedSamples);
    } catch (error) {
      console.error('Failed to delete sample:', error);
    }
  };

  const GranularLayersIcon = UnitMassIcon;
  return (
    <Container>
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <Header
            title={'Amostras cadastradas em Camadas Estabilizadas'}
            image={GranularLayersIcon}
            sx={{ marginTop: '3rem' }}
          />
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
                height: '110vh',
                marginBottom: '1rem',
              }}
            >
              <FilterTable materials={samples} handleDeleteMaterial={handleDeleteSample} area={'stabilized-layers'} />
            </Box>
          </Box>
        </Container>
      )}
    </Container>
  );
};

export default StabilizedLayers_view;
