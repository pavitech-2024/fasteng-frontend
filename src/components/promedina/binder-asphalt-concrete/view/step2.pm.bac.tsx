import { EssayPageProps } from '../../../templates/essay';
import { t } from 'i18next';
import { Box, Button, TextField } from '@mui/material';
import useBinderAsphaltConcreteStore from '@/stores/promedina/granular-layers/granular-layers.store';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import UploadImages from '@/components/molecules/uploadImages';
import { useState, useEffect } from 'react';

const BinderAsphaltConcrete_step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { step2Data, setData } = useBinderAsphaltConcreteStore();
  const rows = step2Data.structuralComposition;
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (images !== null) {
      setData({ step: 1, key: 'images', value: images });
    }
  }, [images, setData]);

  // Remover mais uma linha de determinado valor
  const handleErase = () => {
    try {
      if (rows.length > 1) {
        // O mínimo é um valor de cada
        const newRows = [...rows];
        newRows.pop();
        setData({ step: 1, key: 'structuralComposition', value: newRows });
      } else throw t('compression.error.minValue');
    } catch (error) {
      toast.error(error);
    }
  };

  // Adicionar mais uma linha de determinado valor
  const handleAdd = () => {
    const newRows = [...rows];
    newRows.push({
      id: rows.length,
      layer: null,
      material: null,
      thickness: null,
    });
    setData({ step: 1, key: 'structuralComposition', value: newRows });
    setNextDisabled(true);
  };

  const ExpansionToolbar = () => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem', flexWrap: 'wrap' }}>
        <Button sx={{ color: 'secondaryTons.red' }} onClick={handleErase}>
          {t('erase')}
        </Button>
        <Button sx={{ color: 'secondaryTons.green' }} onClick={handleAdd}>
          {t('add')}
        </Button>
      </Box>
    );
  };

  const inputsPavimentData = [
    {
      label: t('pm.binderAsphaltConcrete.identification'),
      value: step2Data.identification,
      key: 'identification',
      required: true,
    },
    {
      label: t('pm.binderAsphaltConcrete.section.type'),
      value: step2Data.sectionType,
      key: 'sectionType',
      required: true,
    },
    { label: t('pm.binderAsphaltConcrete.extension'), value: step2Data.extension, key: 'extension', required: true },
    {
      label: t('pm.binderAsphaltConcrete.initial.stake.meters'),
      value: step2Data.initialStakeMeters,
      key: 'initialStakeMeters',
      required: true,
    },
    { label: t('pm.binderAsphaltConcrete.latitudeI'), value: step2Data.latitudeI, key: 'latitudeI', required: true },
    { label: t('pm.binderAsphaltConcrete.longitudeI'), value: step2Data.longitudeI, key: 'longitudeI', required: true },
    {
      label: t('pm.binderAsphaltConcrete.final.stake.meters'),
      value: step2Data.finalStakeMeters,
      key: 'finalStakeMeters',
      required: true,
    },
    { label: t('pm.binderAsphaltConcrete.latitudeF'), value: step2Data.latitudeF, key: 'latitudeF', required: true },
    { label: t('pm.binderAsphaltConcrete.longitudeF'), value: step2Data.longitudeF, key: 'longitudeF', required: true },
    {
      label: t('pm.binderAsphaltConcrete.monitoring.phase'),
      value: step2Data.monitoringPhase,
      key: 'monitoringPhase',
      required: true,
    },
    {
      label: t('pm.binderAsphaltConcrete.observations'),
      value: step2Data.observation,
      key: 'observation',
      required: false,
    },
  ];

  const inputsPavimentPreparation = [
    { label: t('pm.binderAsphaltConcrete.milling'), value: step2Data.milling, key: 'milling', required: true },
    {
      label: t('pm.binderAsphaltConcrete.intervention.at.the.base'),
      value: step2Data.interventionAtTheBase,
      key: 'interventionAtTheBase',
      required: true,
    },
    { label: t('pm.binderAsphaltConcrete.sami'), value: step2Data.sami, key: 'sami', required: true },
    {
      label: t('pm.binderAsphaltConcrete.bonding.paint'),
      value: step2Data.bondingPaint,
      key: 'bondingPaint',
      required: true,
    },
    {
      label: t('pm.binderAsphaltConcrete.priming'),
      value: step2Data.priming,
      key: 'priming',
      required: true,
    },
  ];

  const columns: GridColDef[] = [
    {
      field: 'layer',
      headerName: t('pm.granularLayer.layer'),
      renderCell: ({ row }) => {
        const { id } = row;
        const index = rows.findIndex((r) => r.id === id);

        return (
          <InputEndAdornment
            fullWidth
            label={t('pm.granularLayer.layer')}
            type="number"
            inputProps={{ min: 0 }}
            value={row.layer}
            onChange={(e) => {
              const newRows = [...rows];
              rows[index].layer = Number(e.target.value);
              setData({ step: 1, key: 'layer', value: newRows });
            }}
            adornment={''}
          />
        );
      },
    },
    {
      field: 'material',
      headerName: t('pm.granularLayer.material'),
      renderCell: ({ row }) => {
        const { id } = row;
        const index = rows.findIndex((r) => r.id === id);

        return (
          <InputEndAdornment
            fullWidth
            label={t('pm.granularLayer.material')}
            type="number"
            inputProps={{ min: 0 }}
            value={row.wetGrossWeightCapsule}
            onChange={(e) => {
              const newRows = [...rows];
              newRows[index].material = Number(e.target.value);
              setData({ step: 1, key: 'material', value: newRows });
            }}
            adornment={''}
          />
        );
      },
    },
    {
      field: 'thickness',
      headerName: t('pm.granularLayer.thickness'),
      renderCell: ({ row }) => {
        const { id } = row;
        const index = rows.findIndex((r) => r.id === id);

        return (
          <InputEndAdornment
            fullWidth
            label={t('pm.granularLayer.thickness')}
            type="number"
            inputProps={{ min: 0 }}
            value={row.thickness}
            onChange={(e) => {
              const newRows = [...rows];
              newRows[index].thickness = Number(e.target.value);
              setData({ step: 1, key: 'thickness', value: newRows });
            }}
            adornment={''}
          />
        );
      },
    },
  ];

  inputsPavimentData.every(({ required }) => {
    if (!required) return true;

    //   if (value === null) return false;

    //   if (typeof value === 'string' && value.trim() === '') return false;

    return true;
  }) &&
    inputsPavimentPreparation.every(({ required }) => {
      if (!required) return true;

      //     if (value === null) return false;

      //     if (typeof value === 'string' && value.trim() === '') return false;

      return true;
    }) &&
    nextDisabled &&
    setNextDisabled(false);

  return (
    <>
      <FlexColumnBorder title={t('pm.paviment.data')} open={true} theme={'#07B811'}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              width: '100%',
              gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' },
              gap: '10px 20px',
              paddingBottom: '20px',
            }}
          >
            {inputsPavimentData.map((input) => {
              return (
                <TextField
                  key={input.key}
                  variant="standard"
                  label={input.label}
                  value={input.value}
                  required={input.required}
                  onChange={(e) => setData({ step: 0, key: input.key, value: e.target.value })}
                />
              );
            })}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title={t('pm.paviment.preparation')} open={true} theme={'#07B811'}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              width: '100%',
              gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' },
              gap: '5px 20px',
              paddingBottom: '20px',
            }}
          >
            {inputsPavimentPreparation.map((input) => {
              return (
                <TextField
                  key={input.key}
                  variant="standard"
                  label={input.label}
                  value={input.value}
                  required={input.required}
                  onChange={(e) => setData({ step: 0, key: input.key, value: e.target.value })}
                />
              );
            })}
          </Box>
        </Box>
      </FlexColumnBorder>
      <FlexColumnBorder title={t('pm.structural.composition')} open={true} theme={'#07B811'}>
        <DataGrid
          sx={{ mt: '1rem', borderRadius: '10px' }}
          density="compact"
          showCellVerticalBorder
          showColumnVerticalBorder
          slots={{ footer: ExpansionToolbar }}
          rows={rows.map((row, index) => ({ ...row, id: index }))}
          columns={columns.map((column) => ({
            ...column,
            sortable: false,
            disableColumnMenu: true,
            align: 'center',
            headerAlign: 'center',
            minWidth: 200,
            flex: 1,
          }))}
        />
        <Box
          id="upload-images"
          sx={{
            display: 'grid',
            width: '100%',
            gridTemplateColumns: '1fr',
            paddingBottom: '20px',
            alignItems: 'center',
          }}
        >
          <UploadImages onImagesUpdate={(images: string[]) => setImages(images)} />
          <TextField
            variant="standard"
            label={'Data da imagem'}
            value={step2Data.imagesDate}
            style={{ display: 'block' }}
            required={false}
            onChange={(e) => setData({ step: 0, key: 'date', value: e.target.value })}
          />
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default BinderAsphaltConcrete_step2;
