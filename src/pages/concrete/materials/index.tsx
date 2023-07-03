import { DropDownOption } from '@/components/atoms/inputs/dropDown';
import MaterialsTemplate from '@/components/templates/materials';
import NewConcreteMaterialModal from '@/components/templates/modals/newConcreteMaterial';
import useAuth from '@/contexts/auth';
import { ConcreteMaterial } from '@/interfaces/concrete';
import concreteMaterialService from '@/services/concrete/concrete-materials.service';
import { t } from 'i18next';
import { useEffect, useState } from 'react';

const ConcreteMaterials = () => {
  const [openModal, setOpenModal] = useState(false);
  const [materials, setMaterials] = useState<ConcreteMaterial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { user } = useAuth();

  useEffect(() => {
    concreteMaterialService
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
      await concreteMaterialService.deleteMaterial(id);
      const updatedMaterials = materials.filter((material) => material._id !== id);
      setMaterials(updatedMaterials);
    } catch (error) {
      console.error('Failed to delete material:', error);
    }
  };

  const addNewMaterial = () => {
    setLoading(true);
    concreteMaterialService
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
    <>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <MaterialsTemplate
          materials={materials}
          types={types}
          title={t('materials.title')}
          handleOpenModal={() => setOpenModal(true)}
          handleDeleteMaterial={handleDeleteMaterial}
          modal={
            <NewConcreteMaterialModal
              openModal={openModal}
              handleCloseModal={() => setOpenModal(false)}
              updateMaterials={addNewMaterial}
              materials={materials}
            />
          }
        />
      )}
    </>
  );
};

export default ConcreteMaterials;
