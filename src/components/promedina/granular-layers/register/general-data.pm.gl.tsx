import { EssayPageProps } from '../../../templates/essay';
import { Box, TextField, MenuItem, Select, FormControl, InputLabel, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import useGranularLayersStore from '@/stores/promedina/granular-layers/granular-layers.store';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { useEffect } from 'react';

interface CamadaEstrutural {
  id: number;
  layer: string;
  material: string;
  thickness: string;
}

const GranularLayers_step1 = ({ setNextDisabled }: EssayPageProps) => {
  const { generalData, setData } = useGranularLayersStore();
  
  const structuralComposition = generalData?.structuralComposition || [];

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
      type={type === 'date' ? 'date' : 'text'}
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

  const adicionarCamada = () => {
    const camadasAtuais = [...structuralComposition];
    const novaCamada: CamadaEstrutural = {
      id: Date.now(),
      layer: '',
      material: '',
      thickness: '',
    };
    setData({
      step: 0,
      key: 'structuralComposition',
      value: [...camadasAtuais, novaCamada]
    });
  };

  const removerCamada = (index: number) => {
    const camadasAtuais = [...structuralComposition];
    camadasAtuais.splice(index, 1);
    setData({
      step: 0,
      key: 'structuralComposition',
      value: camadasAtuais
    });
  };

  const atualizarCamada = (index: number, campo: string, valor: string) => {
    const camadasAtuais = [...structuralComposition];
    camadasAtuais[index] = { ...camadasAtuais[index], [campo]: valor };
    setData({
      step: 0,
      key: 'structuralComposition',
      value: camadasAtuais
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setData({ step: 0, key: 'images', value: imageUrl });
    }
  };

  return (
    <>
      <FlexColumnBorder title="IDENTIFICAÇÃO" open={true} theme={'#07B811'}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', width: '100%', flexWrap: 'wrap', '& > *': { width: 'calc(50% - 10px)' }, gap: '5px 20px', marginBottom: '10px', marginTop: '-20px' }}>
            {renderTextField('name', 'INSTITUIÇÃO + NÚMERO DO TRECHO + TIPO DE EXECUÇÃO + ANO DE IMPLANTAÇÃO', generalData?.name)}
            {renderSelect('tipoSecao', 'TIPO DE SEÇÃO', generalData?.tipoSecao, tipoSecaoOptions)}
            {renderSelect('faseMonitoramento', 'FASE DE MONITORAMENTO', generalData?.faseMonitoramento, faseMonitoramentoOptions)}
            {renderTextField('liberacaoTrafico', 'LIBERAÇÃO AO TRÁFEGO', generalData?.liberacaoTrafico, 'date')}
            {renderSelect('utilizadaMedina', 'UTILIZADA NA CALIBRAÇÃO DO MEDINA', generalData?.utilizadaMedina, simNaoOptions)}
            {renderSelect('utilizadaLvec', 'UTILIZADA NA CALIBRAÇÃO DO LVECD', generalData?.utilizadaLvec, simNaoOptions)}
            {renderSelect('dadosConfirmadosICT', 'DADOS CONFIRMADOS PELA ICT', generalData?.dadosConfirmadosICT, simNaoOptions)}
            {renderTextField('observation', 'OBSERVAÇÕES', generalData?.observation, 'text', false, true)}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="PREPARO DO PAVIMENTO" open={true} theme={'#07B811'}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px', '& > *': { width: 'calc(50% - 10px)' } }}>
          {renderTextField('iriPrerehabilitation', 'IRI (m/km) PRÉ-REABILITAÇÃO', generalData?.iriPrerehabilitation)}
          {renderTextField('atPrerehabilitation', 'AT (%) PRÉ-REABILITAÇÃO', generalData?.atPrerehabilitation)}
          {renderSelect('fresagem', 'FRESAGEM', generalData?.fresagem, simNaoOptions)}
          {generalData?.fresagem === 'Sim' && renderTextField('millingThickness', 'ESPESSURA FRESADA (mm)', generalData?.millingThickness)}
          {renderSelect('interventionAtTheBase', 'INTERVENÇÃO NA BASE', generalData?.interventionAtTheBase, simNaoOptions)}
          {renderSelect('sami', 'SAMI', generalData?.sami, simNaoOptions)}
          {renderSelect('bondingPaint', 'PINTURA DE LIGAÇÃO', generalData?.bondingPaint, simNaoOptions)}
          {renderSelect('priming', 'IMPRIMAÇÃO', generalData?.priming, simNaoOptions)}
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="DATA DA ÚLTIMA ATUALIZAÇÃO" open={true} theme={'#07B811'}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px', '& > *': { width: 'calc(50% - 10px)' } }}>
          {renderTextField('lastUpdate', 'DATA DA ÚLTIMA ATUALIZAÇÃO', generalData?.lastUpdate, 'date')}
          {renderTextField('serviceTimeYears', 'TEMPO EM SERVIÇO (ANOS)', generalData?.serviceTimeYears)}
          {renderTextField('serviceTimeMonths', 'TEMPO EM SERVIÇO (MESES)', generalData?.serviceTimeMonths)}
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="CARACTERÍSTICAS" open={true} theme={'#07B811'}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px', '& > *': { width: 'calc(50% - 10px)' } }}>
          {renderTextField('roadName', 'LOCAL (RODOVIA/AVENIDA)', generalData?.roadName)}
          {renderTextField('cityState', 'MUNICÍPIO/ESTADO', generalData?.cityState)}
          {renderTextField('experimentalLength', 'EXTENSÃO (m)', generalData?.experimentalLength)}
          {renderTextField('guideSpeed', 'VELOCIDADE DIRETRIZ DA VIA (km/h)', generalData?.guideSpeed)}
          {renderTextField('kmInicial', 'KM INICIAL', generalData?.kmInicial)}
          {renderTextField('kmFinal', 'KM FINAL', generalData?.kmFinal)}
          {renderTextField('numberOfTracks', 'NÚMERO DE FAIXAS', generalData?.numberOfTracks)}
          {renderTextField('monitoredTrack', 'FAIXA MONITORADA', generalData?.monitoredTrack)}
          {renderTextField('trackWidth', 'LARGURA DA FAIXA (m)', generalData?.trackWidth)}
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="COORDENADAS" open={true} theme={'#07B811'}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px', '& > *': { width: 'calc(50% - 10px)' } }}>
          {renderTextField('inicioEstaca', 'INÍCIO - ESTACA', generalData?.inicioEstaca)}
          {renderTextField('inicioMetros', 'INÍCIO - METROS', generalData?.inicioMetros)}
          {renderTextField('fimEstaca', 'FIM - ESTACA', generalData?.fimEstaca)}
          {renderTextField('fimMetros', 'FIM - METROS', generalData?.fimMetros)}
          {renderTextField('averageAltitude', 'ALTITUDE MÉDIA (m)', generalData?.averageAltitude)}
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="COMPOSIÇÃO ESTRUTURAL" open={true} theme={'#07B811'}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 50px', gap: '10px', fontWeight: 'bold', borderBottom: '2px solid #07B811', paddingBottom: '10px', marginBottom: '10px' }}>
              <Box sx={{ textTransform: 'uppercase' }}>CAMADA</Box>
              <Box sx={{ textTransform: 'uppercase' }}>MATERIAL</Box>
              <Box sx={{ textTransform: 'uppercase' }}>ESPESSURA (mm)</Box>
              <Box sx={{ textTransform: 'uppercase' }}>AÇÕES</Box>
            </Box>

            {structuralComposition.map((camada: any, index: number) => (
              <Box key={camada.id || index} sx={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 50px', gap: '10px', alignItems: 'center' }}>
                <Select variant="standard" value={camada.layer || ''} onChange={(e) => atualizarCamada(index, 'layer', e.target.value)} displayEmpty sx={{ textTransform: 'uppercase' }}>
                  <MenuItem value="" disabled>SELECIONE A CAMADA</MenuItem>
                  {tipoCamadaOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
                <TextField variant="standard" placeholder="MATERIAL" value={camada.material || ''} onChange={(e) => atualizarCamada(index, 'material', e.target.value)} InputProps={{ inputProps: { style: { textTransform: 'uppercase' } } }} />
                <TextField variant="standard" type="text" placeholder="ESPESSURA" value={camada.thickness || ''} onChange={(e) => atualizarCamada(index, 'thickness', e.target.value)} />
                <IconButton onClick={() => removerCamada(index)} color="error" size="small"><DeleteIcon /></IconButton>
              </Box>
            ))}
          </Box>

          <Button variant="outlined" startIcon={<AddIcon />} onClick={adicionarCamada} sx={{ borderColor: '#07B811', color: '#07B811', textTransform: 'uppercase', '&:hover': { borderColor: '#05990e', backgroundColor: 'rgba(7, 184, 17, 0.04)' } }}>
            ADICIONAR CAMADA
          </Button>

          <Box sx={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px dashed #ccc', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <Box sx={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Button variant="contained" component="label" sx={{ backgroundColor: '#07B811', textTransform: 'uppercase', '&:hover': { backgroundColor: '#05990e' } }}>
                ADICIONAR IMAGEM
                <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
              </Button>
              {generalData?.images && (
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <img src={generalData.images} alt="Estrutura do pavimento" style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '4px' }} />
                  <IconButton size="small" onClick={() => setData({ step: 0, key: 'images', value: null })} sx={{ position: 'absolute', top: -10, right: -10, backgroundColor: 'red', color: 'white', '&:hover': { backgroundColor: 'darkred' } }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
            {renderTextField('imagesDate', 'DATA DAS IMAGENS', generalData?.imagesDate, 'date')}
          </Box>
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default GranularLayers_step1;