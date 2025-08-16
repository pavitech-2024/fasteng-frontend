import DropDown, { DropDownOption } from '@/components/atoms/inputs/dropDown';
import ModalBase from '@/components/molecules/modals/modal';
import useAuth from '@/contexts/auth';
import { Sieve } from '@/interfaces/common';
import { ConcreteMaterial, ConcreteMaterialData } from '@/interfaces/concrete';
import concreteMaterialService from '@/services/concrete/concrete-materials.service';
import { Box, TextField } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface CreateEditConcreteMaterialModalProps {
  openModal: boolean;
  handleCloseModal: () => void;
  updateMaterials: () => void;
  materials: ConcreteMaterial[];
  materialToEdit?: ConcreteMaterial;
  isEdit: boolean;
}

const CreateEditConcreteMaterialModal = ({
  openModal,
  handleCloseModal,
  updateMaterials,
  materials,
  materialToEdit,
  isEdit,
}: CreateEditConcreteMaterialModalProps) => {
  const initialMaterialState: ConcreteMaterialData = {
    name: '',
    type: null,
    userId: '',
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
      cementType: null,
      resistance: null,
      observation: null,
    },
  };

  const [material, setMaterial] = useState<ConcreteMaterialData>(initialMaterialState);

  const { user } = useAuth();
  const userId = user._id;

  const modalTitle = isEdit ? 'Editar material' : 'Cadastrar material';

  const resetMaterial = () => {
    setMaterial(initialMaterialState);
  };

  useEffect(() => {
    if (isEdit && materialToEdit) {
      setMaterial(materialToEdit);
    }
  }, [materialToEdit]);

  const getInputs = () => {
    const inputs = [
      {
        label: t('samples.name'),
        value: material.name,
        key: 'name',
        required: true,
      },
      {
        label: t('concrete.materials.type'),
        value: material.type,
        key: 'type',
        required: true,
      },
      {
        label: t('concrete.materials.source'),
        value: material.description.source,
        key: 'source',
        required: false,
      },
      {
        label: t('concrete.materials.responsible'),
        value: material.description.responsible,
        key: 'responsible',
        required: false,
      },
      {
        label: t('concrete.materials.maxDiammeter'),
        value: material.description.maxDiammeter,
        key: 'maxDiammeter',
        required: false,
      },
      {
        label: t('concrete.materials.aggregateNature'),
        value: material.description.aggregateNature,
        key: 'aggregateNature',
        required: false,
      },
      {
        label: t('concrete.materials.resistance'),
        value: material.description.resistance,
        key: 'resistance',
        required: true,
      },
      {
        label: t('concrete.materials.classification_CAP'),
        value: material.description.classification_CAP,
        key: 'classification_CAP',
        required: true,
      },
      {
        label: t('concrete.materials.classification_AMP'),
        value: material.description.classification_AMP,
        key: 'classification_AMP',
        required: true,
      },
      {
        label: t('concrete.materials.cementType'),
        value: material.description.cementType,
        key: 'cementType',
        required: true,
      },
      {
        label: t('concrete.materials.boughtDate'),
        value: material.description.boughtDate,
        key: 'boughtDate',
        required: false,
      },
      {
        label: t('concrete.materials.recieveDate'),
        value: material.description.recieveDate,
        key: 'recieveDate',
        required: false,
      },
      {
        label: t('concrete.materials.extractionDate'),
        value: material.description.extractionDate,
        key: 'extractionDate',
        required: false,
      },
      {
        label: t('concrete.materials.collectionDate'),
        value: material.description.collectionDate,
        key: 'collectionDate',
        required: false,
      },
      {
        label: t('concrete.materials.observation'),
        value: material.description.observation,
        key: 'observation',
        required: false,
      },
    ];

    const WhiteList: string[] = ['name', 'type', 'source', 'responsible'];

    switch (material.type) {
      case 'coarseAggregate':
        WhiteList.push('maxDiammeter', 'aggregateNature', 'extractionDate', 'collectionDate');
        break;
      case 'fineAggregate':
        WhiteList.push('maxDiammeter', 'aggregateNature', 'extractionDate', 'collectionDate');
        break;
      case 'cement':
        WhiteList.push('cementType', 'collectionDate', 'resistance');
        break;
      default:
        break;
    }

    return inputs.filter((input) => WhiteList.includes(input.key));
  };

  const types: DropDownOption[] = [
    { label: '', value: null },
    { label: t('concrete.materials.coarseAggregate'), value: 'coarseAggregate' },
    { label: t('concrete.materials.fineAggregate'), value: 'fineAggregate' },
    { label: t('concrete.materials.other'), value: 'other' },
    { label: t('concrete.materials.cement'), value: 'cement' },
  ];

  const resistances: DropDownOption[] = [
    { label: '', value: null },
    { label: 'CP-29', value: 'CP-29' },
    { label: 'CP-32', value: 'CP-32' },
    { label: 'CP-35', value: 'CP-35' },
    { label: 'CP-36', value: 'CP-36' },
    { label: 'CP-41', value: 'CP-41' },
    { label: 'CP-44', value: 'CP-44' },
    { label: 'CP-47', value: 'CP-47' },
    { label: 'CP-50', value: 'CP-50' },
    { label: t('concrete.materials.cementType.other'), value: 'Other' },
  ];

  const classification_CAP_options: DropDownOption[] = [
    { label: '', value: null },
    { label: 'CAP 30/45', value: 'CAP 30/45' },
    { label: 'CAP 50/70', value: 'CAP 50/70' },
    { label: 'CAP 85/100', value: 'CAP 85/100' },
    { label: 'CAP 150/200', value: 'CAP 150/200' },
  ];

  const classification_AMP_options: DropDownOption[] = [
    { label: '', value: null },
    { label: 'AMP 50/65', value: 'AMP 50/65' },
    { label: 'AMP 55/75', value: 'AMP 55/75' },
    { label: 'AMP 60/85', value: 'AMP 60/85' },
    { label: 'AMP 65/90', value: 'AMP 65/90' },
  ];

  const cementTypes: DropDownOption[] = [
    { label: '', value: null },
    { label: 'CP I', value: 'CP I' },
    { label: 'CP I-S', value: 'CP I-S' },
    { label: 'CP II-E', value: 'CP II-E' },
    { label: 'CP II-Z', value: 'CP II-Z' },
    { label: 'CP II-F', value: 'CP II-F' },
    { label: 'CP III', value: 'CP III' },
    { label: 'CP IV', value: 'CP IV' },
    { label: 'CP V-ARI', value: 'CP V-ARI' },
    { label: 'CP V-ARI RS', value: 'CP V-ARI RS' },
  ];

  const dropDowns = {
    type: types,
    classification_CAP: classification_CAP_options,
    classification_AMP: classification_AMP_options,
    resistance: resistances,
  };

  const changeMaterial = (key: string, value: string) => {
    if (key === 'type' || key === 'name') setMaterial({ ...material, [key]: value });
    else setMaterial({ ...material, description: { ...material.description, [key]: value } });
  };

  const handleCreateMaterial = async () => {
    const CreateEditMaterialToast = toast.loading('Cadastrando material...', { autoClose: 5000 });
    try {
      validateMaterialData();

      const formattedMaterial: ConcreteMaterial = { ...material, userId, description: material.description || {} };
      delete formattedMaterial.createdAt;
      delete formattedMaterial._id;

      await concreteMaterialService.createMaterial(formattedMaterial);

      await updateMaterials();

      handleCloseModal();

      toast.update(CreateEditMaterialToast, {
        render: 'Material cadastrado com sucesso!',
        type: 'success',
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
    } catch (error) {
      toast.update(CreateEditMaterialToast, {
        render: error,
        type: 'error',
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
      toast.dismiss();
      handleCloseModal();
    }
  };

  const validateMaterialData = () => {
    if (material.name === '') throw 'Nome do material não pode ser vazio';
    if (material.type === null) throw 'Tipo do material não pode ser vazio';
    if (materials.find((m) => m.name === material.name)) throw 'Já existe uma amostra com esse nome!';
  };

  const handleEditMaterial = async () => {
    const toastId = toast.loading('Editando material...', { autoClose: 5000 });

    try {
      validateMaterialData();

      await concreteMaterialService.editMaterial(materialToEdit._id, material);

      await updateMaterials();

      handleCloseModal();

      toast.update(toastId, {
        render: 'Material editado com sucesso!',
        type: 'success',
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
    } catch (error) {
      toast.update(toastId, {
        render: error,
        type: 'error',
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
    }
  };

  const getDropdownDefaultValue = (key: string, value: string | Sieve) => {
    switch (key) {
      case 'type':
        return { label: material.type, value: material.type };
      case 'classification_CAP':
        return { label: material.description.classification_CAP, value: material.description.classification_CAP };
      case 'classification_AMP':
        return { label: material.description.classification_AMP, value: material.description.classification_AMP };
      case 'resistance':
        return { label: material.description.resistance, value: material.description.resistance };
      case 'cementType':
        return { label: material.description.cementType, value: material.description.cementType };
      default:
        return { label: value.toString(), value: value };
    }
  };

  return (
    <ModalBase
      title={modalTitle}
      open={openModal}
      leftButtonTitle={t('samples.cancel')}
      rightButtonTitle={isEdit ? t('samples.edit') : t('samples.register')}
      size="medium"
      onSubmit={() => {
        if (isEdit) {
          handleEditMaterial();
        } else {
          handleCreateMaterial();
        }
      }}
      onCancel={() => {
        resetMaterial();
        handleCloseModal();
      }}
      disableSubmit={
        material.name === '' ||
        material.type === null ||
        (material.type === 'cement'
          ? material.description.cementType === null || material.description.resistance === null
          : false)
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
              input.key === 'classification_CAP' ||
              input.key === 'classification_AMP' ||
              input.key === 'resistance' ||
              input.key === 'cementType'
            ) {
              return (
                <DropDown
                  key={input.key}
                  variant="standard"
                  size="medium"
                  isEdit={isEdit}
                  sx={{ minWidth: '120px', bgcolor: 'primaryTons.white' }}
                  callback={(value: string) => changeMaterial(input.key, value)}
                  required={input.required}
                  label={t(`concrete.materials.${input.key}`)}
                  options={
                    input.key === 'type'
                      ? types
                      : input.key === 'resistance'
                      ? resistances
                      : input.key === 'cementType'
                      ? cementTypes
                      : dropDowns[input.key]
                  }
                  value={getDropdownDefaultValue(input.key, input.value)}
                />
              );
            } else {
              return (
                <TextField
                  key={input.key}
                  label={input.label}
                  variant="standard"
                  value={input.value}
                  required={input.required}
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

export default CreateEditConcreteMaterialModal;
