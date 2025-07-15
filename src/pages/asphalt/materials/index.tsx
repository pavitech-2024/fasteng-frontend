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
import { FwdData } from '@/stores/asphalt/fwd/fwd.store';
import { IggData } from '@/stores/asphalt/igg/igg.store';
import { RtcdData } from '@/stores/asphalt/rtcd/rtcd.store';
import { DduiData } from '@/stores/asphalt/ddui/ddui.store';

export interface MaterialsProps {
  materials: AsphaltMaterial[];
  fwdEssays: FwdData[];
  iggEssays: IggData[];
  rtcdEssays: RtcdData[];
  stretchEssays: any[];
  dduiEssays: DduiData[];
}

const Materials = () => {
  const [openModal, setOpenModal] = useState(false);
  const [materials, setMaterials] = useState<MaterialsProps[]>([]);
  const [materialToEdit, setMaterialToEdit] = useState<AsphaltMaterial>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [fwdEssays, setFwdEssays] = useState<FwdData[]>([]);
  const [iggEssays, setIggEssays] = useState<IggData[]>([]);
  const [rtcdEssays, setRtcdEssays] = useState<RtcdData[]>([]);
  const [stretchEssays, setStretchEssays] = useState<any[]>([]);
  const [dduiEssays, setDduiEssays] = useState<DduiData[]>([]);

  console.log("testando o Materials", materials);

  const { user } = useAuth();

  console.log('Testando o undefined', rtcdEssays);

  useEffect(() => {
    materialsService
      .getMaterialsByUserId(user._id)
      .then((response) => {
        console.log(response.data);
        setMaterials(response.data);
        setLoading(false);
        console.log('Testando o response.data', response.data);
        setFwdEssays(response.data[0].fwdEssays); // semMaterial = response.data[0].fwdEssays;
        //console.log("Testando o semMaterial", semMaterial);
        setIggEssays(response.data[0].iggEssays);
        console.log('Testando o rtcd mistura', response.data[0].rtcdEssays);
        setRtcdEssays(response.data[0].rtcdEssays);
        setStretchEssays([...response.data[0].fwdEssays, ...response.data[0].iggEssays]);
        setDduiEssays(response.data[0].dduiEssays);
      })
      .catch((error) => {
        console.error('Failed to load materials:', error);
      });
  }, [user]);

  const types: DropDownOption[] = [{ label: t('samples.all'), value: '' }];

  const handleDeleteMaterial = async (id: string) => {
    console.log("Testando o id", id);
    try {
      await materialsService.deleteMaterial(id);
      // deleta a amostra do estado
      const updatedMaterials = materials[0].materials.filter((material) => material._id !== id);
      console.log("Testando o updatedMaterials", updatedMaterials);
      const testandoMateriais = updatedMaterials.find((material) => material._id === id);
      console.log("'Testando o material",testandoMateriais)
      const prevData = [...materials];
      prevData[0].materials = updatedMaterials;
      setMaterials(prevData);
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
      const selectedMaterialToEdit = materials[0].materials.find((material) => material._id === materialId);
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
          fwdEssays={fwdEssays}
          iggEssays={iggEssays}
          rtcdEssays={rtcdEssays}
          dduiEssays={dduiEssays}
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
