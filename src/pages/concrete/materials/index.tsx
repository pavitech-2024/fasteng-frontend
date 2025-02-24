import { DropDownOption } from '@/components/atoms/inputs/dropDown';
import MaterialsTemplate from '@/components/templates/materials';
import CreateEditConcreteMaterialModal from '@/components/templates/modals/createEditConcreteMaterial';
import useAuth from '@/contexts/auth';
import { ConcreteMaterial } from '@/interfaces/concrete';
import concreteMaterialService from '@/services/concrete/concrete-materials.service';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { PageGenericContainer as Container } from '@/components/organisms/pageContainer';

const ConcreteMaterials = () => {
  const [openModal, setOpenModal] = useState(false);
  const [materials, setMaterials] = useState<ConcreteMaterial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [materialToEdit, setMaterialToEdit] = useState<ConcreteMaterial>();
  const [isEdit, setIsEdit] = useState<boolean>(false);

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

  const handleEditMaterial = async (materialId: string) => {
    try {
      const selectedMaterialToEdit = materials.find((material) => material._id === materialId);
      setMaterialToEdit(selectedMaterialToEdit);
      setIsEdit(true);
      setOpenModal(true);
    } catch (error) {
      console.error('Failed to get the selected material to edit:', error);
    }
  };

  return (
    <Container>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <MaterialsTemplate
          materials={materials}
          types={types}
          title={t('concrete.materials.title')}
          handleOpenModal={() => setOpenModal(true)}
          deleteMaterial={handleDeleteMaterial}
          path="concrete/materials/material"
          editMaterial={handleEditMaterial}
          modal={
            <CreateEditConcreteMaterialModal
              openModal={openModal}
              handleCloseModal={() => {
                setOpenModal(false);
                setIsEdit(false);
                setMaterialToEdit(undefined);
              }}
              updateMaterials={addNewMaterial}
              materials={materials}
              materialToEdit={materialToEdit ? materialToEdit : undefined}
              isEdit={isEdit}
            />
          }
        />
      )}
    </Container>
  );
};

export default ConcreteMaterials;
