import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import ExperimentResume, { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import { EssayPageProps } from '@/components/templates/essay';
import useRtcdStore from '@/stores/asphalt/rtcd/rtcd.store';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { t } from 'i18next';

const Rtcd_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  const { results: results, generalData } = useRtcdStore();

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
        ? t('rtcd.results.acceptance-condition-true')
        : t('rtcd.results.acceptance-condition-false');
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
              headerName: t('rtcd.results.sampleName'),
              flex: 1,
              align: 'center',
              headerAlign: 'center',
            },
            { field: 'rtKgf', headerName: t('rtcd.results.RtKgf'), flex: 1, align: 'center', headerAlign: 'center' },
            { field: 'rtMpa', headerName: t('rtcd.results.RtMpa'), flex: 1, align: 'center', headerAlign: 'center' },
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
              label={t('rtcd.results.minimum-rt')}
              value={`${minimumRtValue.toString().replace('.', ',')}`}
              unity={'Mpa'}
            />
            <Result_Card
              label={t('rtcd.results.average')}
              value={data.average.toString().replace('.', ',')}
              unity={'MPa'}
            />
            <Result_Card label={t('rtcd.results.acceptance-condition')} value={data.acceptanceCondition} unity={''} />
          </Box>
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default Rtcd_Results;
