import { NextPage } from 'next';
import MaterialsTemplate from '@/components/templates/materials';
import { Sample } from '@/interfaces/soils';
import { DropDownOption } from '@/components/atoms/inputs/dropDown';
import { useEffect, useState } from 'react';
import samplesService from '@/services/soils/soils-samples.service';
import useAuth from '@/contexts/auth';
import NewSampleModal from '@/components/templates/modals/newSample';
import { t } from 'i18next';
import Loading from '@/components/molecules/loading';
import { PageGenericContainer as Container } from '@/components/organisms/pageContainer';

const Samples: NextPage = () => {
  const types: DropDownOption[] = [
    { label: t('samples.all'), value: '' },
    { label: t('samples.inorganicSoil'), value: 'inorganicSoil' },
    { label: t('samples.organicSoil'), value: 'organicSoil' },
    { label: t('samples.pavementLayer'), value: 'pavementLayer' },
  ];

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);

  const { user } = useAuth();
  const [samples, setSamples] = useState<Sample[]>([]);
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
        <Loading size={30} color={'secondary'} />
      ) : (
        <MaterialsTemplate
          materials={samples}
          types={types}
          title={t('samples.title')}
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

export default Samples;
