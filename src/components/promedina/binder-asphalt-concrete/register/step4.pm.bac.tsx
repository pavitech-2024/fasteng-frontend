import { EssayPageProps } from '../../../templates/essay';
import { Box, TextField, IconButton, Button } from '@mui/material';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import useBinderAsphaltConcreteStore from '@/stores/promedina/binder-asphalt-concrete/binder-asphalt-concrete.store';

const BinderAsphaltConcrete_step4 = ({ setNextDisabled }: EssayPageProps) => {
  const { step4Data, setData } = useBinderAsphaltConcreteStore();

  // PROPRIEDADES GERAIS
  const geraisInputs = [
    { label: 'Tipo de CAP', value: step4Data?.tipoCAP, key: 'tipoCAP', required: true },
    { label: 'Massa Específica (g/cm³)', value: step4Data?.massaEspecifica, key: 'massaEspecifica', required: true, adornment: 'g/cm³' },
    { label: 'Resistência à Tração (MPa)', value: step4Data?.resistenciaTracao, key: 'resistenciaTracao', required: true, adornment: 'MPa' },
    { label: 'Teor de Asfalto (%)', value: step4Data?.teorAsfalto, key: 'teorAsfalto', required: true, adornment: '%' },
    { label: 'Volume de Vazios (%)', value: step4Data?.volumeVazios, key: 'volumeVazios', required: true, adornment: '%' },
    { label: 'Faixa Granulométrica', value: step4Data?.faixaGranulometrica, key: 'faixaGranulometrica', required: true },
    { label: 'TMN (mm)', value: step4Data?.tmn, key: 'tmn', required: true, adornment: 'mm' },
    { label: 'Abrasão Los Angeles (%)', value: step4Data?.abrasaoLosAngeles, key: 'abrasaoLosAngeles', required: true, adornment: '%' },
    { label: 'Flow Number (FN)', value: step4Data?.flowNumber, key: 'flowNumber', required: true },
    { label: 'Módulo de Resiliência 25°C (MPa)', value: step4Data?.moduloResiliencia, key: 'moduloResiliencia', required: true, adornment: 'MPa' },
  ];

  // CURVA DE FADIGA
  const curvaFadigaInputs = [
    { label: 'Nº de Amostras (CPs) Consideradas', value: step4Data?.curvaFadiga_n_cps, key: 'curvaFadiga_n_cps', required: true },
    { label: 'Coeficiente de Regressão (k1)', value: step4Data?.curvaFadiga_k1, key: 'curvaFadiga_k1', required: true },
    { label: 'Coeficiente de Regressão (k2)', value: step4Data?.curvaFadiga_k2, key: 'curvaFadiga_k2', required: true },
    { label: 'Coef. de Determinação do Ajuste (R²)', value: step4Data?.curvaFadiga_r2, key: 'curvaFadiga_r2', required: true },
  ];

  // CURVAS-MESTRAS
  const sigmoidalInputs = [
    { label: 'Coeficiente a', value: step4Data?.sigmoidal_a, key: 'sigmoidal_a', required: true },
    { label: 'Coeficiente b', value: step4Data?.sigmoidal_b, key: 'sigmoidal_b', required: true },
    { label: 'Coeficiente d', value: step4Data?.sigmoidal_d, key: 'sigmoidal_d', required: true },
    { label: 'Coeficiente g', value: step4Data?.sigmoidal_g, key: 'sigmoidal_g', required: true },
    { label: 'Coeficiente a1', value: step4Data?.sigmoidal_a1, key: 'sigmoidal_a1', required: true },
    { label: 'Coeficiente a2', value: step4Data?.sigmoidal_a2, key: 'sigmoidal_a2', required: true },
    { label: 'Coeficiente a3', value: step4Data?.sigmoidal_a3, key: 'sigmoidal_a3', required: true },
  ];

  // PARÂMETRO α
  const parametroAlfaInputs = [
    { label: 'Parâmetro "α" de evolução do dano', value: step4Data?.parametro_alfa, key: 'parametro_alfa', required: true },
  ];

  // COEFICIENTES G²
  const danoInputs = [
    { label: 'C₁₀', value: step4Data?.dano_C10, key: 'dano_C10', required: true },
    { label: 'C₁₁', value: step4Data?.dano_C11, key: 'dano_C11', required: true },
    { label: 'C₁₂', value: step4Data?.dano_C12, key: 'dano_C12', required: true },
    { label: 'a', value: step4Data?.dano_a, key: 'dano_a', required: true },
    { label: 'b', value: step4Data?.dano_b, key: 'dano_b', required: true },
    { label: 'Y', value: step4Data?.dano_Y, key: 'dano_Y', required: true },
    { label: 'Δ', value: step4Data?.dano_Delta, key: 'dano_Delta', required: true },
  ];

  // EINF
  const einfInputs = [
    { label: 'Einf (kPa)', value: step4Data?.einf, key: 'einf', required: true, adornment: 'kPa' },
  ];

  // PRONY
  const handleAddProny = () => {
    const newPi = [...(step4Data?.prony_pi || []), ''];
    const newEi = [...(step4Data?.prony_Ei || []), ''];
    setData({ step: 3, key: 'prony_pi', value: newPi });
    setData({ step: 3, key: 'prony_Ei', value: newEi });
  };

  const handleRemoveProny = (index: number) => {
    const newPi = [...(step4Data?.prony_pi || [])];
    const newEi = [...(step4Data?.prony_Ei || [])];
    newPi.splice(index, 1);
    newEi.splice(index, 1);
    setData({ step: 3, key: 'prony_pi', value: newPi });
    setData({ step: 3, key: 'prony_Ei', value: newEi });
  };

  // SHIFT MODEL
  const shiftModelInputs = [
    { label: 'Nº de Amostras (CPs) Consideradas', value: step4Data?.shiftModel_n_cps, key: 'shiftModel_n_cps', required: true },
    { label: 'ε₀', value: step4Data?.shiftModel_ε0, key: 'shiftModel_ε0', required: true },
    { label: 'N1', value: step4Data?.shiftModel_N1, key: 'shiftModel_N1', required: true },
    { label: 'β', value: step4Data?.shiftModel_β, key: 'shiftModel_β', required: true },
    { label: 'p1', value: step4Data?.shiftModel_p1, key: 'shiftModel_p1', required: true },
    { label: 'p2', value: step4Data?.shiftModel_p2, key: 'shiftModel_p2', required: true },
    { label: 'd1', value: step4Data?.shiftModel_d1, key: 'shiftModel_d1', required: true },
    { label: 'd2', value: step4Data?.shiftModel_d2, key: 'shiftModel_d2', required: true },
  ];

  setNextDisabled(false);

  return (
    <>
      <FlexColumnBorder title="PROPRIEDADES GERAIS" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {geraisInputs.map((input) => (
              input.adornment ? (
                <InputEndAdornment
                  key={input.key}
                  adornment={input.adornment}
                  type="text"
                  variant="standard"
                  label={input.label}
                  value={input.value?.toString() || ''}
                  required={input.required}
                  onChange={(e) => setData({ step: 3, key: input.key, value: e.target.value })}
                />
              ) : (
                <TextField
                  key={input.key}
                  variant="standard"
                  type="text"
                  label={input.label}
                  value={input.value || ''}
                  required={input.required}
                  onChange={(e) => setData({ step: 3, key: input.key, value: e.target.value })}
                />
              )
            ))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="CURVA DE FADIGA (COMPRESSÃO DIAMETRAL)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {curvaFadigaInputs.map((input) => (
              <TextField
                key={input.key}
                variant="standard"
                type="text"
                label={input.label}
                value={input.value || ''}
                required={input.required}
                onChange={(e) => setData({ step: 3, key: input.key, value: e.target.value })}
              />
            ))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="CURVAS-MESTRAS E COEFICIENTES DE TRANSLAÇÃO" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {sigmoidalInputs.map((input) => (
              <TextField
                key={input.key}
                variant="standard"
                type="text"
                label={input.label}
                value={input.value || ''}
                required={input.required}
                onChange={(e) => setData({ step: 3, key: input.key, value: e.target.value })}
              />
            ))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="PARÂMETRO α DE EVOLUÇÃO DO DANO" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {parametroAlfaInputs.map((input) => (
              <TextField
                key={input.key}
                variant="standard"
                type="text"
                label={input.label}
                value={input.value || ''}
                required={input.required}
                onChange={(e) => setData({ step: 3, key: input.key, value: e.target.value })}
              />
            ))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="COEFICIENTES DE REGRESSÃO DAS CURVAS CARACTERÍSTICAS DE DANO (G²)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {danoInputs.map((input) => (
              <TextField
                key={input.key}
                variant="standard"
                type="text"
                label={input.label}
                value={input.value || ''}
                required={input.required}
                onChange={(e) => setData({ step: 3, key: input.key, value: e.target.value })}
              />
            ))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="EINF" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {einfInputs.map((input) => (
              <InputEndAdornment
                key={input.key}
                adornment={input.adornment}
                type="text"
                variant="standard"
                label={input.label}
                value={input.value?.toString() || ''}
                required={input.required}
                onChange={(e) => setData({ step: 3, key: input.key, value: e.target.value })}
              />
            ))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="MÓDULOS DE RELAXAÇÃO (PRONY)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mb: 2 }}>
            <Button startIcon={<AddIcon />} onClick={handleAddProny} variant="outlined" size="small">
              Adicionar Par
            </Button>
          </Box>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: '1fr 1fr auto', gap: '10px', alignItems: 'center', paddingBottom: '20px' }}>
            <Box sx={{ fontWeight: 'bold' }}>pi (s)</Box>
            <Box sx={{ fontWeight: 'bold' }}>Ei (kPa)</Box>
            <Box />
            {(step4Data?.prony_pi || []).map((_, index) => (
              <>
                <TextField
                  key={`pi-${index}`}
                  variant="standard"
                  placeholder="pi (s)"
                  value={step4Data?.prony_pi?.[index] || ''}
                  onChange={(e) => {
                    const newPi = [...(step4Data?.prony_pi || [])];
                    newPi[index] = e.target.value;
                    setData({ step: 3, key: 'prony_pi', value: newPi });
                  }}
                />
                <TextField
                  key={`Ei-${index}`}
                  variant="standard"
                  placeholder="Ei (kPa)"
                  value={step4Data?.prony_Ei?.[index] || ''}
                  onChange={(e) => {
                    const newEi = [...(step4Data?.prony_Ei || [])];
                    newEi[index] = e.target.value;
                    setData({ step: 3, key: 'prony_Ei', value: newEi });
                  }}
                />
                <IconButton onClick={() => handleRemoveProny(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </>
            ))}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title="COEFICIENTES DE REGRESSÃO DO SHIFT MODEL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {shiftModelInputs.map((input) => (
              <TextField
                key={input.key}
                variant="standard"
                type="text"
                label={input.label}
                value={input.value || ''}
                required={input.required}
                onChange={(e) => setData({ step: 3, key: input.key, value: e.target.value })}
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
              value={step4Data?.observacoes || ''}
              onChange={(e) => setData({ step: 3, key: 'observacoes', value: e.target.value })}
            />
          </Box>
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default BinderAsphaltConcrete_step4;