import { EssayPageProps } from '../../../templates/essay';
import { Box, TextField, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import useBinderAsphaltConcreteStore from '@/stores/promedina/binder-asphalt-concrete/binder-asphalt-concrete.store';

interface InputField {
  label: string;
  value: string | null | undefined;
  key: string;
  required: boolean;
  adornment?: string;
  type?: string;
}

const BinderAsphaltConcrete_step2 = ({ setNextDisabled }: EssayPageProps) => {
  const { step2Data, setData } = useBinderAsphaltConcreteStore();

  const tratamentoInputs: InputField[] = [
    { label: 'Tipo de Tratamento', value: step2Data?.tipoTratamento, key: 'tipoTratamento', required: true },
    { label: 'Tipo de Emulsão', value: step2Data?.tipoEmulsao, key: 'tipoEmulsao', required: true },
    { label: 'Taxa de Emulsão (l/m²)', value: step2Data?.taxaEmulsao, key: 'taxaEmulsao', required: true, adornment: 'l/m²' },
    { label: 'Taxa de Agregados por Camada (kg/m²)', value: step2Data?.taxaAgregados, key: 'taxaAgregados', required: true, adornment: 'kg/m²' },
    { label: 'Faixa Granulométrica', value: step2Data?.faixaGranulometrica, key: 'faixaGranulometrica', required: true },
    { label: 'Abrasão Los Angeles (%)', value: step2Data?.abrasaoLosAngeles, key: 'abrasaoLosAngeles', required: true, adornment: '%' },
    { label: 'Massa Específica (g/cm³)', value: step2Data?.massaEspecifica, key: 'massaEspecifica', required: true, adornment: 'g/cm³' },
  ];

  const emulsaoInputs: InputField[] = [
    { label: 'Referência Comercial', value: step2Data?.referenciaComercial, key: 'referenciaComercial', required: true },
    { label: 'Refinaria', value: step2Data?.refinaria, key: 'refinaria', required: true },
    { label: 'Empresa Distribuidora', value: step2Data?.empresaDistribuidora, key: 'empresaDistribuidora', required: true },
    { label: 'Data do Carregamento', value: step2Data?.dataCarregamento, key: 'dataCarregamento', required: true, type: 'date' },
    { label: 'Número da Nota Fiscal', value: step2Data?.numeroNotaFiscal, key: 'numeroNotaFiscal', required: true },
    { label: 'Data da Nota Fiscal', value: step2Data?.dataNotaFiscal, key: 'dataNotaFiscal', required: true, type: 'date' },
    { label: 'Número do Certificado', value: step2Data?.numeroCertificado, key: 'numeroCertificado', required: true },
    { label: 'Data do Certificado', value: step2Data?.dataCertificado, key: 'dataCertificado', required: true, type: 'date' },
  ];

  const parametrosInputs: InputField[] = [
    { label: 'Viscosidade (SSF)', value: step2Data?.viscosidadeSSF, key: 'viscosidadeSSF', required: true },
    { label: 'Peneiração (%)', value: step2Data?.peneiracao, key: 'peneiracao', required: true, adornment: '%' },
    { label: 'Resíduo (%)', value: step2Data?.residuo, key: 'residuo', required: true, adornment: '%' },
    { label: 'Carga de Partícula', value: step2Data?.cargaParticula, key: 'cargaParticula', required: true },
    { label: 'Penetração (mm)', value: step2Data?.penetracao, key: 'penetracao', required: true, adornment: 'mm' },
    { label: 'Recuperação Elástica (%)', value: step2Data?.recuperacaoElastica, key: 'recuperacaoElastica', required: true, adornment: '%' },
    { label: 'Ponto de Amolecimento (°C)', value: step2Data?.pontoAmolecimento, key: 'pontoAmolecimento', required: true, adornment: '°C' },
  ];

  setNextDisabled(false);

  return (
    <>
      <FlexColumnBorder title="TRATAMENTO SUPERFICIAL" open={true} theme={'#07B811'}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '20px', padding: '20px' }}>
          {tratamentoInputs.map((input) => (
            input.adornment ? (
              <InputEndAdornment
                key={input.key}
                adornment={input.adornment}
                variant="standard"
                label={input.label}
                value={input.value?.toString() || ''}
                required={input.required}
                onChange={(e) => setData({ step: 1, key: input.key, value: e.target.value })}
              />
            ) : (
              <TextField
                key={input.key}
                variant="standard"
                type="text"
                label={input.label}
                value={input.value || ''}
                required={input.required}
                
                onChange={(e) => setData({ step: 1, key: input.key, value: e.target.value })}
                
              />
            )
          ))}
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="EMULSÃO ASFÁLTICA" open={true} theme={'#07B811'}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '20px', padding: '20px' }}>
          {emulsaoInputs.map((input) => (
            <TextField
              key={input.key}
              variant="standard"
              type={input.type || 'text'}
              label={input.label}
              value={input.value || ''}
              required={input.required}
              onChange={(e) => setData({ step: 1, key: input.key, value: e.target.value })}
            />
          ))}
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="PARÂMETROS DO MATERIAL" open={true} theme={'#07B811'}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '20px', padding: '20px' }}>
          {parametrosInputs.map((input) => (
            input.adornment ? (
              <InputEndAdornment
                key={input.key}
                adornment={input.adornment}
                variant="standard"
                label={input.label}
                value={input.value?.toString() || ''}
                required={input.required}
                onChange={(e) => setData({ step: 1, key: input.key, value: e.target.value })}
              />
            ) : (
              <TextField
                key={input.key}
                variant="standard"
                type="text"
                label={input.label}
                value={input.value || ''}
                required={input.required}
                onChange={(e) => setData({ step: 1, key: input.key, value: e.target.value })}
              />
            )
          ))}
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="OBSERVAÇÕES" open={true} theme={'#07B811'}>
        <Box sx={{ padding: '20px' }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Observações"
            value={step2Data?.observacoes || ''}
            onChange={(e) => setData({ step: 1, key: 'observacoes', value: e.target.value })}
          />
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default BinderAsphaltConcrete_step2;