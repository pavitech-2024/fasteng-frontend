import React, { useEffect, useState } from 'react';
import ExperimentResume, { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import { EssayPageProps } from '@/components/templates/essay';
import useFwdStore from '@/stores/asphalt/fwd/fwd.store';
import { t } from 'i18next';
import { Box } from '@mui/material';
import { Chart } from 'react-google-charts';
import ResultsTable from './tables/results-table.fwd';

const FwdResults = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  const { results, generalData } = useFwdStore();
  const optionsGraph = {
    title: 'Divisão de segmentos homogêneos - AASHTO/86',
    hAxis: {
      title: 'Diferença acumulada - ZX (x10^(-2)mm)',
    },
    vAxis: {
      title: 'Distância acumulada (m)',
    },
    series: {
      0: { color: '#1520A6' },
    },
    colors: ['#ff0000'],
  };

  useEffect(() => {
    if (nextDisabled) {
      setNextDisabled(false);
    }
  }, [nextDisabled, setNextDisabled]);

  const { graphData, deletedPositions } = results || {};
  const { name: experimentName } = generalData || {};

  const experimentResumeData: ExperimentResumeData = {
    experimentName,
  };

  const addDeletedLines = (data, deletedPositions) => {
    const newData = [...data];

    deletedPositions.forEach((position) => {
      newData[position + 1].push(null);
    });

    return newData;
  };
  const graphDataWithDeletedLines = addDeletedLines(graphData, deletedPositions);
  const graphDataWithoutNull = graphDataWithDeletedLines.map((array) => array.filter((value) => value !== null));
  const graphDataWithoutNullNumeric = graphDataWithoutNull
    .map(([x, y]) => [Number(x), y])
    .filter((value, index, self) => index === self.findIndex((arr) => arr[0] === value[0] && arr[1] === value[1]));
  const graphValues = [['Distâncias', 'Diferença acumulada'], ...graphDataWithoutNullNumeric];

  const tableResultsData = [];

  const deltaLiFormat = (index) => {
    return index === 0
      ? '0.00'
      : (Number(results.processedData[index].hodometro) - Number(results.processedData[index - 1].hodometro)).toFixed(
          2
        );
  };

  results.processedData.map((element, index) => {
    const tableRow = {
      id: index,
      point: (element.hodometro / 1000).toFixed(4),
      di: (element.d1 * 10).toFixed(2),
      dm: element.meanDeflection.toFixed(2),
      deltaLi: deltaLiFormat(index),
      sumDeltaLi: Number(element.hodometro),
      areaBetweenCurves: element.areaBetweenStationCurves.toFixed(2),
      cumulativeAreas: element.cumulativeArea.toFixed(2),
      cumulativeDifference: element.cumulativeDifference.toFixed(2),
    };

    tableResultsData.push(tableRow);
  });

  return (
    <>
      <ExperimentResume data={experimentResumeData} />
      <div>
        <Chart
          chartType="LineChart"
          data={graphValues}
          options={optionsGraph}
          width="100%"
          height="300px"
          legendToggle
        />
      </div>
      <Box>
        <ResultsTable rows={tableResultsData} />
      </Box>
    </>
  );
};

export default FwdResults;
