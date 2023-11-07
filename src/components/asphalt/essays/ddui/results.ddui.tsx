import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import ExperimentResume, { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import { EssayPageProps } from '@/components/templates/essay';
import useDduiStore from '@/stores/asphalt/ddui.store';
import { Alert, AlertTitle, Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';

const Ddui_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  const { results: results, generalData } = useDduiStore();
  const { dduiStep2: ddui_Step2 } = useDduiStore();
  const { dduiStep3: ddui_Step3 } = useDduiStore();
  console.log('🚀 ~ file: results.ddui.tsx:9 ~ results:', results);

  const rows = ddui_Step3.ddui_data.map((item, index) => {
    const { pressReading } = item;
    return {
      id: index,
      pressReading,
      RT1: results.everyRtsKgf[index].toFixed(2),
      RT2: results.everyRtsMpa[index].toFixed(2),
    };
  });

  const columns: GridColDef[] = [
    {
      field: 'pressReading',
      headerName: 'Leitura da prensa',
    },
    {
      field: 'RT1',
      headerName: 'RT (Kgf/cm³)',
    },
    {
      field: 'RT2',
      headerName: 'RT (MPa)',
    },
  ];

  // criando o objeto que será passado para o componente ExperimentResume
  const experimentResumeData: ExperimentResumeData = {
    experimentName: generalData.name,
    materials: [{ name: generalData.material.name, type: generalData.material.type }],
  };

  const data = {
    everyRtsMpa: [],
    everyRtsKgf: [],
    conditionedAverage: 0,
    unconditionedAverage: 0,
    rrt: 0,
    minRrt: 0,
    acceptanceCondition: '',
  };

  if (results) {
    data.everyRtsKgf = results.everyRtsKgf.map((element) => {
      return element.toFixed(2);
    });
    data.everyRtsMpa = results.everyRtsMpa.map((element) => {
      return element.toFixed(2);
    });
    data.conditionedAverage = Number(results.conditionedAverage.toFixed(2));
    data.unconditionedAverage = Number(results.unconditionedAverage.toFixed(2));
    data.rrt = Number(results.rrt.toFixed(2)) * 100;
    data.minRrt = ddui_Step2.minRrt;
    data.acceptanceCondition =
      data.rrt > ddui_Step2.minRrt
        ? t('ddui.results.acceptance-condition-true')
        : t('ddui.results.acceptance-condition-false');
  }

  return (
    <>
      <ExperimentResume data={experimentResumeData} />
      <FlexColumnBorder title={t('results')} open={true}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '.65rem',
            paddingX: '1.5rem',
            overflowX: 'auto'
          }}
        >
          <DataGrid
            columns={columns.map((column) => ({
              ...column,
              sortable: false,
              disableColumnMenu: true,
              align: 'center',
              headerAlign: 'center',
              flex: 1,
            }))}
            sx={{
              width: '100%',
              marginBottom: '2rem',
              overflow: 'scroll'
            }}
            rows={rows}
            hideFooter
          />

          <ResultSubTitle title={'RT'}/>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { mobile: 'column', notebook: 'row' },
              gap: '.65rem',
            }}
          >
            <Result_Card
              label={t('ddui.results.average-conditioned')}
              value={data.conditionedAverage.toString()}
              unity={'MPa'}
            />

            <Result_Card
              label={t('ddui.results.average-unconditioned')}
              value={data.unconditionedAverage.toString()}
              unity={'MPa'}
            />
          </Box>

          <ResultSubTitle title={'RRT'}/>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { mobile: 'column', notebook: 'row' },
              gap: '.65rem',
            }}
          >
            <Result_Card label={t('ddui.results.rrt')} value={data.rrt.toString()} unity={'%'} />

            <Result_Card label={t('ddui.results.minimun-rrt')} value={data.minRrt.toString()} unity={'%'} />
          </Box>

          <Alert severity="warning">
            <AlertTitle>{t('ddui.results.acceptance-condition')}</AlertTitle>
            {data.acceptanceCondition}
          </Alert>
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default Ddui_Results;
