import { CloseIcon } from '@/assets';
import FullScreenIcon from '@/assets/common/fullScreenIcon';
import { Title } from '@mui/icons-material';
import { Box, Button, Modal } from '@mui/material';
import { useState, useRef, useEffect, useCallback } from 'react';
import Chart, { GoogleChartWrapper, ReactGoogleChartEvent } from 'react-google-charts';

const Graph = ({ data, nominalSize }) => {
  const [fullScreen, setFullScreen] = useState(false);
  const [ready, setReady] = useState(false);
  const [options, setOptions] = useState({
    title: 'Curvas granulométricas',
    width: 0,
    height: 0,
    selectionMode: 'multiple',
    animation: {
      duration: 500,
      easing: 'linear',
      startup: true,
    },
    hAxis: {
      title: '(D/d)^0,45',
      titleTextStyle: { italic: false },
    },
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
        opacity: 1,
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
      2: {
        color: 'red',
        visibleInLegend: false,
      },
      4: {
        visibleInLegend: false,
      },
      3: {
        color: 'red',
        labelInLegend: 'Zona de restrição',
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
        labelInLegend: 'Curva inferior',
      },
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
        lineDashStyle: [10, 5],
        pointSize: 1.5,
        labelInLegend: 'Curva superior',
      },
    },
    chartArea: { width: '80%', height: '80%' },
    vAxis: { title: 'Porcentagem passante (%)', titleTextStyle: { italic: false } },
    legend: { position: 'bottom', textStyle: { color: '#515151', fontSize: 11 } },
  });
  const optionsFullScreen = useRef({ ...options });
  const graphContainerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => updateWindowDimensions(fullScreen);
    window.addEventListener('load', handleResize);
    window.addEventListener('resize', handleResize);

    const { width, height } = getPercentDimensions();
    setOptions((prevOptions) => ({ ...prevOptions, width, height }));
    optionsFullScreen.current = { ...options, width, height };

    return () => {
      window.removeEventListener('load', handleResize);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (data) {
      scrollToGraph();
    }
  }, [data]);

  const scrollToGraph = () => {
    if (graphContainerRef.current) {
      const distanceOfTop = graphContainerRef.current.offsetTop;
      window.scrollTo({
        top: distanceOfTop,
        behavior: 'smooth',
      });
    }
  };

  const getPercentDimensions = () => {
    let width = (window.innerWidth - 91) * 0.95;
    const windowSize = window.innerWidth;
    if (width > windowSize) {
      width = (windowSize * 0.98 - 16) * 0.9;
    }
    updateStaticDivGoogle(width, 'reactgooglegraph-1', window.innerHeight - 50);
    return { width: width, height: window.innerHeight - 50 };
  };

  const updateStaticDivGoogle = (width, graphId, height = 0) => {
    let graphContainer = document.getElementById(graphId);
    if (graphContainer) {
      graphContainer = graphContainer.parentElement;
      graphContainer.style.width = `${width}px`;
      height !== 0 ? (graphContainer.style.height = `${height}px`) : (graphContainer.style.height = `${width / 2}px`);
    }
  };

  const updateWindowDimensions = (fullScreen) => {
    const { width, height } = getPercentDimensions();
    if (fullScreen) {
      updateStaticDivGoogle(window.innerWidth * 0.9, 'reactgooglegraph-2', window.innerHeight * 0.9);
      optionsFullScreen.current = { ...options, width: window.innerWidth * 0.9, height: window.innerHeight * 0.9 };
      setOptions((prevOptions) => ({ ...prevOptions, width, height }));
      document.querySelector('body').style.overflowY = 'hidden';
    } else {
      document.querySelector('body').style.overflowY = 'auto';
      setOptions((prevOptions) => ({ ...prevOptions, width, height }));
    }
    setFullScreen(fullScreen);
  };

  // const chartEvents: ReactGoogleChartEvent[] = useCallback(() => {
  //   return [
  //     {
  //       eventName: 'ready',
  //       callback: (chartWrapper: GoogleChartWrapper) => {
  //         if (!ready) {
  //           scrollToGraph();
  //           setReady(true);
  //         }
  //       },
  //     },
  //   ];
  // }, [ready]);

  return (
    <Box id="graph-container" ref={graphContainerRef}>
      {/* <Modal isOpen={fullScreen}>
        <ActionsModal>
          <CloseIcon
            fill="#efc6c6"
            onClick={() => updateWindowDimensions(false)}
          />
        </ActionsModal>
        <Chart chartType="LineChart" data={data} options={optionsFullScreen.current} />
      </Modal> */}
      <Title>Tamanho nominal máximo: {nominalSize} mm</Title>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'flex-end',
        }}
      >
        <Button onClick={() => updateWindowDimensions(true)}>
          Expandir gráfico
          <FullScreenIcon />
        </Button>
      </Box>
      <Chart chartType="LineChart" data={data} options={options} />
    </Box>
  );
};

export default Graph;
