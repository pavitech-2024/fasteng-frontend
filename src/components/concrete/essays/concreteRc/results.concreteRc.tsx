import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import ExperimentResume, { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import { EssayPageProps } from '@/components/templates/essay';
import useConcreteRcStore from '@/stores/concrete/concreteRc/concreteRc.store';
import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';

const ConcreteRc_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  const { results: data, step2Data, step3Data, generalData } = useConcreteRcStore();

  // 🔥 Verificar se todos os dados necessários existem
  const hasResults = data && 
                     data.finalResult && 
                     data.tolerances && 
                     data.correctionFactors &&
                     step2Data?.samples &&
                     step3Data?.rupture &&
                     step3Data?.graphImg;

  if (!hasResults) {
    return (
      <>
        <ExperimentResume data={{ experimentName: generalData?.name || t('concrete.essays.noData') }} />
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

  // criando o objeto que será passado para o componente ExperimentResume
  const experimentResumeData: ExperimentResumeData = {
    experimentName: generalData?.name || t('concrete.essays.noData'),
  };

  const rows = data.finalResult!.map((item, i) => ({
    id: i,
    sampleName: step2Data.samples[i].sampleName || `Amostra ${i + 1}`,
    averageDiammeter: ((step2Data.samples[i].diammeter1 || 0) + (step2Data.samples[i].diammeter2 || 0)) / 2,
    height: step2Data.samples[i].height || 0,
    age: ((step2Data.samples[i].age?.hours || 0) * 60 + (step2Data.samples[i].age?.minutes || 0)) / 60,
    tolerance: (data.tolerances![i] || 0).toFixed(2),
    maximumStrength: step2Data.samples[i].maximumStrength || 0,
    correctionFactor: (data.correctionFactors![i] || 0).toFixed(2),
    finalResult: (item || 0).toFixed(2),
  }));

  const columns: GridColDef[] = [
    {
      field: 'sampleName',
      headerName: t('concrete.essays.sample-name'),
      width: 120,
      valueFormatter: ({ value }) => `${value} N`,
    },
    {
      field: 'maximumStrength',
      headerName: t('concrete.essays.max-strenght'),
      width: 120,
      valueFormatter: ({ value }) => `${value} N`,
    },
    {
      field: 'finalResult',
      headerName: t('concrete.essays.compression-resistance'),
      width: 120,
      valueFormatter: ({ value }) => `${value} Mpa`,
    },
  ];

  return (
    <>
      <ExperimentResume data={experimentResumeData} />
      <FlexColumnBorder title={t('results')} open={true}>
        <ResultSubTitle title={t('concrete.essays.concreteRc')} sx={{ margin: '.65rem' }} />
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            gap: '10px',
            mt: '20px',
          }}
        >
          {columns.length > 0 && rows?.length > 0 && (
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

        <Box sx={{ width: 'fit-content', display: 'flex', flexDirection: 'column', gap: '10px', mt: '20px' }}>
          <ResultSubTitle title={t('concrete.essays.compression-rupture')} sx={{ margin: '.65rem' }} />
          {step3Data?.rupture?.src && (
            <>
              <Box
                component={'img'}
                sx={{ width: { mobile: '50%', notebook: '35%' }, height: '50%' }}
                src={step3Data.rupture.src}
                alt={'rupture image'}
              />
              <Typography
                sx={{
                  margin: '.65rem',
                  mb: '2rem',
                  fontWeight: '500',
                  textAlign: 'center',
                  lineHeight: '1.2rem',
                  width: 'fit-content',
                }}
              >
                {step3Data.rupture.type}
              </Typography>
            </>
          )}
        </Box>

        <ResultSubTitle title={t('concrete.essays.graph-image')} sx={{ margin: '.65rem', width: '100%' }} />

        <Box sx={{ width: 'fit-content', display: 'flex', flexDirection: 'column', gap: '10px', mt: '20px' }}>
          {step3Data?.graphImg?.src && (
            <>
              <Box
                component={'img'}
                sx={{ width: '100%', height: '50%' }}
                src={step3Data.graphImg.src}
                alt={'rupture image'}
              />
              <Typography
                sx={{
                  margin: '.65rem',
                  mb: '2rem',
                  fontWeight: '500',
                  textAlign: 'center',
                  lineHeight: '1.2rem',
                  width: 'fit-content',
                }}
              >
                {step3Data.graphImg.name}
              </Typography>
            </>
          )}
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default ConcreteRc_Results;
