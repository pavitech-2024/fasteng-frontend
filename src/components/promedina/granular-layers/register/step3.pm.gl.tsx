import { EssayPageProps } from '../../../templates/essay';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import useGranularLayersStore from '@/stores/promedina/granular-layers/granular-layers.store';
import { useEffect, useState } from 'react';

type Layer = {
  id: string;
  name: string;
  mctCoefficientC: string;
  mctIndexE: string;
  especificMass: string;
  optimalHumidity: string;
  compressionEnergy: string;
  k1: string;
  k2: string;
  k3: string;
  k4: string;
  k1psi1: string;
  k2psi2: string;
  k3psi3: string;
  k4psi4: string;
};

const createEmptyLayer = (): Layer => ({
  id: crypto.randomUUID(),
  name: '',
  mctCoefficientC: '',
  mctIndexE: '',
  especificMass: '',
  optimalHumidity: '',
  compressionEnergy: '',
  k1: '',
  k2: '',
  k3: '',
  k4: '',
  k1psi1: '',
  k2psi2: '',
  k3psi3: '',
  k4psi4: '',
});

const getTooltips = (layerName: string): Record<string, string> => {
  const baseTooltips: Record<string, string> = {
    mctCoefficientC: "Coeficiente c' da classificação MCT do material",
    mctIndexE: "Índice e' da classificação MCT do material",
    especificMass: 'Massa específica aparente seca do material obtido no ensaio de Compactação do DNIT',
    optimalHumidity: 'Umidade ótima de compactação (%)',
    compressionEnergy: 'Preencher com normal, intermediária ou modificada',
    k1: 'Modelo Constituinte: MR = k1 x (σ3)^k2 x (σd)^k3 x (I)^k4',
    k2: 'Modelo Constituinte: MR = k1 x (σ3)^k2 x (σd)^k3 x (I)^k4',
    k3: 'Modelo Constituinte: MR = k1 x (σ3)^k2 x (σd)^k3 x (I)^k4',
    k4: 'Modelo Constituinte: MR = k1 x (σ3)^k2 x (σd)^k3 x (I)^k4',
    k1psi1: 'Modelo Constituinte: εp = ψ1 x (σ3^ψ2) x (σd^ψ3) x (N^ψ4)',
    k2psi2: 'Modelo Constituinte: εp = ψ1 x (σ3^ψ2) x (σd^ψ3) x (N^ψ4)',
    k3psi3: 'Modelo Constituinte: εp = ψ1 x (σ3^ψ2) x (σd^ψ3) x (N^ψ4)',
    k4psi4: 'Modelo Constituinte: εp = ψ1 x (σ3^ψ2) x (σd^ψ3) x (N^ψ4)',
  };

  return baseTooltips;
};

const GranularLayers_step3 = ({ setNextDisabled }: EssayPageProps) => {
  const { step2Data, setData } = useGranularLayersStore();

  const [layers, setLayers] = useState<Layer[]>(
    step2Data.layers?.length ? step2Data.layers : [createEmptyLayer()]
  );

  const hasMultipleLayers = layers.length > 1;

  useEffect(() => {
    setData({ step: 1, key: 'layers', value: layers });
  }, [layers]);

  useEffect(() => {
    setNextDisabled(false);
  }, [layers, setNextDisabled]);

  const updateLayer = (id: string, key: keyof Layer, value: string) => {
    setLayers(prev =>
      prev.map(l => (l.id === id ? { ...l, [key]: value } : l))
    );
  };

  const addLayer = () => {
    setLayers(prev => [...prev, createEmptyLayer()]);
  };

  const removeLayer = (id: string) => {
    setLayers(prev => prev.filter(l => l.id !== id));
  };

  const renderField = (
    layerId: string,
    layerName: string,
    key: keyof Layer,
    label: string,
    value: string,
    type = 'text'
  ) => {
    const tips = getTooltips(layerName);
    return (
      <Box key={`${layerId}-${key}`} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          variant="standard"
          type={type}
          label={label}
          value={value || ''}
          onChange={(e) => updateLayer(layerId, key, e.target.value)}
          fullWidth
          InputProps={{
            inputProps: { style: { textTransform: 'uppercase' } }
          }}
          sx={{ flex: 1 }}
        />
        <Tooltip title={tips[key] || 'Preencher conforme especificação'} arrow>
          <IconButton size="small" sx={{ color: '#07B811' }}>
            <HelpOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };

  const renderLayers = () => (
    <>
      {layers.map((layer, index) => (
        <Box key={layer.id} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
              <TextField
                variant="standard"
                label={`NOME DA CAMADA ${index + 1}`}
                value={layer.name}
                onChange={(e) => updateLayer(layer.id, 'name', e.target.value)}
                InputProps={{ inputProps: { style: { textTransform: 'uppercase' } } }}
                sx={{ flex: 1 }}
              />
              <Tooltip title="Preencher com: Subleito, Aterro, Sub-base Granular ou Base Granular" arrow>
                <IconButton size="small" sx={{ color: '#07B811' }}>
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            {hasMultipleLayers && (
              <IconButton color="error" onClick={() => removeLayer(layer.id)}>
                <DeleteIcon />
              </IconButton>
            )}
          </Box>

          <FlexColumnBorder title="GRUPO MCT" open theme={'#07B811'}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
              {renderField(layer.id, layer.name, 'mctCoefficientC', "COEFICIENTE c'", layer.mctCoefficientC)}
              {renderField(layer.id, layer.name, 'mctIndexE', "ÍNDICE e'", layer.mctIndexE)}
              {renderField(layer.id, layer.name, 'especificMass', 'MASSA ESPECÍFICA (g/cm³)', layer.especificMass, 'number')}
              {renderField(layer.id, layer.name, 'optimalHumidity', 'UMIDADE ÓTIMA (%)', layer.optimalHumidity, 'number')}
              {renderField(layer.id, layer.name, 'compressionEnergy', 'ENERGIA DE COMPACTAÇÃO', layer.compressionEnergy)}
            </Box>
          </FlexColumnBorder>

          <FlexColumnBorder title="MÓDULO DE RESILIÊNCIA" open theme={'#07B811'}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
              {renderField(layer.id, layer.name, 'k1', 'k1', layer.k1, 'number')}
              {renderField(layer.id, layer.name, 'k2', 'k2', layer.k2, 'number')}
              {renderField(layer.id, layer.name, 'k3', 'k3', layer.k3, 'number')}
              {renderField(layer.id, layer.name, 'k4', 'k4', layer.k4, 'number')}
            </Box>
          </FlexColumnBorder>

          <FlexColumnBorder title="DEFORMAÇÃO PERMANENTE" open theme={'#07B811'}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
              {renderField(layer.id, layer.name, 'k1psi1', 'ψ1', layer.k1psi1, 'number')}
              {renderField(layer.id, layer.name, 'k2psi2', 'ψ2', layer.k2psi2, 'number')}
              {renderField(layer.id, layer.name, 'k3psi3', 'ψ3', layer.k3psi3, 'number')}
              {renderField(layer.id, layer.name, 'k4psi4', 'ψ4', layer.k4psi4, 'number')}
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

      <Button variant="outlined" startIcon={<AddIcon />} onClick={addLayer} sx={{ mt: 2, textTransform: 'uppercase' }}>
        ADICIONAR CAMADA
      </Button>

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

export default GranularLayers_step3;