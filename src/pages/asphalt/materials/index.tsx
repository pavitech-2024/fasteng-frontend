/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { DropDownOption } from '@/components/atoms/inputs/dropDown';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import materialsService from '@/services/asphalt/asphalt-materials.service';
import { t } from 'i18next';
import useAuth from '@/contexts/auth';
import MaterialsTemplate from '@/components/templates/materials';
import CreateEditMaterialModal from '../../../components/templates/modals/createEditAsphaltMaterial';
import { PageGenericContainer as Container } from '@/components/organisms/pageContainer';
import Loading from '@/components/molecules/loading';
import { Box } from '@mui/material';

const Materials = () => {
  const [openModal, setOpenModal] = useState(false);
  const [materials, setMaterials] = useState<AsphaltMaterial[]>([]);
  const [materialToEdit, setMaterialToEdit] = useState<AsphaltMaterial>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isEdit, setIsEdit] = useState<boolean>(false);

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
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <Loading />
        </Box>
      ) : (
        <MaterialsTemplate
          materials={materials}
          types={types}
          title={t('asphalt.materials.title')}
          handleOpenModal={() => setOpenModal(true)}
          deleteMaterial={handleDeleteMaterial}
          editMaterial={handleEditMaterial}
          path="asphalt/materials/material"
          modal={
            <CreateEditMaterialModal
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

export default Materials;
