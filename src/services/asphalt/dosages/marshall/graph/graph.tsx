// components/Graph/index.js
import React from 'react';
import { Chart } from 'react-google-charts';

const Graph = ({ data }) => {
  return (
    <Chart
      width={'100%'}
      height={'400px'}
      chartType="LineChart"
      loader={<div>Loading Chart</div>}
      data={data}
      options={{
        title: 'Curvas granulométricas',
        selectionMode: 'multiple',
        hAxis: {
          title: '(D/d)^0,45',
          titleTextStyle: { italic: false },
        },
        chartArea: { width: '100%', height: '80%' },
        vAxis: { title: 'Porcentagem passante (%)', titleTextStyle: { italic: false } },
        legend: { position: 'bottom', textStyle: { color: 'black', italic: false, fontSize: 12 } },
        trendlines: {
          4: {
            color: 'blue',
            labelInLegend: 'Densidade máxima',
            visibleInLegend: true,
          },
        },
        series: {
          0: {
            color: 'black',
            lineWidth: 0,
            pointsVisible: true,
            pointSize: 7,
            pointShape: 'square',
            visibleInLegend: false,
          },
          1: {
            color: 'black',
            lineWidth: 0,
            opacity: 1,
            pointsVisible: true,
            pointSize: 7,
            labelInLegend: 'Pontos de controle',
            pointShape: 'square',
          },
          2: { color: 'red', visibleInLegend: false },
          3: { color: 'red', labelInLegend: 'Zona de restrição' },
          4: { visibleInLegend: false },
          5: { color: 'green', opacity: 1, labelInLegend: 'Faixa do DNIT' },
          6: { color: 'green', opacity: 1, visibleInLegend: false },
          7: { color: 'black', pointsVisible: true, pointSize: 1.5, labelInLegend: 'Curva inferior' },
          8: {
            color: 'black',
            pointsVisible: true,
            pointSize: 1.5,
            lineDashStyle: [2, 2],
            labelInLegend: 'Curva intermediária',
          },
          9: {
            color: 'black',
            pointsVisible: true,
            pointSize: 1.5,
            lineDashStyle: [10, 5],
            labelInLegend: 'Curva superior',
          },
        },
      }}
    />
  );
};

export default Graph;
