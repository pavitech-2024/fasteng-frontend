import { EssayPageProps } from '../../../templates/essay';
import { Box, TextField, Tooltip, IconButton } from '@mui/material';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import useBinderAsphaltConcreteStore from '@/stores/promedina/binder-asphalt-concrete/binder-asphalt-concrete.store';

const BinderAsphaltConcrete_step3 = ({ setNextDisabled }: EssayPageProps) => {
  const { step3Data, setData } = useBinderAsphaltConcreteStore();

  const tooltips: Record<string, string> = {
    tipoTratamento: 'Preencher com Simples, Duplo ou Triplo',
    tipoEmulsao: 'Preencher com o tipo de emulsão utilizada no tratamento',
    taxaEmulsao: 'Taxa de emulsão aplicada em l/m²',
    taxaAgregados: 'Taxa de agregados por camada em kg/m²',
    faixaGranulometrica: 'Faixa granulométrica do agregado utilizado',
    abrasaoLosAngeles: 'Referente aos agregados',
    massaEspecifica: 'Massa específica aparente seca do material obtido no ensaio de Compactação do DNIT',
    referenciaComercial: 'Referência comercial do produto',
    refinaria: 'Nome da refinaria fornecedora',
    empresaDistribuidora: 'Nome da empresa distribuidora',
    dataCarregamento: 'Data de carregamento do material',
    numeroNotaFiscal: 'Número da nota fiscal',
    dataNotaFiscal: 'Data de emissão da nota fiscal',
    numeroCertificado: 'Número do certificado de qualidade',
    dataCertificado: 'Data de emissão do certificado',
    viscosidadeSSF: 'Viscosidade Saybolt Furol (SSF) da emulsão',
    peneiracao: 'Percentual retido na peneiração (%)',
    residuo: 'Teor de resíduo da emulsão (%)',
    cargaParticula: 'Preencher com Catiônica, Aniônica, Não-iônica ou Anfotérica',
    penetracao: 'Valor de penetração do resíduo (mm)',
    recuperacaoElastica: 'Percentual de recuperação elástica (%)',
    pontoAmolecimento: 'Temperatura de ponto de amolecimento (°C)',
  };

  const renderTextField = (
    key: string,
    label: string,
    value: any,
    type = 'text',
    adornment?: string
  ) => {
    if (adornment) {
      return (
        <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InputEndAdornment
            adornment={adornment}
            type={type}
            variant="standard"
            label={label}
            placeholder={adornment ? `Ex: ${adornment}` : ''}
            value={value?.toString() || ''}
            onChange={(e) => setData({ step: 2, key, value: e.target.value })}
            sx={{ flex: 1 }}
          />
          <Tooltip title={tooltips[key] || 'Preencher conforme especificação'} arrow>
            <IconButton size="small" sx={{ color: '#0ab39f' }}>
              <HelpOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      );
    }

    return (
      <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          variant="standard"
          type={type}
          label={label}
          value={value || ''}
          InputLabelProps={type === 'date' ? { shrink: true } : undefined}
          onChange={(e) => setData({ step: 2, key, value: e.target.value })}
          InputProps={{
            inputProps: { style: { textTransform: 'uppercase' } }
          }}
          sx={{ flex: 1 }}
        />
        <Tooltip title={tooltips[key] || 'Preencher conforme especificação'} arrow>
          <IconButton size="small" sx={{ color: '#0ab39f' }}>
            <HelpOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };

  const tratamentoInputs = [
    { label: 'TIPO DE TRATAMENTO', key: 'tipoTratamento', type: 'text', value: step3Data?.tipoTratamento },
    { label: 'TIPO DE EMULSÃO', key: 'tipoEmulsao', type: 'text', value: step3Data?.tipoEmulsao },
    { label: 'TAXA DE EMULSÃO (l/m²)', key: 'taxaEmulsao', type: 'text', adornment: 'l/m²', value: step3Data?.taxaEmulsao },
    { label: 'TAXA DE AGREGADOS POR CAMADA (kg/m²)', key: 'taxaAgregados', type: 'text', adornment: 'kg/m²', value: step3Data?.taxaAgregados },
    { label: 'FAIXA GRANULOMÉTRICA', key: 'faixaGranulometrica', type: 'text', value: step3Data?.faixaGranulometrica },
    { label: 'ABRASÃO LOS ANGELES (%)', key: 'abrasaoLosAngeles', type: 'text', adornment: '%', value: step3Data?.abrasaoLosAngeles },
    { label: 'MASSA ESPECÍFICA (g/cm³)', key: 'massaEspecifica', type: 'text', adornment: 'g/cm³', value: step3Data?.massaEspecifica },
  ];

  const emulsaoInputs = [
    { label: 'REFERÊNCIA COMERCIAL', key: 'referenciaComercial', type: 'text', value: step3Data?.referenciaComercial },
    { label: 'REFINARIA', key: 'refinaria', type: 'text', value: step3Data?.refinaria },
    { label: 'EMPRESA DISTRIBUIDORA', key: 'empresaDistribuidora', type: 'text', value: step3Data?.empresaDistribuidora },
    { label: 'DATA DO CARREGAMENTO', key: 'dataCarregamento', type: 'date', value: step3Data?.dataCarregamento },
    { label: 'NÚMERO DA NOTA FISCAL', key: 'numeroNotaFiscal', type: 'text', value: step3Data?.numeroNotaFiscal },
    { label: 'DATA DA NOTA FISCAL', key: 'dataNotaFiscal', type: 'date', value: step3Data?.dataNotaFiscal },
    { label: 'NÚMERO DO CERTIFICADO', key: 'numeroCertificado', type: 'text', value: step3Data?.numeroCertificado },
    { label: 'DATA DO CERTIFICADO', key: 'dataCertificado', type: 'date', value: step3Data?.dataCertificado },
  ];

  const parametrosInputs = [
    { label: 'VISCOSIDADE (SSF)', key: 'viscosidadeSSF', type: 'text', value: step3Data?.viscosidadeSSF },
    { label: 'PENEIRAÇÃO (%)', key: 'peneiracao', type: 'text', adornment: '%', value: step3Data?.peneiracao },
    { label: 'RESÍDUO (%)', key: 'residuo', type: 'text', adornment: '%', value: step3Data?.residuo },
    { label: 'CARGA DE PARTÍCULA', key: 'cargaParticula', type: 'text', value: step3Data?.cargaParticula },
    { label: 'PENETRAÇÃO (mm)', key: 'penetracao', type: 'text', adornment: 'mm', value: step3Data?.penetracao },
    { label: 'RECUPERAÇÃO ELÁSTICA (%)', key: 'recuperacaoElastica', type: 'text', adornment: '%', value: step3Data?.recuperacaoElastica },
    { label: 'PONTO DE AMOLECIMENTO (°C)', key: 'pontoAmolecimento', type: 'text', adornment: '°C', value: step3Data?.pontoAmolecimento },
  ];

  setNextDisabled(false);

  return (
    <>
      <FlexColumnBorder title="TRATAMENTO SUPERFICIAL" open={true} theme={'#0ab39f'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {tratamentoInputs.map((input) => renderTextField(input.key, input.label, input.value, input.type, input.adornment))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="EMULSÃO ASFÁLTICA" open={true} theme={'#0ab39f'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {emulsaoInputs.map((input) => renderTextField(input.key, input.label, input.value, input.type))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="PARÂMETROS DO MATERIAL" open={true} theme={'#0ab39f'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {parametrosInputs.map((input) => renderTextField(input.key, input.label, input.value, input.type, input.adornment))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="OBSERVAÇÕES" open={true} theme={'#0ab39f'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: '1fr', gap: '10px 20px', paddingBottom: '20px' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                label="OBSERVAÇÕES"
                value={step3Data?.observacoes || ''}
                onChange={(e) => setData({ step: 2, key: 'observacoes', value: e.target.value })}
                InputProps={{
                  inputProps: { style: { textTransform: 'uppercase' } }
                }}
              />
              <Tooltip title="Caso necessário, utilizar o espaço para alguma anotação que facilite a compreensão dos dados" arrow>
                <IconButton size="small" sx={{ color: '#0ab39f', mt: 1 }}>
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default BinderAsphaltConcrete_step3;