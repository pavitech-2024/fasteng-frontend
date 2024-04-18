import React, { useEffect } from 'react';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import ExperimentResume, { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import { EssayPageProps } from '@/components/templates/essay';
import useIggStore from '@/stores/asphalt/igg/igg.store';
import { t } from 'i18next';
import { Box } from '@mui/material';
import Chart from 'react-google-charts';
import IggResultsTable from './tables/results-table.igg';

const IggResults = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  const { results, generalData, iggStep4 } = useIggStore();

  useEffect(() => {
    if (nextDisabled) {
      setNextDisabled(false);
    }
  }, [nextDisabled, setNextDisabled]);

  const { arrowsAverage, variancesAverage, iggs, igis, conditions } = results || {};
  const { name: experimentName } = generalData || {};

  const experimentResumeData: ExperimentResumeData = {
    experimentName,
  };
  // Pegando indice maior de IGG
  const getMaxIndexIGG = (props) => {
    let maxIndex = 0;
    for (let i = 0; i < props.length; i++) if (props[i] > props[maxIndex]) maxIndex = i;
    return maxIndex;
  };

  // Pegando indice menor de IGG
  const getMinIndexIGG = (props) => {
    let minIndex = 0;
    for (let i = 0; i < props.length; i++) if (props[i] < props[minIndex]) minIndex = i;
    return minIndex;
  };

  const minIndexIGG = getMinIndexIGG(iggs || []);
  const maxIndexIGG = getMaxIndexIGG(iggs || []);

  // definindo dados para os gráficos de pizza
  const dataSmallerChart = [
    ['number', 'value'],
    ['1', results.igis[minIndexIGG][0]],
    ['2', results.igis[minIndexIGG][1]],
    ['3', results.igis[minIndexIGG][2]],
    ['4', results.igis[minIndexIGG][3]],
    ['5', results.igis[minIndexIGG][4]],
    ['6', results.igis[minIndexIGG][5]],
    ['7', results.igis[minIndexIGG][6]],
    ['8', results.igis[minIndexIGG][7]],
    ['9', results.igis[minIndexIGG][8]],
    ['10', results.igis[minIndexIGG][9]],
  ];
  const dataBiggerChart = [
    ['number', 'value'],
    ['1', results.igis[maxIndexIGG][0]],
    ['2', results.igis[maxIndexIGG][1]],
    ['3', results.igis[maxIndexIGG][2]],
    ['4', results.igis[maxIndexIGG][3]],
    ['5', results.igis[maxIndexIGG][4]],
    ['6', results.igis[maxIndexIGG][5]],
    ['7', results.igis[maxIndexIGG][6]],
    ['8', results.igis[maxIndexIGG][7]],
    ['9', results.igis[maxIndexIGG][8]],
    ['10', results.igis[maxIndexIGG][9]],
  ];

  const optionsSmaller = {
    title: `Contribuição de cada defeito no IGG - SH-${minIndexIGG + 1}`,
  };

  const optionsBigger = {
    title: `Contribuição de cada defeito no IGG - SH-${maxIndexIGG + 1}`,
  };

  return (
    <>
      <ExperimentResume data={experimentResumeData} />
      <FlexColumnBorder title={t('results')} open={true}>
        <IggResultsTable
          rows={(iggs || []).map((value: unknown, index: number) => {
            const section = iggStep4?.sections[index];
            const initialStake = section?.initial;
            const finalStake = section?.final;
            const extension = initialStake && finalStake ? (finalStake - initialStake) * 20 : null;
            return {
              id: index + 1,
              initialStake: initialStake !== null ? Number(initialStake).toFixed(2) : null,
              finalStake: finalStake !== null ? Number(finalStake).toFixed(2) : null,
              extension: extension !== null ? Number(extension).toFixed(2) : null,
              FC1: Number(igis[index][0]).toFixed(2),
              FC2: Number(igis[index][1]).toFixed(2),
              ALP: Number(igis[index][2]).toFixed(2),
              ATP: Number(igis[index][3]).toFixed(2),
              OEP: Number(igis[index][4]).toFixed(2),
              Ex: Number(igis[index][5]).toFixed(2),
              D: Number(igis[index][6]).toFixed(2),
              R: Number(igis[index][7]).toFixed(2),
              arrowsAverage: arrowsAverage[index] !== null ? Number(arrowsAverage[index]).toFixed(2) : null,
              variancesAverage: variancesAverage[index] !== null ? Number(variancesAverage[index]).toFixed(2) : null,
              igg: value !== null ? Number(value).toFixed(2) : null,
              concept: conditions[0],
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
            { field: 'igg', headerName: 'IGG (%', flex: 1, align: 'center', headerAlign: 'center', minWidth: 70 },
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
