import Result_Card, { Result_CardContainer } from '@/components/atoms/containers/result-card';
import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
import { t } from 'i18next';
import Chart from 'react-google-charts';
import { useEffect, useState } from 'react';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
//import {AsphaltMaterial, GranulometryResult, ViscosityResult, GranulometryItem} from '@/components/asphalt/dosages/superpave/types/results-gr';

const Superpave_Step3_GranulometryResults = ({
  setNextDisabled,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const { granulometryResultsData: data } = useSuperpaveStore();
  const [granulometryData, setGranulometryData] = useState<any[]>([]);
  const [materialsToShow, setMaterialToShow] = useState<string[]>([]);

  // VALIDAÇÃO: Verificar se data existe
  if (!data) {
    return <div>Dados não disponíveis</div>;
  }

  const storeData = data as any;

  const aggregatesCheckboxes =
    storeData.granulometrys?.map((gran) => ({
      name: gran.material.name,
      type: gran.material.type,
    })) || [];

  if (storeData.viscosity?.material) {
    aggregatesCheckboxes.push({
      name: storeData.viscosity.material.name,
      type: storeData.viscosity.material.type,
    });
  }

  useEffect(() => {
    const newGranulometryData =
      storeData.granulometrys?.map((gran: any) => {
        if (gran.result && gran.result.graph_data && Array.isArray(gran.result.graph_data)) {
          return processResultData(gran, t);
        }

        let tableData = null;

        if (gran.data?.table_data && Array.isArray(gran.data.table_data) && gran.data.table_data.length > 0) {
          tableData = gran.data.table_data;
        } else if (gran.data && Array.isArray(gran.data) && gran.data.length > 0) {
          tableData = gran.data;
        }

        if (tableData && tableData.length > 0) {
          return processTableData(gran.material, tableData, t);
        }

        return getEmptyDataStructure(gran.material, t);
      }) || [];

    setGranulometryData(newGranulometryData);
  }, [storeData.granulometrys, t]);

  const processResultData = (gran: any, t: any) => {
    const result = gran.result;

    const getNumericValue = (value: any): number => {
      if (Array.isArray(value) && value.length > 0 && Array.isArray(value[0])) {
        return Number(value[value.length - 1]?.[1]) || 0;
      }
      return Number(value) || 0;
    };

    return {
      material: gran.material,
      graph: [[t('granulometry-asphalt.passant'), t('granulometry-asphalt.diameter')], ...(result.graph_data ?? [])],
      data: [
        {
          label: t('granulometry-asphalt.accumulated-retained'),
          value: getNumericValue(result.accumulated_retained),
          unity: '%',
        },
        {
          label: t('granulometry-asphalt.total-retained'),
          value: result.total_retained ?? 0,
          unity: 'g',
        },
        {
          label: t('asphalt.essays.granulometry.results.nominalSize'),
          value: result.nominal_size ?? 0,
          unity: 'mm',
        },
        {
          label: t('asphalt.essays.granulometry.results.nominalDiammeter'),
          value: result.nominal_diameter ?? 0,
          unity: 'mm',
        },
        {
          label: t('asphalt.dosages.superpave.granulometry-fineness-module'),
          value: result.fineness_module ?? 0,
          unity: '%',
        },
        {
          label: t('asphalt.dosages.superpave.granulometry-cc'),
          value: result.cc ?? 0,
          unity: '%',
        },
        {
          label: t('asphalt.dosages.superpave.granulometry-cnu'),
          value: result.cnu ?? 0,
          unity: '%',
        },
        {
          label: t('asphalt.dosages.superpave.granulometry-error'),
          value: result.error ?? 0,
          unity: '%',
        },
      ],
    };
  };

  // so qnd (quando não tem result)
  const processTableData = (material: any, tableData: any[], t: any) => {
    console.log('🎯 Processando table_data no frontend:', tableData);

    // formato de graph_data
    const graphData = tableData.map((item: any) => {
      const sieveValue = item.sieve_value || item.diameter || item.sieve || item.x || 0;
      const passantValue = item.passant || item.passing || item.y || item.value || 0;

      return [sieveValue, passantValue];
    });

    graphData.sort((a: number[], b: number[]) => b[0] - a[0]);

    console.log('📊 Graph data gerado:', graphData);

    return {
      material: material,
      graph: [[t('granulometry-asphalt.passant'), t('granulometry-asphalt.diameter')], ...graphData],
      data: [
        {
          label: t('granulometry-asphalt.accumulated-retained'),
          value: calculateAccumulatedRetained(tableData),
          unity: '%',
        },
        {
          label: t('granulometry-asphalt.total-retained'),
          value: calculateTotalRetained(tableData),
          unity: 'g',
        },
        {
          label: t('asphalt.essays.granulometry.results.nominalSize'),
          value: calculateNominalSize(tableData),
          unity: 'mm',
        },
        {
          label: t('asphalt.essays.granulometry.results.nominalDiammeter'),
          value: calculateNominalDiameter(tableData),
          unity: 'mm',
        },
        {
          label: t('asphalt.dosages.superpave.granulometry-fineness-module'),
          value: 0, // Calcular depois, msm pro rest
          unity: '%',
        },
        {
          label: t('asphalt.dosages.superpave.granulometry-cc'),
          value: 0,
          unity: '%',
        },
        {
          label: t('asphalt.dosages.superpave.granulometry-cnu'),
          value: 0,
          unity: '%',
        },
        {
          label: t('asphalt.dosages.superpave.granulometry-error'),
          value: 0,
          unity: '%',
        },
      ],
    };
  };

  const getEmptyDataStructure = (material: any, t: any) => ({
    material: material,
    graph: [[t('granulometry-asphalt.passant'), t('granulometry-asphalt.diameter')]],
    data: [
      { label: t('granulometry-asphalt.accumulated-retained'), value: 0, unity: '%' },
      { label: t('granulometry-asphalt.total-retained'), value: 0, unity: 'g' },
      { label: t('asphalt.essays.granulometry.results.nominalSize'), value: 0, unity: 'mm' },
      { label: t('asphalt.essays.granulometry.results.nominalDiammeter'), value: 0, unity: 'mm' },
      { label: t('asphalt.dosages.superpave.granulometry-fineness-module'), value: 0, unity: '%' },
      { label: t('asphalt.dosages.superpave.granulometry-cc'), value: 0, unity: '%' },
      { label: t('asphalt.dosages.superpave.granulometry-cnu'), value: 0, unity: '%' },
      { label: t('asphalt.dosages.superpave.granulometry-error'), value: 0, unity: '%' },
    ],
  });

  const calculateAccumulatedRetained = (tableData: any[]): number => {
    const item200 = tableData.find((item) => item.sieve_label?.includes('200') || item.sieve_value === 0.075);
    return item200?.retained || 0;
  };

  const calculateTotalRetained = (tableData: any[]): number => {
    return tableData.reduce((sum, item) => sum + (item.retained || 0), 0);
  };

  const calculateNominalSize = (tableData: any[]): number => {
    const firstUnder100 = tableData.find((item) => (item.passant || item.passing) < 100);
    return firstUnder100?.sieve_value || firstUnder100?.diameter || 0;
  };

  const calculateNominalDiameter = (tableData: any[]): number => {
    return calculateNominalSize(tableData);
  };

  const handleCheckboxClick = (item: { name: string; type: string }) => {
    if (materialsToShow.find((material) => material === item.name)) {
      setMaterialToShow(materialsToShow.filter((material) => material !== item.name));
    } else {
      setMaterialToShow([...materialsToShow, item.name]);
    }
  };

  setNextDisabled(false);

  // VALIDAÇÃO: Verificar se há dados para mostrar
  if (!granulometryData || granulometryData.length === 0) {
    return (
      <Box>
        <Typography>Nenhum dado de granulometria disponível</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box>
        <FormGroup sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {aggregatesCheckboxes?.map((item, index) => (
            <FormControlLabel
              key={index}
              control={<Checkbox onClick={() => handleCheckboxClick(item)} />}
              label={`${item.name} | ` + t(`asphalt.materials.${item.type}`)}
            />
          ))}
        </FormGroup>

        {granulometryData.map((item, index) => {
          // VALIDAÇÃO: Verificar se item e material existem
          if (!item || !item.material || !materialsToShow.find((material) => material === item.material?.name)) {
            return null;
          }

          return (
            <FlexColumnBorder
              key={index}
              title={`${item.material?.name} | ` + t(`asphalt.materials.${item.material?.type}`)}
              open={true}
            >
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px',
                  mt: '20px',
                }}
                key={index}
              >
                {item.data.map((dataItem: any, dataIndex: number) => {
                  if (Array.isArray(dataItem.value)) {
                    return null;
                  } else {
                    return (
                      <Result_Card
                        key={dataIndex}
                        label={dataItem.label}
                        value={dataItem.value}
                        unity={dataItem.unity}
                      />
                    );
                  }
                })}

                {/* VALIDAÇÃO PARA O GRÁFICO */}
                {item.graph && item.graph.length > 1 ? (
                  <Chart
                    chartType="LineChart"
                    width={'100%'}
                    height={'400px'}
                    loader={<Loading />}
                    data={item.graph}
                    options={{
                      title: t('granulometry-asphalt.granulometry'),
                      backgroundColor: 'transparent',
                      pointSize: '5',
                      hAxis: {
                        title: `${t('granulometry-asphalt.sieve-openness') + ' (mm)'}`,
                        type: 'number',
                        scaleType: 'log',
                      },
                      vAxis: {
                        title: `${t('granulometry-asphalt.passant') + ' (%)'}`,
                        minValue: '0',
                        maxValue: '105',
                      },
                      legend: 'none',
                    }}
                  />
                ) : (
                  <Typography>Dados do gráfico não disponíveis</Typography>
                )}
              </Box>
            </FlexColumnBorder>
          );
        })}

        {/* VALIDAÇÃO COMPLETA PARA VISCOSIDADE */}
        {storeData.viscosity?.material &&
          materialsToShow.find((item) => item === storeData.viscosity.material.name) &&
          storeData.viscosity.result && (
            <FlexColumnBorder
              title={`${storeData.viscosity.material.name} | ${storeData.viscosity.material.type}`}
              open={true}
            >
              <Typography variant="h6">{t('viscosity-rotational.compression-temperature')}</Typography>
              <Result_CardContainer sx={{ marginBottom: '2rem' }}>
                {Object.entries(storeData.viscosity.result.result.compressionTemperatureRange || {}).map(
                  ([key, value], index) => (
                    <Result_Card key={index} label={key} value={Number(value).toFixed(2).toString()} unity={'°C'} />
                  )
                )}
              </Result_CardContainer>

              <Typography variant="h6">{t('viscosity-rotational.aggregate-temperature')}</Typography>
              <Result_CardContainer sx={{ marginBottom: '2rem' }}>
                {Object.entries(storeData.viscosity.result.result.aggregateTemperatureRange || {}).map(
                  ([key, value], index) => (
                    <Result_Card key={index} label={key} value={Number(value).toFixed(2).toString()} unity={'°C'} />
                  )
                )}
              </Result_CardContainer>

              <Typography variant="h6">{t('viscosity-rotational.machining-temperature')}</Typography>
              <Result_CardContainer sx={{ marginBottom: '2rem' }}>
                {Object.entries(storeData.viscosity.result.result.machiningTemperatureRange || {}).map(
                  ([key, value], index) => (
                    <Result_Card key={index} label={key} value={Number(value).toFixed(2).toString()} unity={'°C'} />
                  )
                )}
              </Result_CardContainer>

              <Typography variant="h6">{t('asphalt.essays.viscosityRotational.graph')}</Typography>
              {storeData.viscosity.result.result.curvePoints &&
              storeData.viscosity.result.result.curvePoints.length > 0 ? (
                <Chart
                  chartType="LineChart"
                  width={'100%'}
                  height={'400px'}
                  loader={<Loading />}
                  data={storeData.viscosity.result.result.curvePoints}
                  options={{
                    backgroundColor: 'transparent',
                    hAxis: {
                      title: `${t('asphalt.essays.viscosityRotational.temperature')} C`,
                    },
                    vAxis: {
                      title: `${t('asphalt.essays.viscosityRotational.viscosity')} (SSF)`,
                      maxValue: '1.5',
                    },
                    explorer: {
                      actions: ['dragToZoom', 'rightClickToReset'],
                      axis: 'vertical',
                    },
                    legend: 'none',
                    trendlines: {
                      0: {
                        type: 'polynomial',
                        degree: 4,
                        visibleInLegend: true,
                        labelInLegend: 'curva',
                      },
                    },
                  }}
                />
              ) : (
                <Typography>Dados do gráfico de viscosidade não disponíveis</Typography>
              )}
            </FlexColumnBorder>
          )}
      </Box>
    </>
  );
};

export default Superpave_Step3_GranulometryResults;
