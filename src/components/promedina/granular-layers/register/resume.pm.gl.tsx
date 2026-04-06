import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import { t } from 'i18next';
import GeneratePDF_ProMedina from '@/components/generatePDF/promedina/granularLayers/generatePDF.promedina';
import useGranularLayersStore from '@/stores/promedina/granular-layers/granular-layers.store';
import { EssayPageProps } from '@/components/templates/essay';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const GranularLayersResume = ({ setNextDisabled, onSave }: EssayPageProps & { onSave?: () => Promise<{ success: boolean; duplicate?: boolean }> }) => {
  const { generalData, step2Data, step3Data, resetStore } = useGranularLayersStore();
  const router = useRouter();
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const samples = { generalData, step2Data, step3Data };

  // Configuração das colunas da tabela de composição estrutural
  const columns: GridColDef[] = [
    { field: 'layer', headerName: t('materials.template.layer'), flex: 1, minWidth: 150 },
    { field: 'material', headerName: t('pm.binderAsphaltConcrete.material'), flex: 1, minWidth: 150 },
    { field: 'thickness', headerName: t('pm.binderAsphaltConcrete.thickness'), flex: 1, minWidth: 120 },
  ];

  const rows = samples?.step2Data?.structuralComposition?.map((item, index) => ({
    id: index,
    layer: item.layer || '-',
    material: item.material || '-',
    thickness: item.thickness ? `${item.thickness} mm` : '-',
  })) || [];

  // ==================== STEP 1 - IDENTIFICAÇÃO ====================
  const identificationFields = [
    { label: t('pm.granularLayer.tipoSecao'), key: 'tipoSecao', value: generalData?.tipoSecao },
    { label: t('pm.granularLayer.faseMonitoramento'), key: 'faseMonitoramento', value: generalData?.faseMonitoramento },
    { label: t('pm.granularLayer.liberacaoTrafico'), key: 'liberacaoTrafico', value: generalData?.liberacaoTrafico },
    { label: t('pm.granularLayer.utilizadaMeDiNa'), key: 'utilizadaMeDiNa', value: generalData?.utilizadaMeDiNa },
    { label: t('pm.granularLayer.utilizadaLVECD'), key: 'utilizadaLVECD', value: generalData?.utilizadaLVECD },
    { label: t('pm.granularLayer.dadosConfirmadosICT'), key: 'dadosConfirmadosICT', value: generalData?.dadosConfirmadosICT },
    { label: t('pm.granularLayer.observations'), key: 'observations', value: generalData?.observations },
  ];

  // ==================== STEP 2 - DADOS DO PAVIMENTO ====================
  const pavementDataFields = [
    { label: t('pm.granularLayer.identification'), key: 'identification', value: step2Data?.identification },
    { label: t('pm.granularLayer.sectionType'), key: 'sectionType', value: step2Data?.sectionType },
    { label: t('pm.granularLayer.extension'), key: 'extension', value: step2Data?.extension ? `${step2Data.extension} m` : '-' },
    { label: t('pm.granularLayer.initialStakeMeters'), key: 'initialStakeMeters', value: step2Data?.initialStakeMeters },
    { label: t('pm.granularLayer.latitudeI'), key: 'latitudeI', value: step2Data?.latitudeI },
    { label: t('pm.granularLayer.longitudeI'), key: 'longitudeI', value: step2Data?.longitudeI },
    { label: t('pm.granularLayer.finalStakeMeters'), key: 'finalStakeMeters', value: step2Data?.finalStakeMeters },
    { label: t('pm.granularLayer.latitudeF'), key: 'latitudeF', value: step2Data?.latitudeF },
    { label: t('pm.granularLayer.longitudeF'), key: 'longitudeF', value: step2Data?.longitudeF },
    { label: t('pm.granularLayer.monitoringPhase'), key: 'monitoringPhase', value: step2Data?.monitoringPhase },
    { label: t('pm.granularLayer.trafficLiberation'), key: 'trafficLiberation', value: step2Data?.trafficLiberation },
    { label: t('pm.granularLayer.averageAltitude'), key: 'averageAltitude', value: step2Data?.averageAltitude ? `${step2Data.averageAltitude} m` : '-' },
    { label: t('pm.granularLayer.numberOfTracks'), key: 'numberOfTracks', value: step2Data?.numberOfTracks },
    { label: t('pm.granularLayer.monitoredTrack'), key: 'monitoredTrack', value: step2Data?.monitoredTrack },
    { label: t('pm.granularLayer.trackWidth'), key: 'trackWidth', value: step2Data?.trackWidth ? `${step2Data.trackWidth} m` : '-' },
  ];

  // Preparo do pavimento
  const preparationFields = [
    { label: t('pm.granularLayer.milling'), key: 'milling', value: step2Data?.milling },
    { label: t('pm.granularLayer.interventionAtTheBase'), key: 'interventionAtTheBase', value: step2Data?.interventionAtTheBase },
    { label: t('pm.granularLayer.sami'), key: 'sami', value: step2Data?.sami },
    { label: t('pm.granularLayer.bondingPaint'), key: 'bondingPaint', value: step2Data?.bondingPaint },
    { label: t('pm.granularLayer.priming'), key: 'priming', value: step2Data?.priming },
    { label: t('pm.granularLayer.lastUpdate'), key: 'lastUpdate', value: step2Data?.lastUpdate },
  ];

  // Características da via
  const characteristicsFields = [
    { label: t('pm.granularLayer.highway'), key: 'highway', value: generalData?.highway },
    { label: t('pm.granularLayer.name'), key: 'name', value: generalData?.name },
    { label: t('pm.granularLayer.zone'), key: 'zone', value: generalData?.zone },
    { label: t('pm.granularLayer.layer'), key: 'layer', value: generalData?.layer },
    { label: t('pm.granularLayer.cityState'), key: 'cityState', value: generalData?.cityState },
    { label: t('pm.granularLayer.guideLineSpeed'), key: 'guideLineSpeed', value: generalData?.guideLineSpeed ? `${generalData.guideLineSpeed} km/h` : '-' },
  ];

  // Coordenadas
  const coordinatesFields = [
    { label: t('pm.granularLayer.initialStakeMeters'), key: 'initialStakeMeters', value: step2Data?.initialStakeMeters },
    { label: t('pm.granularLayer.latitudeI'), key: 'latitudeI', value: step2Data?.latitudeI },
    { label: t('pm.granularLayer.longitudeI'), key: 'longitudeI', value: step2Data?.longitudeI },
    { label: t('pm.granularLayer.finalStakeMeters'), key: 'finalStakeMeters', value: step2Data?.finalStakeMeters },
    { label: t('pm.granularLayer.latitudeF'), key: 'latitudeF', value: step2Data?.latitudeF },
    { label: t('pm.granularLayer.longitudeF'), key: 'longitudeF', value: step2Data?.longitudeF },
    { label: t('pm.granularLayer.averageAltitude'), key: 'averageAltitude', value: step2Data?.averageAltitude ? `${step2Data.averageAltitude} m` : '-' },
  ];

  // ==================== STEP 3 - CAMADAS ====================
  const layers = [
    { id: 'subleito', label: 'Subleito' },
    { id: 'aterro', label: 'Aterro' },
    { id: 'subBaseGranular', label: 'Sub-base Granular' },
    { id: 'baseGranular', label: 'Base Granular' }
  ];

  const mctFields = [
    { key: 'mctCoefficientC', label: 'MCT - Coeficiente c\'' },
    { key: 'mctIndexE', label: 'MCT - Índice e\'' },
    { key: 'especificMass', label: 'Massa Específica (g/cm³)' },
    { key: 'optimalHumidity', label: 'Umidade Ótima (%)' },
    { key: 'compressionEnergy', label: 'Energia de Compactação' },
  ];

  const resilienceFields = [
    { key: 'k1', label: 'Coeficiente de Regressão (k1)' },
    { key: 'k2', label: 'Coeficiente de Regressão (k2)' },
    { key: 'k3', label: 'Coeficiente de Regressão (k3)' },
    { key: 'k4', label: 'Coeficiente de Regressão (k4)' },
  ];

  const deformationFields = [
    { key: 'k1psi1', label: 'Coeficiente de Regressão (k1 ou psi)' },
    { key: 'k2psi2', label: 'Coeficiente de Regressão (k2 ou psi)' },
    { key: 'k3psi3', label: 'Coeficiente de Regressão (k3 ou psi)' },
    { key: 'k4psi4', label: 'Coeficiente de Regressão (k4 ou psi)' },
  ];

  const sections = [
    'identification',
    'pavement-data',
    'pavement-preparation',
    'characteristics',
    'coordinates',
    'subleito',
    'aterro',
    'subBaseGranular',
    'baseGranular',
    'structural-composition',
  ];

  // Função para salvar com tratamento de duplicata
  const handleSave = async (forceOverwrite = false) => {
    setIsSaving(true);
    try {
      const result = await onSave?.();
      
      if (result?.duplicate && !forceOverwrite) {
        setDuplicateDialogOpen(true);
        setIsSaving(false);
        return;
      }
      
      toast.success('Cadastro salvo com sucesso!');
      resetStore();
      router.push('/promedina/granular-layers');
    } catch (error) {
      toast.error('Erro ao salvar cadastro');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmOverwrite = async () => {
    setDuplicateDialogOpen(false);
    await handleSave(true);
  };

  // FUNÇÃO CORRIGIDA - usando Box com flexbox em vez de Grid
  const renderFieldGroup = (fields: Array<{ label: string; value: any }>, columns = 4) => (
    <Box sx={{ 
      padding: '1rem',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px'
    }}>
      {fields.map((field, idx) => (
        field.value !== undefined && field.value !== null && field.value !== '' && (
          <Box key={idx} sx={{ 
            flex: `0 0 calc(${100/columns}% - 20px)`,
            minWidth: '200px'
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 'normal', fontSize: '12px', color: 'gray' }}>
                {field.label}
              </Typography>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                {field.value === '-' ? '-' : field.value}
              </Typography>
            </Box>
          </Box>
        )
      ))}
    </Box>
  );

  const renderLayerSection = (layerId: string, layerLabel: string, layerData: any) => {
    if (!layerData) return null;

    const mctValues = mctFields.map(field => ({
      label: field.label,
      value: layerData[field.key] || '-'
    }));

    const resilienceValues = resilienceFields.map(field => ({
      label: field.label,
      value: layerData[field.key] || '-'
    }));

    const deformationValues = deformationFields.map(field => ({
      label: field.label,
      value: layerData[field.key] || '-'
    }));

    return (
      <Box id={layerId} sx={{ paddingTop: '1rem', paddingX: '2rem' }} key={layerId}>
        <FlexColumnBorder title={layerLabel} open={true} theme={'#07B811'}>
          <Box sx={{ padding: '0.5rem' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#07B811', marginTop: '1rem' }}>
              Grupo MCT
            </Typography>
            {renderFieldGroup(mctValues, 3)}

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#07B811', marginTop: '1rem' }}>
              Módulo de Resiliência (MPa)
            </Typography>
            {renderFieldGroup(resilienceValues, 4)}

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#07B811', marginTop: '1rem' }}>
              Deformação Permanente
            </Typography>
            {renderFieldGroup(deformationValues, 4)}
          </Box>
        </FlexColumnBorder>
      </Box>
    );
  };

  setNextDisabled(false);

  return (
    <>
      <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            width: { mobile: '90%', notebook: '100%' },
            maxWidth: '2200px',
            padding: '2rem',
            borderRadius: '20px',
            bgcolor: 'primaryTons.white',
            border: '1px solid',
            borderColor: 'primaryTons.border',
            margin: '1rem',
            marginTop: '1rem',
          }}
        >
          <GeneratePDF_ProMedina sample={samples} sections={sections} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
            <Button 
              variant="contained" 
              color="success" 
              onClick={() => handleSave()}
              disabled={isSaving}
            >
              {isSaving ? 'Salvando...' : 'Salvar Cadastro'}
            </Button>
          </Box>

          {/* STEP 1 - IDENTIFICAÇÃO */}
          <Box id="identification" sx={{ paddingTop: '1rem', paddingX: '2rem' }}>
            <FlexColumnBorder title="Identificação" open={true} theme={'#07B811'}>
              {renderFieldGroup(identificationFields, 3)}
            </FlexColumnBorder>
          </Box>

          {/* STEP 2 - DADOS DO PAVIMENTO */}
          <Box id="pavement-data" sx={{ paddingTop: '1rem', paddingX: '2rem' }}>
            <FlexColumnBorder title={t('pm.paviment.data')} open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              {renderFieldGroup(pavementDataFields, 3)}
            </FlexColumnBorder>
          </Box>

          {/* PREPARO DO PAVIMENTO */}
          <Box id="pavement-preparation" sx={{ paddingTop: '1rem', paddingX: '2rem' }}>
            <FlexColumnBorder title={t('pm.paviment.preparation')} open={true} theme={'#07B811'}>
              {renderFieldGroup(preparationFields, 4)}
            </FlexColumnBorder>
          </Box>

          {/* CARACTERÍSTICAS DA VIA */}
          <Box id="characteristics" sx={{ paddingTop: '1rem', paddingX: '2rem' }}>
            <FlexColumnBorder title="Características da Via" open={true} theme={'#07B811'}>
              {renderFieldGroup(characteristicsFields, 3)}
            </FlexColumnBorder>
          </Box>

          {/* COORDENADAS */}
          <Box id="coordinates" sx={{ paddingTop: '1rem', paddingX: '2rem' }}>
            <FlexColumnBorder title="Coordenadas" open={true} theme={'#07B811'}>
              {renderFieldGroup(coordinatesFields, 3)}
            </FlexColumnBorder>
          </Box>

          {/* STEP 3 - CAMADAS */}
          {layers.map(layer => renderLayerSection(layer.id, layer.label, step3Data?.[layer.id]))}

          {/* Observações Gerais do Step 3 */}
          {step3Data?.observations && (
            <Box id="observations" sx={{ paddingTop: '1rem', paddingX: '2rem' }}>
              <FlexColumnBorder title="Observações Gerais" open={true} theme={'#07B811'}>
                <Box sx={{ padding: '1rem', textAlign: 'center' }}>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                    {step3Data.observations}
                  </Typography>
                </Box>
              </FlexColumnBorder>
            </Box>
          )}

          {/* COMPOSIÇÃO ESTRUTURAL */}
          <Box id="structural-composition" sx={{ paddingTop: '1rem', paddingX: '2rem' }}>
            <FlexColumnBorder title={t('pm.structural.composition')} open={true} theme={'#07B811'}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
                {rows.length > 0 && (
                  <DataGrid
                    rows={rows}
                    hideFooter
                    columns={columns.map((column) => ({
                      ...column,
                      disableColumnMenu: true,
                      sortable: false,
                      align: 'center',
                      headerAlign: 'center',
                    }))}
                    sx={{ width: '100%' }}
                  />
                )}
              </Box>
              {samples.step2Data?.images && (
                <Box sx={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 'bold', marginTop: '0.5rem', color: 'black' }}>
                    {t('pm-image-structural-composition')}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: { mobile: 'column', desktop: 'row' }, gap: '1rem', alignItems: 'center', border: '2px solid #07B811', borderRadius: '10px', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', p: 1 }}>
                    <img src={samples?.step2Data.images} alt={t('pm-image-structural-composition')} width={'250px'} height={'250px'} style={{ borderRadius: '8px', objectFit: 'cover' }} />
                  </Box>
                  <Typography sx={{ color: 'gray' }}>{t('pm-estructural-composition-image-date')}</Typography>
                  <Typography sx={{ color: 'black' }}>{samples?.step2Data.imagesDate || '-'}</Typography>
                </Box>
              )}
            </FlexColumnBorder>
          </Box>
        </Box>
      </Box>

      <Dialog open={duplicateDialogOpen} onClose={() => setDuplicateDialogOpen(false)}>
        <DialogTitle>Nome duplicado</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Já existe um cadastro com este nome. Deseja sobrescrever o cadastro existente?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDuplicateDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmOverwrite} color="error" variant="contained">
            Sobrescrever
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GranularLayersResume;