
import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import FullScreenIcon from '@/assets/common/fullScreenIcon';
import { Box, Button, Dialog, Modal } from '@mui/material';
import { FullscreenExit } from '@mui/icons-material';

const MarshallGranulometryGraph = ({ data }) => {
  const [fullScreen, setFullScreen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: '100%', height: 400 });

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
    const MarshallGranulometrygraphContainer = document.querySelector('#MarshallGranulometrygraph-container') as HTMLElement;
    if (MarshallGranulometrygraphContainer) {
      window.scrollTo({
        top: MarshallGranulometrygraphContainer.offsetTop,
        behavior: 'smooth',
      });
    }
  }, [data]);

  // Bloquear scroll de fundo no fullscreen
  useEffect(() => {
    document.body.style.overflowY = fullScreen ? 'hidden' : 'auto';
  }, [fullScreen]);

  return (
    <Box id="MarshallGranulometrygraph-container">
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

export default MarshallGranulometryGraph;
