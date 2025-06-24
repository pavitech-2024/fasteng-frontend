// components/Graph/index.js
import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import { text } from 'stream/consumers';

const Graph = ({ data }) => {
  // const [newData, setNewData] = useState();
  // console.log("🚀 ~ Graph ~ newData:", newData)

  // useEffect(() => {
  //   let updatedData = data.map((curve) => {
  //     return curve.map((row) => {
  //       if (row > 100) {
  //         return row / 100;
  //       } else {
  //         return row;
  //       }
  //     });
  //   });
  //   console.log("🚀 ~ updatedData ~ updatedData:", updatedData)
  //   setNewData(updatedData);
  // }, [data])

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
        chartArea: { width: '80%', height: '80%' },
        vAxis: { title: 'Porcentagem passante (%)', titleTextStyle: { italic: false } },
        legend: { position: 'bottom', textStyle: { color: 'black', italic: false } },
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
            opacity: 1,
            lineWidth: 3,
            pointsVisible: true,
            pointSize: 7,
            pointShape: 'square',
            visibleInLegend: false,
          },
          // 1: { color: 'gray', lineDashStyle: [2, 2] },
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
          3: {
            color: 'red',
            labelInLegend: 'Zona de restrição',
          },
          4: {
            visibleInLegend: false,
          },
          5: {
            color: 'green',
            opacity: 1,
            labelInLegend: 'Faixa do DNIT',
          },
          6: {
            color: 'green',
            opacity: 1,
            visibleInLegend: false,
          },
          7: {
            color: 'black',
            pointsVisible: true,
            pointSize: 1.5,
            // visibleInLegend: false
            labelInLegend: 'Curva inferior',
          },
          8: {
            color: 'black',
            pointsVisible: true,
            pointSize: 1.5,
            lineDashStyle: [2, 2],
            // visibleInLegend: false
            labelInLegend: 'Curva intermediária',
          },
          9: {
            color: 'black',
            pointsVisible: true,
            lineDashStyle: [10, 5],
            pointSize: 1.5,
            labelInLegend: 'Curva superior',
          },
        },
      }}
      // options={{
      // 	title: 'Curvas granulométricas',
      // 	width: 0,
      // 	height: 0,
      // 	selectionMode: 'multiple',
      // 	animation: {
      // 		duration: 500,
      // 		easing: 'linear',
      // 		startup: true,
      // 	},
      // 	hAxis: {
      // 		title: '(D/d)^0,45',
      // 		titleTextStyle: { italic: false },
      // 	},
      // 	trendlines: {
      // 		4: {
      // 			color: 'blue',
      // 			labelInLegend: 'Densidade máxima',
      // 			visibleInLegend: true,
      // 		},
      // 	},
      // 	series: {
      // 		0: {
      // 			color: 'black',
      // 			lineWidth: 0,
      // 			opacity: 1,
      // 			pointsVisible: true,
      // 			pointSize: 7,
      // 			pointShape: 'square',
      // 			visibleInLegend: false,
      // 		},
      // 		1: {
      // 			color: 'black',
      // 			lineWidth: 0,
      // 			opacity: 1,
      // 			pointsVisible: true,
      // 			pointSize: 7,
      // 			labelInLegend: 'Pontos de controle',
      // 			pointShape: 'square',
      // 		},
      // 		2: {
      // 			color: 'red',
      // 			visibleInLegend: false,
      // 		},
      // 		4: {
      // 			visibleInLegend: false,
      // 		},
      // 		3: {
      // 			color: 'red',
      // 			labelInLegend: 'Zona de restrição',
      // 		},
      // 		5: {
      // 			color: 'green',
      // 			opacity: 1,
      // 			labelInLegend: 'Faixa do DNIT',
      // 		},
      // 		6: {
      // 			color: 'green',
      // 			opacity: 1,
      // 			visibleInLegend: false,
      // 		},
      // 		7: {
      // 			color: 'black',
      // 			pointsVisible: true,
      // 			pointSize: 1.5,
      // 			// visibleInLegend: false
      // 			labelInLegend: 'Curva inferior',
      // 		},
      // 		8: {
      // 			color: 'black',
      // 			pointsVisible: true,
      // 			pointSize: 1.5,
      // 			lineDashStyle: [2, 2],
      // 			// visibleInLegend: false
      // 			labelInLegend: 'Curva intermediária',
      // 		},
      // 		9: {
      // 			color: 'black',
      // 			pointsVisible: true,
      // 			lineDashStyle: [10, 5],
      // 			pointSize: 1.5,
      // 			labelInLegend: 'Curva superior',
      // 		},
      // 	},
      // 	chartArea: { width: '80%', height: '80%' },
      // 	vAxis: { title: 'Porcentagem passante (%)', titleTextStyle: { italic: false } },
      // 	legend: { position: 'bottom', textStyle: { color: '#515151', fontSize: 11 } },
      // }}
    />
  );
};

export default Graph;
