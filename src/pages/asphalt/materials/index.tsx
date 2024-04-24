/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { DropDownOption } from '@/components/atoms/inputs/dropDown';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import materialsService from '@/services/asphalt/asphalt-materials.service';
import { t } from 'i18next';
import useAuth from '@/contexts/auth';
import MaterialsTemplate from '@/components/templates/materials';
import NewAsphaltMaterialModal from '../../../components/templates/modals/newAsphaltMaterial';
import { PageGenericContainer as Container } from '@/components/organisms/pageContainer';

const Materials = () => {
  const [openModal, setOpenModal] = useState(false);
  const [materials, setMaterials] = useState<AsphaltMaterial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { user } = useAuth();

  useEffect(() => {
    materialsService
      .getMaterialsByUserId(user._id)
      .then((response) => {
        setMaterials(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load materials:', error);
      });
  }, [user]);
  

  const types: DropDownOption[] = [{ label: t('samples.all'), value: '' }];

  const handleDeleteMaterial = async (id: string) => {
    try {
      await materialsService.deleteMaterial(id);
      // deleta a amostra do estado
      const updatedMaterials = materials.filter((material) => material._id !== id);
      setMaterials(updatedMaterials);
    } catch (error) {
      console.error('Failed to delete material:', error);
    }
  };

  const addNewMaterial = () => {
    setLoading(true);
    materialsService
      .getMaterialsByUserId(user._id)
      .then((response) => {
        setMaterials(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load materials:', error);
      });
  };


  return (
    <Container>
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <MaterialsTemplate
          materials={materials}
          types={types}
          title={t('asphalt.materials.title')}
          handleOpenModal={() => setOpenModal(true)}
          handleDeleteMaterial={handleDeleteMaterial}
          modal={
            <NewAsphaltMaterialModal
              openModal={openModal}
              handleCloseModal={() => setOpenModal(false)}
              updateMaterials={addNewMaterial}
              materials={materials}
            />
          }
        />
      )}
    </Container>
  );
};

export default Materials;
