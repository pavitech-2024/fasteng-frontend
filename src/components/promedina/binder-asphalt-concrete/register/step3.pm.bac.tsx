import { EssayPageProps } from '../../../templates/essay';
import { Box, TextField, Typography } from '@mui/material';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import useBinderAsphaltConcreteStore from '@/stores/promedina/binder-asphalt-concrete/binder-asphalt-concrete.store';

const BinderAsphaltConcrete_step3 = ({ setNextDisabled }: EssayPageProps) => {
  const { step3Data, setData } = useBinderAsphaltConcreteStore();

  // DADOS COMERCIAIS
  const comerciaisInputs = [
    { label: 'Referência Comercial', value: step3Data?.referenciaComercial, key: 'referenciaComercial', required: true },
    { label: 'Refinaria', value: step3Data?.refinaria, key: 'refinaria', required: true },
    { label: 'Empresa Distribuidora', value: step3Data?.empresaDistribuidora, key: 'empresaDistribuidora', required: true },
    { label: 'Data do Carregamento', value: step3Data?.dataCarregamento, key: 'dataCarregamento', required: true, type: 'date' },
    { label: 'Número da Nota Fiscal', value: step3Data?.numeroNotaFiscal, key: 'numeroNotaFiscal', required: true },
    { label: 'Data da Nota Fiscal', value: step3Data?.dataNotaFiscal, key: 'dataNotaFiscal', required: true, type: 'date' },
    { label: 'Número do Certificado', value: step3Data?.numeroCertificado, key: 'numeroCertificado', required: true },
    { label: 'Data do Certificado', value: step3Data?.dataCertificado, key: 'dataCertificado', required: true, type: 'date' },
  ];

  // LIGANTE ORIGINAL
  const originalInputs = [
    { label: 'Tipo de CAP', value: step3Data?.tipoCAP, key: 'tipoCAP', required: true },
    { label: 'Performance Grade (PG)', value: step3Data?.performanceGrade, key: 'performanceGrade', required: true },
    { label: 'Penetração (mm) - 25°C', value: step3Data?.penetracao25, key: 'penetracao25', required: true, adornment: 'mm' },
    { label: 'Ponto de Amolecimento (°C)', value: step3Data?.pontoAmolecimento, key: 'pontoAmolecimento', required: true, adornment: '°C' },
    { label: 'Viscosidade Brookfield 135°C (cP)', value: step3Data?.viscosidadeBrookfield_135, key: 'viscosidadeBrookfield_135', required: true, adornment: 'cP' },
    { label: 'Viscosidade Brookfield 150°C (cP)', value: step3Data?.viscosidadeBrookfield_150, key: 'viscosidadeBrookfield_150', required: true, adornment: 'cP' },
    { label: 'Viscosidade Brookfield 177°C (cP)', value: step3Data?.viscosidadeBrookfield_177, key: 'viscosidadeBrookfield_177', required: true, adornment: 'cP' },
    { label: 'Recuperação Elástica (%)', value: step3Data?.recuperacaoElastica, key: 'recuperacaoElastica', required: true, adornment: '%' },
  ];

  // DSR ORIGINAL
  const dsrOriginalInputs = [
    { label: 'DSR - G*/sen(δ) (MPa)', value: step3Data?.dsr_original_G_sen, key: 'dsr_original_G_sen', required: true, adornment: 'MPa' },
    { label: 'Temperatura do Teste (°C)', value: step3Data?.dsr_original_temp, key: 'dsr_original_temp', required: true, adornment: '°C' },
  ];

  // DSR RTFOT
  const dsrRtfotInputs = [
    { label: 'DSR RTFOT - G*/sen(δ) (MPa)', value: step3Data?.dsr_rtfot_G_sen, key: 'dsr_rtfot_G_sen', required: true, adornment: 'MPa' },
    { label: 'Temperatura do Teste (°C)', value: step3Data?.dsr_rtfot_temp, key: 'dsr_rtfot_temp', required: true, adornment: '°C' },
  ];

  // MSCR
  const mscrInputs = [
    { label: 'MSCR - Jnr 3,2 (1/kPa)', value: step3Data?.mscr_Jnr_3_2, key: 'mscr_Jnr_3_2', required: true, adornment: '1/kPa' },
    { label: 'MSCR - Jndiff (%)', value: step3Data?.mscr_Jndiff, key: 'mscr_Jndiff', required: true, adornment: '%' },
  ];

  // LAS
  const lasInputs = [
    { label: 'LAS - Strain 1,25% - Nº', value: step3Data?.las_strain_1_25, key: 'las_strain_1_25', required: true },
    { label: 'LAS - Strain 2,5% - Nº', value: step3Data?.las_strain_2_5, key: 'las_strain_2_5', required: true },
    { label: 'LAS - Strain 5% - Nº', value: step3Data?.las_strain_5, key: 'las_strain_5', required: true },
    { label: 'LAS - af (comprimento na trinca)', value: step3Data?.las_af, key: 'las_af', required: true },
    { label: 'LAS - FFL (Fator de fadiga)', value: step3Data?.las_FFL, key: 'las_FFL', required: true },
    { label: 'LAS - D³', value: step3Data?.las_D, key: 'las_D', required: true },
  ];

  // BBR
  const bbrInputs = [
    { label: 'BBR - Módulo de rigidez S (MPa)', value: step3Data?.bbr_S, key: 'bbr_S', required: true, adornment: 'MPa' },
    { label: 'BBR - Coeficiente angular m (MPa)', value: step3Data?.bbr_m, key: 'bbr_m', required: true, adornment: 'MPa' },
    { label: 'Temperatura do Teste (°C)', value: step3Data?.bbr_temp, key: 'bbr_temp', required: true, adornment: '°C' },
  ];

  setNextDisabled(false);

  return (
    <>
      <FlexColumnBorder title="DADOS COMERCIAIS" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {comerciaisInputs.map((input) => (
              <TextField
                key={input.key}
                variant="standard"
                type={input.type || 'text'}
                label={input.label}
                value={input.value || ''}
                required={input.required}
                onChange={(e) => setData({ step: 2, key: input.key, value: e.target.value })}
              />
            ))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="LIGANTE ORIGINAL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {originalInputs.map((input) => (
              input.adornment ? (
                <InputEndAdornment
                  key={input.key}
                  adornment={input.adornment}
                  type="text"
                  variant="standard"
                  label={input.label}
                  value={input.value?.toString() || ''}
                  required={input.required}
                  onChange={(e) => setData({ step: 2, key: input.key, value: e.target.value })}
                />
              ) : (
                <TextField
                  key={input.key}
                  variant="standard"
                  type="text"
                  label={input.label}
                  value={input.value || ''}
                  required={input.required}
                  onChange={(e) => setData({ step: 2, key: input.key, value: e.target.value })}
                />
              )
            ))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="DSR - LIGANTE ORIGINAL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {dsrOriginalInputs.map((input) => (
              <InputEndAdornment
                key={input.key}
                adornment={input.adornment}
                type="text"
                variant="standard"
                label={input.label}
                value={input.value?.toString() || ''}
                required={input.required}
                onChange={(e) => setData({ step: 2, key: input.key, value: e.target.value })}
              />
            ))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="LIGANTE ENVELHECIDO NO RTFOT (75 min, 163°C)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {dsrRtfotInputs.map((input) => (
              <InputEndAdornment
                key={input.key}
                adornment={input.adornment}
                type="text"
                variant="standard"
                label={input.label}
                value={input.value?.toString() || ''}
                required={input.required}
                onChange={(e) => setData({ step: 2, key: input.key, value: e.target.value })}
              />
            ))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="MSCR (MULTIPLE STRESS CREEP RECOVERY)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {mscrInputs.map((input) => (
              <InputEndAdornment
                key={input.key}
                adornment={input.adornment}
                type="text"
                variant="standard"
                label={input.label}
                value={input.value?.toString() || ''}
                required={input.required}
                onChange={(e) => setData({ step: 2, key: input.key, value: e.target.value })}
              />
            ))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="LAS (LINEAR AMPLITUDE SWEEP)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {lasInputs.map((input) => (
              <TextField
                key={input.key}
                variant="standard"
                type="text"
                label={input.label}
                value={input.value || ''}
                required={input.required}
                onChange={(e) => setData({ step: 2, key: input.key, value: e.target.value })}
              />
            ))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="LIGANTE ENVELHECIDO NO RTFOT + PAV (20 horas, 100°C)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {bbrInputs.map((input) => (
              <InputEndAdornment
                key={input.key}
                adornment={input.adornment}
                type="text"
                variant="standard"
                label={input.label}
                value={input.value?.toString() || ''}
                required={input.required}
                onChange={(e) => setData({ step: 2, key: input.key, value: e.target.value })}
              />
            ))}
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
              label="Observações"
              value={step3Data?.observacoes || ''}
              onChange={(e) => setData({ step: 2, key: 'observacoes', value: e.target.value })}
            />
            <Typography variant="caption" color="textSecondary">
              af: comprimento na trinca - critério de falha proposto por Hintz e Bahia (2013); FFL: Fator de fadiga de ligante - critério proposto por Nascimento (2015)
            </Typography>
          </Box>
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default BinderAsphaltConcrete_step3;