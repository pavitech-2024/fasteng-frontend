import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import ExperimentResume, { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import { EssayPageProps } from '@/components/templates/essay';
import useConcreteRtStore from '@/stores/concrete/concreteRt/concreteRt.store';
import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';

const ConcreteRt_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  const { results: data, generalData, step2Data } = useConcreteRtStore();

  // criando o objeto que será passado para o componente ExperimentResume
  const experimentResumeData: ExperimentResumeData = {
    experimentName: generalData.name,
  };

  const rows = step2Data.samples.map((item, i) => ({
    id: item.id,
    age: (item.age.hours * 60 + item.age.minutes) / 60,
    tolerance: (item.tolerance.hours * 60 + item.tolerance.minutes) / 60,
    appliedCharge: item.appliedCharge,
    supportDistance: item.supportDistance,
    flexualTensileStrength: data.flexualTensileStrength[i].toFixed(2),
    compressionResistance: data.compressionResistance[i].toFixed(2),
  }));

  const columns: GridColDef[] = [
    {
      field: 'appliedCharge',
      headerName: t('concrete.essays.applied-charge'),
      width: 120,
      valueFormatter: ({ value }) => `${value} N`,
    },
    {
      field: 'supportDistance',
      headerName: t('concrete.essays.support-distance'),
      width: 120,
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'flexualTensileStrength',
      headerName: t('concrete.essays.flexual-tensile-strength'),
      width: 120,
      valueFormatter: ({ value }) => `${value} Mpa`,
    },
    {
      field: 'compressionResistance',
      headerName: t('concrete.essays.compression-resistance'),
      width: 120,
      valueFormatter: ({ value }) => `${value} Mpa`,
    },
  ];

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
      </FlexColumnBorder>
    </>
  );
};

export default ConcreteRt_Results;
