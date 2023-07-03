import DropDown, { DropDownOption } from '@/components/atoms/inputs/dropDown';
import ModalBase from '@/components/molecules/modals/modal';
import { ConcreteMaterial, ConcreteMaterialData } from '@/interfaces/concrete';
import concreteMaterialService from '@/services/concrete/concrete-materials.service';
import { Box, TextField } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface NewConcreteMaterialModalProps {
  openModal: boolean;
  handleCloseModal: () => void;
  updateMaterials: () => void;
  materials: ConcreteMaterial[];
}

const NewConcreteMaterialModal = ({
  openModal,
  handleCloseModal,
  updateMaterials,
  materials,
}: NewConcreteMaterialModalProps) => {
  const [material, setMaterial] = useState<ConcreteMaterialData>({
    name: '',
    type: null,
    description: {
      source: null,
      responsible: null,
      maxDiammeter: null,
      aggregateNature: null,
      boughtDate: null,
      recieveDate: null,
      extractionDate: null,
      collectionDate: null,
      classification_CAP: null,
      classification_AMP: null,
      observation: null,
    },
  });

  const getInputs = () => {
    const inputs = [
      {
        label: t('samples.name'),
        value: material.name,
        key: 'name',
      },
      {
        label: t('concrete.materials.type'),
        value: material.type,
        key: 'type',
      },
      {
        label: t('concrete.materials.source'),
        value: material.description.source,
        key: 'source',
      },
      {
        label: t('concrete.materials.responsible'),
        value: material.description.responsible,
        key: 'responsible',
      },
      {
        label: t('concrete.materials.maxDiammeter'),
        value: material.description.maxDiammeter,
        key: 'maxDiammeter',
      },
      {
        label: t('concrete.materials.aggregateNature'),
        value: material.description.aggregateNature,
        key: 'aggregateNature',
      },
      {
        label: t('concrete.materials.boughtDate'),
        value: material.description.boughtDate,
        key: 'boughtDate',
      },
      {
        label: t('concrete.materials.recieveDate'),
        value: material.description.recieveDate,
        key: 'recieveDate',
      },
      {
        label: t('concrete.materials.extractionDate'),
        value: material.description.extractionDate,
        key: 'extractionDate',
      },
      {
        label: t('concrete.materials.collectionDate'),
        value: material.description.collectionDate,
        key: 'collectionDate',
      },
      {
        label: t('concrete.materials.observation'),
        value: material.description.observation,
        key: 'observation',
      },
    ];

    const WhiteList: string[] = ['name', 'type', 'source', 'responsible'];

    switch (material.type) {
      case 'coarseAggregate':
      case 'fineAggregate':
        WhiteList.push('maxDiameter', 'aggregateNature', 'extrationDate', 'collectionDate');
        break;
    }

    return inputs.filter((input) => WhiteList.includes(input.key));
  };

  const types: DropDownOption[] = [
    { label: t('concrete.materials.coarseAggregate'), value: 'coarseAggregate' },
    { label: t('concrete.materials.fineAggregate'), value: 'fineAggregate' },
    { label: t('concrete.materials.other'), value: 'other' },
    { label: t('concrete.materials.cement'), value: 'cement' },
  ];

  // const classification_CAP_options: DropDownOption[] = [
  //   { label: 'CAP 30/45', value: 'CAP 30/45' },
  //   { label: 'CAP 50/70', value: 'CAP 50/70' },
  //   { label: 'CAP 85/100', value: 'CAP 85/100' },
  //   { label: 'CAP 150/200', value: 'CAP 150/200' },
  // ];

  // const classification_AMP_options: DropDownOption[] = [
  //   { label: 'AMP 50/65', value: 'AMP 50/65' },
  //   { label: 'AMP 55/75', value: 'AMP 55/75' },
  //   { label: 'AMP 60/85', value: 'AMP 60/85' },
  //   { label: 'AMP 65/90', value: 'AMP 65/90' },
  // ];

  const changeMaterial = (key: string, value: string) => {
    if (key === 'type' || key === 'name') setMaterial({ ...material, [key]: value });
    else setMaterial({ ...material, description: { ...material.description, [key]: value } });
  };

  const handleSubmitNewMaterial = async () => {
    const createMaterialToast = toast.loading('Cadastrando material...', { autoClose: 5000 });
    try {
      if (material.name === '') throw 'Nome do material não pode ser vazio';
      if (material.type === null) throw 'Tipo do material não pode ser vazio';
      if (materials.find((m) => m.name === material.name)) throw 'Já existe uma amostra com esse nome!';

      await concreteMaterialService.createMaterial(material);

      await updateMaterials();

      handleCloseModal();

      toast.update(createMaterialToast, {
        render: 'Material cadastrado com sucesso!',
        type: 'success',
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
    } catch (error) {
      toast.update(createMaterialToast, {
        render: error,
        type: 'error',
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
    }
  };

  return (
    <ModalBase
      title={t('concrete.materials.title')}
      open={openModal}
      leftButtonTitle={t('samples.cancel')}
      rightButtonTitle={t('samples.register')}
      size="medium"
      onSubmit={() => handleSubmitNewMaterial()}
      onCancel={handleCloseModal}
      disableSubmit={material.name === '' || material.type === null}
    >
      <Box sx={{ mb: '1rem' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              mobile: '1fr',
              notebook: '1fr 1fr',
            },
            gap: {
              mobile: '.6rem .8rem',
              notebook: '1.2rem .8rem',
            },
          }}
        >
          {getInputs().map((input) => {
            if (
              input.key === 'type' ||
              input.key === 'maxDiameter' ||
              input.key === 'classification_CAP' ||
              input.key === 'classification_AMP'
            ) {
              return (
                <DropDown
                  key={input.key}
                  variant="standard"
                  size="medium"
                  sx={{ minWidth: '120px', bgcolor: 'white' }}
                  callback={(value: string) => changeMaterial(input.key, value)}
                  required
                  label={t(`materials.template.${input.key}`)}
                  options={types}
                />
              );
            } else {
              return (
                <TextField
                  key={input.key}
                  label={input.label}
                  variant="standard"
                  value={input.value}
                  required={input.key === 'name'}
                  onChange={(e) => changeMaterial(input.key, e.target.value)}
                />
              );
            }
          })}
        </Box>
        <TextField
          sx={{ mt: '.8rem' }}
          label={t('samples.comments')}
          variant="standard"
          value={material.description.observation}
          onChange={(e) => changeMaterial('observation', e.target.value)}
          fullWidth
        />
      </Box>
    </ModalBase>
  );
};

export default NewConcreteMaterialModal;
