import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import ExperimentResume, { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useConcreteRtStore from '@/stores/concrete/concreteRt/concreteRt.store';
import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import Chart from 'react-google-charts';

const ConcreteRt_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  const { results: results, generalData } = useConcreteRtStore();

  // criando o objeto que será passado para o componente ExperimentResume
  const experimentResumeData: ExperimentResumeData = {
    experimentName: generalData.name,
    materials: [{ name: generalData.material.name, type: generalData.material.type }],
  };

  const data = {
    everyRtsMpa: [],
    everyRtsKgf: [],
    average: 0,
    acceptanceCondition: '',
  };
  const minimumRtValue = 0.65;

  if (results) {
    data.everyRtsKgf = results.everyRtsKgf.map((element) => {
      return Number(element).toFixed(2);
    });
    data.everyRtsMpa = results.everyRtsMpa.map((element) => {
      return Number(element).toFixed(2);
    });
    data.average = Number(Number(results.average).toFixed(2));
    data.acceptanceCondition =
      data.average > minimumRtValue
        ? t('concreteRt.results.acceptance-condition-true')
        : t('concreteRt.results.acceptance-condition-false');
  }

  const rows = data.everyRtsKgf.map((value, index) => ({
    id: index,
    sampleName: experimentResumeData.experimentName,
    rtKgf: value.toString().replace('.', ','),
    rtMpa: data.everyRtsMpa[index].toString().replace('.', ','),
  }));

  return (
    <>
      <ExperimentResume data={experimentResumeData} />
      <FlexColumnBorder title={t('results')} open={true}>
        <DataGrid
          sx={{ lineHeight: '1.2rem' }}
          rows={rows}
          columns={[
            {
              field: 'sampleName',
              headerName: t('concreteRt.results.sampleName'),
              flex: 1,
              align: 'center',
              headerAlign: 'center',
            },
            {
              field: 'rtKgf',
              headerName: t('concreteRt.results.RtKgf'),
              flex: 1,
              align: 'center',
              headerAlign: 'center',
            },
            {
              field: 'rtMpa',
              headerName: t('concreteRt.results.RtMpa'),
              flex: 1,
              align: 'center',
              headerAlign: 'center',
            },
          ]}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            marginTop: '2rem',
            marginBottom: '2rem',
            gap: '.65rem',
            paddingX: '1.5rem',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: '.65rem',
              alignItems: 'center',
            }}
          >
            <Result_Card
              label={t('concreteRt.results.minimum-rt')}
              value={`${minimumRtValue.toString().replace('.', ',')}`}
              unity={'Mpa'}
            />
            <Result_Card
              label={t('concreteRt.results.average')}
              value={data.average.toString().replace('.', ',')}
              unity={'MPa'}
            />
            <Result_Card
              label={t('concreteRt.results.acceptance-condition')}
              value={data.acceptanceCondition}
              unity={''}
            />
          </Box>
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default ConcreteRt_Results;
