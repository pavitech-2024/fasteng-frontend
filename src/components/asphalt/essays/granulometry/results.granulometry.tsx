import { useEffect, useState } from 'react';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import ExperimentResume, { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAsphaltGranulometryStore from '@/stores/asphalt/granulometry/asphalt-granulometry.store';
import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import Chart from 'react-google-charts';
import AsphaltGranulometry_resultsTable from './tables/results-table.granulometry';

const AsphaltGranulometry_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  const { results: granulometry_results, step2Data, generalData } = useAsphaltGranulometryStore();

  const [smoothedGraphData, setSmoothedGraphData] = useState<any[]>([]);

  useEffect(() => {
    if (granulometry_results?.graph_data) {
      const smoothedData = smoothGranulometryCurve(granulometry_results.graph_data, 0.3);
      setSmoothedGraphData([
        [t('granulometry-asphalt.passant'), t('granulometry-asphalt.diameter')],
        ...smoothedData,
      ]);
    }
  }, [granulometry_results]);

  // Função para suavizar a curva de granulometria
  const smoothGranulometryCurve = (originalPoints: number[][], smoothingFactor: number = 0.3): number[][] => {
    if (!originalPoints || originalPoints.length < 3) return originalPoints || [];

    const smoothed: number[][] = [];
    
    for (let i = 0; i < originalPoints.length; i++) {
      const currentPoint = originalPoints[i];
      
      if (i === 0 || i === originalPoints.length - 1) {
        smoothed.push([currentPoint[0], currentPoint[1]]);
      } else {
        const prevPoint = originalPoints[i - 1];
        const nextPoint = originalPoints[i + 1];
        
        const smoothedX = currentPoint[0]; // Mantém o X original (diâmetro do sieve)
        const smoothedY = 
          (prevPoint[1] * smoothingFactor + 
           currentPoint[1] * (1 - 2 * smoothingFactor) + 
           nextPoint[1] * smoothingFactor);
        
        smoothed.push([smoothedX, smoothedY]);
        
        if (i < originalPoints.length - 1) {
          const midX = (currentPoint[0] + nextPoint[0]) / 2;
          const midY = (currentPoint[1] + nextPoint[1]) / 2;
          
          const smoothedMidY = midY * 0.7 + (currentPoint[1] + nextPoint[1]) / 2 * 0.3;
          smoothed.push([midX, smoothedMidY]);
        }
      }
    }
    
    const uniquePoints = Array.from(
      new Map(smoothed.map(point => [point[0].toFixed(4), point])).values()
    ).sort((a, b) => a[0] - b[0]);
    
    return uniquePoints;
  };

  const data = {
    container_other_data: [],
  };

  if (granulometry_results) {
    data.container_other_data.push(
      {
        label: t('granulometry-asphalt.accumulated-retained'),
        value: granulometry_results.accumulated_retained,
        unity: '%',
      },
      { label: t('granulometry-asphalt.total-retained'), value: granulometry_results.total_retained, unity: 'g' },
      {
        label: t('asphalt.essays.granulometry.results.nominalSize'),
        value: granulometry_results.nominal_size,
        unity: 'mm',
      },
      {
        label: t('asphalt.essays.granulometry.results.nominalDiammeter'),
        value: granulometry_results.nominal_diameter,
        unity: 'mm',
      },
      {
        label: t('asphalt.essays.granulometry.results.finenessModule'),
        value: granulometry_results.fineness_module,
        unity: '%',
      },
      { label: t('granulometry-asphalt.cc'), value: granulometry_results.cc },
      { label: t('granulometry-asphalt.cnu'), value: granulometry_results.cnu },
      { label: t('granulometry-asphalt.error'), value: granulometry_results.error, unity: '%' }
    );
  }

  const experimentResumeData: ExperimentResumeData = {
    experimentName: generalData.name,
    materials: [{ name: generalData.material.name, type: generalData.material.type }],
  };

  const originalGraphData = [
    [t('granulometry-asphalt.passant'), t('granulometry-asphalt.diameter')],
    ...(granulometry_results?.graph_data || []),
  ];

  const rows = [];

  step2Data?.table_data?.forEach((value, index) => {
    if (granulometry_results?.passant?.[index]) {
      rows.push({
        sieve: value.sieve_label,
        passant_porcentage: value.passant,
        passant: granulometry_results.passant[index][1],
        retained_porcentage: granulometry_results.retained_porcentage?.[index]?.[1] || 0,
        retained: value.retained,
        accumulated_retained: granulometry_results.accumulated_retained?.[index]?.[1] || 0,
      });
    }
  });

  const columns: GridColDef[] = [
    {
      field: 'sieve',
      headerName: t('granulometry-asphalt.sieves'),
      valueFormatter: ({ value }) => `${value}`,
      flex: 1,
    },
    {
      field: 'passant_porcentage',
      headerName: t('granulometry-asphalt.passant') + ' (%)',
      valueFormatter: ({ value }) => `${Number(value).toFixed(2)}`,
      flex: 1,
    },
    {
      field: 'passant',
      headerName: t('granulometry-asphalt.passant') + ' (g)',
      valueFormatter: ({ value }) => `${Number(value).toFixed(2)}`,
      flex: 1,
    },
    {
      field: 'retained_porcentage',
      headerName: t('granulometry-asphalt.retained') + ' (%)',
      valueFormatter: ({ value }) => `${Number(value).toFixed(2)}`,
      flex: 1,
    },
    {
      field: 'retained',
      headerName: t('granulometry-asphalt.retained') + ' (g)',
      valueFormatter: ({ value }) => `${Number(value).toFixed(2)}`,
      flex: 1,
    },
    {
      field: 'accumulated_retained',
      headerName: t('granulometry-asphalt.accumulated-retained') + ' (%)',
      valueFormatter: ({ value }) => `${Number(value).toFixed(2)}`,
      flex: 1,
    },
  ];

  return (
    <>
      <ExperimentResume data={experimentResumeData} />
      <FlexColumnBorder title={t('results')} open={true}>
        <ResultSubTitle title={t('asphalt.essays.granulometry')} sx={{ margin: '.65rem' }} />
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            gap: '10px',
            mt: '20px',
            flexWrap: 'wrap',
          }}
        >
          {data.container_other_data.map((item, index) => {
            if (Array.isArray(item.value)) {
              return null;
            } else {
              return (
                <Result_Card 
                  key={index} 
                  label={item.label} 
                  value={item.value} 
                  unity={item.unity} 
                />
              );
            }
          })}
        </Box>
        
        <Box sx={{ mt: 4 }}>
          <Chart
            chartType="LineChart"
            width={'100%'}
            height={'500px'} 
            loader={<Loading />}
            data={smoothedGraphData.length > 1 ? smoothedGraphData : originalGraphData}
            options={{
              title: t('granulometry-asphalt.granulometry'),
              backgroundColor: 'transparent',
              curveType: 'function', // Suavização do Google Charts
              pointSize: 6,
              pointShape: 'circle',
              lineWidth: 3,
              colors: ['#1976d2'],
              hAxis: {
                title: `${t('granulometry-asphalt.sieve-openness') + ' (mm)'}`,
                type: 'number',
                scaleType: 'log',
                logScale: true,
                gridlines: { count: -1 },
                minorGridlines: { count: 0 },
                format: '####',
              },
              vAxis: {
                title: `${t('granulometry-asphalt.passant') + ' (%)'}`,
                minValue: 0,
                maxValue: 105,
                gridlines: { count: 10 },
                format: '##',
              },
              legend: 'none',
              chartArea: {
                width: '85%',
                height: '80%',
              },
              series: {
                0: {
                  visibleInLegend: false,
                },
              },
              // series: {
              //   1: {
              //     type: 'line',
              //     color: '#ff0000',
              //     lineDashStyle: [4, 4],
              //     visibleInLegend: true,
              //   },
              // },
            }}
          />
        </Box>
        
        <AsphaltGranulometry_resultsTable rows={rows} columns={columns} />
      </FlexColumnBorder>
    </>
  );
};

export default AsphaltGranulometry_Results;