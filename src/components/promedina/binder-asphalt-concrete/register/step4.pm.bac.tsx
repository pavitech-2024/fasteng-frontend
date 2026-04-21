import { EssayPageProps } from '../../../templates/essay';
import { Box, TextField, Typography } from '@mui/material';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import useBinderAsphaltConcreteStore from '@/stores/promedina/binder-asphalt-concrete/binder-asphalt-concrete.store';

const BinderAsphaltConcrete_step4 = ({ setNextDisabled }: EssayPageProps) => {
  const { step4Data, setData } = useBinderAsphaltConcreteStore();

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
          onChange={(e) => setData({ step: 3, key, value: e.target.value })}
          sx={{
            '& .MuiInputLabel-root': { fontSize: '0.9rem', fontWeight: 500 },
            '& .MuiInputBase-input': { fontSize: '1rem', padding: '8px 0' },
            '& .MuiInputBase-input::placeholder': { fontSize: '1rem', opacity: 0.7, color: '#666' },
          }}
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
        onChange={(e) => setData({ step: 3, key, value: e.target.value })}
        sx={{
          '& .MuiInputLabel-root': { fontSize: '0.9rem', fontWeight: 500 },
          '& .MuiInputBase-input': { fontSize: '1rem', padding: '8px 0' },
          '& .MuiInputBase-input::placeholder': { fontSize: '1rem', opacity: 0.7, color: '#666' },
        }}
      />
    );
  };

  // DADOS COMERCIAIS - Adicionado type
  const comerciaisInputs = [
    { label: 'REFERÊNCIA COMERCIAL', key: 'referenciaComercial', required: true, type: 'text', value: step4Data?.referenciaComercial },
    { label: 'REFINARIA', key: 'refinaria', required: true, type: 'text', value: step4Data?.refinaria },
    { label: 'EMPRESA DISTRIBUIDORA', key: 'empresaDistribuidora', required: true, type: 'text', value: step4Data?.empresaDistribuidora },
    { label: 'DATA DO CARREGAMENTO', key: 'dataCarregamento', required: true, type: 'date', value: step4Data?.dataCarregamento },
    { label: 'NÚMERO DA NOTA FISCAL', key: 'numeroNotaFiscal', required: true, type: 'text', value: step4Data?.numeroNotaFiscal },
    { label: 'DATA DA NOTA FISCAL', key: 'dataNotaFiscal', required: true, type: 'date', value: step4Data?.dataNotaFiscal },
    { label: 'NÚMERO DO CERTIFICADO', key: 'numeroCertificado', required: true, type: 'text', value: step4Data?.numeroCertificado },
    { label: 'DATA DO CERTIFICADO', key: 'dataCertificado', required: true, type: 'date', value: step4Data?.dataCertificado },
  ];

  // LIGANTE ORIGINAL - Adicionado type
  const originalInputs = [
    { label: 'TIPO DE CAP', key: 'tipoCAP', required: true, type: 'text', value: step4Data?.tipoCAP },
    { label: 'PERFORMANCE GRADE (PG)', key: 'performanceGrade', required: true, type: 'text', value: step4Data?.performanceGrade },
    { label: 'PENETRAÇÃO (mm) - 25°C', key: 'penetracao25', required: true, type: 'text', adornment: 'mm', value: step4Data?.penetracao25 },
    { label: 'PONTO DE AMOLECIMENTO (°C)', key: 'pontoAmolecimento', required: true, type: 'text', adornment: '°C', value: step4Data?.pontoAmolecimento },
    { label: 'VISCOSIDADE BROOKFIELD 135°C (cP)', key: 'viscosidadeBrookfield_135', required: true, type: 'text', adornment: 'cP', value: step4Data?.viscosidadeBrookfield_135 },
    { label: 'VISCOSIDADE BROOKFIELD 150°C (cP)', key: 'viscosidadeBrookfield_150', required: true, type: 'text', adornment: 'cP', value: step4Data?.viscosidadeBrookfield_150 },
    { label: 'VISCOSIDADE BROOKFIELD 177°C (cP)', key: 'viscosidadeBrookfield_177', required: true, type: 'text', adornment: 'cP', value: step4Data?.viscosidadeBrookfield_177 },
    { label: 'RECUPERAÇÃO ELÁSTICA (%)', key: 'recuperacaoElastica', required: true, type: 'text', adornment: '%', value: step4Data?.recuperacaoElastica },
  ];

  // DSR ORIGINAL - Adicionado type
  const dsrOriginalInputs = [
    { label: 'DSR - G*/SEN(δ) (MPa)', key: 'dsr_original_G_sen', required: true, type: 'text', adornment: 'MPa', value: step4Data?.dsr_original_G_sen },
    { label: 'TEMPERATURA DO TESTE (°C)', key: 'dsr_original_temp', required: true, type: 'text', adornment: '°C', value: step4Data?.dsr_original_temp },
  ];

  // DSR RTFOT - Adicionado type
  const dsrRtfotInputs = [
    { label: 'DSR RTFOT - G*/SEN(δ) (MPa)', key: 'dsr_rtfot_G_sen', required: true, type: 'text', adornment: 'MPa', value: step4Data?.dsr_rtfot_G_sen },
    { label: 'TEMPERATURA DO TESTE (°C)', key: 'dsr_rtfot_temp', required: true, type: 'text', adornment: '°C', value: step4Data?.dsr_rtfot_temp },
  ];

  // MSCR - Adicionado type
  const mscrInputs = [
    { label: 'MSCR - JNR 3,2 (1/KPA)', key: 'mscr_Jnr_3_2', required: true, type: 'text', adornment: '1/kPa', value: step4Data?.mscr_Jnr_3_2 },
    { label: 'MSCR - JNDIFF (%)', key: 'mscr_Jndiff', required: true, type: 'text', adornment: '%', value: step4Data?.mscr_Jndiff },
  ];

  // LAS - Adicionado type
  const lasInputs = [
    { label: 'LAS - STRAIN 1,25% - Nº', key: 'las_strain_1_25', required: true, type: 'text', value: step4Data?.las_strain_1_25 },
    { label: 'LAS - STRAIN 2,5% - Nº', key: 'las_strain_2_5', required: true, type: 'text', value: step4Data?.las_strain_2_5 },
    { label: 'LAS - STRAIN 5% - Nº', key: 'las_strain_5', required: true, type: 'text', value: step4Data?.las_strain_5 },
    { label: 'LAS - AF (COMPRIMENTO NA TRINCA)', key: 'las_af', required: true, type: 'text', value: step4Data?.las_af },
    { label: 'LAS - FFL (FATOR DE FADIGA)', key: 'las_FFL', required: true, type: 'text', value: step4Data?.las_FFL },
    { label: 'LAS - D³', key: 'las_D', required: true, type: 'text', value: step4Data?.las_D },
  ];

  // BBR - Adicionado type
  const bbrInputs = [
    { label: 'BBR - MÓDULO DE RIGIDEZ S (MPa)', key: 'bbr_S', required: true, type: 'text', adornment: 'MPa', value: step4Data?.bbr_S },
    { label: 'BBR - COEFICIENTE ANGULAR M (MPa)', key: 'bbr_m', required: true, type: 'text', adornment: 'MPa', value: step4Data?.bbr_m },
    { label: 'TEMPERATURA DO TESTE (°C)', key: 'bbr_temp', required: true, type: 'text', adornment: '°C', value: step4Data?.bbr_temp },
  ];

  setNextDisabled(false);

  return (
    <>
      <FlexColumnBorder title="DADOS COMERCIAIS" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {comerciaisInputs.map((input) => renderTextField(input.key, input.label, input.value, input.type, input.required))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="LIGANTE ORIGINAL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {originalInputs.map((input) => renderTextField(input.key, input.label, input.value, input.type, input.required, input.adornment))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="DSR - LIGANTE ORIGINAL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {dsrOriginalInputs.map((input) => renderTextField(input.key, input.label, input.value, input.type, input.required, input.adornment))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="LIGANTE ENVELHECIDO NO RTFOT (75 MIN, 163°C)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {dsrRtfotInputs.map((input) => renderTextField(input.key, input.label, input.value, input.type, input.required, input.adornment))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="MSCR (MULTIPLE STRESS CREEP RECOVERY)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {mscrInputs.map((input) => renderTextField(input.key, input.label, input.value, input.type, input.required, input.adornment))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="LAS (LINEAR AMPLITUDE SWEEP)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {lasInputs.map((input) => renderTextField(input.key, input.label, input.value, input.type, input.required))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="LIGANTE ENVELHECIDO NO RTFOT + PAV (20 HORAS, 100°C)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {bbrInputs.map((input) => renderTextField(input.key, input.label, input.value, input.type, input.required, input.adornment))}
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
              value={step4Data?.observacoes || ''}
              onChange={(e) => setData({ step: 3, key: 'observacoes', value: e.target.value })}
              sx={{
                '& .MuiInputLabel-root': { fontSize: '0.9rem', fontWeight: 500 },
                '& .MuiInputBase-input': { fontSize: '1rem' },
                '& .MuiInputBase-input::placeholder': { fontSize: '1rem', opacity: 0.7, color: '#666' },
              }}
            />
            <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.8rem' }}>
              AF: COMPRIMENTO NA TRINCA - CRITÉRIO DE FALHA PROPOSTO POR HINTZ E BAHIA (2013); FFL: FATOR DE FADIGA DE LIGANTE - CRITÉRIO PROPOSTO POR NASCIMENTO (2015)
            </Typography>
          </Box>
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default BinderAsphaltConcrete_step4;