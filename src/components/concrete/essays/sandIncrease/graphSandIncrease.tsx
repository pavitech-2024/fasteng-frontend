import { useEffect, useState } from 'react';
import Chart from 'react-google-charts';

const GraphSandIncrease = (props) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const { curve, retaR, retaS, retaT, retaU } = props.results;

    const ExtraPoints = [];

    const newData = curve.map((elem) => {
      const Xcoords = elem[0];
      const currentData = [Xcoords, elem[1]];

      const processReta = (reta, type) => {
        let status = false;
        reta.forEach((R) => {
          if (R[0] === Xcoords) {
            currentData.push(R[1]);
            status = true;
          } else {
            ExtraPoints.push([R[0], type, R[1]]);
          }
        });
        if (!status) currentData.push(null);
      };

      processReta(retaR, 'R');
      processReta(retaS, 'S');
      processReta(retaT, 'T');
      processReta(retaU, 'U');

      return currentData;
    });

    const NewPoints = [];
    ExtraPoints.forEach((elem) => {
      NewPoints.push([
        elem[0],
        null,
        elem[1] === 'R' ? elem[2] : null,
        elem[1] === 'S' ? elem[2] : null,
        elem[1] === 'T' ? elem[2] : null,
        elem[1] === 'U' ? elem[2] : null,
      ]);
    });

    newData.unshift(['Texto X', 'Curva', 'Reta R', 'Reta S', 'Reta T', 'Reta U']);
    setData([...newData, ...NewPoints]);
  }, [props.results]);

  const options = {
    title: `Gráfico Inchamento Areia`,
    legend: 'none',
    curveType: 'function',
    pointSize: 7,
    dataOpacity: 0.6,
    chartArea: { width: '80%', height: '80%' },
    crosshair: {
      trigger: 'both',
    },
    vAxis: {
      title: 'Texto em X',
    },
    hAxis: {
      title: 'Texto em Y',
    },
  };

  return (
    <div style={{ width: '100%' }}>
      <Chart chartType="LineChart" height="500px" width="100%" data={data} options={options} />
    </div>
  );
};

export default GraphSandIncrease;
