import { EssayPageProps } from '../../../templates/essay';
import { Box, TextField } from '@mui/material';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import useStabilizedLayersStore from '@/stores/promedina/stabilized-layers/stabilized-layers.store';

const StabilizedLayers_step3 = ({ setNextDisabled }: EssayPageProps) => {
  const { step3Data, setData } = useStabilizedLayersStore();

  // Seção 1: PARÂMETROS E DADOS DO MATERIAL
  const inputsMaterialParams = [
    { label: 'ESTABILIZANTE', value: step3Data.stabilizer, key: 'stabilizer', required: true },
    { label: 'TEOR', value: step3Data.tenor, key: 'tenor', required: true },
    { label: 'RTCD, 28 DIAS (MPa)', value: step3Data.rtcd, key: 'rtcd', required: true },
    { label: 'RTF, 28 DIAS (MPa)', value: step3Data.rtf, key: 'rtf', required: true },
    { label: 'RCS, 28 DIAS (MPa)', value: step3Data.rcs, key: 'rcs', required: true },
    { label: 'FAIXA GRANULOMÉTRICA', value: step3Data.granulometricRange, key: 'granulometricRange', required: true },
    { label: 'MASSA ESPECÍFICA (g/cm³)', value: step3Data.especificMass, key: 'especificMass', required: true },
    { label: 'UMIDADE ÓTIMA (%)', value: step3Data.optimalHumidity, key: 'optimalHumidity', required: true },
    { label: 'ENERGIA DE COMPACTAÇÃO', value: step3Data.compressionEnergy, key: 'compressionEnergy', required: true },
  ];

  // Seção 2: MÓDULO DE RESISTÊNCIA (MPa)
  const inputsResilienceModule = [
    { label: 'INICIAL (EI)', value: step3Data.rsInitial, key: 'rsInitial', required: true },
    { label: 'FINAL (EF)', value: step3Data.rsFinal, key: 'rsFinal', required: true },
    { label: 'CONSTANTE A', value: step3Data.constantA, key: 'constantA', required: true },
    { label: 'CONSTANTE B', value: step3Data.constantB, key: 'constantB', required: true },
  ];

  // Seção 3: FADIGA DO MATERIAL, 28 DIAS
  const inputsMaterialFatigue = [
    { label: 'K1 OU PSI1', value: step3Data.fatiguek1psi1, key: 'fatiguek1psi1', required: true },
    { label: 'K2 OU PSI2', value: step3Data.fatiguek2psi2, key: 'fatiguek2psi2', required: true },
    { label: 'OBSERVAÇÕES', value: step3Data.observations, key: 'observations', required: false },
  ];

  setNextDisabled(false);

  return (
    <>
      {/* Seção 1: PARÂMETROS E DADOS DO MATERIAL */}
      <FlexColumnBorder 
        title="PARÂMETROS E DADOS DO MATERIAL" 
        open={true} 
        theme={'#07B811'} 
        sx_title={{ whiteSpace: 'wrap', fontWeight: 'bold' }}
      >
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
              display: 'grid',
              width: '100%',
              gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' },
              gap: '10px 20px',
              paddingBottom: '20px',
            }}
          >
            {inputsMaterialParams.map((input) => {
              return (
                <TextField
                  key={input.key}
                  variant="standard"
                  label={input.label}
                  value={input.value || ''}
                  required={input.required}
                  onChange={(e) => setData({ step: 2, key: input.key, value: e.target.value })}
                />
              );
            })}
          </Box>
        </Box>
      </FlexColumnBorder>

      {/* Seção 2: MÓDULO DE RESISTÊNCIA (MPa) */}
      <FlexColumnBorder
        title="MÓDULO DE RESISTÊNCIA (MPa)"
        open={true}
        theme={'#07B811'}
        sx_title={{ whiteSpace: 'wrap', fontWeight: 'bold' }}
      >
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
              display: 'grid',
              width: '100%',
              gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' },
              gap: '10px 20px',
              paddingBottom: '20px',
            }}
          >
            {inputsResilienceModule.map((input) => {
              return (
                <TextField
                  key={input.key}
                  variant="standard"
                  label={input.label}
                  value={input.value || ''}
                  required={input.required}
                  onChange={(e) => setData({ step: 2, key: input.key, value: e.target.value })}
                />
              );
            })}
          </Box>
        </Box>
      </FlexColumnBorder>

      {/* Seção 3: FADIGA DO MATERIAL, 28 DIAS */}
      <FlexColumnBorder 
        title="FADIGA DO MATERIAL, 28 DIAS" 
        open={true} 
        theme={'#07B811'}
        sx_title={{ fontWeight: 'bold' }}
      >
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
              display: 'grid',
              width: '100%',
              gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' },
              gap: '10px 20px',
              paddingBottom: '20px',
            }}
          >
            {inputsMaterialFatigue.map((input) => {
              return (
                <TextField
                  key={input.key}
                  variant="standard"
                  label={input.label}
                  value={input.value || ''}
                  required={input.required}
                  onChange={(e) => setData({ step: 2, key: input.key, value: e.target.value })}
                />
              );
            })}
          </Box>
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default StabilizedLayers_step3;