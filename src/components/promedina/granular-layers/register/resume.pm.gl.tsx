import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { Box, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
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
    { label: t('pm.granularLayer.tipoSecao'), key: 'tipoSecao', value: step2Data?.tipoSecao },
    { label: t('pm.granularLayer.estrutura'), key: 'estrutura', value: step2Data?.estrutura },
    { label: t('pm.granularLayer.material'), key: 'material', value: step2Data?.material },
    { label: t('pm.granularLayer.longitude'), key: 'longitude', value: step2Data?.longitude },
    { label: t('pm.granularLayer.latitude'), key: 'latitude', value: step2Data?.latitude },
    { label: t('pm.granularLayer.altitude'), key: 'altitude', value: step2Data?.altitude ? `${step2Data.altitude} m` : '-' },
    { label: t('pm.granularLayer.fonteMonitoramento'), key: 'fonteMonitoramento', value: step2Data?.fonteMonitoramento },
    { label: t('pm.granularLayer.longitudeFora'), key: 'longitudeFora', value: step2Data?.longitudeFora },
    { label: t('pm.granularLayer.latitudeFora'), key: 'latitudeFora', value: step2Data?.latitudeFora },
  ];

  // Preparo do pavimento
  const preparationFields = [
    { label: t('pm.granularLayer.pregoeiro'), key: 'pregoeiro', value: step2Data?.pregoeiro },
    { label: t('pm.granularLayer.informacaoBase'), key: 'informacaoBase', value: step2Data?.informacaoBase },
    { label: t('pm.granularLayer.pontoLigacao'), key: 'pontoLigacao', value: step2Data?.pontoLigacao },
    { label: t('pm.granularLayer.ultimaAtualizacao'), key: 'ultimaAtualizacao', value: step2Data?.ultimaAtualizacao },
  ];

  // Características da via
  const characteristicsFields = [
    { label: t('pm.granularLayer.local'), key: 'local', value: step2Data?.local },
    { label: t('pm.granularLayer.municipioEstado'), key: 'municipioEstado', value: step2Data?.municipioEstado },
    { label: t('pm.granularLayer.extensao'), key: 'extensao', value: step2Data?.extensao ? `${step2Data.extensao} m` : '-' },
    { label: t('pm.granularLayer.velocidadeDiretaVia'), key: 'velocidadeDiretaVia', value: step2Data?.velocidadeDiretaVia ? `${step2Data.velocidadeDiretaVia} km/h` : '-' },
    { label: t('pm.granularLayer.larguraFaixa'), key: 'larguraFaixa', value: step2Data?.larguraFaixa ? `${step2Data.larguraFaixa} m` : '-' },
  ];

  // Coordenadas
  const coordinatesFields = [
    { label: t('pm.granularLayer.inicioEstaca'), key: 'inicioEstaca', value: step2Data?.inicioEstaca },
    { label: t('pm.granularLayer.inicioLatitude'), key: 'inicioLatitude', value: step2Data?.inicioLatitude },
    { label: t('pm.granularLayer.fimMetros'), key: 'fimMetros', value: step2Data?.fimMetros },
    { label: t('pm.granularLayer.fimLongitude'), key: 'fimLongitude', value: step2Data?.fimLongitude },
    { label: t('pm.granularLayer.altitudeMedia'), key: 'altitudeMedia', value: step2Data?.altitudeMedia ? `${step2Data.altitudeMedia} m` : '-' },
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
      // Chama a função de save passando o parâmetro forceOverwrite
      const result = await onSave?.();
      
      if (result?.duplicate && !forceOverwrite) {
        // Se for duplicata e não for força, mostra o diálogo
        setDuplicateDialogOpen(true);
        setIsSaving(false);
        return;
      }
      
      // Sucesso
      toast.success('Cadastro salvo com sucesso!');
      resetStore();
      router.push('/promedina/granular-layers');
    } catch (error) {
      toast.error('Erro ao salvar cadastro');
    } finally {
      setIsSaving(false);
    }
  };

  // Função para confirmar sobrescrita
  const handleConfirmOverwrite = async () => {
    setDuplicateDialogOpen(false);
    await handleSave(true);
  };

  // Função para renderizar um grupo de campos
  const renderFieldGroup = (fields: Array<{ label: string; value: any }>, columns = 4) => (
    <Grid container spacing={2} sx={{ padding: '1rem' }}>
      {fields.map((field, idx) => (
        field.value !== undefined && field.value !== null && field.value !== '' && (
          <Grid item xs={12} sm={6} md={12/columns} key={idx}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 'normal', fontSize: '12px', color: 'gray' }}>
                {field.label}
              </Typography>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                {field.value === '-' ? '-' : field.value}
              </Typography>
            </Box>
          </Grid>
        )
      ))}
    </Grid>
  );

  // Função para renderizar uma camada completa
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

          {/* Botão de Salvar com tratamento de duplicata */}
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

          {/* ==================== STEP 1 - IDENTIFICAÇÃO ==================== */}
          <Box id="identification" sx={{ paddingTop: '1rem', paddingX: '2rem' }}>
            <FlexColumnBorder title="Identificação" open={true} theme={'#07B811'}>
              {renderFieldGroup(identificationFields, 3)}
            </FlexColumnBorder>
          </Box>

          {/* ==================== STEP 2 - DADOS DO PAVIMENTO ==================== */}
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

          {/* ==================== STEP 3 - CAMADAS ==================== */}
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

          {/* ==================== COMPOSIÇÃO ESTRUTURAL ==================== */}
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

      {/* Dialog de confirmação de sobrescrita */}
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