import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import ExperimentResume, { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import { EssayPageProps } from '@/components/templates/essay';
import useConcreteRtStore from '@/stores/concrete/concreteRt/concreteRt.store';
import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';

const ConcreteRt_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  const { results: data, generalData, step2Data } = useConcreteRtStore();

  // 🔥 Verifica se os dados necessários existem
  const hasResults = data && 
                     data.flexualTensileStrength && 
                     data.compressionResistance && 
                     step2Data?.samples;

  // 🔥 DEBUG
  console.log('🔍 Dados de resultados no componente:', data);
  console.log('flexualTensileStrength:', data?.flexualTensileStrength);
  console.log('compressionResistance:', data?.compressionResistance);

  // criando o objeto que será passado para o componente ExperimentResume
  const experimentResumeData: ExperimentResumeData = {
    experimentName: generalData?.name || t('concrete.essays.noData'),
  };

  // 🔥 Só cria as rows se tiver resultados
  const rows = hasResults ? step2Data.samples.map((item, i) => {
    // 🔥 Verificação adicional para cada item
    const flexValue = data.flexualTensileStrength[i];
    const compValue = data.compressionResistance[i];
    
    return {
      id: item.id,
      sampleName: step2Data.samples[i].sampleName || `Amostra ${i + 1}`,
      age: ((item.age?.hours || 0) * 60 + (item.age?.minutes || 0)) / 60,
      tolerance: ((item.tolerance?.hours || 0) * 60 + (item.tolerance?.minutes || 0)) / 60,
      appliedCharge: item.appliedCharge || 0,
      supportDistance: item.supportDistance || 0,
      flexualTensileStrength: flexValue !== null && flexValue !== undefined ? flexValue.toFixed(2) : '0.00',
      compressionResistance: compValue !== null && compValue !== undefined ? compValue.toFixed(2) : '0.00',
    };
  }) : [];

  const columns: GridColDef[] = [
    {
      field: 'sampleName',
      headerName: t('rt.results.sampleName'),
      width: 120,
    },
    {
      field: 'appliedCharge',
      headerName: t('concrete.essays.applied-charge'),
      width: 120,
      valueFormatter: ({ value }) => `${value} N`,
    },
    {
      field: 'supportDistance',
      headerName: t('concrete.essays.supports-distance'),
      width: 120,
      valueFormatter: ({ value }) => `${value} mm`,
    },
    {
      field: 'flexualTensileStrength',
      headerName: t('results.flexual-tensile'),
      width: 120,
      valueFormatter: ({ value }) => `${value} MPa`,
    },
    {
      field: 'compressionResistance',
      headerName: t('results.compression'),
      width: 120,
      valueFormatter: ({ value }) => `${value} MPa`,
    },
  ];

  // 🔥 Se não tem resultados, mostra mensagem
  if (!hasResults) {
    return (
      <>
        <ExperimentResume data={experimentResumeData} />
        <FlexColumnBorder title={t('results')} open={true}>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="error">
              ⚠️ {t('concrete.essays.noResults')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Os resultados ainda não foram calculados. Complete os passos anteriores.
            </Typography>
          </Box>
        </FlexColumnBorder>
      </>
    );
  }

  return (
    <>
      <ExperimentResume data={experimentResumeData} />
      <FlexColumnBorder title={t('results')} open={true}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            gap: '10px',
            mt: '20px',
          }}
        >
          {rows.length > 0 && (
            <DataGrid
              columns={columns.map((column) => ({
                ...column,
                sortable: false,
                disableColumnMenu: true,
                align: 'center',
                headerAlign: 'center',
                minWidth: 70,
                flex: 1,
              }))}
              rows={rows}
              getRowId={(row) => row.id}
              hideFooter
            />
          )}
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default ConcreteRt_Results;