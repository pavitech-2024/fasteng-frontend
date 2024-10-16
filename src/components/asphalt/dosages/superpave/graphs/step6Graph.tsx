// /components/Graph.tsx

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Container, Modal, Typography } from '@mui/material';
import ModalBase from '@/components/molecules/modals/modal';

// Carregar Chart dinamicamente para evitar problemas com SSR
const Chart = dynamic(() => import('react-google-charts').then((mod) => mod.Chart), { ssr: false });

interface GraphProps {
  data: any[];
}

const GraphStep6: React.FC<GraphProps> = ({ data }) => {
  const [fullScreen, setFullScreen] = useState(false);
  const [options, setOptions] = useState({
    width: 0,
    height: 0,
    selectionMode: 'multiple',
    animation: {
      duration: 500,
      easing: 'linear',
      startup: true,
    },
    chartArea: {
      width: '80%',
      height: '80%',
    },
    hAxis: {
      title: 'Nº de Giros',
      titleTextStyle: { italic: false },
      maxValue: data.length + 4,
    },
    series: {
      0: {
        color: 'rgb(63, 199, 250)',
        lineWidth: 1,
        pointsVisible: true,
        pointSize: 1,
        labelInLegend: 'Altura (mm)',
      },
      1: {
        color: 'rgb(133, 210, 98)',
        lineWidth: 1,
        pointsVisible: true,
        pointSize: 1,
        labelInLegend: 'Gmb*/Gmm',
      },
      2: {
        color: 'rgb(254, 140, 106)',
        lineWidth: 1,
        pointsVisible: true,
        pointSize: 1,
        labelInLegend: 'Volume de Vazios (%)',
      },
    },
    legend: {
      position: 'top',
      textStyle: {
        color: '#515151',
        fontSize: 14,
      },
    },
  });
  const [optionsFullScreen, setOptionsFullScreen] = useState({ ...options });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      updateWindowDimensions(fullScreen);
    };

    const { width, height } = getPercentDimensions();
    setOptions((prevOptions) => ({
      ...prevOptions,
      width,
      height,
    }));
    setOptionsFullScreen((prevOptions) => ({
      ...prevOptions,
      width,
      height,
    }));

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [fullScreen]);

  useEffect(() => {
    scrollToGraph();
  }, [data]);

  const scrollToGraph = () => {
    const graphContainer = document.querySelector('#graph-container') as HTMLElement;
    if (graphContainer) {
      const distanceOfTop = graphContainer.offsetTop;
      window.scrollTo({
        top: distanceOfTop,
        behavior: 'smooth',
      });
    }
  };

  const getPercentDimensions = () => {
    const windowSize = window.innerWidth;
    let width = (windowSize - 91) * 0.7;
    if (width > windowSize) {
      width = (windowSize * 0.98 - 16) * 0.9;
    }
    updateStaticDivGoogle(width, 'reactgooglegraph-1', window.innerHeight - 50);
    return { width: width, height: window.innerHeight * 0.75 };
  };

  const updateStaticDivGoogle = (width: number, graphId: string, height = 0) => {
    let graphContainer = document.getElementById(graphId) as HTMLElement;
    if (graphContainer) {
      graphContainer = graphContainer.parentElement as HTMLElement;
      graphContainer.style.width = `${width}px`;
      height !== 0 ? (graphContainer.style.height = `${height}px`) : (graphContainer.style.height = `${width / 2}px`);
    }
  };

  const updateWindowDimensions = (fullScreen: boolean) => {
    const newOptions = { ...options };
    const newOptionsFullScreen = { ...optionsFullScreen };
    if (fullScreen) {
      const { width, height } = getPercentDimensions();
      updateStaticDivGoogle(window.innerWidth * 0.9, 'reactgooglegraph-2', window.innerHeight * 0.9);
      newOptionsFullScreen.width = window.innerWidth * 0.9;
      newOptionsFullScreen.height = window.innerHeight * 0.9;
      newOptions.width = width;
      newOptions.height = height;
      setOptions(newOptions);
      setOptionsFullScreen(newOptionsFullScreen);
      document.querySelector('body')!.style.overflowY = 'hidden';
    } else {
      document.querySelector('body')!.style.overflowY = 'auto';
      const { width, height } = getPercentDimensions();
      newOptions.width = width;
      newOptions.height = height;
      setOptions(newOptions);
    }
    setFullScreen(fullScreen);
  };

  const chartEvents = () => [
    {
      eventName: 'ready',
      callback: ({ chartWrapper }) => {
        if (!ready) {
          scrollToGraph();
          setReady(true);
        }
      },
    },
  ];

  return (
    <Container id="graph-container">
      <ModalBase
        open={fullScreen}
        title={'Modal'}
        leftButtonTitle={'esquerda'}
        rightButtonTitle={'direita'}
        onCancel={() => setFullScreen(false)}
        size={'small'}
        onSubmit={() => console.log('teste')}
      >
        {/* <ActionsModal>
          <CloseIcon
            fill="#efc6c6"
            onClick={() => {
              updateWindowDimensions(false);
            }}
          />
        </ActionsModal> */}
        <Chart chartType="LineChart" data={data} options={optionsFullScreen} />
      </ModalBase>
      <Typography>Parâmetros vs Nº de Giros</Typography>
      {/* <Actions>
        <ExpandButton
          onClick={() => {
            updateWindowDimensions(true);
          }}
        >
          Expandir gráfico
          <FullScreenIcon />
        </ExpandButton>
      </Actions> */}
      <Chart
        chartType="LineChart"
        data={data}
        // chartEvents={chartEvents()}
        options={options}
      />
    </Container>
  );
};

export default GraphStep6;
