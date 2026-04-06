import { EssayPageProps } from '../../../templates/essay';
import { t } from 'i18next';
import { Box, TextField, Grid, Divider, Typography } from '@mui/material';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import useStabilizedLayersStore from '@/stores/promedina/stabilized-layers/stabilized-layers.store';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { useEffect } from 'react';

const StabilizedLayers_step1 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { generalData, setData } = useStabilizedLayersStore();

  // CAMPOS PRINCIPAIS (já existentes)
  const mainInputs = [
    { label: 'NOME DA CAMADA GRANULAR', value: generalData.name, key: 'name', required: true },
    { label: 'ZONA', value: generalData.zone, key: 'zone', required: true },
    { label: 'RODOVIA', value: generalData.highway, key: 'highway', required: true },
    { label: 'CAMADA', value: generalData.layer, key: 'layer', required: true },
    { label: 'CIDADE/UF', value: generalData.cityState, key: 'cityState', required: true },
    {
      label: 'VELOCIDADE DIRETRIZ',
      value: generalData.guideLineSpeed,
      key: 'guideLineSpeed',
      required: true,
    },
  ];

  // NOVOS CAMPOS - INFORMAÇÕES DA CAMADA ESTABILIZADA
  const stabilizedLayerInputs = [
    { label: 'EMPRESA RESPONSÁVEL PELO SERVIÇO', value: generalData.companyResponsible, key: 'companyResponsible', required: false },
    { label: 'TIPO DE REVESTIMENTO', value: generalData.coatingType, key: 'coatingType', required: false },
    { label: 'ORDEM DE SERVIÇO / CONTRATO', value: generalData.serviceOrder, key: 'serviceOrder', required: false },
    { label: 'NÚMERO DA CAMADA', value: generalData.layerNumber, key: 'layerNumber', required: false },
  ];

  // CAMPOS DE ESPESSURAS
  const thicknessInputs = [
    { label: 'CLASSE DE REFORÇO DO SUBLEITO', value: generalData.subgradeClass, key: 'subgradeClass', required: false },
    { label: 'ESPESSURA DO REFORÇO DO SUBLEITO (cm)', value: generalData.subgradeThickness, key: 'subgradeThickness', required: false, adornment: 'cm' },
    { label: 'ESPESSURA DA BASE GRANULAR (cm)', value: generalData.granularBaseThickness, key: 'granularBaseThickness', required: false, adornment: 'cm' },
    { label: 'ESPESSURA DA CAMADA ESTABILIZADA (cm)', value: generalData.stabilizedLayerThickness, key: 'stabilizedLayerThickness', required: false, adornment: 'cm' },
  ];

  // CAMPOS DE DATAS E OBSERVAÇÕES
  const infoInputs = [
    { label: 'DATA DE INÍCIO', value: generalData.startDate, key: 'startDate', required: false, type: 'date' },
    { label: 'DATA DE TÉRMINO', value: generalData.endDate, key: 'endDate', required: false, type: 'date' },
    { label: 'CLIMA / TEMPERATURA MÉDIA', value: generalData.weather, key: 'weather', required: false },
    { label: 'OBSERVAÇÕES DO SUBLEITO', value: generalData.subgradeObs, key: 'subgradeObs', required: false, multiline: true },
  ];

  useEffect(() => {
    if (generalData?.name !== null && generalData?.name !== '') setNextDisabled(false);
    else setNextDisabled(true);
  }, [generalData.name]);

  // Função para renderizar campos em grid responsivo
  const renderGridFields = (fields: any[], columns = 2) => (
    <Box sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
      width: '100%'
    }}>
      {fields.map((input) => (
        <Box key={input.key} sx={{ 
          flex: `0 0 calc(${100/columns}% - 20px)`,
          minWidth: '250px'
        }}>
          {input.adornment ? (
            <InputEndAdornment
              adornment={input.adornment}
              type="number"
              variant="standard"
              fullWidth
              value={input.value?.toString() || ''}
              label={input.label}
              required={input.required}
              onChange={(e) => setData({ step: 0, key: input.key, value: e.target.value })}
            />
          ) : input.type === 'date' ? (
            <TextField
              variant="standard"
              fullWidth
              type="date"
              label={input.label}
              value={input.value || ''}
              required={input.required}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setData({ step: 0, key: input.key, value: e.target.value })}
            />
          ) : (
            <TextField
              variant="standard"
              fullWidth
              multiline={input.multiline || false}
              rows={input.multiline ? 3 : 1}
              type={input.type || 'text'}
              label={input.label}
              value={input.value || ''}
              required={input.required}
              onChange={(e) => setData({ step: 0, key: input.key, value: e.target.value })}
            />
          )}
        </Box>
      ))}
    </Box>
  );

  return (
    <>
      {/* SEÇÃO 1 - DADOS PRINCIPAIS */}
      <FlexColumnBorder title="DADOS PRINCIPAIS" open={true} theme={'#07B811'}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              flexWrap: 'wrap',
              '& > *': {
                width: 'calc(50% - 10px)',
              },
              gap: '5px 20px',
              marginBottom: '10px',
              marginTop: '-20px',
            }}
          >
            {mainInputs.map((input) => {
              if (input.key === 'guideLineSpeed') {
                return (
                  <InputEndAdornment
                    adornment={'km/h'}
                    key={input.key}
                    type="number"
                    variant="standard"
                    value={generalData.guideLineSpeed?.toString()}
                    label={input.label}
                    required={input.required}
                    onChange={(e) => setData({ step: 0, key: input.key, value: e.target.value })}
                  />
                );
              } else {
                return (
                  <TextField
                    key={input.key}
                    variant="standard"
                    label={input.label}
                    value={input.value || ''}
                    required={input.required}
                    onChange={(e) => setData({ step: 0, key: input.key, value: e.target.value })}
                  />
                );
              }
            })}
          </Box>
          
          {/* CAMPO OBSERVAÇÕES GERAIS */}
          <Box sx={{ width: '100%', mt: 2 }}>
            <TextField
              variant="standard"
              multiline
              rows={3}
              fullWidth
              label="OBSERVAÇÕES GERAIS"
              value={generalData.observations || ''}
              required={false}
              onChange={(e) => setData({ step: 0, key: 'observations', value: e.target.value })}
            />
          </Box>
        </Box>
      </FlexColumnBorder>

      {/* SEÇÃO 2 - INFORMAÇÕES DA CAMADA ESTABILIZADA */}
      <Box sx={{ mt: 3 }}>
        <FlexColumnBorder title="INFORMAÇÕES DA CAMADA ESTABILIZADA" open={true} theme={'#07B811'}>
          <Box sx={{ width: '100%', p: 1 }}>
            {renderGridFields(stabilizedLayerInputs, 2)}
          </Box>
        </FlexColumnBorder>
      </Box>

      {/* SEÇÃO 3 - ESPESSURAS */}
      <Box sx={{ mt: 3 }}>
        <FlexColumnBorder title="ESPESSURAS" open={true} theme={'#07B811'}>
          <Box sx={{ width: '100%', p: 1 }}>
            {renderGridFields(thicknessInputs, 2)}
          </Box>
        </FlexColumnBorder>
      </Box>

      {/* SEÇÃO 4 - DATAS E INFORMAÇÕES ADICIONAIS */}
      <Box sx={{ mt: 3 }}>
        <FlexColumnBorder title="DATAS E INFORMAÇÕES ADICIONAIS" open={true} theme={'#07B811'}>
          <Box sx={{ width: '100%', p: 1 }}>
            {renderGridFields(infoInputs, 2)}
          </Box>
        </FlexColumnBorder>
      </Box>
    </>
  );
};

export default StabilizedLayers_step1;