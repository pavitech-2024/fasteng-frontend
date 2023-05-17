import { useState } from 'react';
import { AsphaltMaterial, AsphaltMaterialData } from '@/interfaces/asphalt';
import { t } from 'i18next';
import DropDown, { DropDownOption } from '@/components/atoms/inputs/dropDown';
import { toast } from 'react-toastify';
import materialsService from '@/services/asphalt/asphalt-materials.service';
import ModalBase from '@/components/molecules/modals/modal';
import { Box, TextField } from '@mui/material';

interface NewAsphaltMaterialModalProps {
  openModal: boolean;
  handleCloseModal: () => void;
  updateMaterials: () => void;
  materials: AsphaltMaterial[];
}

const NewAsphaltMaterialModal = ({
  openModal,
  handleCloseModal,
  updateMaterials,
  materials,
}: NewAsphaltMaterialModalProps) => {
  const [material, setMaterial] = useState<AsphaltMaterialData>({
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
      { label: t('samples.name'), value: material.name, key: 'name' },
      { label: t('asphalt.materials.type'), value: material.type, key: 'type' },
      { label: t('asphalt.materials.source'), value: material.description.source, key: 'source' },
      { label: t('asphalt.materials.responsible'), value: material.description.responsible, key: 'responsible' },
      { label: t('asphalt.materials.maxDiammeter'), value: material.description.maxDiammeter, key: 'maxDiammeter' },
      {
        label: t('asphalt.materials.aggregateNature'),
        value: material.description.aggregateNature,
        key: 'aggregateNature',
      },
      { label: t('asphalt.materials.boughtDate'), value: material.description.boughtDate, key: 'boughtDate' },
      { label: t('asphalt.materials.recieveDate'), value: material.description.recieveDate, key: 'recieveDate' },
      {
        label: t('asphalt.materials.extractionDate'),
        value: material.description.extractionDate,
        key: 'extractionDate',
      },
      {
        label: t('asphalt.materials.collectionDate'),
        value: material.description.collectionDate,
        key: 'collectionDate',
      },
      {
        label: t('asphalt.materials.classification_CAP'),
        value: material.description.classification_CAP,
        key: 'classification_CAP',
      },
      {
        label: t('asphalt.materials.classification_AMP'),
        value: material.description.classification_AMP,
        key: 'classification_AMP',
      },
      { label: t('asphalt.materials.observation'), value: material.description.observation, key: 'observation' },
    ];

    const WhiteList: string[] = ['name', 'type', 'source', 'responsible'];

    switch (material.type) {
      case 'coarseAggregate':
      case 'fineAggregate':
        WhiteList.push('maxDiameter', 'aggregateNature', 'extrationDate', 'collectionDate');
        break;

      case 'filler':
        WhiteList.push('boughtDate');
        break;

      case 'CAP':
        WhiteList.push('recieveDate', 'classification_CAP');
        break;

      case 'asphaltBinder':
        WhiteList.push('recieveDate', 'classification_AMP');
        break;
    }

    return inputs.filter((input) => WhiteList.includes(input.key));
  };

  const types: DropDownOption[] = [
    { label: t('asphalt.materials.coarseAggregate'), value: 'coarseAggregate' },
    { label: t('asphalt.materials.fineAggregate'), value: 'fineAggregate' },
    { label: t('asphalt.materials.filler'), value: 'filler' },
    { label: t('asphalt.materials.asphaltBinder'), value: 'asphaltBinder' },
    { label: t('asphalt.materials.cap'), value: 'CAP' },
    { label: t('asphalt.materials.other'), value: 'other' },
  ];

  const classification_CAP_options: DropDownOption[] = [
    { label: 'CAP 30/45', value: 'CAP 30/45' },
    { label: 'CAP 50/70', value: 'CAP 50/70' },
    { label: 'CAP 85/100', value: 'CAP 85/100' },
    { label: 'CAP 150/200', value: 'CAP 150/200' },
  ];

  const classification_AMP_options: DropDownOption[] = [
    { label: 'AMP 50/65', value: 'AMP 50/65' },
    { label: 'AMP 55/75', value: 'AMP 55/75' },
    { label: 'AMP 60/85', value: 'AMP 60/85' },
    { label: 'AMP 65/90', value: 'AMP 65/90' },
  ];

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
      if (material.type === 'CAP' && material.description.classification_CAP === null)
        throw 'Classificação do CAP não pode ser vazio';
      if (material.type === 'asphaltBinder' && material.description.classification_AMP === null)
        throw 'Classificação do AMP não pode ser vazio';

      await materialsService.createMaterial(material);

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
      title={t('asphalt.materials.newMaterial')}
      open={openModal}
      leftButtonTitle={t('samples.cancel')}
      rightButtonTitle={t('samples.register')}
      size="medium"
      onSubmit={() => handleSubmitNewMaterial()}
      onCancel={handleCloseModal}
      disableSubmit={
        material.name === '' ||
        material.type === null ||
        (material.type === 'CAP' && material.description.classification_CAP === null) ||
        (material.type === 'asphaltBinder' && material.description.classification_AMP === null)
      }
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
                  sx={{ minWidth: '120px', bgcolor: 'primaryTons.white' }}
                  label={t(`asphalt.materials.${input.key}`)}
                  variant="standard"
                  size="medium"
                  options={
                    input.key === 'type'
                      ? types
                      : input.key === 'classification_CAP'
                      ? classification_CAP_options
                      : classification_AMP_options
                  }
                  callback={(value: string) => changeMaterial(input.key, value)}
                  required
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

export default NewAsphaltMaterialModal;
