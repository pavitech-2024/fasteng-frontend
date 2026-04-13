import { EssayPageProps } from '../../../templates/essay';
import { Box, TextField, MenuItem, Select, FormControl, InputLabel, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import useGranularLayersStore from '@/stores/promedina/granular-layers/granular-layers.store';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { useEffect } from 'react';

// Interface para a camada estrutural
interface CamadaEstrutural {
  id: number;
  layer: string;
  material: string;
  thickness: string;
}

const GranularLayers_step1 = ({ setNextDisabled }: EssayPageProps) => {
  const { step2Data, setData } = useGranularLayersStore();
  
  // O store tem step2Data.structuralComposition
  const structuralComposition = step2Data?.structuralComposition || [];

  // Type assertion para acessar propriedades estendidas
  const extendedStep2Data = step2Data as any;

  // Opções fixas
  const simNaoOptions = [
    { value: 'Sim', label: 'SIM' },
    { value: 'Não', label: 'NÃO' },
  ];

  const tipoSecaoOptions = [
    { value: 'Experimental', label: 'EXPERIMENTAL' },
    { value: 'Controle', label: 'CONTROLE' },
    { value: 'Referência', label: 'REFERÊNCIA' },
  ];

  const faseMonitoramentoOptions = [
    { value: 'Pré-Execução', label: 'PRÉ-EXECUÇÃO' },
    { value: 'Execução', label: 'EXECUÇÃO' },
    { value: 'Pós-Execução', label: 'PÓS-EXECUÇÃO' },
  ];

  const tipoCamadaOptions = [
    { value: 'Capa Asfáltica', label: 'CAPA ASFÁLTICA' },
    { value: 'Binder', label: 'BINDER' },
    { value: 'TSD', label: 'TSD' },
    { value: 'Base', label: 'BASE' },
    { value: 'Sub-base', label: 'SUB-BASE' },
    { value: 'Reforço do Subleito', label: 'REFORÇO DO SUBLEITO' },
    { value: 'Camada de Binder', label: 'CAMADA DE BINDER' },
    { value: 'Concreto Asfáltico', label: 'CONCRETO ASFÁLTICO' },
    { value: 'Outros', label: 'OUTROS' },
  ];

  // Habilita o botão "Avançar" sempre (todos os campos são opcionais)
  useEffect(() => {
    setNextDisabled(false);
  }, [setNextDisabled]);

  // Helper para renderizar campos comuns
  const renderTextField = (
    key: string,
    label: string,
    value: any,
    type = 'text',
    required = false,
    multiline = false
  ) => (
    <TextField
      key={key}
      variant="standard"
      type={type}
      label={label}
      value={value || ''}
      required={required}
      multiline={multiline}
      InputLabelProps={type === 'date' ? { shrink: true } : undefined}
      onChange={(e) => setData({ step: 1, key, value: e.target.value })}
      InputProps={{
        inputProps: { style: { textTransform: 'uppercase' } }
      }}
    />
  );

  const renderSelect = (
    key: string,
    label: string,
    value: any,
    options: { value: string; label: string }[],
    required = false
  ) => (
    <FormControl variant="standard" fullWidth required={required}>
      <InputLabel sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{label}</InputLabel>
      <Select
        value={value || ''}
        label={label}
        onChange={(e) => setData({ step: 1, key, value: e.target.value })}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  // Funções para gerenciar camadas dinâmicas
  const adicionarCamada = () => {
    const camadasAtuais = [...structuralComposition];
    const novaCamada: CamadaEstrutural = {
      id: Date.now(),
      layer: '',
      material: '',
      thickness: '',
    };
    setData({
      step: 1,
      key: 'structuralComposition',
      value: [...camadasAtuais, novaCamada]
    });
  };

  const removerCamada = (index: number) => {
    const camadasAtuais = [...structuralComposition];
    camadasAtuais.splice(index, 1);
    setData({
      step: 1,
      key: 'structuralComposition',
      value: camadasAtuais
    });
  };

  const atualizarCamada = (index: number, campo: string, valor: string) => {
    const camadasAtuais = [...structuralComposition];
    camadasAtuais[index] = { ...camadasAtuais[index], [campo]: valor };
    setData({
      step: 1,
      key: 'structuralComposition',
      value: camadasAtuais
    });
  };

  // Função para upload de imagem
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setData({
        step: 1,
        key: 'images',
        value: imageUrl
      });
    }
  };

  return (
    <>
      {/* CARD 1: IDENTIFICAÇÃO */}
      <FlexColumnBorder title="IDENTIFICAÇÃO" open={true} theme={'#07B811'}>
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
              display: 'flex',
              width: '100%',
              flexWrap: 'wrap',
              '& > *': {
                width: 'calc(50% - 10px)',
              },
              gap: '5px 20px',
              marginBottom: '10px',
              marginTop: '-20px',
            }}
          >
            {renderTextField('identification', 'INSTITUIÇÃO + NÚMERO DO TRECHO + TIPO DE EXECUÇÃO + ANO DE IMPLANTAÇÃO', extendedStep2Data?.identification)}
            {renderSelect('sectionType', 'TIPO DE SEÇÃO', extendedStep2Data?.sectionType, tipoSecaoOptions)}
            {renderSelect('monitoringPhase', 'FASE DE MONITORAMENTO', extendedStep2Data?.monitoringPhase, faseMonitoramentoOptions)}
            {renderTextField('trafficLiberation', 'LIBERAÇÃO AO TRÁFEGO', extendedStep2Data?.trafficLiberation, 'date')}
            {renderSelect('utilizadaMedina', 'UTILIZADA NA CALIBRAÇÃO DO MEDINA', extendedStep2Data?.utilizadaMedina, simNaoOptions)}
            {renderSelect('utilizadaLvec', 'UTILIZADA NA CALIBRAÇÃO DO LVECD', extendedStep2Data?.utilizadaLvec, simNaoOptions)}
            {renderSelect('dadosConfirmadosICT', 'DADOS CONFIRMADOS PELA ICT', extendedStep2Data?.dadosConfirmadosICT, simNaoOptions)}
            {renderTextField('observation', 'OBSERVAÇÕES', extendedStep2Data?.observation, 'text', false, true)}
          </Box>
        </Box>
      </FlexColumnBorder>

      {/* CARD 2: PREPARO DO PAVIMENTO */}
      <FlexColumnBorder title="PREPARO DO PAVIMENTO" open={true} theme={'#07B811'}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px', '& > *': { width: 'calc(50% - 10px)' } }}>
          {renderTextField('iriPrerehabilitation', 'IRI (m/km) Pré-Reabilitação', extendedStep2Data?.iriPrerehabilitation, 'number')}
          {renderTextField('atPrerehabilitation', 'AT (%) Pré-Reabilitação', extendedStep2Data?.atPrerehabilitation, 'number')}
          {renderSelect('fresagem', 'Fresagem', extendedStep2Data?.fresagem, simNaoOptions)}
          {extendedStep2Data?.fresagem === 'Sim' &&
            renderTextField('millingThickness', 'Espessura Fresada (mm)', extendedStep2Data?.millingThickness, 'number')}
          {renderSelect('interventionAtTheBase', 'Intervenção na base', extendedStep2Data?.interventionAtTheBase, simNaoOptions)}
          {renderSelect('sami', 'SAMI', extendedStep2Data?.sami, simNaoOptions)}
          {renderSelect('bondingPaint', 'Pintura de ligação', extendedStep2Data?.bondingPaint, simNaoOptions)}
          {renderSelect('priming', 'Imprimação', extendedStep2Data?.priming, simNaoOptions)}
        </Box>
      </FlexColumnBorder>

      {/* CARD 3: DATA DA ÚLTIMA ATUALIZAÇÃO */}
      <FlexColumnBorder title="DATA DA ÚLTIMA ATUALIZAÇÃO" open={true} theme={'#07B811'}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px', '& > *': { width: 'calc(50% - 10px)' } }}>
          {renderTextField('lastUpdate', 'Data da última atualização', extendedStep2Data?.lastUpdate, 'date')}
          {renderTextField('serviceTimeYears', 'Tempo em Serviço (anos)', extendedStep2Data?.serviceTimeYears, 'number')}
          {renderTextField('serviceTimeMonths', 'Tempo em Serviço (meses)', extendedStep2Data?.serviceTimeMonths, 'number')}
        </Box>
      </FlexColumnBorder>

      {/* CARD 4: CARACTERÍSTICAS */}
      <FlexColumnBorder title="CARACTERÍSTICAS" open={true} theme={'#07B811'}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px', '& > *': { width: 'calc(50% - 10px)' } }}>
          {renderTextField('roadName', 'Local (rodovia/avenida)', extendedStep2Data?.roadName)}
          {renderTextField('cityState', 'Município/Estado', extendedStep2Data?.cityState)}
          {renderTextField('experimentalLength', 'Extensão (m)', extendedStep2Data?.experimentalLength, 'number')}
          {renderTextField('guideSpeed', 'Velocidade Diretriz da Via (km/h)', extendedStep2Data?.guideSpeed, 'number')}
          {renderTextField('kmInicial', 'km Inicial', extendedStep2Data?.kmInicial)}
          {renderTextField('kmFinal', 'km Final', extendedStep2Data?.kmFinal)}
          {renderTextField('inicioEstaca', 'Início - Estaca', extendedStep2Data?.inicioEstaca)}
          {renderTextField('inicioMetros', 'Início - Metros', extendedStep2Data?.inicioMetros, 'number')}
          {renderTextField('fimEstaca', 'Fim - Estaca', extendedStep2Data?.fimEstaca)}
          {renderTextField('fimMetros', 'Fim - Metros', extendedStep2Data?.fimMetros, 'number')}
          {renderTextField('averageAltitude', 'Altitude Média (m)', extendedStep2Data?.averageAltitude)}
          {renderTextField('numberOfTracks', 'Número de Faixas', extendedStep2Data?.numberOfTracks, 'number')}
          {renderTextField('monitoredTrack', 'Faixa Monitorada', extendedStep2Data?.monitoredTrack)}
          {renderTextField('trackWidth', 'Largura da Faixa (m)', extendedStep2Data?.trackWidth, 'number')}
        </Box>
      </FlexColumnBorder>

      {/* CARD 5: COMPOSIÇÃO ESTRUTURAL */}
      <FlexColumnBorder title="COMPOSIÇÃO ESTRUTURAL" open={true} theme={'#07B811'}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Tabela de Camadas */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Cabeçalho */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: '2fr 2fr 1fr 50px',
              gap: '10px',
              fontWeight: 'bold',
              borderBottom: '2px solid #07B811',
              paddingBottom: '10px',
              marginBottom: '10px'
            }}>
              <Box sx={{ textTransform: 'uppercase' }}>CAMADA</Box>
              <Box sx={{ textTransform: 'uppercase' }}>MATERIAL</Box>
              <Box sx={{ textTransform: 'uppercase' }}>ESPESSURA (mm)</Box>
              <Box sx={{ textTransform: 'uppercase' }}>AÇÕES</Box>
            </Box>

            {/* Linhas de Camadas */}
            {structuralComposition.map((camada: any, index: number) => (
              <Box key={camada.id || index} sx={{ 
                display: 'grid', 
                gridTemplateColumns: '2fr 2fr 1fr 50px',
                gap: '10px',
                alignItems: 'center'
              }}>
                <Select
                  variant="standard"
                  value={camada.layer || ''}
                  onChange={(e) => atualizarCamada(index, 'layer', e.target.value)}
                  displayEmpty
                  sx={{ textTransform: 'uppercase' }}
                >
                  <MenuItem value="" disabled>SELECIONE A CAMADA</MenuItem>
                  {tipoCamadaOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                
                <TextField
                  variant="standard"
                  placeholder="MATERIAL"
                  value={camada.material || ''}
                  onChange={(e) => atualizarCamada(index, 'material', e.target.value)}
                  InputProps={{
                    inputProps: { style: { textTransform: 'uppercase' } }
                  }}
                />
                
                <TextField
                  variant="standard"
                  type="number"
                  placeholder="ESPESSURA"
                  value={camada.thickness || ''}
                  onChange={(e) => atualizarCamada(index, 'thickness', e.target.value)}
                />
                
                <IconButton 
                  onClick={() => removerCamada(index)}
                  color="error"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Box>

          {/* Botão Adicionar Camada */}
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={adicionarCamada}
            sx={{
              borderColor: '#07B811',
              color: '#07B811',
              textTransform: 'uppercase',
              '&:hover': {
                borderColor: '#05990e',
                backgroundColor: 'rgba(7, 184, 17, 0.04)'
              }
            }}
          >
            ADICIONAR CAMADA
          </Button>

          {/* Seção de Imagem */}
          <Box sx={{ 
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px dashed #ccc',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            <Box sx={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                component="label"
                sx={{
                  backgroundColor: '#07B811',
                  textTransform: 'uppercase',
                  '&:hover': { backgroundColor: '#05990e' }
                }}
              >
                ADICIONAR IMAGEM
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
              
              {extendedStep2Data?.images && (
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <img 
                    src={extendedStep2Data.images} 
                    alt="Estrutura do pavimento"
                    style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '4px' }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => setData({ step: 1, key: 'images', value: null })}
                    sx={{
                      position: 'absolute',
                      top: -10,
                      right: -10,
                      backgroundColor: 'red',
                      color: 'white',
                      '&:hover': { backgroundColor: 'darkred' }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>

            {renderTextField('imagesDate', 'DATA DAS IMAGENS', extendedStep2Data?.imagesDate, 'date')}
          </Box>
          
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default GranularLayers_step1;