/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { DropDownOption } from '@/components/atoms/inputs/dropDown';
import { AsphaltMaterial, AsphaltMaterialTypesEnum } from '@/interfaces/asphalt';
import { t } from 'i18next';
import MaterialsTemplate from '@/components/templates/materials';
import CreateEditMaterialModal from '../../../components/templates/modals/createEditAsphaltMaterial';
import { PageGenericContainer as Container } from '@/components/organisms/pageContainer';
import Loading from '@/components/molecules/loading';
import { Box } from '@mui/material';
import { FwdData } from '@/stores/asphalt/fwd/fwd.store';
import { IggData } from '@/stores/asphalt/igg/igg.store';
import { RtcdData } from '@/stores/asphalt/rtcd/rtcd.store';
import { DduiData } from '@/stores/asphalt/ddui/ddui.store';
import { useMaterials } from '@/utils/hooks/asphalt/materials.hooks';

export interface MaterialsProps {
  materials: AsphaltMaterial[];
  fwdEssays: FwdData[];
  iggEssays: IggData[];
  rtcdEssays: RtcdData[];
  stretchEssays: any[];
  dduiEssays: DduiData[];
}

const Materials = () => {
  const {
    loadMaterials,
    handleDeleteMaterial,
    dduiEssays,
    fwdEssays,
    iggEssays,
    rtcdEssays,
    loading,
    materials,
    addNewMaterial,
    handleEditMaterial,
    materialToEdit,
    isEdit,
    setIsEdit,
    setMaterialToEdit,
    openModal,
    setOpenModal,
  } = useMaterials('asphalt');

  useEffect(() => {
    loadMaterials();
  }, []);

  const types: DropDownOption[] = Object.values(AsphaltMaterialTypesEnum).map((value) => ({
    label: t(`asphalt.materials.${value}`),
    value: value,
  }));

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
          handleOpenModal={(row?: any) => {
            if (row) {
              setIsEdit(false);
              setMaterialToEdit(row);
            }
            setOpenModal(true);
          }}
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
              updatedMaterial={addNewMaterial}
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