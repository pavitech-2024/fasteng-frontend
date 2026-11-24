import React, { useEffect } from 'react';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import ExperimentResume, { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import { EssayPageProps } from '@/components/templates/essay';
import { UseIggStore } from '@/stores/asphalt/igg/igg.store';
import { t } from 'i18next';
import { Box } from '@mui/material';
import Chart from 'react-google-charts';
import IggResultsTable from './tables/results-table.igg';

const IggResults = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  const { results, generalData, sections } = UseIggStore();

  useEffect(() => {
    if (nextDisabled) {
      setNextDisabled(false);
    }
  }, [nextDisabled, setNextDisabled]);

  const iggs = results?.iggs ?? [];
  const igis = results?.igis ?? [];
  const arrowsAverage = results?.arrowsAverage ?? [];
  const variancesAverage = results?.variancesAverage ?? [];
  const conditions = results?.conditions ?? [];

  if (!igis.length) {
    return <p>Resultados por trecho indisponíveis. Tente novamente.</p>;
  }

  const { name: experimentName } = generalData || {};

  const experimentResumeData: ExperimentResumeData = {
    experimentName,
  };

  // Índice do maior e do menor IGG
  const getMaxIndexIGG = (props: number[]) => {
    let maxIndex = 0;
    for (let i = 0; i < props.length; i++) if (props[i] > props[maxIndex]) maxIndex = i;
    return maxIndex;
  };

  const getMinIndexIGG = (props: number[]) => {
    let minIndex = 0;
    for (let i = 0; i < props.length; i++) if (props[i] < props[minIndex]) minIndex = i;
    return minIndex;
  };

  const minIndexIGG = getMinIndexIGG(iggs);
  const maxIndexIGG = getMaxIndexIGG(iggs);

  // dados para os gráficos de pizza
  const buildPieData = (index: number) => [
    ['number', 'value'],
    ...igis[index].slice(0, 10).map((value, i) => [String(i + 1), value]),
  ];

  const dataSmallerChart = buildPieData(minIndexIGG);
  const dataBiggerChart = buildPieData(maxIndexIGG);

  const optionsSmaller = {
    title: `Contribuição de cada defeito no IGG - SH-${minIndexIGG + 1}`,
  };

  const optionsBigger = {
    title: `Contribuição de cada defeito no IGG - SH-${maxIndexIGG + 1}`,
  };

  const toFixed2 = (value: unknown) => (value !== null && value !== undefined ? Number(value).toFixed(2) : null);

  return (
    <>
      <ExperimentResume data={experimentResumeData} />
      <FlexColumnBorder title={t('results')} open={true}>
        <IggResultsTable
          rows={iggs.map((value: number, index: number) => {
            const section = sections?.[index];
            const initialStake = section?.initial ?? null;
            const finalStake = section?.final ?? null;
            const extension = initialStake !== null && finalStake !== null ? (finalStake - initialStake) * 20 : null;

            return {
              id: index + 1,
              initialStake: toFixed2(initialStake),
              finalStake: toFixed2(finalStake),
              extension: toFixed2(extension),
              FC1: toFixed2(igis[index][0]),
              FC2: toFixed2(igis[index][1]),
              ALP: toFixed2(igis[index][2]),
              ATP: toFixed2(igis[index][3]),
              OEP: toFixed2(igis[index][4]),
              Ex: toFixed2(igis[index][5]),
              D: toFixed2(igis[index][6]),
              R: toFixed2(igis[index][7]),
              arrowsAverage: toFixed2(arrowsAverage[index]),
              variancesAverage: toFixed2(variancesAverage[index]),
              igg: toFixed2(value),
              concept: conditions[index] ?? null,
            };
          })}
          columns={[
            { field: 'id', headerName: 'Id', flex: 1, align: 'center', headerAlign: 'center' },
            {
              field: 'initialStake',
              headerName: 'Estaca Inicial',
              flex: 1,
              align: 'center',
              headerAlign: 'center',
              minWidth: 105,
            },
            {
              field: 'finalStake',
              headerName: 'Estaca Final',
              flex: 1,
              align: 'center',
              headerAlign: 'center',
              minWidth: 100,
            },
            {
              field: 'extension',
              headerName: 'Extensão(m)',
              flex: 1,
              align: 'center',
              headerAlign: 'center',
              minWidth: 105,
            },
            { field: 'FC1', headerName: 'FC-1(%)', flex: 1, align: 'center', headerAlign: 'center', minWidth: 72 },
            { field: 'FC2', headerName: 'FC-2(%)', flex: 1, align: 'center', headerAlign: 'center', minWidth: 72 },
            { field: 'ALP', headerName: 'ALP(%)', flex: 1, align: 'center', headerAlign: 'center', minWidth: 72 },
            { field: 'ATP', headerName: 'ATP(%)', flex: 1, align: 'center', headerAlign: 'center', minWidth: 72 },
            { field: 'OEP', headerName: 'O e P(%)', flex: 1, align: 'center', headerAlign: 'center', minWidth: 75 },
            { field: 'Ex', headerName: 'Ex(%)', flex: 1, align: 'center', headerAlign: 'center', minWidth: 72 },
            { field: 'D', headerName: 'D(%)', flex: 1, align: 'center', headerAlign: 'center', minWidth: 72 },
            { field: 'R', headerName: 'R(%)', flex: 1, align: 'center', headerAlign: 'center', minWidth: 72 },
            {
              field: 'arrowsAverage',
              headerName: 'Média Flechas(mm)',
              flex: 1,
              align: 'center',
              headerAlign: 'center',
              minWidth: 147,
            },
            {
              field: 'variancesAverage',
              headerName: 'Média Variâncias(mm)',
              flex: 1,
              align: 'center',
              headerAlign: 'center',
              minWidth: 165,
            },
            { field: 'igg', headerName: 'IGG (%)', flex: 1, align: 'center', headerAlign: 'center', minWidth: 70 },
            { field: 'concept', headerName: 'Conceito', flex: 1, align: 'center', headerAlign: 'center', minWidth: 80 },
          ]}
        />
        <Box
          sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginX: 'auto',
            marginY: '20px',
          }}
        >
          <div style={{ width: '100%', height: '400px' }}>
            <Chart
              chartType="PieChart"
              data={dataSmallerChart}
              options={optionsSmaller}
              width={'100%'}
              height={'100%'}
            ></Chart>
          </div>
          <div style={{ width: '100%', height: '400px' }}>
            <Chart
              chartType="PieChart"
              data={dataBiggerChart}
              options={optionsBigger}
              width={'100%'}
              height={'100%'}
            ></Chart>
          </div>
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default IggResults;
