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

  // CARACTERÍSTICAS DO PAVIMENTO
  const inputsCharacteristics = [
    { label: 'LOCAL', value: step2Data?.roadName || step2Data?.identification, key: 'roadName', required: true, type: 'text' },
    { label: 'MUNICÍPIO/ESTADO', value: step2Data?.cityState, key: 'cityState', required: true, type: 'text' },
    { label: 'EXTENSÃO (m)', value: step2Data?.experimentalLength || step2Data?.extension, key: 'experimentalLength', required: true, type: 'number', adornment: 'm' },
    { label: 'VELOCIDADE DIRETRIZ DA VIA (km/h)', value: step2Data?.guideSpeed, key: 'guideSpeed', required: true, type: 'number', adornment: 'km/h' },
  ];

  // COORDENADAS
  const inputsCoordinates = [
    { label: 'ESTACA/METROS INICIAL', value: step2Data?.initialStakeMeters, key: 'initialStakeMeters', required: true, type: 'text' },
    { label: 'LATITUDE INICIAL', value: step2Data?.latitudeI, key: 'latitudeI', required: true, type: 'text' },
    { label: 'LONGITUDE INICIAL', value: step2Data?.longitudeI, key: 'longitudeI', required: true, type: 'text' },
    { label: 'ESTACA/METROS FINAL', value: step2Data?.finalStakeMeters, key: 'finalStakeMeters', required: true, type: 'text' },
    { label: 'LATITUDE FINAL', value: step2Data?.latitudeF, key: 'latitudeF', required: true, type: 'text' },
    { label: 'LONGITUDE FINAL', value: step2Data?.longitudeF, key: 'longitudeF', required: true, type: 'text' },
  ];

  // DADOS DO PAVIMENTO
  const inputsPavimentData = [
    { label: 'IDENTIFICAÇÃO', value: step2Data?.identification, key: 'identification', required: true, type: 'text' },
    { label: 'TIPO DE SEÇÃO', value: step2Data?.sectionType, key: 'sectionType', required: true, type: 'text' },
    { label: 'FASE DE MONITORAMENTO', value: step2Data?.monitoringPhase, key: 'monitoringPhase', required: true, type: 'text' },
    { label: 'LIBERAÇÃO AO TRÁFEGO', value: dateFormatter(step2Data?.trafficLiberation), key: 'trafficLiberation', required: true, type: 'text' },
    { label: 'ALTITUDE MÉDIA (m)', value: step2Data?.averageAltitude, key: 'averageAltitude', required: true, type: 'number', adornment: 'm' },
    { label: 'NÚMERO DE FAIXAS', value: step2Data?.numberOfTracks, key: 'numberOfTracks', required: true, type: 'number' },
    { label: 'FAIXA MONITORADA', value: step2Data?.monitoredTrack, key: 'monitoredTrack', required: true, type: 'text' },
    { label: 'LARGURA DA FAIXA (m)', value: step2Data?.trackWidth, key: 'trackWidth', required: true, type: 'number', adornment: 'm' },
    { label: 'OBSERVAÇÕES', value: step2Data?.observation, key: 'observation', required: false, type: 'text', multiline: true },
  ];

  // PREPARO DO PAVIMENTO
  const inputsPavimentPreparation = [
    { label: 'IRI (m/km) PRÉ-REABILITAÇÃO', value: step2Data?.iriPrerehabilitation, key: 'iriPrerehabilitation', required: true, type: 'text' },
    { label: 'AT (%) PRÉ-REABILITAÇÃO', value: step2Data?.atPrerehabilitation, key: 'atPrerehabilitation', required: true, type: 'text' },
    { label: 'FRESAGEM (cm)', value: step2Data?.millingThickness, key: 'millingThickness', required: true, type: 'text' },
    { label: 'INTERVENÇÃO NA BASE', value: step2Data?.interventionAtTheBase, key: 'interventionAtTheBase', required: true, type: 'text' },
    { label: 'SAMI', value: step2Data?.sami, key: 'sami', required: true, type: 'text' },
    { label: 'PINTURA DE LIGAÇÃO', value: step2Data?.bondingPaint, key: 'bondingPaint', required: true, type: 'text' },
    { label: 'IMPRIMAÇÃO', value: step2Data?.priming, key: 'priming', required: true, type: 'text' },
  ];

  // TEMPO EM SERVIÇO
  const inputsServiceTime = [
    { label: 'TEMPO EM SERVIÇO (ANOS)', value: step2Data?.serviceTimeYears, key: 'serviceTimeYears', required: true, type: 'number' },
    { label: 'TEMPO EM SERVIÇO (MESES)', value: step2Data?.serviceTimeMonths, key: 'serviceTimeMonths', required: true, type: 'number' },
  ];

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

  setNextDisabled(false);

  return (
    <>
      {/* CARACTERÍSTICAS */}
      <FlexColumnBorder title="CARACTERÍSTICAS" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {inputsCharacteristics.map((input) => {
              if (input.adornment) {
                return (
                  <InputEndAdornment
                    key={input.key}
                    adornment={input.adornment}
                    type={input.type}
                    variant="standard"
                    label={input.label}
                    value={input.value?.toString() || ''}
                    required={input.required}
                    onChange={(e) => setData({ step: 1, key: input.key, value: e.target.value })}
                  />
                );
              }
              return (
                <TextField
                  key={input.key}
                  variant="standard"
                  type={input.type}
                  label={input.label}
                  value={input.value || ''}
                  required={input.required}
                  onChange={(e) => setData({ step: 1, key: input.key, value: e.target.value })}
                />
              );
            })}
          </Box>
        </Box>
      </FlexColumnBorder>

      {/* COORDENADAS */}
      <FlexColumnBorder title="COORDENADAS" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {inputsCoordinates.map((input) => (
              <TextField
                key={input.key}
                variant="standard"
                type={input.type}
                label={input.label}
                value={input.value || ''}
                required={input.required}
                onChange={(e) => setData({ step: 1, key: input.key, value: e.target.value })}
              />
            ))}
          </Box>
        </Box>
      </FlexColumnBorder>

      {/* DADOS DO PAVIMENTO */}
      <FlexColumnBorder title="DADOS DO PAVIMENTO" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {inputsPavimentData.map((input) => {
              if (input.adornment) {
                return (
                  <InputEndAdornment
                    key={input.key}
                    adornment={input.adornment}
                    type={input.type}
                    variant="standard"
                    label={input.label}
                    value={input.value?.toString() || ''}
                    required={input.required}
                    onChange={(e) => setData({ step: 1, key: input.key, value: e.target.value })}
                  />
                );
              }
              return (
                <TextField
                  key={input.key}
                  variant="standard"
                  type={input.type}
                  multiline={input.multiline || false}
                  sx={input.key === 'observation' ? { gridColumn: 'span 3' } : {}}
                  label={input.label}
                  value={input.value || ''}
                  required={input.required}
                  onChange={(e) => setData({ step: 1, key: input.key, value: e.target.value })}
                />
              );
            })}
          </Box>
        </Box>
      </FlexColumnBorder>

      {/* PREPARO DO PAVIMENTO */}
      <FlexColumnBorder title="PREPARO DO PAVIMENTO" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {inputsPavimentPreparation.map((input) => (
              <TextField
                key={input.key}
                variant="standard"
                type={input.type}
                label={input.label}
                value={input.value || ''}
                required={input.required}
                onChange={(e) => setData({ step: 1, key: input.key, value: e.target.value })}
              />
            ))}
          </Box>
        </Box>
      </FlexColumnBorder>

      {/* TEMPO EM SERVIÇO */}
      <FlexColumnBorder title="TEMPO EM SERVIÇO" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {inputsServiceTime.map((input) => (
              <InputEndAdornment
                key={input.key}
                adornment={input.key === 'serviceTimeYears' ? 'anos' : 'meses'}
                type={input.type}
                variant="standard"
                label={input.label}
                value={input.value?.toString() || ''}
                required={input.required}
                onChange={(e) => setData({ step: 1, key: input.key, value: e.target.value })}
              />
            ))}
          </Box>
        </Box>
      </FlexColumnBorder>

      {/* DATA DA ÚLTIMA ATUALIZAÇÃO */}
      <FlexColumnBorder title="DATA DA ÚLTIMA ATUALIZAÇÃO" open={true} theme={'#07B811'}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            <TextField
              key={'lastUpdate'}
              variant="standard"
              label="DATA"
              placeholder="dd/mm/aaaa"
              value={step2Data?.lastUpdate !== undefined ? dateFormatter(step2Data?.lastUpdate) : ''}
              required
              onChange={(e) => setData({ step: 1, key: 'lastUpdate', value: e.target.value })}
            />
          </Box>
        </Box>
      </FlexColumnBorder>

      {/* COMPOSIÇÃO ESTRUTURAL */}
      <FlexColumnBorder title="COMPOSIÇÃO ESTRUTURAL" open={true} theme={'#07B811'}>
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
            label="DATA DA IMAGEM"
            placeholder="dd/mm/aaaa"
            value={step2Data?.imagesDate !== undefined ? dateFormatter(step2Data?.imagesDate) : ''}
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