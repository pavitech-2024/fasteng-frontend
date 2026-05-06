import { EssayPageProps } from '../../../templates/essay';
import { Box, TextField, IconButton, Button, Tooltip } from '@mui/material';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import useBinderAsphaltConcreteStore from '@/stores/promedina/binder-asphalt-concrete/binder-asphalt-concrete.store';

const BinderAsphaltConcrete_step5 = ({ setNextDisabled }: EssayPageProps) => {
  const { step5Data, setData } = useBinderAsphaltConcreteStore();

  const tooltips: Record<string, string> = {
    tipoCAP: 'Tipo de CAP utilizado na mistura (ex: CAP 50/70)',
    massaEspecifica: 'Massa específica aparente seca da mistura asfáltica',
    resistenciaTracao: 'Resistência à Tração (RT) da mistura (MPa)',
    teorAsfalto: 'Teor de asfalto da mistura (%)',
    volumeVazios: 'Volume de vazios da mistura compactada (%)',
    faixaGranulometrica: 'Faixa granulométrica da mistura (ex: Faixa C DNIT)',
    tmn: 'Tamanho Máximo Nominal do agregado (mm)',
    abrasaoLosAngeles: 'Resultado do ensaio de Abrasão Los Angeles (%)',
    flowNumber: 'Flow Number (FN) do ensaio de creep dinâmico',
    moduloResiliencia: 'Módulo de Resiliência a 25°C (MPa)',
    curvaFadiga_n_cps: 'Número de corpos de prova ensaiados na fadiga',
    curvaFadiga_k1: 'Modelo Utilizado: k1 * (εt ^ k2)',
    curvaFadiga_k2: 'Modelo Utilizado: k1 * (εt ^ k2)',
    curvaFadiga_r2: 'Preencher com o R² obtido na regressão do modelo de fadiga',
    sigmoidal_a: 'Coeficiente "a" da função sigmoidal - curva mestra do módulo dinâmico |E*|',
    sigmoidal_b: 'Coeficiente "b" da função sigmoidal - curva mestra do módulo dinâmico |E*|',
    sigmoidal_d: 'Coeficiente "d" da função sigmoidal - curva mestra do módulo dinâmico |E*|',
    sigmoidal_g: 'Coeficiente "g" da função sigmoidal - curva mestra do módulo dinâmico |E*|',
    sigmoidal_a1: 'Coeficiente a1 do polinômio de shift factor (translação tempo-temperatura)',
    sigmoidal_a2: 'Coeficiente a2 do polinômio de shift factor (translação tempo-temperatura)',
    sigmoidal_a3: 'Coeficiente a3 do polinômio de shift factor (translação tempo-temperatura)',
    parametro_alfa: 'Parâmetro α de evolução do dano da mistura asfáltica',
    dano_C10: 'Preencher com a soma do erro quadrático obtido na modelagem da curva C vs S pelo modelo de potência',
    dano_C11: 'Preencher com a soma do erro quadrático obtido na modelagem da curva C vs S pelo modelo de potência',
    dano_C12: 'Preencher com a soma do erro quadrático obtido na modelagem da curva C vs S pelo modelo de potência',
    dano_a: 'Preencher com a soma do erro quadrático obtido na modelagem da curva C vs S pelo modelo exponencial',
    dano_b: 'Preencher com a soma do erro quadrático obtido na modelagem da curva C vs S pelo modelo exponencial',
    dano_Y: 'Preencher com o R² obtido na regressão do modelo GR vs Nfad',
    dano_Delta: 'Preencher com o R² obtido na regressão do modelo GR vs Nfad',
    einf: 'Menor módulo estimado pelo modelo matemático utilizado no ajuste da curva mestra do ensaio de módulo complexo',
    shiftModel_n_cps: 'Número de CPs considerados na regressão do shift model',
    shiftModel_ε0: 'Parâmetro ε0 do shift model',
    shiftModel_N1: 'Parâmetro N1 do shift model',
    shiftModel_β: 'Parâmetro β do shift model',
    shiftModel_p1: 'Parâmetro p1 do shift model',
    shiftModel_p2: 'Parâmetro p2 do shift model',
    shiftModel_d1: 'Parâmetro d1 do shift model',
    shiftModel_d2: 'Parâmetro d2 do shift model',
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
            onChange={(e) => setData({ step: 4, key, value: e.target.value })}
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
          onChange={(e) => setData({ step: 4, key, value: e.target.value })}
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

  const geraisInputs = [
    { label: 'TIPO DE CAP', value: step5Data?.tipoCAP, key: 'tipoCAP' },
    { label: 'MASSA ESPECÍFICA (g/cm³)', value: step5Data?.massaEspecifica, key: 'massaEspecifica', adornment: 'g/cm³' },
    { label: 'RESISTÊNCIA À TRAÇÃO (MPa)', value: step5Data?.resistenciaTracao, key: 'resistenciaTracao', adornment: 'MPa' },
    { label: 'TEOR DE ASFALTO (%)', value: step5Data?.teorAsfalto, key: 'teorAsfalto', adornment: '%' },
    { label: 'VOLUME DE VAZIOS (%)', value: step5Data?.volumeVazios, key: 'volumeVazios', adornment: '%' },
    { label: 'FAIXA GRANULOMÉTRICA', value: step5Data?.faixaGranulometrica, key: 'faixaGranulometrica' },
    { label: 'TMN (mm)', value: step5Data?.tmn, key: 'tmn', adornment: 'mm' },
    { label: 'ABRASÃO LOS ANGELES (%)', value: step5Data?.abrasaoLosAngeles, key: 'abrasaoLosAngeles', adornment: '%' },
    { label: 'FLOW NUMBER (FN)', value: step5Data?.flowNumber, key: 'flowNumber' },
    { label: 'MÓDULO DE RESILIÊNCIA 25°C (MPa)', value: step5Data?.moduloResiliencia, key: 'moduloResiliencia', adornment: 'MPa' },
  ];

  const curvaFadigaInputs = [
    { label: 'Nº DE AMOSTRAS (CPs) CONSIDERADAS', value: step5Data?.curvaFadiga_n_cps, key: 'curvaFadiga_n_cps' },
    { label: 'COEFICIENTE DE REGRESSÃO (k1)', value: step5Data?.curvaFadiga_k1, key: 'curvaFadiga_k1' },
    { label: 'COEFICIENTE DE REGRESSÃO (k2)', value: step5Data?.curvaFadiga_k2, key: 'curvaFadiga_k2' },
    { label: 'COEF. DE DETERMINAÇÃO DO AJUSTE (R²)', value: step5Data?.curvaFadiga_r2, key: 'curvaFadiga_r2' },
  ];

  const sigmoidalInputs = [
    { label: 'COEFICIENTE a', value: step5Data?.sigmoidal_a, key: 'sigmoidal_a' },
    { label: 'COEFICIENTE b', value: step5Data?.sigmoidal_b, key: 'sigmoidal_b' },
    { label: 'COEFICIENTE d', value: step5Data?.sigmoidal_d, key: 'sigmoidal_d' },
    { label: 'COEFICIENTE g', value: step5Data?.sigmoidal_g, key: 'sigmoidal_g' },
    { label: 'COEFICIENTE a1', value: step5Data?.sigmoidal_a1, key: 'sigmoidal_a1' },
    { label: 'COEFICIENTE a2', value: step5Data?.sigmoidal_a2, key: 'sigmoidal_a2' },
    { label: 'COEFICIENTE a3', value: step5Data?.sigmoidal_a3, key: 'sigmoidal_a3' },
  ];

  const parametroAlfaInputs = [
    { label: 'PARÂMETRO "α" DE EVOLUÇÃO DO DANO', value: step5Data?.parametro_alfa, key: 'parametro_alfa' },
  ];

  const danoInputs = [
    { label: 'C₁₀ (Soma Erro Quadrático - Potência)', value: step5Data?.dano_C10, key: 'dano_C10' },
    { label: 'C₁₁ (Soma Erro Quadrático - Potência)', value: step5Data?.dano_C11, key: 'dano_C11' },
    { label: 'C₁₂ (Soma Erro Quadrático - Potência)', value: step5Data?.dano_C12, key: 'dano_C12' },
    { label: 'a (Soma Erro Quadrático - Exponencial)', value: step5Data?.dano_a, key: 'dano_a' },
    { label: 'b (Soma Erro Quadrático - Exponencial)', value: step5Data?.dano_b, key: 'dano_b' },
    { label: 'Y (Coef. Determinação R²)', value: step5Data?.dano_Y, key: 'dano_Y' },
    { label: 'Δ (Coef. Determinação R²)', value: step5Data?.dano_Delta, key: 'dano_Delta' },
  ];

  const einfInputs = [
    { label: 'EINF (kPa)', value: step5Data?.einf, key: 'einf', adornment: 'kPa' },
  ];

  const handleAddProny = () => {
    const newPi = [...(step5Data?.prony_pi || []), ''];
    const newEi = [...(step5Data?.prony_Ei || []), ''];
    setData({ step: 4, key: 'prony_pi', value: newPi });
    setData({ step: 4, key: 'prony_Ei', value: newEi });
  };

  const handleRemoveProny = (index: number) => {
    const newPi = [...(step5Data?.prony_pi || [])];
    const newEi = [...(step5Data?.prony_Ei || [])];
    newPi.splice(index, 1);
    newEi.splice(index, 1);
    setData({ step: 4, key: 'prony_pi', value: newPi });
    setData({ step: 4, key: 'prony_Ei', value: newEi });
  };

  const shiftModelInputs = [
    { label: 'Nº DE AMOSTRAS (CPs) CONSIDERADAS', value: step5Data?.shiftModel_n_cps, key: 'shiftModel_n_cps' },
    { label: 'ε₀', value: step5Data?.shiftModel_ε0, key: 'shiftModel_ε0' },
    { label: 'N1', value: step5Data?.shiftModel_N1, key: 'shiftModel_N1' },
    { label: 'β', value: step5Data?.shiftModel_β, key: 'shiftModel_β' },
    { label: 'p1', value: step5Data?.shiftModel_p1, key: 'shiftModel_p1' },
    { label: 'p2', value: step5Data?.shiftModel_p2, key: 'shiftModel_p2' },
    { label: 'd1', value: step5Data?.shiftModel_d1, key: 'shiftModel_d1' },
    { label: 'd2', value: step5Data?.shiftModel_d2, key: 'shiftModel_d2' },
  ];

  setNextDisabled(false);

  return (
    <>
      <FlexColumnBorder title="PROPRIEDADES GERAIS" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {geraisInputs.map((input) => renderTextField(input.key, input.label, input.value, 'text', input.adornment))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="CURVA DE FADIGA (COMPRESSÃO DIAMETRAL)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {curvaFadigaInputs.map((input) => renderTextField(input.key, input.label, input.value, 'text'))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="CURVAS-MESTRAS E COEFICIENTES DE TRANSLAÇÃO" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {sigmoidalInputs.map((input) => renderTextField(input.key, input.label, input.value, 'text'))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="PARÂMETRO α DE EVOLUÇÃO DO DANO" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {parametroAlfaInputs.map((input) => renderTextField(input.key, input.label, input.value, 'text'))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="COEFICIENTES DE REGRESSÃO DAS CURVAS CARACTERÍSTICAS DE DANO (G²)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {danoInputs.map((input) => renderTextField(input.key, input.label, input.value, 'text'))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="EINF" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {einfInputs.map((input) => renderTextField(input.key, input.label, input.value, 'text', input.adornment))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="MÓDULOS DE RELAXAÇÃO (PRONY)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mb: 2 }}>
            <Button startIcon={<AddIcon />} onClick={handleAddProny} variant="outlined" size="small" sx={{ textTransform: 'uppercase' }}>
              ADICIONAR PAR
            </Button>
          </Box>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: '1fr 1fr auto', gap: '10px', alignItems: 'center', paddingBottom: '20px' }}>
            <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>pi (s)</Box>
            <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Ei (kPa)</Box>
            <Box />
            {(step5Data?.prony_pi || []).map((_, index) => (
              <Box key={`prony_row_${index}`} sx={{ display: 'contents' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    variant="standard"
                    value={step5Data?.prony_pi?.[index] || ''}
                    onChange={(e) => {
                      const newPi = [...(step5Data?.prony_pi || [])];
                      newPi[index] = e.target.value;
                      setData({ step: 4, key: 'prony_pi', value: newPi });
                    }}
                    InputProps={{ inputProps: { style: { textTransform: 'uppercase' } } }}
                    sx={{ flex: 1 }}
                  />
                  <Tooltip title="Colocar os coeficientes de ajuste do módulo de relaxação. O número de elementos e os tempos adotados na série de Prony pode variar de acordo com a realização do ensaio" arrow>
                    <IconButton size="small" sx={{ color: '#07B811' }}>
                      <HelpOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    variant="standard"
                    value={step5Data?.prony_Ei?.[index] || ''}
                    onChange={(e) => {
                      const newEi = [...(step5Data?.prony_Ei || [])];
                      newEi[index] = e.target.value;
                      setData({ step: 4, key: 'prony_Ei', value: newEi });
                    }}
                    InputProps={{ inputProps: { style: { textTransform: 'uppercase' } } }}
                    sx={{ flex: 1 }}
                  />
                  <Tooltip title="Colocar os coeficientes de ajuste do módulo de relaxação. O número de elementos e os tempos adotados na série de Prony pode variar de acordo com a realização do ensaio" arrow>
                    <IconButton size="small" sx={{ color: '#07B811' }}>
                      <HelpOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <IconButton onClick={() => handleRemoveProny(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="COEFICIENTES DE REGRESSÃO DO SHIFT MODEL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {shiftModelInputs.map((input) => renderTextField(input.key, input.label, input.value, 'text'))}
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
                value={step5Data?.observacoes || ''}
                onChange={(e) => setData({ step: 4, key: 'observacoes', value: e.target.value })}
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
          </Box>
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default BinderAsphaltConcrete_step5;