/* eslint-disable @next/next/no-html-link-for-pages */
import { NextIcon, UnitMassIcon } from '@/assets';
import PromedinaMaterialsTemplate from '@/components/molecules/filter/filter-table';
import Loading from '@/components/molecules/loading';
import Header from '@/components/organisms/header';
import SampleDataVisualization from '@/components/promedina/data-view/data-view';
import samplesService from '@/services/promedina/granular-layers/granular-layers-view.service';
import { Box, Button, Container } from '@mui/material';
import { useState, useEffect } from 'react';

const GranularLayers_view = () => {
  const [samples, setSamples] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const [searchParams, setSearchParams] = useState({
    _id: '',
    name: '',
    cityState: '',
    zone: '',
    layer: '',
    highway: '',
  });

  const fetchData = async () => {
    const filter = [];

    for (const key in searchParams) {
      if (searchParams[key] !== '') {
        filter.push({ [key]: searchParams[key] });
      }
    }

    const encodedFilter = encodeURIComponent(JSON.stringify(filter));

    try {
      const response = await samplesService.getFilteredSamples(encodedFilter, page);
      setSamples(response.data.docs);
      setTotalPages(response.data.totalPages);
      setCount(response.data.count);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load samples:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchParams, page]);

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

  const getFilter = async (param) => {
    setSearchParams(param);
  };

  const getSpecificSampleData = async (id: string) => {
    try {
      // pega os dados de uma amostra em específico que foi escolhida para visualizar
      const response = await samplesService.getSample(id);
      console.log('Dados de uma amostra específica:', response);
      return <SampleDataVisualization specificData={response} />;
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
                getFilter={getFilter}
                pages={totalPages}
                count={count}
                onSearchParamsChange={setSearchParams}
                onPageChange={setPage}
                area={'granular-layers'}
                getSpecificSampleData={getSpecificSampleData}
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
