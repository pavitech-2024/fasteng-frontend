import { EssayPageProps } from '../../../templates/essay';
import { Box, TextField, Button, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import useStabilizedLayersStore from '@/stores/promedina/stabilized-layers/stabilized-layers.store';
import { useState, useEffect } from 'react';
import { LayerCard } from '@/stores/promedina/stabilized-layers/stabilized-layers.store';

const createEmptyLayer = (): LayerCard => ({
  id: crypto.randomUUID(),
  title: '',
  teorCimento: '',
  rt: '',
  rtcd: '',
  rcs: '',
  faixaGranulometrica: '',
  massaEspecifica: '',
  umidadeOtima: '',
  energiaCompactacao: '',
  ei: '',
  ef: '',
  constanteA: '',
  constanteB: '',
  k1: '',
  k2: '',
});

const tooltips: Record<string, string> = {
  teorCimento: 'Teor ótimo de cimento da mistura estabilizada (%)',
  rt: 'Resistência à Tração da camada estabilizada (MPa)',
  rtcd: 'Resistência à Tração por Compressão Diametral - RTCD (MPa)',
  rcs: 'Resistência à Compressão Simples - RCS (MPa)',
  faixaGranulometrica: 'Faixa granulométrica do material estabilizado',
  massaEspecifica: 'Massa específica aparente seca do material obtido no ensaio de Compactação do DNIT',
  umidadeOtima: 'Umidade ótima de compactação (%)',
  energiaCompactacao: 'Preencher com normal, intermediária ou modificada',
  ei: 'Preencher os Ajustes conforme Modelo Sigmoidal: MR = MRmín + ((MRmáx - MRmín) / (1 + e^(-4 + 14 * Di)))',
  ef: 'Preencher os Ajustes conforme Modelo Sigmoidal: MR = MRmín + ((MRmáx - MRmín) / (1 + e^(-4 + 14 * Di)))',
  constanteA: 'Em caso de inexistência da informação, usar valor padrão: -4,00',
  constanteB: 'Em caso de inexistência da informação, usar valor padrão: 14,00',
  k1: 'Modelo Utilizado: 10 ^ (k1 + %RF * k2)',
  k2: 'Modelo Utilizado: 10 ^ (k1 + %RF * k2)',
};

const StabilizedLayers_step3 = ({ setNextDisabled }: EssayPageProps) => {
  const { step2Data, setData } = useStabilizedLayersStore();

  const [layers, setLayers] = useState<LayerCard[]>(
    step2Data.layers?.length ? step2Data.layers : [createEmptyLayer()]
  );

  const hasMultipleLayers = layers.length > 1;

  useEffect(() => {
    setData({ step: 1, key: 'layers', value: layers });
    setNextDisabled(false);
  }, [layers, setData, setNextDisabled]);

  const updateLayer = (id: string, key: keyof LayerCard, value: string) => {
    setLayers(prev => prev.map(l => (l.id === id ? { ...l, [key]: value } : l)));
  };

  const addLayer = () => setLayers(prev => [...prev, createEmptyLayer()]);

  const removeLayer = (id: string) => {
    setLayers(prev => {
      if (prev.length === 1) return prev;
      return prev.filter(l => l.id !== id);
    });
  };

  const renderField = (layerId: string, key: keyof LayerCard, label: string, value: string) => (
    <Box key={`${layerId}-${key}`} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <TextField
        variant="standard"
        type="text"
        label={label}
        value={value || ''}
        onChange={(e) => updateLayer(layerId, key, e.target.value)}
        InputProps={{ inputProps: { style: { textTransform: 'uppercase' } } }}
        sx={{ flex: 1 }}
      />
      <Tooltip title={tooltips[key] || 'Preencher conforme especificação'} arrow>
        <IconButton size="small" sx={{ color: '#07B811' }}>
          <HelpOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );

  const renderLayers = () => (
    <>
      {layers.map((layer, index) => (
        <Box key={layer.id} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {hasMultipleLayers && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ fontWeight: 600, textTransform: 'uppercase' }}>CAMADA {index + 1}</Box>
              <Button variant="outlined" color="error" size="small" startIcon={<DeleteIcon />} onClick={() => removeLayer(layer.id)}>REMOVER</Button>
            </Box>
          )}
          <FlexColumnBorder title="PARÂMETROS DO MATERIAL" open theme={'#07B811'}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' }, gap: 2 }}>
              {renderField(layer.id, 'teorCimento', 'TEOR ÓTIMO DE CIMENTO (%)', layer.teorCimento)}
              {renderField(layer.id, 'rt', 'RESISTÊNCIA À TRAÇÃO (MPa)', layer.rt)}
              {renderField(layer.id, 'rtcd', 'RTCD (MPa)', layer.rtcd)}
              {renderField(layer.id, 'rcs', 'RCS (MPa)', layer.rcs)}
              {renderField(layer.id, 'faixaGranulometrica', 'FAIXA GRANULOMÉTRICA', layer.faixaGranulometrica)}
              {renderField(layer.id, 'massaEspecifica', 'MASSA ESPECÍFICA (g/cm³)', layer.massaEspecifica)}
              {renderField(layer.id, 'umidadeOtima', 'UMIDADE ÓTIMA (%)', layer.umidadeOtima)}
              {renderField(layer.id, 'energiaCompactacao', 'ENERGIA DE COMPACTAÇÃO', layer.energiaCompactacao)}
            </Box>
          </FlexColumnBorder>
          <FlexColumnBorder title="MÓDULO DE RESILIÊNCIA (MPa)" open theme={'#07B811'}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
              {renderField(layer.id, 'ei', 'Ei (Módulo Inicial)', layer.ei)}
              {renderField(layer.id, 'ef', 'Ef (Módulo Final)', layer.ef)}
              {renderField(layer.id, 'constanteA', 'CONSTANTE A', layer.constanteA)}
              {renderField(layer.id, 'constanteB', 'CONSTANTE B', layer.constanteB)}
            </Box>
          </FlexColumnBorder>
          <FlexColumnBorder title="FADIGA DO MATERIAL" open theme={'#07B811'}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
              {renderField(layer.id, 'k1', 'K1 (PSI1)', layer.k1)}
              {renderField(layer.id, 'k2', 'K2 (PSI2)', layer.k2)}
            </Box>
          </FlexColumnBorder>
        </Box>
      ))}
    </>
  );

  return (
    <>
      {hasMultipleLayers ? (
        <FlexColumnBorder open theme={'#07B811'}>{renderLayers()}</FlexColumnBorder>
      ) : (
        renderLayers()
      )}
      <Button variant="outlined" startIcon={<AddIcon />} onClick={addLayer} sx={{ mt: 2, textTransform: 'uppercase' }}>ADICIONAR CAMADA</Button>
      <FlexColumnBorder title="OBSERVAÇÕES" open theme={'#07B811'}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <TextField
            fullWidth multiline rows={4} variant="outlined" label="OBSERVAÇÕES"
            value={step2Data?.observations || ''}
            onChange={(e) => setData({ step: 1, key: 'observations', value: e.target.value })}
          />
          <Tooltip title="Caso necessário, utilizar o espaço para alguma anotação que facilite a compreensão dos dados" arrow>
            <IconButton size="small" sx={{ color: '#07B811', mt: 1 }}>
              <HelpOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default StabilizedLayers_step3;