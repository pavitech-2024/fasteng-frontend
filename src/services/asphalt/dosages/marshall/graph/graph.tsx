// components/Graph/index.js
import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';

const Graph = ({ data }) => {
  console.log('🚀 ~ Graph ~ data:', data);
  const [newData, setNewData] = useState();
  console.log("🚀 ~ Graph ~ newData:", newData)

  useEffect(() => {
    let updatedData = data.map((curve) => {
      return curve.map((row) => {
        if (row > 100) {
          return row / 100;
        } else {
          return row;
        }
      });
    });
    console.log("🚀 ~ updatedData ~ updatedData:", updatedData)
    setNewData(updatedData);
  }, [data])

  return (
    <Chart
      width={'100%'}
      height={'400px'}
      chartType="LineChart"
      loader={<div>Loading Chart</div>}
      data={newData}
      options={{
        title: '',
        hAxis: {
          title: 'Diâmetro (mm)',
          logScale: false,
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
