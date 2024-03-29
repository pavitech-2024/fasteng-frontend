import { CloseIcon } from "@/assets";
import { Fullscreen } from "@mui/icons-material";
import { Button, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import Chart from "react-google-charts";

const GraficoPage7N = ({ data }) => {
  const [fullScreen, setFullScreen] = useState(false);
  const [options, setOptions] = useState({
    fullScreen: false,
    result: {},
    optionsFullScreen: {},
    options: {
      legend: { position: "none" },
      series: {
        0: { axis: "Temps" },
        1: { axis: "Daylight" }
      },
      axes: {
        y: {
          Temps: { label: "Volume de vazios (%)" },
          Daylight: { label: "Relação betume/vazios (%)" }
        },
        x: { label: "vv x rbv" }
      },
      hAxis: {
        title: "Teor de ligante asfáltico (%)",
        titleTextStyle: { italic: false }
      },
      chartArea: { width: "80%", height: "70%" }
    },
    data
  });

  useEffect(() => {
    const onResize = () => {
      updateWindowDimensions(fullScreen);
    };

    window.onload = onResize;
    window.onresize = onResize;

    return () => {
      window.onload = null;
      window.onresize = null;
    };
  }, [fullScreen]);

  const getPercentDimensions = () => {
    const parent = document.getElementById("componentAux");
    let width = parent.clientWidth * 0.9;
    const windowSize = window.innerWidth;
    if (width > windowSize) {
      width = (windowSize * 0.98 - 16) * 0.9;
    }
    updateStaticDivGoogle(width, "reactgoog'leg'raph-1");
    return { width: width, height: width / 2 };
  };

  const updateStaticDivGoogle = (width, graphId, height = 0) => {
    let graphContainer = document.getElementById(graphId);
    if (graphContainer) {
      graphContainer = graphContainer.parentElement;
      graphContainer.style.width = `${width}px`;
      height !== 0
        ? (graphContainer.style.height = `${height}px`)
        : (graphContainer.style.height = `${width / 2}px`);
    }
  };

  const updateWindowDimensions = fullScreen => {
    if (fullScreen) {
      const { width, height } = getPercentDimensions();
      updateStaticDivGoogle(
        window.innerWidth * 0.84,
        "reactgooglegraph-2",
        window.innerHeight * 0.84
      );
      setOptions(prevState => ({
        ...prevState,
        optionsFullScreen: {
          ...prevState.optionsFullScreen,
          width: window.innerWidth * 0.83,
          height: window.innerHeight * 0.83
        },
        options: {
          ...prevState.options,
          width: width,
          height: height
        },
        fullScreen: true
      }));
    } else {
      const { width, height } = getPercentDimensions();
      setOptions(prevState => ({
        ...prevState,
        options: {
          ...prevState.options,
          width: width,
          height: height
        },
        fullScreen: false
      }));
    }
  };

  return (
    <div id="graphContainer">
      <Modal open={fullScreen}>
        <div>
          <Button
            onClick={() => {
              updateWindowDimensions(false);
            }}
          >
            <CloseIcon fill="red" />
          </Button>
          <Chart
            chartType="Line"
            data={data}
            options={options.optionsFullScreen}
          />
        </div>
      </Modal>
      <Button
        onClick={() => {
          updateWindowDimensions(true);
        }}
      >
        Expandir gráfico
        <Fullscreen />
      </Button>
      <Chart
        chartType="Line"
        loader={<i className="pi pi-spinner" />}
        data={data}
        options={options.options}
      />
    </div>
  );
};

export default GraficoPage7N;