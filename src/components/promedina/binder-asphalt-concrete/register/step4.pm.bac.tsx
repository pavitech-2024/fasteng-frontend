import { EssayPageProps } from '../../../templates/essay';
import { Box, TextField, Button, IconButton, Typography, Tooltip } from '@mui/material';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import useBinderAsphaltConcreteStore from '@/stores/promedina/binder-asphalt-concrete/binder-asphalt-concrete.store';

const BinderAsphaltConcrete_step4 = ({ setNextDisabled }: EssayPageProps) => {
  const { step4Data, setData } = useBinderAsphaltConcreteStore();

  const tooltips: Record<string, string> = {
    referenciaComercial: 'Referência comercial do ligante asfáltico',
    refinaria: 'Nome da refinaria fornecedora do CAP',
    empresaDistribuidora: 'Nome da empresa distribuidora do ligante',
    dataCarregamento: 'Data de carregamento do material',
    numeroNotaFiscal: 'Número da nota fiscal do produto',
    dataNotaFiscal: 'Data de emissão da nota fiscal',
    numeroCertificado: 'Número do certificado de qualidade do ligante',
    dataCertificado: 'Data de emissão do certificado de qualidade',
    tipoCAP: 'Tipo de Cimento Asfáltico de Petróleo (ex: CAP 50/70)',
    performanceGrade: 'Grau de Desempenho (PG) do ligante conforme especificação SUPERPAVE',
    penetracao25: 'Penetração a 25°C (mm) conforme norma',
    pontoAmolecimento: 'Temperatura de ponto de amolecimento (°C)',
    viscosidadeBrookfield_135: 'centipoise (cP) - SP21, 20rpm',
    viscosidadeBrookfield_150: 'centipoise (cP) - SP21, 50rpm',
    viscosidadeBrookfield_177: 'centipoise (cP) - SP21, 100rpm',
    recuperacaoElastica: 'Percentual de recuperação elástica do ligante (%)',
    mscr_Jnr_3_2: '1/kPa',
    mscr_Jndiff: 'Diferença percentual entre os valores de Jnr medidos a 3,2kPa e 1kPa',
    critérioRuptura: 'Preencher com: da/dN; PSE ou outro/especificar',
    las_strain_1_25: 'Ver nota nas observações da caixa',
    las_strain_2_5: 'Ver nota nas observações da caixa',
    las_strain_5: 'Ver nota nas observações da caixa',
    las_af: 'Ver nota nas observações da caixa',
    las_FFL: 'Ver nota nas observações da caixa',
    las_D: 'Critério de falha do modelo S-VECD do ligante asfáltico',
    las_temperatura: 'Temperatura de realização do ensaio LAS (°C)',
    bbr_S: 'MPa',
    bbr_m: 'MPa',
    bbr_temp: 'Temperatura de realização do ensaio BBR (°C)',
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
            value={value?.toString() || ''}
            onChange={(e) => setData({ step: 3, key, value: e.target.value })}
            sx={{ flex: 1 }}
          />
          <Tooltip title={tooltips[key] || 'Preencher conforme especificação'} arrow>
            <IconButton size="small" sx={{ color: '#07B811' }}>
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
          onChange={(e) => setData({ step: 3, key, value: e.target.value })}
          InputProps={{
            inputProps: { style: { textTransform: 'uppercase' } }
          }}
          sx={{ flex: 1 }}
        />
        <Tooltip title={tooltips[key] || 'Preencher conforme especificação'} arrow>
          <IconButton size="small" sx={{ color: '#07B811' }}>
            <HelpOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };

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

  const comerciaisInputs = [
    { label: 'REFERÊNCIA COMERCIAL', key: 'referenciaComercial', type: 'text', value: step4Data?.referenciaComercial },
    { label: 'REFINARIA', key: 'refinaria', type: 'text', value: step4Data?.refinaria },
    { label: 'EMPRESA DISTRIBUIDORA', key: 'empresaDistribuidora', type: 'text', value: step4Data?.empresaDistribuidora },
    { label: 'DATA DO CARREGAMENTO', key: 'dataCarregamento', type: 'date', value: step4Data?.dataCarregamento },
    { label: 'NÚMERO DA NOTA FISCAL', key: 'numeroNotaFiscal', type: 'text', value: step4Data?.numeroNotaFiscal },
    { label: 'DATA DA NOTA FISCAL', key: 'dataNotaFiscal', type: 'date', value: step4Data?.dataNotaFiscal },
    { label: 'NÚMERO DO CERTIFICADO', key: 'numeroCertificado', type: 'text', value: step4Data?.numeroCertificado },
    { label: 'DATA DO CERTIFICADO', key: 'dataCertificado', type: 'date', value: step4Data?.dataCertificado },
  ];

  const originalInputs = [
    { label: 'TIPO DE CAP', key: 'tipoCAP', type: 'text', value: step4Data?.tipoCAP },
    { label: 'PERFORMANCE GRADE (PG)', key: 'performanceGrade', type: 'text', value: step4Data?.performanceGrade },
    { label: 'PENETRAÇÃO (mm) - 25°C', key: 'penetracao25', type: 'text', adornment: 'mm', value: step4Data?.penetracao25 },
    { label: 'PONTO DE AMOLECIMENTO (°C)', key: 'pontoAmolecimento', type: 'text', adornment: '°C', value: step4Data?.pontoAmolecimento },
    { label: 'VISCOSIDADE BROOKFIELD 135°C (cP)', key: 'viscosidadeBrookfield_135', type: 'text', adornment: 'cP', value: step4Data?.viscosidadeBrookfield_135 },
    { label: 'VISCOSIDADE BROOKFIELD 150°C (cP)', key: 'viscosidadeBrookfield_150', type: 'text', adornment: 'cP', value: step4Data?.viscosidadeBrookfield_150 },
    { label: 'VISCOSIDADE BROOKFIELD 177°C (cP)', key: 'viscosidadeBrookfield_177', type: 'text', adornment: 'cP', value: step4Data?.viscosidadeBrookfield_177 },
    { label: 'RECUPERAÇÃO ELÁSTICA (%)', key: 'recuperacaoElastica', type: 'text', adornment: '%', value: step4Data?.recuperacaoElastica },
  ];

  const mscrInputs = [
    { label: 'MSCR - JNR 3,2 (1/KPA)', key: 'mscr_Jnr_3_2', type: 'text', adornment: '1/kPa', value: step4Data?.mscr_Jnr_3_2 },
    { label: 'MSCR - JNDIFF (%)', key: 'mscr_Jndiff', type: 'text', adornment: '%', value: step4Data?.mscr_Jndiff },
  ];

  const lasInputs = [
    { label: 'LAS - STRAIN 1,25% - Nf³', key: 'las_strain_1_25', type: 'text', value: step4Data?.las_strain_1_25 },
    { label: 'LAS - STRAIN 2,5% - Nf³', key: 'las_strain_2_5', type: 'text', value: step4Data?.las_strain_2_5 },
    { label: 'LAS - STRAIN 5% - Nf³', key: 'las_strain_5', type: 'text', value: step4Data?.las_strain_5 },
    { label: 'LAS - af ¹', key: 'las_af', type: 'text', value: step4Data?.las_af },
    { label: 'LAS - FFL ²', key: 'las_FFL', type: 'text', value: step4Data?.las_FFL },
    { label: 'LAS - DR', key: 'las_D', type: 'text', value: step4Data?.las_D },
  ];

  const bbrInputs = [
    { label: 'BBR - MÓDULO DE RIGIDEZ S (MPa)', key: 'bbr_S', type: 'text', adornment: 'MPa', value: step4Data?.bbr_S },
    { label: 'BBR - COEFICIENTE ANGULAR m (MPa)', key: 'bbr_m', type: 'text', adornment: 'MPa', value: step4Data?.bbr_m },
    { label: 'TEMPERATURA DO TESTE (°C)', key: 'bbr_temp', type: 'text', adornment: '°C', value: step4Data?.bbr_temp },
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
      <FlexColumnBorder title="DADOS COMERCIAIS" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {comerciaisInputs.map((input) => renderTextField(input.key, input.label, input.value, input.type))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="LIGANTE ORIGINAL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {originalInputs.map((input) => renderTextField(input.key, input.label, input.value, input.type, input.adornment))}
          </Box>
        </Box>
      </FlexColumnBorder>

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
              <Box sx={dsrTableHeaderSx}>│G*│/sen(δ) (MPa)</Box>
              <Box />
              {(step4Data?.dsr_original || []).map((item, index) => (
                <Box key={`dsr_orig_row_${index}`} sx={{ display: 'contents' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      variant="standard"
                      value={item.temp || ''}
                      onChange={(e) => handleDsrChange('dsr_original', index, 'temp', e.target.value)}
                      InputProps={{ inputProps: { style: { textTransform: 'uppercase' } } }}
                      sx={{ flex: 1 }}
                    />
                    <Tooltip title="Temperatura do teste DSR (°C)" arrow>
                      <IconButton size="small" sx={{ color: '#07B811' }}>
                        <HelpOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      variant="standard"
                      value={item.G_sen || ''}
                      onChange={(e) => handleDsrChange('dsr_original', index, 'G_sen', e.target.value)}
                      InputProps={{ inputProps: { style: { textTransform: 'uppercase' } } }}
                      sx={{ flex: 1 }}
                    />
                    <Tooltip title="kPa" arrow>
                      <IconButton size="small" sx={{ color: '#07B811' }}>
                        <HelpOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <IconButton onClick={() => handleRemoveDsr('dsr_original', index)} color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </FlexColumnBorder>

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
              <Box sx={dsrTableHeaderSx}>│G*│/sen(δ) (MPa)</Box>
              <Box />
              {(step4Data?.dsr_rtfot || []).map((item, index) => (
                <Box key={`dsr_rtfot_row_${index}`} sx={{ display: 'contents' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      variant="standard"
                      value={item.temp || ''}
                      onChange={(e) => handleDsrChange('dsr_rtfot', index, 'temp', e.target.value)}
                      InputProps={{ inputProps: { style: { textTransform: 'uppercase' } } }}
                      sx={{ flex: 1 }}
                    />
                    <Tooltip title="Temperatura do teste DSR após RTFOT (°C)" arrow>
                      <IconButton size="small" sx={{ color: '#07B811' }}>
                        <HelpOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      variant="standard"
                      value={item.G_sen || ''}
                      onChange={(e) => handleDsrChange('dsr_rtfot', index, 'G_sen', e.target.value)}
                      InputProps={{ inputProps: { style: { textTransform: 'uppercase' } } }}
                      sx={{ flex: 1 }}
                    />
                    <Tooltip title="kPa" arrow>
                      <IconButton size="small" sx={{ color: '#07B811' }}>
                        <HelpOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <IconButton onClick={() => handleRemoveDsr('dsr_rtfot', index)} color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="MSCR (MULTIPLE STRESS CREEP RECOVERY)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {mscrInputs.map((input) => renderTextField(input.key, input.label, input.value, input.type, input.adornment))}
          </Box>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {renderTextField('critérioRuptura', 'CRITÉRIO DE RUPTURA - da/dN (mm/cycle)', step4Data?.critérioRuptura, 'text')}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="LAS (LINEAR AMPLITUDE SWEEP)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '10px' }}>
            {renderTextField('las_temperatura', 'TEMPERATURA DO TESTE (°C)', step4Data?.las_temperatura, 'text', '°C')}
          </Box>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {lasInputs.map((input) => renderTextField(input.key, input.label, input.value, input.type))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="LIGANTE ENVELHECIDO NO RTFOT + PAV (20 HORAS, 100°C)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {bbrInputs.map((input) => renderTextField(input.key, input.label, input.value, input.type, input.adornment))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="OBSERVAÇÕES" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: '1fr', gap: '10px 20px', paddingBottom: '20px' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                label="OBSERVAÇÕES"
                value={step4Data?.observacoes || ''}
                onChange={(e) => setData({ step: 3, key: 'observacoes', value: e.target.value })}
                InputProps={{
                  inputProps: { style: { textTransform: 'uppercase' } }
                }}
              />
              <Tooltip title="Caso necessário, utilizar o espaço para alguma anotação que facilite a compreensão dos dados" arrow>
                <IconButton size="small" sx={{ color: '#07B811', mt: 1 }}>
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.8rem' }}>
              ¹af: comprimento na trinca - critério de falha proposto por Hintz e Bahia (2013); ²FFL: Fator de fadiga de ligante - critério proposto por Nascimento (2015); ³Nf: ESALs (indicador de volume de tráfego)
            </Typography>
          </Box>
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default BinderAsphaltConcrete_step4;