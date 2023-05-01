import { NextPage } from 'next';
import MaterialsTemplate from '@/components/templates/materials';
import { Sample } from '@/interfaces/soils';
import { DropDownOption } from '@/components/atoms/inputs/dropDown';
import { useEffect, useState } from 'react';
import samplesService from '@/services/soils/samplesService';
import useAuth from '@/contexts/auth';
import NewSampleModal from '../../../components/templates/modals/newSample';

export const getStaticProps = async () => {
  const types: DropDownOption[] = [
    { label: 'Todos', value: '' },
    { label: 'Solo Inorgânico', value: 'inorganicSoil' },
    { label: 'Solo Orgânico', value: 'organicSoil' },
    { label: 'Camada de Pavimento', value: 'pavementLayer' },
  ];
  return {
    props: {
      types,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
interface SamplesProps {
  types: DropDownOption[];
}

const Samples: NextPage = ({ types }: SamplesProps) => {
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);

  const { user } = useAuth();
  const [samples, setSamples] = useState<Sample[]>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log('renderizou');
    samplesService
      .getSamplesByUserId(user._id)
      .then((response) => {
        setSamples(response.data);
        setLoading(false);
      })
      .catch((error) => {
        throw error;
      });
  }, [user]);

  const handleDeleteSample = async (id: string) => {
    try {
      await samplesService.deleteSample(id);
      // deleta a amostra do estado
      const updatedSamples = samples.filter((sample) => sample._id !== id);
      setSamples(updatedSamples);
    } catch (error) {
      throw error;
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
        throw error;
      });
  };

  return (
    <>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <MaterialsTemplate
          materials={samples}
          types={types}
          title="Amostras Cadastradas"
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
    </>
  );
};

export default Samples;
