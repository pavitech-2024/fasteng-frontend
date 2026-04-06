import { EssayPageProps } from '../../../templates/essay';
import { Box, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import useStabilizedLayersStore from '@/stores/promedina/stabilized-layers/stabilized-layers.store';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { useEffect } from 'react';

const StabilizedLayers_step1 = ({ setNextDisabled }: EssayPageProps) => {
  const { generalData, setData } = useStabilizedLayersStore();

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

  // Habilita o botão "Avançar" sempre (todos os campos são opcionais)
  useEffect(() => {
    setNextDisabled(false);
  }, [setNextDisabled]);

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

  return (
    <>
      {/* CARD 1: IDENTIFICAÇÃO */}
      <FlexColumnBorder title="IDENTIFICAÇÃO" open={true} theme={'#07B811'}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', width: '100%', flexWrap: 'wrap', '& > *': { width: 'calc(50% - 10px)' }, gap: '5px 20px', marginBottom: '10px', marginTop: '-20px' }}>
            {renderTextField('identification', 'INSTITUIÇÃO + NÚMERO DO TRECHO + TIPO DE EXECUÇÃO + ANO DE IMPLANTAÇÃO', generalData.identification)}
            {renderSelect('tipoSecao', 'TIPO DE SEÇÃO', generalData.tipoSecao, tipoSecaoOptions)}
            {renderSelect('faseMonitoramento', 'FASE DE MONITORAMENTO', generalData.faseMonitoramento, faseMonitoramentoOptions)}
            {renderTextField('liberacaoTrafico', 'LIBERAÇÃO AO TRÁFEGO', generalData.liberacaoTrafico, 'date')}
            {renderSelect('utilizadaMedina', 'UTILIZADA NA CALIBRAÇÃO DO MEDINA', generalData.utilizadaMedina, simNaoOptions)}
            {renderSelect('utilizadaLvec', 'UTILIZADA NA CALIBRAÇÃO DO LVECD', generalData.utilizadaLvec, simNaoOptions)}
            {renderSelect('dadosConfirmadosICT', 'DADOS CONFIRMADOS PELA ICT', generalData.dadosConfirmadosICT, simNaoOptions)}
            {renderTextField('observations', 'OBSERVAÇÕES GERAIS', generalData.observations, 'text', false, true)}
          </Box>
        </Box>
      </FlexColumnBorder>

      {/* CARD 2: PREPARO DO PAVIMENTO */}
      <FlexColumnBorder title="PREPARO DO PAVIMENTO" open={true} theme={'#07B811'}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px', '& > *': { width: 'calc(50% - 10px)' } }}>
          {renderTextField('iriPreReabilitacao', 'IRI (m/km) Pré-Reabilitação', generalData.iriPreReabilitacao, 'number')}
          {renderTextField('atPreReabilitacao', 'AT (%) Pré-Reabilitação', generalData.atPreReabilitacao, 'number')}
          {renderSelect('fresagem', 'Fresagem', generalData.fresagem, simNaoOptions)}
          {generalData.fresagem === 'Sim' && renderTextField('espessuraFresagem', 'Espessura Fresada (mm)', generalData.espessuraFresagem, 'number')}
          {renderSelect('intervencaoBase', 'Intervenção na base', generalData.intervencaoBase, simNaoOptions)}
          {renderSelect('sami', 'SAMI', generalData.sami, simNaoOptions)}
          {renderSelect('pinturaLigacao', 'Pintura de ligação', generalData.pinturaLigacao, simNaoOptions)}
          {renderSelect('imprimacao', 'Imprimação', generalData.imprimacao, simNaoOptions)}
        </Box>
      </FlexColumnBorder>

      {/* CARD 3: DATA DA ÚLTIMA ATUALIZAÇÃO */}
      <FlexColumnBorder title="DATA DA ÚLTIMA ATUALIZAÇÃO" open={true} theme={'#07B811'}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px', '& > *': { width: 'calc(50% - 10px)' } }}>
          {renderTextField('dataUltimaAtualizacao', 'Data da última atualização', generalData.dataUltimaAtualizacao, 'date')}
          {renderTextField('tempoServicoAnos', 'Tempo em Serviço (anos)', generalData.tempoServicoAnos, 'number')}
          {renderTextField('tempoServicoMeses', 'Tempo em Serviço (meses)', generalData.tempoServicoMeses, 'number')}
        </Box>
      </FlexColumnBorder>

      {/* CARD 4: CARACTERÍSTICAS */}
      <FlexColumnBorder title="CARACTERÍSTICAS" open={true} theme={'#07B811'}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px', '& > *': { width: 'calc(50% - 10px)' } }}>
          {renderTextField('local', 'Local (rodovia/avenida)', generalData.local)}
          {renderTextField('municipioEstado', 'Município/Estado', generalData.municipioEstado)}
          {renderTextField('extensao', 'Extensão (m)', generalData.extensao, 'number')}
          {renderTextField('velocidadeDiretriz', 'Velocidade Diretriz da Via (km/h)', generalData.velocidadeDiretriz, 'number')}
          {renderTextField('kmInicial', 'km Inicial', generalData.kmInicial)}
          {renderTextField('kmFinal', 'km Final', generalData.kmFinal)}
          {renderTextField('inicioEstaca', 'Início - Estaca', generalData.inicioEstaca)}
          {renderTextField('inicioMetros', 'Início - Metros', generalData.inicioMetros, 'number')}
          {renderTextField('fimEstaca', 'Fim - Estaca', generalData.fimEstaca)}
          {renderTextField('fimMetros', 'Fim - Metros', generalData.fimMetros, 'number')}
          {renderTextField('altitudeMedia', 'Altitude Média (m) (NORTE/SUL / LESTE/OESTE)', generalData.altitudeMedia)}
          {renderTextField('numeroFaixas', 'Número de Faixas', generalData.numeroFaixas, 'number')}
          {renderTextField('faixaMonitorada', 'Faixa Monitorada', generalData.faixaMonitorada)}
          {renderTextField('larguraFaixa', 'Largura da Faixa (m)', generalData.larguraFaixa, 'number')}
        </Box>
      </FlexColumnBorder>

      {/* CARD 5: COMPOSIÇÃO ESTRUTURAL */}
      <FlexColumnBorder title="COMPOSIÇÃO ESTRUTURAL" open={true} theme={'#07B811'}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px', '& > *': { width: 'calc(50% - 10px)' } }}>
          {renderTextField('capaMaterial', 'Capa - Material', generalData.capaMaterial)}
          {renderTextField('capaEspessura', 'Capa - Espessura (mm)', generalData.capaEspessura, 'number')}
          {renderTextField('binderMaterial', 'Binder - Material', generalData.binderMaterial)}
          {renderTextField('binderEspessura', 'Binder - Espessura (mm)', generalData.binderEspessura, 'number')}
          {renderTextField('tsdMaterial', 'TSD - Material', generalData.tsdMaterial)}
          {renderTextField('tsdEspessura', 'TSD - Espessura (mm)', generalData.tsdEspessura, 'number')}
          {renderTextField('baseMaterial', 'Base - Material', generalData.baseMaterial)}
          {renderTextField('baseEspessura', 'Base - Espessura (mm)', generalData.baseEspessura, 'number')}
          {renderTextField('subBaseMaterial', 'Sub-base - Material', generalData.subBaseMaterial)}
          {renderTextField('subBaseEspessura', 'Sub-base - Espessura (mm)', generalData.subBaseEspessura, 'number')}
          {renderTextField('reforcoSubleitoMaterial', 'Reforço do Subleito - Material', generalData.reforcoSubleitoMaterial)}
          {renderTextField('reforcoSubleitoEspessura', 'Reforço do Subleito - Espessura (mm)', generalData.reforcoSubleitoEspessura, 'number')}
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default StabilizedLayers_step1;