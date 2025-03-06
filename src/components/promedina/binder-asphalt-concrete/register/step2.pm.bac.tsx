import { EssayPageProps } from '../../../templates/essay';
import { t } from 'i18next';
import { Box, Button, TextField } from '@mui/material';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import UploadImages from '@/components/molecules/uploadImages';
import { useState, useEffect } from 'react';
import useBinderAsphaltConcreteStore from '@/stores/promedina/binder-asphalt-concrete/binder-asphalt-concrete.store';
import { dateFormatter } from '@/utils/dateFormatter';
import EditableCell from '@/utils/hooks/editableTableCell';

const BinderAsphaltConcrete_step2 = ({ setNextDisabled }: EssayPageProps) => {
  const { step2Data, setData } = useBinderAsphaltConcreteStore();
  const rows = step2Data?.structuralComposition;
  const [images, setImages] = useState<string>(step2Data?.images ? step2Data?.images : '');

  // Effect to update the images data when images state changes
  useEffect(() => {
    if (images !== null) {
      setData({ step: 1, key: 'images', value: images });
    }
  }, [images, setData]);

  // Function to remove the last row from the structural composition
  const handleErase = () => {
    try {
      if (rows.length > 1) {
        const newRows = [...rows];
        newRows.pop();
        setData({ step: 1, key: 'structuralComposition', value: newRows });
      } else throw t('compression.error.minValue'); // Throw error if trying to remove the last row
    } catch (error) {
      toast.error(error);
    }
  };

  // Function to add a new row to the structural composition
  const handleAdd = () => {
    const newRows = [...rows];
    newRows.push({
      id: rows.length,
      layer: null,
      material: null,
      thickness: null,
    });
    setData({ step: 1, key: 'structuralComposition', value: newRows });
    setNextDisabled(true); // Disable the next step button
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
      label: t('pm.granularLayer.identification'),
      value: step2Data?.identification,
      key: 'identification',
      required: true,
      type: 'text',
    },
    {
      label: t('pm.granularLayer.section.type'),
      value: step2Data?.sectionType,
      key: 'sectionType',
      required: true,
      type: 'text',
    },
    {
      label: t('pm.granularLayer.extension'),
      value: step2Data?.extension,
      key: 'extension',
      required: true,
      type: 'number',
    },
    {
      label: t('pm.granularLayer.initialStakeMeters'),
      value: step2Data?.initialStakeMeters,
      key: 'initialStakeMeters',
      required: true,
      type: 'text',
    },
    {
      label: t('pm.granularLayer.latitudeI'),
      value: step2Data?.latitudeI,
      key: 'latitudeI',
      required: true,
      type: 'text',
    },
    {
      label: t('pm.granularLayer.longitudeI'),
      value: step2Data?.longitudeI,
      key: 'longitudeI',
      required: true,
      type: 'text',
    },
    {
      label: t('pm.granularLayer.finalStakeMeters'),
      value: step2Data?.finalStakeMeters,
      key: 'finalStakeMeters',
      required: true,
      type: 'text',
    },
    {
      label: t('pm.granularLayer.latitudeF'),
      value: step2Data?.latitudeF,
      key: 'latitudeF',
      required: true,
      type: 'text',
    },
    {
      label: t('pm.granularLayer.longitudeF'),
      value: step2Data?.longitudeF,
      key: 'longitudeF',
      required: true,
      type: 'text',
    },
    {
      label: t('pm.granularLayer.monitoringPhase'),
      value: step2Data?.monitoringPhase,
      key: 'monitoringPhase',
      required: true,
      type: 'text',
    },
    {
      label: t('pm.granularLayer.trafficLiberation'),
      value: dateFormatter(step2Data?.trafficLiberation),
      key: 'trafficLiberation',
      required: true,
      type: 'text',
    },
    {
      label: t('pm.granularLayer.averageAltitude'),
      value: step2Data?.averageAltitude,
      key: 'averageAltitude',
      required: true,
      type: 'number',
    },
    {
      label: t('pm.granularLayer.numberOfTracks'),
      value: step2Data?.numberOfTracks,
      key: 'numberOfTracks',
      required: true,
      type: 'number',
    },
    {
      label: t('pm.granularLayer.monitoredTrack'),
      value: step2Data?.monitoredTrack,
      key: 'monitoredTrack',
      required: true,
      type: 'text',
    },
    {
      label: t('pm.granularLayer.trackWidth'),
      value: step2Data?.trackWidth,
      key: 'trackWidth',
      required: true,
      type: 'number',
    },
    {
      label: t('pm.granularLayer.observations'),
      value: step2Data?.observation,
      key: 'observation',
      required: false,
      type: 'text',
    },
  ];

  const inputsPavimentPreparation = [
    { label: t('pm.binderAsphaltConcrete.milling'), value: step2Data?.milling, key: 'milling', required: true },
    {
      label: t('pm.binderAsphaltConcrete.intervention.at.the.base'),
      value: step2Data?.interventionAtTheBase,
      key: 'interventionAtTheBase',
      required: true,
    },
    { label: t('pm.binderAsphaltConcrete.sami'), value: step2Data?.sami, key: 'sami', required: true },
    {
      label: t('pm.binderAsphaltConcrete.bonding.paint'),
      value: step2Data?.bondingPaint,
      key: 'bondingPaint',
      required: true,
    },
    {
      label: t('pm.binderAsphaltConcrete.priming'),
      value: step2Data?.priming,
      key: 'priming',
      required: true,
    },
  ];

  const columns: GridColDef[] = [
    {
      field: 'layer',
      headerName: t('pm.granularLayer.layer'),
      renderCell: ({ row }) => {
        return <EditableCell row={row} field="layer" rows={rows} setData={setData} adornment={''} />;
      },
    },
    {
      field: 'material',
      headerName: t('pm.granularLayer.material'),
      renderCell: ({ row }) => {
        return <EditableCell row={row} field="material" rows={rows} setData={setData} adornment={''} />;
      },
    },
    {
      field: 'thickness',
      headerName: t('pm.granularLayer.thickness'),
      renderCell: ({ row }) => {
        return <EditableCell row={row} field="thickness" rows={rows} setData={setData} adornment={'mm'} />;
      },
    },
  ];

  setNextDisabled(false);

  return (
    <>
      <FlexColumnBorder title={t('pm.paviment.data')} open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
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
              if (input.key === 'extension' || input.key === 'averageAltitude' || input.key === 'trackWidth') {
                return (
                  <InputEndAdornment
                    adornment={'m'}
                    type={input.type}
                    key={input.key}
                    variant="standard"
                    label={input.label}
                    value={input.value?.toString()}
                    required={input.required}
                    onChange={(e) => setData({ step: 1, key: input.key, value: e.target.value })}
                  />
                );
              } else {
                return (
                  <TextField
                    key={input.key}
                    variant={'standard'}
                    type={input.type}
                    multiline={input.key === 'observation' ? true : false}
                    sx={input.key === 'observations' && { width: '100%' }}
                    label={input.label}
                    value={input.value}
                    required={input.required}
                    onChange={(e) => setData({ step: 1, key: input.key, value: e.target.value })}
                  />
                );
              }
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
                  onChange={(e) => setData({ step: 1, key: input.key, value: e.target.value })}
                />
              );
            })}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title={t('pm.paviment.lastUpdate')} open={true} theme={'#07B811'}>
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
            <TextField
              key={'lastUpdate'}
              variant="standard"
              label={t('pm.paviment.lastUpdate')}
              value={step2Data?.lastUpdate !== undefined ? dateFormatter(step2Data?.lastUpdate) : null}
              required
              onChange={(e) => setData({ step: 1, key: 'lastUpdate', value: e.target.value })}
            />
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title={t('pm.structural.composition')} open={true} theme={'#07B811'}>
        {rows?.length > 0 && columns?.length > 0 && (
          <DataGrid
            sx={{ mt: '1rem', borderRadius: '10px' }}
            density="compact"
            showCellVerticalBorder
            showColumnVerticalBorder
            slots={{ footer: ExpansionToolbar }}
            rows={rows?.map((row, index) => ({ ...row, id: index }))}
            columns={columns?.map((column) => ({
              ...column,
              sortable: false,
              disableColumnMenu: true,
              align: 'center',
              headerAlign: 'center',
              minWidth: 200,
              flex: 1,
            }))}
          />
        )}

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
          <UploadImages editarImages={step2Data?.images} onImagesUpdate={(images: string) => setImages(images)} />
          <TextField
            variant="standard"
            sx={{ width: 'fit-content', marginX: 'auto' }}
            label={t('pm-estructural-composition-image-date')}
            placeholder="_ _/_ _/_ _ _ _"
            value={step2Data?.imagesDate !== undefined ? dateFormatter(step2Data?.imagesDate) : null}
            style={{ display: 'block' }}
            required={false}
            onChange={(e) => setData({ step: 1, key: 'imagesDate', value: e.target.value })}
          />
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default BinderAsphaltConcrete_step2;
