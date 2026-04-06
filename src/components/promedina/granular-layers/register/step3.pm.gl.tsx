import { EssayPageProps } from '../../../templates/essay';
import { t } from 'i18next';
import { Box, TextField, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useGranularLayersStore from '@/stores/promedina/granular-layers/granular-layers.store';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { useCallback, useEffect, useState } from 'react';

const GranularLayers_step3 = ({ setNextDisabled }: EssayPageProps) => {
  const { step3Data, setData } = useGranularLayersStore();
  const [isValid, setIsValid] = useState(false);

  // Configuração das camadas
  const layers = [
    { id: 'subleito', label: 'Subleito' },
    { id: 'aterro', label: 'Aterro' },
    { id: 'subBaseGranular', label: 'Sub-base Granular' },
    { id: 'baseGranular', label: 'Base Granular' }
  ];

  // Todos os campos obrigatórios
  const allRequiredFields = [
    'mctCoefficientC', 'mctIndexE', 'especificMass', 'optimalHumidity', 'compressionEnergy',
    'k1', 'k2', 'k3', 'k4',
    'k1psi1', 'k2psi2', 'k3psi3', 'k4psi4'
  ];

  // Inicializar dados da camada se não existirem
  const initializeLayerIfNeeded = useCallback((layerId: string) => {
    const layerData = step3Data?.[layerId];
    
    if (!layerData) {
      // Criar objeto vazio para a camada
      setData({
        step: 2,
        key: layerId,
        value: {}
      });
      return false;
    }
    
    // Verificar se algum campo obrigatório está faltando e inicializar com string vazia
    let needsUpdate = false;
    const updatedData = { ...layerData };
    
    for (const field of allRequiredFields) {
      if (updatedData[field] === undefined || updatedData[field] === null) {
        updatedData[field] = '';
        needsUpdate = true;
      }
    }
    
    if (needsUpdate) {
      setData({
        step: 2,
        key: layerId,
        value: updatedData
      });
    }
    
    return true;
  }, [step3Data, setData]);

  // Inicializar todas as camadas na primeira renderização
  useEffect(() => {
    for (const layer of layers) {
      initializeLayerIfNeeded(layer.id);
    }
  }, [initializeLayerIfNeeded]);

  // Função para verificar se uma camada está completa
  const isLayerComplete = useCallback((layerId: string) => {
    const layerData = step3Data?.[layerId];
    
    if (!layerData) {
      console.log(`Camada ${layerId} não existe`);
      return false;
    }
    
    // Verifica cada campo obrigatório
    for (const field of allRequiredFields) {
      const value = layerData[field];
      // Verifica se é null, undefined, string vazia ou apenas espaços
      if (value === undefined || value === null || value === '' || (typeof value === 'string' && value.trim() === '')) {
        console.log(`❌ Campo faltando em ${layerId}: ${field} (valor: ${value})`);
        return false;
      }
    }
    
    console.log(`✅ Camada ${layerId} completa`);
    return true;
  }, [step3Data]);

  // Verificar se todas as camadas estão preenchidas
  useEffect(() => {
    let allComplete = true;
    
    for (const layer of layers) {
      if (!isLayerComplete(layer.id)) {
        allComplete = false;
        break;
      }
    }
    
    console.log('📊 Validação step3 - Todas camadas completas:', allComplete);
    setIsValid(allComplete);
    setNextDisabled(!allComplete);
  }, [step3Data, setNextDisabled, isLayerComplete]);

  // Função para atualizar dados aninhados
  const setNestedData = (layerId: string, fieldKey: string, value: string) => {
    const currentLayerData = step3Data?.[layerId] || {};
    
    setData({
      step: 2,
      key: layerId,
      value: {
        ...currentLayerData,
        [fieldKey]: value
      }
    });
  };

  // Renderizar campo
  const renderField = (fieldKey: string, label: string, layerId: string, value: any, type: string = 'text') => {
    // Garante que value nunca seja null (sempre string vazia)
    const safeValue = value === undefined || value === null ? '' : value;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setNestedData(layerId, fieldKey, e.target.value);
    };

    // Para campos com unidade, mostrar no label
    let labelWithUnit = label;
    if (fieldKey === 'especificMass') labelWithUnit = `${label} (g/cm³)`;
    if (fieldKey === 'optimalHumidity') labelWithUnit = `${label} (%)`;

    return (
      <TextField
        key={`${layerId}-${fieldKey}`}
        variant="standard"
        type={type}
        label={labelWithUnit}
        value={safeValue}
        required={true}
        onChange={handleChange}
        fullWidth
      />
    );
  };

  return (
    <>
      <FlexColumnBorder title="Parâmetros e dados do material" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap', fontWeight: 'bold' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          {layers.map((layer) => {
            const layerData = step3Data?.[layer.id] || {};
            
            return (
              <Accordion key={layer.id} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#07B811' }}>
                    {layer.label}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {/* Grupo MCT */}
                  <FlexColumnBorder title="Grupo MCT" open={true} theme={'#07B811'}>
                    <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
                      {renderField('mctCoefficientC', 'MCT - Coeficiente c\'', layer.id, layerData.mctCoefficientC, 'text')}
                      {renderField('mctIndexE', 'MCT - Índice e\'', layer.id, layerData.mctIndexE, 'text')}
                      {renderField('especificMass', 'Massa Específica', layer.id, layerData.especificMass, 'number')}
                      {renderField('optimalHumidity', 'Umidade Ótima', layer.id, layerData.optimalHumidity, 'number')}
                      {renderField('compressionEnergy', 'Energia de Compactação', layer.id, layerData.compressionEnergy, 'text')}
                    </Box>
                  </FlexColumnBorder>

                  {/* Módulo de Resiliência */}
                  <FlexColumnBorder title="Módulo de Resiliência (MPa)" open={true} theme={'#07B811'}>
                    <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
                      {renderField('k1', 'Coeficiente de Regressão (k1)', layer.id, layerData.k1, 'number')}
                      {renderField('k2', 'Coeficiente de Regressão (k2)', layer.id, layerData.k2, 'number')}
                      {renderField('k3', 'Coeficiente de Regressão (k3)', layer.id, layerData.k3, 'number')}
                      {renderField('k4', 'Coeficiente de Regressão (k4)', layer.id, layerData.k4, 'number')}
                    </Box>
                  </FlexColumnBorder>

                  {/* Deformação Permanente */}
                  <FlexColumnBorder title="Deformação Permanente" open={true} theme={'#07B811'}>
                    <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
                      {renderField('k1psi1', 'Coeficiente de Regressão (k1 ou psi)', layer.id, layerData.k1psi1, 'number')}
                      {renderField('k2psi2', 'Coeficiente de Regressão (k2 ou psi)', layer.id, layerData.k2psi2, 'number')}
                      {renderField('k3psi3', 'Coeficiente de Regressão (k3 ou psi)', layer.id, layerData.k3psi3, 'number')}
                      {renderField('k4psi4', 'Coeficiente de Regressão (k4 ou psi)', layer.id, layerData.k4psi4, 'number')}
                    </Box>
                  </FlexColumnBorder>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      </FlexColumnBorder>

      {/* Observações */}
      <FlexColumnBorder title="Observações" open={true} theme={'#07B811'}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <TextField
            variant="standard"
            multiline
            rows={4}
            fullWidth
            label="Observações"
            value={step3Data?.observations || ''}
            onChange={(e) => setData({ step: 2, key: 'observations', value: e.target.value })}
          />
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default GranularLayers_step3;