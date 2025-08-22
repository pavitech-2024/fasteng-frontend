// // components/Graph/index.js
// import React from 'react';
// import { Chart } from 'react-google-charts';

// const Graph = ({ data }) => {
//   return (
//     <Chart
//       width={'100%'}
//       height={'400px'}
//       chartType="LineChart"
//       loader={<div>Loading Chart</div>}
//       data={data}
//       options={{
//         title: 'Curvas granulométricas',
//         selectionMode: 'multiple',
//         hAxis: {
//           title: '(D/d)^0,45',
//           titleTextStyle: { italic: false },
//         },
//         chartArea: { width: '100%', height: '80%' },
//         vAxis: { title: 'Porcentagem passante (%)', titleTextStyle: { italic: false } },
//         legend: { position: 'bottom', textStyle: { color: 'black', italic: false, fontSize: 12 } },
//         trendlines: {
//           4: {
//             color: 'blue',
//             labelInLegend: 'Densidade máxima',
//             visibleInLegend: true,
//           },
//         },
//         series: {
//           0: {
//             color: 'black',
//             lineWidth: 0,
//             pointsVisible: true,
//             pointSize: 7,
//             pointShape: 'square',
//             visibleInLegend: false,
//           },
//           1: {
//             color: 'black',
//             lineWidth: 0,
//             opacity: 1,
//             pointsVisible: true,
//             pointSize: 7,
//             labelInLegend: 'Pontos de controle',
//             pointShape: 'square',
//           },
//           2: { color: 'red', visibleInLegend: false },
//           3: { color: 'red', labelInLegend: 'Zona de restrição' },
//           4: { visibleInLegend: false },
//           5: { color: 'green', opacity: 1, labelInLegend: 'Faixa do DNIT' },
//           6: { color: 'green', opacity: 1, visibleInLegend: false },
//           7: { color: 'black', pointsVisible: true, pointSize: 1.5, labelInLegend: 'Curva inferior' },
//           8: {
//             color: 'black',
//             pointsVisible: true,
//             pointSize: 1.5,
//             lineDashStyle: [2, 2],
//             labelInLegend: 'Curva intermediária',
//           },
//           9: {
//             color: 'black',
//             pointsVisible: true,
//             pointSize: 1.5,
//             lineDashStyle: [10, 5],
//             labelInLegend: 'Curva superior',
//           },
//         },
//       }}
//     />
//   );
// };

// export default Graph;

// components/Graph/index.js
import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import FullScreenIcon from '@/assets/common/fullScreenIcon';
import { Box, Button, Dialog, Modal } from '@mui/material';
import { FullscreenExit } from '@mui/icons-material';

const Graph = ({ data }) => {
  const [fullScreen, setFullScreen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: '100%', height: 400 });

  // Opções do gráfico (copiadas do B)
  const options = {
    title: 'Curvas granulométricas',
    selectionMode: 'multiple',
    hAxis: {
      title: 'Diâmetro (mm)',
      logScale: true,
      titleTextStyle: { italic: false },
    },
    chartArea: { width: '70%', height: '70%' },
    vAxis: { title: 'Porcentagem passante (%)', titleTextStyle: { italic: false } },
    legend: { position: 'bottom', textStyle: { color: 'black', italic: false, fontSize: 12 } },
    series: {
      0: {
        color: 'blue',
        lineDashStyle: [15, 15],
        lineWidth: 3,
      },
      1: {
        color: 'gray',
        lineDashStyle: [2, 2],
      },
      2: {
        color: 'black',
      },
      3: {
        color: 'gray',
        lineDashStyle: [2, 2],
        visibleInLegend: false,
      },
      4: {
        color: 'blue',
        lineDashStyle: [15, 15],
        lineWidth: 3,
        visibleInLegend: false,
      },
    },
  };

  // Resize automático
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth * 0.9;
      const height = window.innerHeight * 0.6;
      setDimensions({ width: width.toString(), height: height });
    };

    handleResize(); // inicial
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll até o gráfico quando os dados mudarem
  useEffect(() => {
    const graphContainer = document.querySelector('#graph-container') as HTMLElement;
    if (graphContainer) {
      window.scrollTo({
        top: graphContainer.offsetTop,
        behavior: 'smooth',
      });
    }
  }, [data]);

  // Bloquear scroll de fundo no fullscreen
  useEffect(() => {
    document.body.style.overflowY = fullScreen ? 'hidden' : 'auto';
  }, [fullScreen]);

  return (
    <Box id="graph-container">
      {/* Modal fullscreen */}
      <Dialog open={fullScreen}>
        <Button>
          <FullscreenExit fill="red" onClick={() => setFullScreen(false)} />
        </Button>
        <Chart chartType="LineChart" data={data} options={options} width="90%" height="90vh" />
      </Dialog>

      {/* Botão expandir */}
      <Button>
        Expandir gráfico
        <FullScreenIcon />
      </Button>

      {/* Gráfico normal */}
      <Chart chartType="LineChart" data={data} options={options} width={dimensions.width} height={dimensions.height} />
    </Box>
  );
};

export default Graph;
