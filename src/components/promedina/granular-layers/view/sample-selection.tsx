import FilterTable from '@/components/molecules/filter/filter-table';
import Loading from '@/components/molecules/loading';
import NewSampleModal from '@/components/templates/modals/newSample';
import useAuth from '@/contexts/auth';
import samplesService from '@/services/soils/soils-samples.service';
import { Container } from '@mui/material';
import { useState, useEffect } from 'react';

const GranularLayers_view = () => {
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);

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

  const addNewSample = () => {
    setLoading(true);
    samplesService
      .getSamplesByUserId(user._id)
      .then((response) => {
        setSamples(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load samples:', error);
      });
  };

  return (
    <Container>
      {loading ? (
        <Loading />
      ) : (
        <FilterTable
          materials={samples}
          handleOpenModal={handleOpenModal}
          handleDeleteMaterial={handleDeleteSample}
          modal={
            <NewSampleModal
              openModal={openModal}
              handleCloseModal={() => setOpenModal(false)}
              updateSamples={addNewSample}
              samples={samples}
            />
          }
        />
      )}
    </Container>
  );
};

export default GranularLayers_view;
