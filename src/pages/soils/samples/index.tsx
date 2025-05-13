import { NextPage } from 'next';
import MaterialsTemplate from '@/components/templates/materials';
import { SoilSample } from '@/interfaces/soils';
import { DropDownOption } from '@/components/atoms/inputs/dropDown';
import { useEffect, useState } from 'react';
import samplesService from '@/services/soils/soils-samples.service';
import useAuth from '@/contexts/auth';
import CreateEditSoilSampleModal from '@/components/templates/modals/createEditSoilSample';
import { t } from 'i18next';
import Loading from '@/components/molecules/loading';
import { PageGenericContainer as Container } from '@/components/organisms/pageContainer';
import { Box } from '@mui/material';

const Samples: NextPage = () => {
  const types: DropDownOption[] = [
    { label: t('samples.all'), value: '' },
    { label: t('samples.inorganicSoil'), value: 'inorganicSoil' },
    { label: t('samples.organicSoil'), value: 'organicSoil' },
    { label: t('samples.pavementLayer'), value: 'pavementLayer' },
  ];

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const [sampleToEdit, setSampleToEdit] = useState<SoilSample>();
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { user } = useAuth();
  const [samples, setSamples] = useState<SoilSample[]>([]);
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

  const handleEditSample = async (sampleId: string) => {
    try {
      const selectedSampleToEdit = samples.find((sample) => sample._id === sampleId);
      setSampleToEdit(selectedSampleToEdit);
      setIsEdit(true);
      setOpenModal(true);
    } catch (error) {
      console.error('Failed to get the selected sample to edit:', error);
    }
  };

  return (
    <Container>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <Loading />
        </Box>
      ) : (
        <MaterialsTemplate
          materials={samples}
          types={types}
          title={t('samples.title')}
          path="soils/samples/sample"
          handleOpenModal={handleOpenModal}
          deleteMaterial={handleDeleteSample}
          editMaterial={handleEditSample}
          modal={
            <CreateEditSoilSampleModal
              openModal={openModal}
              handleCloseModal={() => {
                setOpenModal(false);
                setIsEdit(false);
                setSampleToEdit(undefined);
              }}
              updateSamples={addNewSample}
              samples={samples}
              sampleToEdit={sampleToEdit ? sampleToEdit : undefined}
              isEdit={isEdit}
            />
          }
        />
      )}
    </Container>
  );
};

export default Samples;
