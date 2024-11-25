import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import Loading from '@/components/molecules/loading';

interface AbramsCurveGraphProps {
  Xvalues: number[];
  Yvalues: number[];
  ac: number;
  formula: string;
  fcj: number;
}

export default function AbramsCurvGraph({ Xvalues, Yvalues, ac, formula, fcj }: AbramsCurveGraphProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const mountData = () => {
    const data: (number | string | { type: string; role: string })[][] = [
      ['Relação A/c', 'Fcj', { type: 'string', role: 'style' }, { type: 'string', role: 'tooltip' }],
    ];

    Xvalues.forEach((elem, index) => {
      const numericX = parseFloat(String(Xvalues[index]));
      const numericY = parseFloat(String(Yvalues[index]));

      if (ac === Number(elem)) {
        data.push([
          numericX,
          numericY,
          'point { size: 6; shape-type: circle; fill-color: #a52714; }',
          `Ponto escolhido para achar A/c [ ${numericX}, ${numericY} ].`,
        ]);
      } else {
        data.push([numericX, numericY, null, null]);
      }
    });

    return data;
  };

  const options = {
    title: `Equação de Referência: ${formula}`,
    subtitle: `A/c: ${ac}  /  Fcj: ${fcj}`,
    legend: 'none',
    curveType: 'function',
    pointSize: 7,
    dataOpacity: 0.6,
    chartArea: { width: '80%', height: '80%' },
    crosshair: {
      trigger: 'both',
    },

    vAxis: {
      title: 'Fcj',
    },
    hAxis: {
      title: 'Relação Água/Cimento',
    },
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div id='chart-div-abramsCurveGraph'>
          <Chart chartType="LineChart" height="500px" data={mountData()} options={options} />
        </div>
      )}
    </>
  );
}
