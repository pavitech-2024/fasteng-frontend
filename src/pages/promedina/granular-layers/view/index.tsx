/* eslint-disable @next/next/no-html-link-for-pages */
import { NextIcon, UnitMassIcon } from '@/assets';
import PromedinaMaterialsTemplate from '@/components/molecules/filter/filter-table';
import Loading from '@/components/molecules/loading';
import Header from '@/components/organisms/header';
import useAuth from '@/contexts/auth';
import samplesService from '@/services/soils/soils-samples.service';
import { Box, Button, Container } from '@mui/material';
import { useState, useEffect } from 'react';

const GranularLayers_view = () => {
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
            title={'Amostras cadastradas em Camadas Granulares'}
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
                marginBottom: '1rem',
              }}
            >
              <PromedinaMaterialsTemplate
                materials={samples}
                handleDeleteMaterial={handleDeleteSample}
                area={'granular-layers'}
              />
            </Box>
          </Box>
        </Container>
      )}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: { mobile: '4vh 4vw', notebook: '3vh 6vw' },
        }}
      >
        <a
          href="/promedina/granular-layers"
          style={{
            backgroundColor: '#00A3FF',
            color: '#FFFFFF',
            height: '32px',
            width: '140px',
            fontSize: '1.2rem',
            alignItems: 'center',
            border: '#00A3FF',
            borderRadius: '30px',
            textAlign: 'center',
            fontWeight: 'bold',
            paddingTop: '0.2rem',
          }}
        >
          VOLTAR
        </a>

        <Button
          endIcon={<NextIcon />}
          variant="contained"
          disabled
          sx={{
            bgcolor: 'secondaryTons.blue',
            color: 'primaryTons.white',
            height: '32px',
            width: '140px',
            fontSize: '1rem',
            display: 'none',

            ':hover': {
              transition: 'all 0.1s ease-in-out',
              bgcolor: 'secondaryTons.blueDisabled',
            },

            ':active': {
              transition: 'all 0.1s ease-in-out',
              bgcolor: 'secondaryTons.blueClick',
            },
          }}
        >
          Próximo
        </Button>
      </Box>
    </Container>
  );
};

export default GranularLayers_view;
