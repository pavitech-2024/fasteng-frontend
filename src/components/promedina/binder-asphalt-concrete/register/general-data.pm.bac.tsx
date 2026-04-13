import { EssayPageProps } from '../../../templates/essay';
import { Box, TextField, MenuItem, Select, FormControl, InputLabel, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import useBinderAsphaltConcreteStore from '@/stores/promedina/binder-asphalt-concrete/binder-asphalt-concrete.store';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { useEffect } from 'react';

// Interface para a camada estrutural
interface CamadaEstrutural {
  id: number;
  tipo: string;
  material: string;
  espessura: string;
}

// Interface estendida para o GeneralData com todos os campos necessários
interface ExtendedGeneralData {
  identification?: string;
  tipoSecao?: string;
  faseMonitoramento?: string;
  liberacaoTrafico?: string;
  utilizadaMedina?: string;
  utilizadaLvec?: string;
  dadosConfirmadosICT?: string;
  observations?: string;
  iriPreReabilitacao?: string;
  atPreReabilitacao?: string;
  fresagem?: string;
  espessuraFresagem?: string;
  intervencaoBase?: string;
  sami?: string;
  pinturaLigacao?: string;
  imprimacao?: string;
  dataUltimaAtualizacao?: string;
  tempoServicoAnos?: string;
  tempoServicoMeses?: string;
  local?: string;
  municipioEstado?: string;
  extensao?: string;
  velocidadeDiretriz?: string;
  kmInicial?: string;
  kmFinal?: string;
  inicioEstaca?: string;
  inicioMetros?: string;
  fimEstaca?: string;
  fimMetros?: string;
  altitudeMedia?: string;
  numeroFaixas?: string;
  faixaMonitorada?: string;
  larguraFaixa?: string;
  camadasEstruturais?: CamadaEstrutural[];
  imagemEstrutural?: string | null;
  dataImagens?: string;
}

const BinderAsphaltConcrete_step1 = ({ setNextDisabled }: EssayPageProps) => {
  const { generalData, setData } = useBinderAsphaltConcreteStore();
  
  // Type assertion para estender o tipo generalData
  const extendedGeneralData = generalData as ExtendedGeneralData;

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
      onChange={(e) => setData({ step: 0, key, value: e.target.value })}
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
        onChange={(e) => setData({ step: 0, key, value: e.target.value })}
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
    const camadasAtuais = extendedGeneralData.camadasEstruturais || [];
    const novaCamada: CamadaEstrutural = {
      id: Date.now(),
      tipo: '',
      material: '',
      espessura: '',
    };
    setData({
      step: 0,
      key: 'camadasEstruturais',
      value: [...camadasAtuais, novaCamada]
    });
  };

  const removerCamada = (index: number) => {
    const camadasAtuais = [...(extendedGeneralData.camadasEstruturais || [])];
    camadasAtuais.splice(index, 1);
    setData({
      step: 0,
      key: 'camadasEstruturais',
      value: camadasAtuais
    });
  };

  const atualizarCamada = (index: number, campo: string, valor: string) => {
    const camadasAtuais = [...(extendedGeneralData.camadasEstruturais || [])];
    camadasAtuais[index] = { ...camadasAtuais[index], [campo]: valor };
    setData({
      step: 0,
      key: 'camadasEstruturais',
      value: camadasAtuais
    });
  };

  // Função para upload de imagem
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setData({
        step: 0,
        key: 'imagemEstrutural',
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
            {renderTextField('identification', 'INSTITUIÇÃO + NÚMERO DO TRECHO + TIPO DE EXECUÇÃO + ANO DE IMPLANTAÇÃO', extendedGeneralData.identification)}
            {renderSelect('tipoSecao', 'TIPO DE SEÇÃO', extendedGeneralData.tipoSecao, tipoSecaoOptions)}
            {renderSelect('faseMonitoramento', 'FASE DE MONITORAMENTO', extendedGeneralData.faseMonitoramento, faseMonitoramentoOptions)}
            {renderTextField('liberacaoTrafico', 'LIBERAÇÃO AO TRÁFEGO', extendedGeneralData.liberacaoTrafico, 'date')}
            {renderSelect('utilizadaMedina', 'UTILIZADA NA CALIBRAÇÃO DO MEDINA', extendedGeneralData.utilizadaMedina, simNaoOptions)}
            {renderSelect('utilizadaLvec', 'UTILIZADA NA CALIBRAÇÃO DO LVECD', extendedGeneralData.utilizadaLvec, simNaoOptions)}
            {renderSelect('dadosConfirmadosICT', 'DADOS CONFIRMADOS PELA ICT', extendedGeneralData.dadosConfirmadosICT, simNaoOptions)}
            {renderTextField('observations', 'OBSERVAÇÕES', extendedGeneralData.observations, 'text', false, true)}
          </Box>
        </Box>
      </FlexColumnBorder>

      {/* CARD 2: PREPARO DO PAVIMENTO */}
      <FlexColumnBorder title="PREPARO DO PAVIMENTO" open={true} theme={'#07B811'}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px', '& > *': { width: 'calc(50% - 10px)' } }}>
          {renderTextField('iriPreReabilitacao', 'IRI (m/km) Pré-Reabilitação', extendedGeneralData.iriPreReabilitacao, 'number')}
          {renderTextField('atPreReabilitacao', 'AT (%) Pré-Reabilitação', extendedGeneralData.atPreReabilitacao, 'number')}
          {renderSelect('fresagem', 'Fresagem', extendedGeneralData.fresagem, simNaoOptions)}
          {extendedGeneralData.fresagem === 'Sim' &&
            renderTextField('espessuraFresagem', 'Espessura Fresada (mm)', extendedGeneralData.espessuraFresagem, 'number')}
          {renderSelect('intervencaoBase', 'Intervenção na base', extendedGeneralData.intervencaoBase, simNaoOptions)}
          {renderSelect('sami', 'SAMI', extendedGeneralData.sami, simNaoOptions)}
          {renderSelect('pinturaLigacao', 'Pintura de ligação', extendedGeneralData.pinturaLigacao, simNaoOptions)}
          {renderSelect('imprimacao', 'Imprimação', extendedGeneralData.imprimacao, simNaoOptions)}
        </Box>
      </FlexColumnBorder>

      {/* CARD 3: DATA DA ÚLTIMA ATUALIZAÇÃO */}
      <FlexColumnBorder title="DATA DA ÚLTIMA ATUALIZAÇÃO" open={true} theme={'#07B811'}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px', '& > *': { width: 'calc(50% - 10px)' } }}>
          {renderTextField('dataUltimaAtualizacao', 'Data da última atualização', extendedGeneralData.dataUltimaAtualizacao, 'date')}
          {renderTextField('tempoServicoAnos', 'Tempo em Serviço (anos)', extendedGeneralData.tempoServicoAnos, 'number')}
          {renderTextField('tempoServicoMeses', 'Tempo em Serviço (meses)', extendedGeneralData.tempoServicoMeses, 'number')}
        </Box>
      </FlexColumnBorder>

      {/* CARD 4: CARACTERÍSTICAS */}
      <FlexColumnBorder title="CARACTERÍSTICAS" open={true} theme={'#07B811'}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px', '& > *': { width: 'calc(50% - 10px)' } }}>
          {renderTextField('local', 'Local (rodovia/avenida)', extendedGeneralData.local)}
          {renderTextField('municipioEstado', 'Município/Estado', extendedGeneralData.municipioEstado)}
          {renderTextField('extensao', 'Extensão (m)', extendedGeneralData.extensao, 'number')}
          {renderTextField('velocidadeDiretriz', 'Velocidade Diretriz da Via (km/h)', extendedGeneralData.velocidadeDiretriz, 'number')}
          {renderTextField('kmInicial', 'km Inicial', extendedGeneralData.kmInicial)}
          {renderTextField('kmFinal', 'km Final', extendedGeneralData.kmFinal)}
          {renderTextField('inicioEstaca', 'Início - Estaca', extendedGeneralData.inicioEstaca)}
          {renderTextField('inicioMetros', 'Início - Metros', extendedGeneralData.inicioMetros, 'number')}
          {renderTextField('fimEstaca', 'Fim - Estaca', extendedGeneralData.fimEstaca)}
          {renderTextField('fimMetros', 'Fim - Metros', extendedGeneralData.fimMetros, 'number')}
          {renderTextField('altitudeMedia', 'Altitude Média (m) (NORTE/SUL / LESTE/OESTE)', extendedGeneralData.altitudeMedia)}
          {renderTextField('numeroFaixas', 'Número de Faixas', extendedGeneralData.numeroFaixas, 'number')}
          {renderTextField('faixaMonitorada', 'Faixa Monitorada', extendedGeneralData.faixaMonitorada)}
          {renderTextField('larguraFaixa', 'Largura da Faixa (m)', extendedGeneralData.larguraFaixa, 'number')}
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
            {(extendedGeneralData.camadasEstruturais || []).map((camada: CamadaEstrutural, index: number) => (
              <Box key={camada.id || index} sx={{ 
                display: 'grid', 
                gridTemplateColumns: '2fr 2fr 1fr 50px',
                gap: '10px',
                alignItems: 'center'
              }}>
                <Select
                  variant="standard"
                  value={camada.tipo || ''}
                  onChange={(e) => atualizarCamada(index, 'tipo', e.target.value)}
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
                  value={camada.espessura || ''}
                  onChange={(e) => atualizarCamada(index, 'espessura', e.target.value)}
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
              
              {extendedGeneralData.imagemEstrutural && (
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <img 
                    src={extendedGeneralData.imagemEstrutural} 
                    alt="Estrutura do pavimento"
                    style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '4px' }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => setData({ step: 0, key: 'imagemEstrutural', value: null })}
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

            {renderTextField('dataImagens', 'DATA DAS IMAGENS', extendedGeneralData.dataImagens, 'date')}
          </Box>
          
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default BinderAsphaltConcrete_step1;