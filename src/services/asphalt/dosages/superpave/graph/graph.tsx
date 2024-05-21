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
        title: '',
        hAxis: {
          title: 'Diâmetro (mm)',
          logScale: true,
          titleTextStyle: { italic: false },
        },
        chartArea: { width: '70%', height: '70%' },
        vAxis: { title: 'Passante (%)', titleTextStyle: { italic: false } },
        legend: { position: 'bottom' },
        series: {
          0: { color: 'blue', lineDashStyle: [15, 15], lineWidth: 3 },
          1: { color: 'gray', lineDashStyle: [2, 2] },
          2: { color: 'black' },
          3: { color: 'gray', lineDashStyle: [2, 2], visibleInLegend: false },
          4: { color: 'blue', lineDashStyle: [15, 15], lineWidth: 3, visibleInLegend: false },
        },
      }}
    />
  );
};

export default Graph;
