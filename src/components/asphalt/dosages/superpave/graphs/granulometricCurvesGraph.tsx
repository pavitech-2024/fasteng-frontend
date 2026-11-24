import { useMemo } from 'react';
import { Chart } from 'react-google-charts';

export type CurveKey = 'lower' | 'average' | 'higher';

/**
 * O pointsOfCurve cru vem do backend com 11 colunas por peneira:
 *
 * [0] eixo X = (d/D)^0,45   [4] zona de restrição sup   [8]  curva inferior
 * [1] ponto de controle inf [5] densidade máxima        [9]  curva intermediária
 * [2] ponto de controle sup [6] faixa DNIT superior     [10] curva superior
 * [3] zona de restrição inf [7] faixa DNIT inferior
 *
 * Este componente escolhe quais colunas de curva entram e monta as séries do
 * Charts de acordo — por isso o mesmo componente serve para um gráfico de uma
 * curva só e para o comparativo.
 */

// Colunas sempre presentes. Mantidas nesta ordem para que a densidade máxima
// continue sendo a série 4, que é onde a trendline está ancorada.
const FIXED_COLUMNS = [
  { column: 1, label: 'Pontos Inferior' },
  { column: 2, label: 'Pontos Superior' },
  { column: 3, label: 'Zona Inf' },
  { column: 4, label: 'Zona Sup' },
  { column: 5, label: 'Densidade' },
  { column: 6, label: 'Faixa Superior' },
  { column: 7, label: 'Faixa Inferior' },
];

const FIXED_SERIES: Record<number, any> = {
  0: { color: 'black', lineWidth: 0, pointsVisible: true, pointSize: 7, pointShape: 'square', visibleInLegend: false },
  1: {
    color: 'black',
    lineWidth: 0,
    pointsVisible: true,
    pointSize: 7,
    pointShape: 'square',
    labelInLegend: 'Pontos de controle',
  },
  2: { color: 'red', visibleInLegend: false },
  3: { color: 'red', labelInLegend: 'Zona de restrição' },
  4: { visibleInLegend: false },
  5: { color: 'green', opacity: 1, labelInLegend: 'Faixa do DNIT' },
  6: { color: 'green', opacity: 1, visibleInLegend: false },
};

const CURVE_COLUMN: Record<CurveKey, number> = { lower: 8, average: 9, higher: 10 };

const CURVE_META: Record<CurveKey, { label: string; dash?: number[] }> = {
  lower: { label: 'Curva inferior' },
  average: { label: 'Curva intermediária', dash: [2, 2] },
  higher: { label: 'Curva superior', dash: [10, 5] },
};

const toNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null;
  const num = typeof value === 'number' ? value : Number(String(value).replace(',', '.'));
  return Number.isFinite(num) ? num : null;
};

interface Props {
  /** pointsOfCurve como veio do backend, 11 colunas por linha. */
  points: any[];
  /** Quais curvas plotar. Uma só, ou várias no comparativo. */
  curves: CurveKey[];
  title?: string;
  height?: string;
}

const GranulometricCurvesGraph = ({ points, curves, title = 'Curvas granulométricas', height = '400px' }: Props) => {
  const { data, series } = useMemo(() => {
    // Linhas de cabeçalho de versões antigas do store são descartadas aqui.
    const rawRows = (points ?? []).filter((row) => Array.isArray(row) && typeof row[0] === 'number');

    const selected = [...FIXED_COLUMNS, ...curves.map((curve) => ({ column: CURVE_COLUMN[curve], label: CURVE_META[curve].label }))];

    // Tipo declarado coluna a coluna: sem isso o Charts infere pela primeira
    // linha e quebra com "All series on a given axis must be of the same data
    // type" quando uma coluna vem inteira nula.
    const headers = [
      { label: 'Peneira', type: 'number' },
      ...selected.map(({ label }) => ({ label, type: 'number' })),
    ];

    // Ordenar por diâmetro é obrigatório: o Charts liga os pontos na ordem do
    // array, e o backend não garante ordem nenhuma.
    const rows = [...rawRows]
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map((row) => [toNumber(row[0]), ...selected.map(({ column }) => toNumber(row[column]))]);

    const curveSeries = curves.reduce((acc, curve, index) => {
      const meta = CURVE_META[curve];
      acc[FIXED_COLUMNS.length + index] = {
        color: 'black',
        pointsVisible: true,
        pointSize: 1.5,
        labelInLegend: meta.label,
        ...(meta.dash ? { lineDashStyle: meta.dash } : {}),
      };
      return acc;
    }, {} as Record<number, any>);

    return { data: [headers, ...rows], series: { ...FIXED_SERIES, ...curveSeries } };
  }, [points, curves]);

  if (data.length <= 1) return null;

  return (
    <Chart
      width={'100%'}
      height={height}
      chartType="LineChart"
      loader={<div>Carregando gráfico</div>}
      data={data}
      options={{
        title,
        // Reta entre pontos: a spline do Charts extrapola e desenha passante
        // acima de 100%, que é fisicamente impossível.
        curveType: 'none',
        selectionMode: 'multiple',
        // Sem isso o Charts costura as lacunas: os pontos de controle viram
        // linha e a zona de restrição atravessa o gráfico inteiro.
        interpolateNulls: false,
        hAxis: {
          title: '(d/D)^0,45',
          titleTextStyle: { italic: false },
        },
        vAxis: {
          title: 'Porcentagem passante (%)',
          titleTextStyle: { italic: false },
          viewWindow: { min: 0, max: 105 },
        },
        chartArea: { left: 60, right: 40, top: 40, bottom: 60, width: '80%', height: '70%' },
        legend: { position: 'bottom', textStyle: { color: 'black', italic: false, fontSize: 12 } },
        trendlines: {
          4: { color: 'blue', labelInLegend: 'Densidade máxima', visibleInLegend: true },
        },
        series,
      }}
    />
  );
};

export default GranulometricCurvesGraph;