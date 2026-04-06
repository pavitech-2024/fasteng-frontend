import { EssayPageProps } from '../../../templates/essay';
import { Box, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import useGranularLayersStore from '@/stores/promedina/granular-layers/granular-layers.store';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { useEffect } from 'react';

const GranularLayers_step1 = ({ setNextDisabled }: EssayPageProps) => {
  const { generalData, setData } = useGranularLayersStore();

  const simNaoOptions = [
    { value: 'Sim', label: 'SIM' },
    { value: 'Não', label: 'NÃO' },
  ];

  const tipoSecaoOptions = [
    { value: 'Experimental', label: 'EXPERIMENTAL' },
    { value: 'Controle', label: 'CONTROLE' },
    { value: 'Referência', label: 'REFERÊNCIA' },
  ];

  const faseMonitoramentoOptions = [
    { value: 'Pré-Execução', label: 'PRÉ-EXECUÇÃO' },
    { value: 'Execução', label: 'EXECUÇÃO' },
    { value: 'Pós-Execução', label: 'PÓS-EXECUÇÃO' },
  ];

  const inputs = [
    {
      label: 'TIPO DE SEÇÃO',
      value: generalData.tipoSecao,
      key: 'tipoSecao' as const,
      required: true,
      type: 'select' as const,
      options: tipoSecaoOptions,
    },
    {
      label: 'FASE DE MONITORAMENTO',
      value: generalData.faseMonitoramento,
      key: 'faseMonitoramento' as const,
      required: true,
      type: 'select' as const,
      options: faseMonitoramentoOptions,
    },
    {
      label: 'LIBERAÇÃO AO TRÁFEGO',
      value: generalData.liberacaoTrafico,
      key: 'liberacaoTrafico' as const,
      required: true,
      type: 'date' as const,
    },
    {
      label: 'UTILIZADA NA CALIBRAÇÃO DO MEDINA',
      value: generalData.utilizadaMeDiNa,
      key: 'utilizadaMeDiNa' as const,
      required: true,
      type: 'select' as const,
      options: simNaoOptions,
    },
    {
      label: 'UTILIZADA NA CALIBRAÇÃO DO LVECD',
      value: generalData.utilizadaLVECD,
      key: 'utilizadaLVECD' as const,
      required: true,
      type: 'select' as const,
      options: simNaoOptions,
    },
    {
      label: 'DADOS CONFIRMADOS PELA ICT',
      value: generalData.dadosConfirmadosICT,
      key: 'dadosConfirmadosICT' as const,
      required: true,
      type: 'select' as const,
      options: simNaoOptions,
    },
    {
      label: 'OBSERVAÇÕES',
      value: generalData.observations,
      key: 'observations' as const,
      required: false,
      type: 'text' as const,
    },
  ];

  useEffect(() => {
    const requiredFields = [
      'tipoSecao',
      'faseMonitoramento',
      'liberacaoTrafico',
      'utilizadaMeDiNa',
      'utilizadaLVECD',
      'dadosConfirmadosICT',
    ] as const;
    
    const allRequiredFilled = requiredFields.every((field) => {
      const value = generalData[field];
      return value !== null && value !== undefined && value.toString().trim() !== '';
    });
    setNextDisabled(!allRequiredFilled);
  }, [
    generalData.tipoSecao,
    generalData.faseMonitoramento,
    generalData.liberacaoTrafico,
    generalData.utilizadaMeDiNa,
    generalData.utilizadaLVECD,
    generalData.dadosConfirmadosICT,
    setNextDisabled,
  ]);

  const renderInput = (input: typeof inputs[number]) => {
    if (input.type === 'select') {
      return (
        <FormControl variant="standard" fullWidth required={input.required}>
          <InputLabel sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{input.label}</InputLabel>
          <Select
            value={input.value || ''}
            label={input.label}
            onChange={(e) => setData({ step: 0, key: input.key, value: e.target.value })}
          >
            {input.options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    if (input.type === 'date') {
      return (
        <TextField
          key={input.key}
          variant="standard"
          type="date"
          label={input.label}
          value={input.value || ''}
          required={input.required}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => setData({ step: 0, key: input.key, value: e.target.value })}
          InputProps={{
            inputProps: { style: { textTransform: 'uppercase' } }
          }}
        />
      );
    }

    return (
      <TextField
        key={input.key}
        variant="standard"
        multiline={input.key === 'observations'}
        label={input.label}
        sx={input.key === 'observations' && { width: '100%' }}
        value={input.value || ''}
        required={input.required}
        onChange={(e) => setData({ step: 0, key: input.key, value: e.target.value })}
        InputProps={{
          inputProps: { style: { textTransform: 'uppercase' } }
        }}
      />
    );
  };

  return (
    <FlexColumnBorder title="IDENTIFICAÇÃO" open={true} theme={'#07B811'}>
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
          {inputs.map((input) => renderInput(input))}
        </Box>
      </Box>
    </FlexColumnBorder>
  );
};

export default GranularLayers_step1;