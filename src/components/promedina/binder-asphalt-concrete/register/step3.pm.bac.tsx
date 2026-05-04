import { EssayPageProps } from '../../../templates/essay';
import { Box, TextField } from '@mui/material';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import useBinderAsphaltConcreteStore from '@/stores/promedina/binder-asphalt-concrete/binder-asphalt-concrete.store';

const BinderAsphaltConcrete_step3 = ({ setNextDisabled }: EssayPageProps) => {
  const { step3Data, setData } = useBinderAsphaltConcreteStore();

  // Helper para renderizar campos com placeholder grande
  const renderTextField = (
    key: string,
    label: string,
    value: any,
    type = 'text',
    required = false,
    adornment?: string
  ) => {
    if (adornment) {
      return (
        <InputEndAdornment
          key={key}
          adornment={adornment}
          type={type}
          variant="standard"
          label={label}
          placeholder={label}
          value={value?.toString() || ''}
          required={required}
          onChange={(e) => setData({ step: 2, key, value: e.target.value })}
        />
      );
    }

    return (
      <TextField
        key={key}
        variant="standard"
        type={type}
        label={label}
        placeholder={label}
        value={value || ''}
        required={required}
        InputLabelProps={type === 'date' ? { shrink: true } : undefined}
        onChange={(e) => setData({ step: 2, key, value: e.target.value })}
        InputProps={{
          inputProps: { style: { textTransform: 'uppercase' } }
        }}
      />
    );
  };

  // TRATAMENTO SUPERFICIAL - Adicionado type: 'text' para todos
  const tratamentoInputs = [
    { label: 'TIPO DE TRATAMENTO', key: 'tipoTratamento', required: true, type: 'text', value: step3Data?.tipoTratamento },
    { label: 'TIPO DE EMULSÃO', key: 'tipoEmulsao', required: true, type: 'text', value: step3Data?.tipoEmulsao },
    { label: 'TAXA DE EMULSÃO (l/m²)', key: 'taxaEmulsao', required: true, type: 'text', adornment: 'l/m²', value: step3Data?.taxaEmulsao },
    { label: 'TAXA DE AGREGADOS POR CAMADA (kg/m²)', key: 'taxaAgregados', required: true, type: 'text', adornment: 'kg/m²', value: step3Data?.taxaAgregados },
    { label: 'FAIXA GRANULOMÉTRICA', key: 'faixaGranulometrica', required: true, type: 'text', value: step3Data?.faixaGranulometrica },
    { label: 'ABRASÃO LOS ANGELES (%)', key: 'abrasaoLosAngeles', required: true, type: 'text', adornment: '%', value: step3Data?.abrasaoLosAngeles },
    { label: 'MASSA ESPECÍFICA (g/cm³)', key: 'massaEspecifica', required: true, type: 'text', adornment: 'g/cm³', value: step3Data?.massaEspecifica },
  ];

  // EMULSÃO ASFÁLTICA - Adicionado type: 'text' ou 'date' conforme necessário
  const emulsaoInputs = [
    { label: 'REFERÊNCIA COMERCIAL', key: 'referenciaComercial', required: true, type: 'text', value: step3Data?.referenciaComercial },
    { label: 'REFINARIA', key: 'refinaria', required: true, type: 'text', value: step3Data?.refinaria },
    { label: 'EMPRESA DISTRIBUIDORA', key: 'empresaDistribuidora', required: true, type: 'text', value: step3Data?.empresaDistribuidora },
    { label: 'DATA DO CARREGAMENTO', key: 'dataCarregamento', required: true, type: 'date', value: step3Data?.dataCarregamento },
    { label: 'NÚMERO DA NOTA FISCAL', key: 'numeroNotaFiscal', required: true, type: 'text', value: step3Data?.numeroNotaFiscal },
    { label: 'DATA DA NOTA FISCAL', key: 'dataNotaFiscal', required: true, type: 'date', value: step3Data?.dataNotaFiscal },
    { label: 'NÚMERO DO CERTIFICADO', key: 'numeroCertificado', required: true, type: 'text', value: step3Data?.numeroCertificado },
    { label: 'DATA DO CERTIFICADO', key: 'dataCertificado', required: true, type: 'date', value: step3Data?.dataCertificado },
  ];

  // PARÂMETROS DO MATERIAL - Adicionado type: 'text' para todos
  const parametrosInputs = [
    { label: 'VISCOSIDADE (SSF)', key: 'viscosidadeSSF', required: true, type: 'text', value: step3Data?.viscosidadeSSF },
    { label: 'PENEIRAÇÃO (%)', key: 'peneiracao', required: true, type: 'text', adornment: '%', value: step3Data?.peneiracao },
    { label: 'RESÍDUO (%)', key: 'residuo', required: true, type: 'text', adornment: '%', value: step3Data?.residuo },
    { label: 'CARGA DE PARTÍCULA', key: 'cargaParticula', required: true, type: 'text', value: step3Data?.cargaParticula },
    { label: 'PENETRAÇÃO (mm)', key: 'penetracao', required: true, type: 'text', adornment: 'mm', value: step3Data?.penetracao },
    { label: 'RECUPERAÇÃO ELÁSTICA (%)', key: 'recuperacaoElastica', required: true, type: 'text', adornment: '%', value: step3Data?.recuperacaoElastica },
    { label: 'PONTO DE AMOLECIMENTO (°C)', key: 'pontoAmolecimento', required: true, type: 'text', adornment: '°C', value: step3Data?.pontoAmolecimento },
  ];

  setNextDisabled(false);

  return (
    <>
      <FlexColumnBorder title="TRATAMENTO SUPERFICIAL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {tratamentoInputs.map((input) => renderTextField(input.key, input.label, input.value, input.type, input.required, input.adornment))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="EMULSÃO ASFÁLTICA" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {emulsaoInputs.map((input) => renderTextField(input.key, input.label, input.value, input.type, input.required))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="PARÂMETROS DO MATERIAL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {parametrosInputs.map((input) => renderTextField(input.key, input.label, input.value, input.type, input.required, input.adornment))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="OBSERVAÇÕES" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: '1fr', gap: '10px 20px', paddingBottom: '20px' }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              label="OBSERVAÇÕES"
              placeholder="DIGITE SUAS OBSERVAÇÕES AQUI"
              value={step3Data?.observacoes || ''}
              onChange={(e) => setData({ step: 2, key: 'observacoes', value: e.target.value })}
              InputProps={{
                inputProps: { style: { textTransform: 'uppercase' } }
              }}
            />
          </Box>
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default BinderAsphaltConcrete_step3;