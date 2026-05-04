import { EssayPageProps } from '../../../templates/essay';
import {
  Box,
  TextField,
  Button,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
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

const GranularLayers_step3 = ({ setNextDisabled }: EssayPageProps) => {
  const { step2Data, setData } = useGranularLayersStore();

  const [layers, setLayers] = useState<Layer[]>(
    step2Data.layers?.length ? step2Data.layers : [createEmptyLayer()]
  );

  const hasMultipleLayers = layers.length > 1;

  // salvar no store
  useEffect(() => {
    setData({ step: 1, key: 'layers', value: layers });
  }, [layers]);

  // validação
  useEffect(() => {
    const isValid = layers.every(layer =>
      Object.entries(layer).every(([key, value]) => {
        if (key === 'id') return true;
        return value !== '';
      })
    );

    setNextDisabled(!isValid);
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
    key: keyof Layer,
    label: string,
    value: string,
    type = 'text'
  ) => (
    <TextField
      key={`${layerId}-${key}`}
      variant="standard"
      type={type}
      label={label}
      value={value || ''}
      onChange={(e) => updateLayer(layerId, key, e.target.value)}
      fullWidth
      InputProps={{
        inputProps: { style: { textTransform: 'uppercase' } }
      }}
    />
  );

  const renderLayers = () => (
    <>
      {layers.map((layer, index) => (
        <Box
          key={layer.id}
          sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
        >
          {/* HEADER */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <TextField
              variant="standard"
              label={`NOME DA CAMADA ${index + 1}`}
              value={layer.name}
              onChange={(e) =>
                updateLayer(layer.id, 'name', e.target.value)
              }
              InputProps={{
                inputProps: { style: { textTransform: 'uppercase' } }
              }}
            />

            {hasMultipleLayers && (
              <IconButton
                color="error"
                onClick={() => removeLayer(layer.id)}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>

          {/* MCT */}
          <FlexColumnBorder title="GRUPO MCT" open theme={'#07B811'}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
              {renderField(layer.id, 'mctCoefficientC', "COEFICIENTE c'", layer.mctCoefficientC)}
              {renderField(layer.id, 'mctIndexE', "ÍNDICE e'", layer.mctIndexE)}
              {renderField(layer.id, 'especificMass', 'MASSA ESPECÍFICA (g/cm³)', layer.especificMass, 'number')}
              {renderField(layer.id, 'optimalHumidity', 'UMIDADE ÓTIMA (%)', layer.optimalHumidity, 'number')}
              {renderField(layer.id, 'compressionEnergy', 'ENERGIA DE COMPACTAÇÃO', layer.compressionEnergy)}
            </Box>
          </FlexColumnBorder>

          {/* RESILIÊNCIA */}
          <FlexColumnBorder title="MÓDULO DE RESILIÊNCIA" open theme={'#07B811'}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
              {renderField(layer.id, 'k1', 'k1', layer.k1, 'number')}
              {renderField(layer.id, 'k2', 'k2', layer.k2, 'number')}
              {renderField(layer.id, 'k3', 'k3', layer.k3, 'number')}
              {renderField(layer.id, 'k4', 'k4', layer.k4, 'number')}
            </Box>
          </FlexColumnBorder>

          {/* DEFORMAÇÃO */}
          <FlexColumnBorder title="DEFORMAÇÃO PERMANENTE" open theme={'#07B811'}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
              {renderField(layer.id, 'k1psi1', 'k1/psi', layer.k1psi1, 'number')}
              {renderField(layer.id, 'k2psi2', 'k2/psi', layer.k2psi2, 'number')}
              {renderField(layer.id, 'k3psi3', 'k3/psi', layer.k3psi3, 'number')}
              {renderField(layer.id, 'k4psi4', 'k4/psi', layer.k4psi4, 'number')}
            </Box>
          </FlexColumnBorder>
        </Box>
      ))}
    </>
  );

  return (
    <>
      {hasMultipleLayers ? (
        <FlexColumnBorder open theme={'#07B811'}>
          {renderLayers()}
        </FlexColumnBorder>
      ) : (
        renderLayers()
      )}

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={addLayer}
        sx={{ mt: 2, textTransform: 'uppercase' }}
      >
        ADICIONAR CAMADA
      </Button>

      {/* OBS */}
   <FlexColumnBorder title="OBSERVAÇÕES" open theme={'#07B811'}>
  <TextField
    fullWidth
    multiline
    rows={4}
    variant="outlined"
    label="OBSERVAÇÕES"
    value={step2Data?.observations || ''}
    onChange={(e) =>
      setData({ step: 1, key: 'observations', value: e.target.value })
    }
  />
</FlexColumnBorder>
    </>
  );
};

export default GranularLayers_step3;