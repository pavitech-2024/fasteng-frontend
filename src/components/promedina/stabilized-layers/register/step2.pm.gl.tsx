import { EssayPageProps } from '../../../templates/essay';
import { t } from 'i18next';
import { Box, Button, TextField } from '@mui/material';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import useStabilizedLayersStore from '@/stores/promedina/stabilized-layers/stabilized-layers.store';
import { toast } from 'react-toastify';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import UploadImages from '@/components/molecules/uploadImages';
import { useState, useEffect } from 'react';
import { dateFormatter } from '@/utils/dateFormatter';
import EditableCell from '@/utils/hooks/editableTableCell';

const StabilizedLayers_step2 = ({ setNextDisabled }: EssayPageProps) => {
  const { step2Data, setData } = useStabilizedLayersStore();
  const rows = step2Data.structuralComposition;
  const [images, setImages] = useState<string>(step2Data.images ? step2Data.images : '');

  useEffect(() => {
    if (images !== null) {
      setData({ step: 1, key: 'images', value: images });
    }
  }, [images, setData]);

  const handleErase = () => {
    try {
      if (rows.length > 1) {
        const newRows = [...rows];
        newRows.pop();
        setData({ step: 1, key: 'structuralComposition', value: newRows });
      } else throw t('compression.error.minValue');
    } catch (error) {
      toast.error(error);
    }
  };

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

  const columns: GridColDef[] = [
    {
      field: 'layer',
      headerName: 'CAMADA',
      renderCell: ({ row }) => {
        return <EditableCell row={row} field="layer" rows={rows} setData={setData} adornment={''} />;
      },
    },
    {
      field: 'material',
      headerName: 'MATERIAL',
      renderCell: ({ row }) => {
        return <EditableCell row={row} field="material" rows={rows} setData={setData} adornment={''} />;
      },
    },
    {
      field: 'thickness',
      headerName: 'ESPESSURA (mm)',
      renderCell: ({ row }) => {
        return <EditableCell row={row} field="thickness" rows={rows} setData={setData} adornment={'mm'} />;
      },
    },
  ];

  // COORDENADAS
  const coordinatesInputs = [
    { label: 'ESTACA/METROS INICIAL', value: step2Data.initialStakeMeters, key: 'initialStakeMeters', required: true },
    { label: 'LATITUDE INICIAL', value: step2Data.latitudeI, key: 'latitudeI', required: true },
    { label: 'LONGITUDE INICIAL', value: step2Data.longitudeI, key: 'longitudeI', required: true },
    { label: 'ESTACA/METROS FINAL', value: step2Data.finalStakeMeters, key: 'finalStakeMeters', required: true },
    { label: 'LATITUDE FINAL', value: step2Data.latitudeF, key: 'latitudeF', required: true },
    { label: 'LONGITUDE FINAL', value: step2Data.longitudeF, key: 'longitudeF', required: true },
  ];

  setNextDisabled(false);

  return (
    <>
      {/* COORDENADAS */}
      <FlexColumnBorder title="COORDENADAS" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {coordinatesInputs.map((input) => (
              <TextField
                key={input.key}
                variant="standard"
                type="text"
                label={input.label}
                value={input.value || ''}
                required={input.required}
                onChange={(e) => setData({ step: 1, key: input.key, value: e.target.value })}
                InputProps={{
                  inputProps: { style: { textTransform: 'uppercase' } }
                }}
              />
            ))}
          </Box>
        </Box>
      </FlexColumnBorder>

      {/* COMPOSIÇÃO ESTRUTURAL */}
      <FlexColumnBorder title="COMPOSIÇÃO ESTRUTURAL" open={true} theme={'#07B811'}>
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
            mt: 2,
          }}
        >
          <UploadImages editarImages={step2Data.images} onImagesUpdate={(images: string) => setImages(images)} />
          <TextField
            variant="standard"
            sx={{ width: 'fit-content', marginX: 'auto', mt: 2 }}
            label="DATA DA IMAGEM"
            placeholder="dd/mm/aaaa"
            value={dateFormatter(step2Data.imagesDate)}
            style={{ display: 'block' }}
            required={false}
            onChange={(e) => setData({ step: 1, key: 'imagesDate', value: e.target.value })}
            InputProps={{
              inputProps: { style: { textTransform: 'uppercase' } }
            }}
          />
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default StabilizedLayers_step2;