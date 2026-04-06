import { EssayPageProps } from '../../../templates/essay';
import { t } from 'i18next';
import { Box, Button, TextField, Typography, Divider } from '@mui/material';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import useStabilizedLayersStore from '@/stores/promedina/stabilized-layers/stabilized-layers.store';
import { toast } from 'react-toastify';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import UploadImages from '@/components/molecules/uploadImages';
import { useState, useEffect } from 'react';
import { dateFormatter } from '@/utils/dateFormatter';
import EditableCell from '@/utils/hooks/editableTableCell';

const StabilizedLayers_step2 = ({ setNextDisabled }: EssayPageProps) => {
  const { step2Data, setData } = useStabilizedLayersStore();
  const rows = step2Data.structuralComposition;
  const [images, setImages] = useState<string>(step2Data.images ? step2Data.images : '');
  const [showMillingThickness, setShowMillingThickness] = useState<boolean>(step2Data.milling === 'Sim');

  useEffect(() => {
    if (images !== null) {
      setData({ step: 1, key: 'images', value: images });
    }
  }, [images, setData]);

  // Verificar se fresagem é "Sim" para mostrar campo de espessura
  useEffect(() => {
    setShowMillingThickness(step2Data.milling === 'Sim');
    if (step2Data.milling !== 'Sim') {
      setData({ step: 1, key: 'millingThickness', value: null });
    }
  }, [step2Data.milling, setData]);

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

  // Função para renderizar campos em grid responsivo - CORRIGIDA
  const renderGridFields = (fields: any[], columnsCount = 3) => (
    <Box sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
      width: '100%',
      paddingBottom: '20px'
    }}>
      {fields.map((input) => (
        <Box key={input.key} sx={{ 
          flex: `0 0 calc(${100/columnsCount}% - 20px)`,
          minWidth: '250px'
        }}>
          {input.adornment ? (
            <InputEndAdornment
              adornment={input.adornment}
              type={input.type || 'text'}
              variant="standard"
              fullWidth
              label={input.label}
              value={input.value?.toString() || ''}
              required={input.required}
              onChange={(e) => setData({ step: 1, key: input.key, value: e.target.value })}
            />
          ) : input.type === 'date' ? (
            <TextField
              variant="standard"
              fullWidth
              type="date"
              label={input.label}
              value={input.value || ''}
              required={input.required}
              InputLabelProps={{ shrink: true }}
              helperText={input.helperText || ''}
              onChange={(e) => setData({ step: 1, key: input.key, value: e.target.value })}
            />
          ) : (
            <TextField
              variant="standard"
              fullWidth
              multiline={input.multiline || false}
              rows={input.multiline ? 3 : 1}
              type={input.type || 'text'}
              label={input.label}
              value={input.value || ''}
              required={input.required}
              helperText={input.helperText || ''}
              onChange={(e) => setData({ step: 1, key: input.key, value: e.target.value })}
            />
          )}
        </Box>
      ))}
    </Box>
  );

  // SEÇÃO 1 - DADOS DO PAVIMENTO (já existentes)
  const pavimentDataInputs = [
    { label: 'IDENTIFICAÇÃO', value: step2Data.identification, key: 'identification', required: true },
    { label: 'TIPO DE SEÇÃO', value: step2Data.sectionType, key: 'sectionType', required: true },
    { label: 'EXTENSÃO (m)', value: step2Data.extension, key: 'extension', required: true, adornment: 'm', type: 'number' },
    { label: 'ESTACA/METROS INICIAL', value: step2Data.initialStakeMeters, key: 'initialStakeMeters', required: true },
    { label: 'LATITUDE INICIAL', value: step2Data.latitudeI, key: 'latitudeI', required: true },
    { label: 'LONGITUDE INICIAL', value: step2Data.longitudeI, key: 'longitudeI', required: true },
    { label: 'ESTACA/METROS FINAL', value: step2Data.finalStakeMeters, key: 'finalStakeMeters', required: true },
    { label: 'LATITUDE FINAL', value: step2Data.latitudeF, key: 'latitudeF', required: true },
    { label: 'LONGITUDE FINAL', value: step2Data.longitudeF, key: 'longitudeF', required: true },
    { label: 'FASE DE MONITORAMENTO', value: step2Data.monitoringPhase, key: 'monitoringPhase', required: true },
    { label: 'LIBERAÇÃO AO TRÁFEGO', value: dateFormatter(step2Data?.trafficLiberation), key: 'trafficLiberation', required: true, type: 'date' },
    { label: 'ALTITUDE MÉDIA (m)', value: step2Data.averageAltitude, key: 'averageAltitude', required: true, adornment: 'm', type: 'number' },
    { label: 'NÚMERO DE FAIXAS', value: step2Data.numberOfTracks, key: 'numberOfTracks', required: true, type: 'number' },
    { label: 'FAIXA MONITORADA', value: step2Data.monitoredTrack, key: 'monitoredTrack', required: true },
    { label: 'LARGURA DA FAIXA (m)', value: step2Data.trackWidth, key: 'trackWidth', required: true, adornment: 'm', type: 'number' },
    { label: 'OBSERVAÇÕES', value: step2Data.observation, key: 'observation', required: false, multiline: true },
  ];

  // SEÇÃO 2 - PREPARO DO PAVIMENTO
  const pavementPreparationInputs = [
    { label: 'IRI (m/km) PRÉ-REABILITAÇÃO', value: step2Data.iriPrerehabilitation, key: 'iriPrerehabilitation', required: false, adornment: 'm/km', type: 'number' },
    { label: 'AT (%) PRÉ-REABILITAÇÃO', value: step2Data.atPrerehabilitation, key: 'atPrerehabilitation', required: false, adornment: '%', type: 'number' },
    { label: 'FRESAGEM:', value: step2Data.milling, key: 'milling', required: true, helperText: 'Preencher com Sim ou Não' },
    { label: 'INTERVENÇÃO NA BASE:', value: step2Data.interventionAtTheBase, key: 'interventionAtTheBase', required: true, helperText: 'Preencher com Sim ou Não' },
    { label: 'SAMI:', value: step2Data.sami, key: 'sami', required: true, helperText: 'Preencher com Sim ou Não' },
    { label: 'PINTURA DE LIGAÇÃO:', value: step2Data.bondingPaint, key: 'bondingPaint', required: true, helperText: 'Preencher com Sim ou Não' },
    { label: 'IMPRIMAÇÃO:', value: step2Data.priming, key: 'priming', required: true, helperText: 'Preencher com Sim ou Não' },
  ];

  // SEÇÃO 3 - CARACTERÍSTICAS
  const characteristicsInputs = [
    { label: 'RODOVIA/AVENIDA/RUA', value: step2Data.roadName, key: 'roadName', required: false, helperText: 'Preencher com o nome da rodovia/avenida/rua onde o trecho está localizado' },
    { label: 'CIDADE/ESTADO', value: step2Data.cityState, key: 'cityState', required: false, helperText: 'Preencher com a cidade/estado onde o segmento experimental está localizado' },
    { label: 'EXTENSÃO DA SEÇÃO EXPERIMENTAL (m)', value: step2Data.experimentalLength || step2Data.extension, key: 'experimentalLength', required: false, adornment: 'm', type: 'number' },
    { label: 'VELOCIDADE DIRETRIZ (km/h)', value: step2Data.guideSpeed, key: 'guideSpeed', required: false, adornment: 'km/h', type: 'number' },
  ];

  // SEÇÃO 4 - COORDENADAS
  const coordinatesInputs = [
    { label: 'LATITUDE INÍCIO', value: step2Data.latitudeI, key: 'latitudeI', required: false },
    { label: 'LONGITUDE INÍCIO', value: step2Data.longitudeI, key: 'longitudeI', required: false },
    { label: 'LATITUDE FIM', value: step2Data.latitudeF, key: 'latitudeF', required: false },
    { label: 'LONGITUDE FIM', value: step2Data.longitudeF, key: 'longitudeF', required: false },
  ];

  // SEÇÃO 5 - TEMPO EM SERVIÇO
  const serviceTimeInputs = [
    { label: 'DATA DA ÚLTIMA ATUALIZAÇÃO', value: dateFormatter(step2Data.lastUpdate), key: 'lastUpdate', required: true, type: 'date' },
    { label: 'TEMPO EM SERVIÇO (ANOS)', value: step2Data.serviceTimeYears, key: 'serviceTimeYears', required: false, type: 'number', adornment: 'anos' },
    { label: 'TEMPO EM SERVIÇO (MESES)', value: step2Data.serviceTimeMonths, key: 'serviceTimeMonths', required: false, type: 'number', adornment: 'meses' },
  ];

  setNextDisabled(false);

  return (
    <>
      {/* SEÇÃO 1 - DADOS DO PAVIMENTO */}
      <FlexColumnBorder title="DADOS DO PAVIMENTO" open={true} theme={'#07B811'}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {renderGridFields(pavimentDataInputs, 3)}
        </Box>
      </FlexColumnBorder>

      {/* SEÇÃO 2 - PREPARO DO PAVIMENTO */}
      <Box sx={{ mt: 3 }}>
        <FlexColumnBorder title="PREPARO DO PAVIMENTO" open={true} theme={'#07B811'}>
          <Box sx={{ width: '100%', p: 1 }}>
            {renderGridFields(pavementPreparationInputs, 3)}
            
            {/* Campo condicional para ESPESSURA FRESADA */}
            {showMillingThickness && (
              <Box sx={{ mt: 2, width: '100%' }}>
                <InputEndAdornment
                  adornment="cm"
                  type="number"
                  variant="standard"
                  fullWidth
                  label="ESPESSURA FRESADA (cm)"
                  value={step2Data.millingThickness?.toString() || ''}
                  required={false}
                  onChange={(e) => setData({ step: 1, key: 'millingThickness', value: e.target.value })}
                />
              </Box>
            )}
          </Box>
        </FlexColumnBorder>
      </Box>

      {/* SEÇÃO 3 - CARACTERÍSTICAS */}
      <Box sx={{ mt: 3 }}>
        <FlexColumnBorder title="CARACTERÍSTICAS" open={true} theme={'#07B811'}>
          <Box sx={{ width: '100%', p: 1 }}>
            {renderGridFields(characteristicsInputs, 2)}
          </Box>
        </FlexColumnBorder>
      </Box>

      {/* SEÇÃO 4 - COORDENADAS */}
      <Box sx={{ mt: 3 }}>
        <FlexColumnBorder title="COORDENADAS" open={true} theme={'#07B811'}>
          <Box sx={{ width: '100%', p: 1 }}>
            {renderGridFields(coordinatesInputs, 2)}
          </Box>
        </FlexColumnBorder>
      </Box>

      {/* SEÇÃO 5 - TEMPO EM SERVIÇO */}
      <Box sx={{ mt: 3 }}>
        <FlexColumnBorder title="TEMPO EM SERVIÇO" open={true} theme={'#07B811'}>
          <Box sx={{ width: '100%', p: 1 }}>
            {renderGridFields(serviceTimeInputs, 3)}
          </Box>
        </FlexColumnBorder>
      </Box>

      {/* SEÇÃO 6 - COMPOSIÇÃO ESTRUTURAL */}
      <Box sx={{ mt: 3 }}>
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
              label="DATA DAS IMAGENS"
              placeholder="dd/mm/aaaa"
              value={dateFormatter(step2Data.imagesDate)}
              style={{ display: 'block' }}
              required={false}
              onChange={(e) => setData({ step: 1, key: 'imagesDate', value: e.target.value })}
            />
          </Box>
        </FlexColumnBorder>
      </Box>
    </>
  );
};

export default StabilizedLayers_step2;