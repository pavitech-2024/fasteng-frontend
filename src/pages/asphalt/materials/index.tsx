/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { DropDownOption } from '@/components/atoms/inputs/dropDown';
import { AsphaltMaterial, AsphaltMaterialTypesEnum } from '@/interfaces/asphalt';
import materialsService from '@/services/asphalt/asphalt-materials.service';
import { t } from 'i18next';
import useAuth from '@/contexts/auth';
import MaterialsTemplate, { essayTypes, FilterTypes } from '@/components/templates/materials';
import CreateEditMaterialModal from '../../../components/templates/modals/createEditAsphaltMaterial';
import { PageGenericContainer as Container } from '@/components/organisms/pageContainer';
import Loading from '@/components/molecules/loading';
import { Box } from '@mui/material';
import { FwdData } from '@/stores/asphalt/fwd/fwd.store';
import { IggData } from '@/stores/asphalt/igg/igg.store';
import { RtcdData } from '@/stores/asphalt/rtcd/rtcd.store';
import { DduiData } from '@/stores/asphalt/ddui/ddui.store';
import Rtcd_SERVICE from '@/services/asphalt/essays/rtcd/rtcd.service';
import Ddui_SERVICE from '@/services/asphalt/essays/ddui/ddui.service';
import Fwd_SERVICE from '@/services/asphalt/essays/fwd/fwd.service';
import Igg_SERVICE from '@/services/asphalt/essays/igg/igg.service';

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
  let stretchEssays;
  const [dduiEssays, setDduiEssays] = useState<DduiData[]>([]);
  const { user } = useAuth();
  const { deleteRtcdEssay } = new Rtcd_SERVICE();
  const { deleteDduiEssay } = new Ddui_SERVICE();
  const { deleteFwdEssay } = new Fwd_SERVICE();
  const { deleteIggEssay } = new Igg_SERVICE();

  const loadMaterials = async (userId: string) => {
    try {
      const response = await materialsService.getMaterialsByUserId(userId);
      setMaterials(response.data);
      setLoading(false);
      setFwdEssays(response.data[0].fwdEssays);
      setIggEssays(response.data[0].iggEssays);
      setRtcdEssays(response.data[0].rtcdEssays);
      stretchEssays = [...response.data[0].fwdEssays, ...response.data[0].iggEssays];
      setDduiEssays(response.data[0].dduiEssays);
    } catch (error) {
      console.error('Failed to load materials:', error);
    }
  };

  useEffect(() => {
    loadMaterials(user._id);
  }, []);

  const types: DropDownOption[] = Object.values(AsphaltMaterialTypesEnum).map((value) => ({
    label: t(`asphalt.materials.${value}`),
    value: value,
  }));

  const handleDeleteMaterial = async (id: string, filter: FilterTypes, essayType?: essayTypes) => {
    try {
      switch (filter.toLowerCase()) {
        case 'name':
          await materialsService.deleteMaterial(id);
          break;
        case 'type':
          await materialsService.deleteMaterial(id);
          break;
        case 'mix':
          if (essayType.toLowerCase() === 'rtcd') {
            await deleteRtcdEssay(id);
          } else if (essayType.toLowerCase() === 'ddui') {
            await deleteDduiEssay(id);
          }
          break;
        case 'stretch':
          if (essayType.toLowerCase() === 'fwd') {
            await deleteFwdEssay(id);
          } else if (essayType.toLowerCase() === 'igg') {
            await deleteIggEssay(id);
          }
          break;
        default:
          break;
      }
      loadMaterials(user._id);
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
              materials={materials[0].materials}
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
