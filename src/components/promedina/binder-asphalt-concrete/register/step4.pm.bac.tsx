import { EssayPageProps } from '../../../templates/essay';
import { Box, TextField, Button, IconButton, Typography } from '@mui/material';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import useBinderAsphaltConcreteStore from '@/stores/promedina/binder-asphalt-concrete/binder-asphalt-concrete.store';
//ts
const BinderAsphaltConcrete_step4 = ({ setNextDisabled }: EssayPageProps) => {
  const { step4Data, setData } = useBinderAsphaltConcreteStore();

  // ==================== HELPER ====================
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
        InputProps={{
          inputProps: { style: { textTransform: 'uppercase' } }
        }}
      />
    );
  };

  // ==================== DSR HANDLERS ====================
  const handleAddDsr = (type: 'dsr_original' | 'dsr_rtfot') => {
    const current = step4Data?.[type] || [];
    setData({ step: 3, key: type, value: [...current, { temp: '', G_sen: '' }] });
  };

  const handleRemoveDsr = (type: 'dsr_original' | 'dsr_rtfot', index: number) => {
    const current = [...(step4Data?.[type] || [])];
    current.splice(index, 1);
    setData({ step: 3, key: type, value: current });
  };

  const handleDsrChange = (
    type: 'dsr_original' | 'dsr_rtfot',
    index: number,
    field: 'temp' | 'G_sen',
    value: string
  ) => {
    const current = [...(step4Data?.[type] || [])];
    current[index] = { ...current[index], [field]: value };
    setData({ step: 3, key: type, value: current });
  };

  // ==================== INPUTS ====================
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

  const mscrInputs = [
    { label: 'MSCR - JNR 3,2 (1/KPA)', key: 'mscr_Jnr_3_2', required: true, type: 'text', adornment: '1/kPa', value: step4Data?.mscr_Jnr_3_2 },
    { label: 'MSCR - JNDIFF (%)', key: 'mscr_Jndiff', required: true, type: 'text', adornment: '%', value: step4Data?.mscr_Jndiff },
  ];

  const lasInputs = [
    { label: 'LAS - STRAIN 1,25% - Nº', key: 'las_strain_1_25', required: true, type: 'text', value: step4Data?.las_strain_1_25 },
    { label: 'LAS - STRAIN 2,5% - Nº', key: 'las_strain_2_5', required: true, type: 'text', value: step4Data?.las_strain_2_5 },
    { label: 'LAS - STRAIN 5% - Nº', key: 'las_strain_5', required: true, type: 'text', value: step4Data?.las_strain_5 },
    { label: 'LAS - AF (COMPRIMENTO NA TRINCA)', key: 'las_af', required: true, type: 'text', value: step4Data?.las_af },
    { label: 'LAS - FFL (FATOR DE FADIGA)', key: 'las_FFL', required: true, type: 'text', value: step4Data?.las_FFL },
    { label: 'LAS - D³', key: 'las_D', required: true, type: 'text', value: step4Data?.las_D },
  ];

  const bbrInputs = [
    { label: 'BBR - MÓDULO DE RIGIDEZ S (MPa)', key: 'bbr_S', required: true, type: 'text', adornment: 'MPa', value: step4Data?.bbr_S },
    { label: 'BBR - COEFICIENTE ANGULAR M (MPa)', key: 'bbr_m', required: true, type: 'text', adornment: 'MPa', value: step4Data?.bbr_m },
    { label: 'TEMPERATURA DO TESTE (°C)', key: 'bbr_temp', required: true, type: 'text', adornment: '°C', value: step4Data?.bbr_temp },
  ];

  const dsrTableHeaderSx = {
    fontWeight: 'bold',
    fontSize: '0.85rem',
    textAlign: 'center' as const,
    color: '#444',
    paddingBottom: '4px',
    borderBottom: '1px solid #ccc',
  };

  setNextDisabled(false);

  return (
    <>
      {/* DADOS COMERCIAIS */}
      <FlexColumnBorder title="DADOS COMERCIAIS" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {comerciaisInputs.map((input) => renderTextField(input.key, input.label, input.value, input.type, input.required))}
          </Box>
        </Box>
      </FlexColumnBorder>

      {/* LIGANTE ORIGINAL */}
      <FlexColumnBorder title="LIGANTE ORIGINAL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {originalInputs.map((input) => renderTextField(input.key, input.label, input.value, input.type, input.required, input.adornment))}
          </Box>
        </Box>
      </FlexColumnBorder>

      {/* DSR - LIGANTE ORIGINAL (dinâmico) */}
      <FlexColumnBorder title="DSR - LIGANTE ORIGINAL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              startIcon={<AddIcon />}
              onClick={() => handleAddDsr('dsr_original')}
              variant="outlined"
              size="small"
              color="success"
            >
              Adicionar Temperatura
            </Button>
          </Box>
          {(step4Data?.dsr_original || []).length === 0 && (
            <Typography sx={{ textAlign: 'center', color: 'gray', fontSize: '0.9rem', pb: 2 }}>
            Nenhuma temperatura cadastrada. Clique em &quot;Adicionar Temperatura&quot; para incluir.
            </Typography>
          )}
          {(step4Data?.dsr_original || []).length > 0 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', alignItems: 'center', pb: '20px' }}>
              <Box sx={dsrTableHeaderSx}>Temperatura do Teste (°C)</Box>
              <Box sx={dsrTableHeaderSx}>G*/sen(δ) (MPa)</Box>
              <Box />
              {(step4Data?.dsr_original || []).map((item, index) => (
                <>
                  <TextField
                    key={`dsr_orig_temp_${index}`}
                    variant="standard"
                    placeholder="Temperatura (°C)"
                    value={item.temp || ''}
                    onChange={(e) => handleDsrChange('dsr_original', index, 'temp', e.target.value)}
                    InputProps={{
                      inputProps: { style: { textTransform: 'uppercase' } }
                    }}
                  />
                  <TextField
                    key={`dsr_orig_G_${index}`}
                    variant="standard"
                    placeholder="G*/sen(δ) (MPa)"
                    value={item.G_sen || ''}
                    onChange={(e) => handleDsrChange('dsr_original', index, 'G_sen', e.target.value)}
                    InputProps={{
                      inputProps: { style: { textTransform: 'uppercase' } }
                    }}
                  />
                  <IconButton onClick={() => handleRemoveDsr('dsr_original', index)} color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                </>
              ))}
            </Box>
          )}
        </Box>
      </FlexColumnBorder>

      {/* LIGANTE ENVELHECIDO NO RTFOT (dinâmico) */}
      <FlexColumnBorder title="LIGANTE ENVELHECIDO NO RTFOT (75 MIN, 163°C)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              startIcon={<AddIcon />}
              onClick={() => handleAddDsr('dsr_rtfot')}
              variant="outlined"
              size="small"
              color="success"
            >
              Adicionar Temperatura
            </Button>
          </Box>
          {(step4Data?.dsr_rtfot || []).length === 0 && (
            <Typography sx={{ textAlign: 'center', color: 'gray', fontSize: '0.9rem', pb: 2 }}>
             Nenhuma temperatura cadastrada. Clique em &quot;Adicionar Temperatura&quot; para incluir.
            </Typography>
          )}
          {(step4Data?.dsr_rtfot || []).length > 0 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', alignItems: 'center', pb: '20px' }}>
              <Box sx={dsrTableHeaderSx}>Temperatura do Teste (°C)</Box>
              <Box sx={dsrTableHeaderSx}>G*/sen(δ) (MPa)</Box>
              <Box />
              {(step4Data?.dsr_rtfot || []).map((item, index) => (
                <>
                  <TextField
                    key={`dsr_rtfot_temp_${index}`}
                    variant="standard"
                    placeholder="Temperatura (°C)"
                    value={item.temp || ''}
                    onChange={(e) => handleDsrChange('dsr_rtfot', index, 'temp', e.target.value)}
                    InputProps={{
                      inputProps: { style: { textTransform: 'uppercase' } }
                    }}
                  />
                  <TextField
                    key={`dsr_rtfot_G_${index}`}
                    variant="standard"
                    placeholder="G*/sen(δ) (MPa)"
                    value={item.G_sen || ''}
                    onChange={(e) => handleDsrChange('dsr_rtfot', index, 'G_sen', e.target.value)}
                    InputProps={{
                      inputProps: { style: { textTransform: 'uppercase' } }
                    }}
                  />
                  <IconButton onClick={() => handleRemoveDsr('dsr_rtfot', index)} color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                </>
              ))}
            </Box>
          )}
        </Box>
      </FlexColumnBorder>

      {/* MSCR */}
      <FlexColumnBorder title="MSCR (MULTIPLE STRESS CREEP RECOVERY)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {mscrInputs.map((input) => renderTextField(input.key, input.label, input.value, input.type, input.required, input.adornment))}
          </Box>
        </Box>
      </FlexColumnBorder>

      {/* LAS */}
      <FlexColumnBorder title="LAS (LINEAR AMPLITUDE SWEEP)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Temperatura do teste - campo separado em linha própria */}
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '10px' }}>
            {renderTextField('las_temperatura', 'TEMPERATURA DO TESTE (°C)', step4Data?.las_temperatura, 'text', true, '°C')}
          </Box>
          {/* Demais campos LAS */}
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {lasInputs.map((input) => renderTextField(input.key, input.label, input.value, input.type, input.required))}
          </Box>
        </Box>
      </FlexColumnBorder>

      {/* BBR */}
      <FlexColumnBorder title="LIGANTE ENVELHECIDO NO RTFOT + PAV (20 HORAS, 100°C)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {bbrInputs.map((input) => renderTextField(input.key, input.label, input.value, input.type, input.required, input.adornment))}
          </Box>
        </Box>
      </FlexColumnBorder>

      {/* OBSERVAÇÕES */}
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
              InputProps={{
                inputProps: { style: { textTransform: 'uppercase' } }
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