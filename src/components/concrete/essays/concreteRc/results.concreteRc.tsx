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

  // criando o objeto que será passado para o componente ExperimentResume
  const experimentResumeData: ExperimentResumeData = {
    experimentName: generalData.name,
  };

  const rows = data.finalResult.map((item, i) => ({
    id: i,
    averageDiammeter: (step2Data.samples[i].diammeter1 + step2Data.samples[i].diammeter2) / 2,
    height: step2Data.samples[i].height,
    age: (step2Data.samples[i].age.hours * 60 + step2Data.samples[i].age.minutes) / 60,
    tolerance: data.tolerances[i].toFixed(2),
    maximumStrength: step2Data.samples[i].maximumStrength,
    correctionFactor: data.correctionFactors[i].toFixed(2),
    finalResult: item.toFixed(2),
  }));

  const columns: GridColDef[] = [
    {
      field: 'maximumStrength',
      headerName: t('concrete.essays.max-strenght'),
      width: 120,
      valueFormatter: ({ value }) => `${value} N`,
    },
    {
      field: 'correctionFactor',
      headerName: t('concrete.essays.correction-factor'),
      width: 120,
      valueFormatter: ({ value }) => `${value}`,
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
        </Box>

        <ResultSubTitle title={t('concrete.essays.graph-image')} sx={{ margin: '.65rem', width: '100%' }} />

        <Box sx={{ width: 'fit-content', display: 'flex', flexDirection: 'column', gap: '10px', mt: '20px' }}>
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
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default ConcreteRc_Results;
