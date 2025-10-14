
import Result_Card, { Result_CardContainer } from '@/components/atoms/containers/result-card';
import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore, { SuperpaveData } from '@/stores/asphalt/superpave/superpave.store';
import { Box, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
import { t } from 'i18next';
import Chart from 'react-google-charts';
import { useEffect, useState } from 'react';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import useAuth from '@/contexts/auth';
//import {AsphaltMaterial, GranulometryResult, ViscosityResult, GranulometryItem} from '@/components/asphalt/dosages/superpave/types/results-gr';

const Superpave_Step3_GranulometryResults = ({
  setNextDisabled, superpave
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const { granulometryResultsData: data } = useSuperpaveStore();
  const [granulometryData, setGranulometryData] = useState<any[]>([]);
  const [materialsToShow, setMaterialToShow] = useState<string[]>([]);
  const [hasProcessed, setHasProcessed] = useState(false);
   const compositionData = useSuperpaveStore((state) => state.granulometryCompositionData);
  const { user } = useAuth();

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
 // console.log('🔍 ESTRUTURA REAL DOS DADOS:');
  //storeData.granulometrys.forEach((gran, index) => {
    //console.log(`Material ${index} (${gran.material.name}):`, gran);
    //console.log(`- Tem data?`, !!gran.data);
    //console.log(`- Data completo:`, gran.data);
    //console.log(`- Tem result?`, !!gran.result);
  //});
    if (hasProcessed || !storeData.granulometrys || storeData.granulometrys.length === 0) {
      return;
    }
  const saveGranulometryDataForComposition = async () => {
    try {
     // console.log('🎯 FRONTEND: Iniciando processamento...');
     
      setHasProcessed(true);
      
      if (!storeData.granulometrys || storeData.granulometrys.length === 0) {
       // console.log('❌ FRONTEND: Nenhum dado de granulometria');
        return;
      }

      // CORREÇÃO: Incluir todas as propriedades obrigatórias
      const superpaveData: SuperpaveData = {
        generalData: {
          ...storeData.generalData,
          userId: storeData.generalData?.userId || user._id,
          name: storeData.generalData?.name || 'Composição Granulométrica',
          trafficVolume: storeData.generalData?.trafficVolume || 'medium',
          objective: storeData.generalData?.objective || 'bearing',
          dnitBand: storeData.generalData?.dnitBand || 'C',
          step: 3
        },
        
        // ⚠️ CORREÇÃO: Incluir todas as propriedades de SuperpaveGranulometryEssayData
        granulometryEssayData: {
          materials: storeData.granulometrys.map(gran => gran.material), // ✅ Obrigatório
          granulometrys: storeData.granulometrys.map(gran => {
            // Converter result para essayData
            const passantPorcentage = gran.result.passant_porcentage;
            const graphData = gran.result.graph_data;
            
            return {
              material: gran.material,
              material_mass: 100, // Valor padrão para cálculo
              table_data: passantPorcentage.map((item, index) => ({
                sieve_label: item[0], // Ex: "1 1/2 pol - 38,1mm"
                sieve_value: graphData[index]?.[0] || 0, // Pega o valor do graph_data
                passant: item[1], // Percentual que passa
                retained: 0 // Não temos este dado, mas o backend pode calcular
              })),
              sieve_series: graphData.map(item => ({
                label: `${item[0]}mm`, // Converte para label
                value: item[0] // Valor numérico
              })),
              bottom: 0 // Valor padrão
            };
          }),
          viscosity: storeData.granulometryEssayData?.viscosity || null // ✅ Obrigatório
        },
        
        // ⚠️ CORREÇÃO: Incluir todas as propriedades de SuperpaveGranulometryResults
        granulometryResultsData: {
          granulometrys: storeData.granulometrys.map(gran => ({
            material: gran.material,
            result: gran.result
          })),
          viscosity: storeData.granulometryResultsData?.viscosity || null // ✅ Obrigatório
        },
        
        granulometryCompositionData: storeData.granulometryCompositionData || {
          percentageInputs: [],
          graphData: [],
          percentsToList: [],
          lowerComposition: { percentsOfMaterials: [[], []], sumOfPercents: [] },
          averageComposition: { percentsOfMaterials: [[], []], sumOfPercents: [] },
          higherComposition: { percentsOfMaterials: [[], []], sumOfPercents: [] },
          nominalSize: { value: null },
          pointsOfCurve: [],
          chosenCurves: [],
          bands: { higher: [], lower: [], letter: null },
          porcentagesPassantsN200: null
        },
        
        initialBinderData: storeData.initialBinderData || {
          materials: [{
            name: null,
            realSpecificMass: null,
            apparentSpecificMass: null,
            absorption: null,
            type: null,
          }],
          binderSpecificMass: null,
          granulometryComposition: [{
            combinedGsa: null,
            combinedGsb: null,
            gse: null,
            pli: null,
            percentsOfDosageWithBinder: [],
            curve: null,
          }],
          binderInput: [],
          turnNumber: {
            initialN: null,
            maxN: null,
            projectN: null,
            tex: null,
          }
        },
        
        firstCompressionData: storeData.firstCompressionData || {
          inferiorRows: [{
            id: 0,
            diammeter: null,
            dryMass: null,
            submergedMass: null,
            drySurfaceSaturatedMass: null,
            waterTemperatureCorrection: null,
            document: null,
          }],
          intermediariaRows: [{
            id: 0,
            diammeter: null,
            dryMass: null,
            submergedMass: null,
            drySurfaceSaturatedMass: null,
            waterTemperatureCorrection: null,
            document: null,
          }],
          superiorRows: [{
            id: 0,
            diammeter: null,
            dryMass: null,
            submergedMass: null,
            drySurfaceSaturatedMass: null,
            waterTemperatureCorrection: null,
            document: null,
          }],
          spreadSheetTemplate: null,
          maximumDensity: {
            lower: { gmm: null, gmb: null },
            average: { gmm: null, gmb: null },
            higher: { gmm: null, gmb: null },
          },
          riceTest: [],
        },
        
        firstCompressionParamsData: storeData.firstCompressionParamsData || {
          table1: {
            expectedPorcentageGmmInitialN: null,
            expectedPorcentageGmmMaxN: null,
            expectedPorcentageGmmProjectN: null,
            expectedVam: null,
            expectedRBV_Higher: null,
            expectedRBV_Lower: null,
            nominalSize: null,
            trafficVolume: null,
          },
          table2: null,
          table3: null,
          table4: null,
          selectedCurve: null,
        },
        
        chosenCurvePercentagesData: storeData.chosenCurvePercentagesData || {
          listOfPlis: [],
          porcentageAggregate: [[]],
          trafficVolume: null,
        },
        
        secondCompressionData: storeData.secondCompressionData || {
          halfLess: [{
            id: 0,
            averageDiammeter: null,
            averageHeight: null,
            dryMass: null,
            submergedMass: null,
            drySurfaceSaturatedMass: null,
            waterTemperatureCorrection: null,
            diametralTractionResistance: null,
          }],
          halfPlus: [{
            id: 0,
            averageDiammeter: null,
            averageHeight: null,
            dryMass: null,
            submergedMass: null,
            drySurfaceSaturatedMass: null,
            waterTemperatureCorrection: null,
            diametralTractionResistance: null,
          }],
          normal: [{
            id: 0,
            averageDiammeter: null,
            averageHeight: null,
            dryMass: null,
            submergedMass: null,
            drySurfaceSaturatedMass: null,
            waterTemperatureCorrection: null,
            diametralTractionResistance: null,
          }],
          onePlus: [{
            id: 0,
            averageDiammeter: null,
            averageHeight: null,
            dryMass: null,
            submergedMass: null,
            drySurfaceSaturatedMass: null,
            waterTemperatureCorrection: null,
            diametralTractionResistance: null,
          }],
          maximumDensities: [],
          composition: {
            halfLess: {
              projectN: { samplesData: null, gmb: null, percentWaterAbs: null, percentageGmm: null },
              specifiesMass: null, gmm: null, Vv: null, Vam: null, expectedPli: null, RBV: null, ratioDustAsphalt: null, indirectTensileStrength: null,
            },
            normal: {
              projectN: { samplesData: null, gmb: null, percentWaterAbs: null, percentageGmm: null },
              specifiesMass: null, gmm: null, Vv: null, Vam: null, RBV: null, ratioDustAsphalt: null, indirectTensileStrength: null,
            },
            halfPlus: {
              projectN: { samplesData: null, gmb: null, percentWaterAbs: null, percentageGmm: null },
              specifiesMass: null, gmm: null, Vv: null, Vam: null, RBV: null, ratioDustAsphalt: null, indirectTensileStrength: null,
            },
            onePlus: {
              projectN: { samplesData: null, gmb: null, percentWaterAbs: null, percentageGmm: null },
              specifiesMass: null, gmm: null, Vv: null, Vam: null, RBV: null, ratioDustAsphalt: null, indirectTensileStrength: null,
            },
          },
          expectedPli: null,
          combinedGsb: null,
          percentsOfDosage: null,
          Gse: null,
          ponderatedPercentsOfDosage: null,
        },
        
        secondCompressionPercentagesData: storeData.secondCompressionPercentagesData || {
          optimumContent: null,
          graphs: {
            graphVv: [], graphVam: [], graphGmb: [], graphGmm: [], graphRBV: [], graphPA: [], graphRT: [],
          },
        },
        
        confirmationCompressionData: storeData.confirmationCompressionData || {
          table: [{
            id: 1,
            averageDiammeter: null,
            averageHeight: null,
            dryMass: null,
            submergedMass: null,
            drySurfaceSaturatedMass: null,
            waterTemperatureCorrection: null,
            diametralTractionResistance: null,
          }],
          gmm: null,
          riceTest: {
            sampleAirDryMass: null,
            containerSampleWaterMass: null,
            containerWaterMass: null,
            temperatureOfWater: null,
          },
        },
        
        dosageResume: storeData.dosageResume || {
          Gmb: null, Gmm: null, RBV: null, Vam: null, Vv: null,
          diametralTractionResistance: null, gmm: null, percentWaterAbs: null,
          ponderatedPercentsOfDosage: [], quantitative: [],
          ratioDustAsphalt: null, specifiesMass: null,
        },
        
        createdAt: storeData.createdAt || new Date()
      };

     // console.log('🔄 FRONTEND: Chamando service...');
      const response = await superpave.getGranulometricCompositionData(superpaveData, user._id);


      
      console.log('✅ FRONTEND: Resposta do service:', response);

      if (response) {
        useSuperpaveStore.getState().setData({
          step: 3,
          value: {
            ...storeData.granulometryCompositionData,
            ...response
          }
        });
        console.log('🎉 FRONTEND: Dados salvos com sucesso!');
      }

    } catch (error) {
      console.error('❌ FRONTEND: Erro no processamento:', error);
      setHasProcessed(false);
    }
  };

  if (storeData.granulometrys && storeData.granulometrys.length > 0) {
    saveGranulometryDataForComposition();
  }
}, [storeData, superpave, user._id, hasProcessed]);
/*
const calculateBands = (nominalSize: number) => {
  if (nominalSize >= 37.5) {
    return {
      letter: 'A',
      higher: [100, 100, 90, null, null, null, null, 45, null, null, null, null, 7],
      lower: [100, 90, 75, 58, 48, 35, 29, 19, 13, 9, 5, 2, 1]
    };
  } else if (nominalSize >= 25) {
    return {
      letter: 'B', 
      higher: [null, 100, 100, 90, null, null, null, 49, null, null, null, null, 8],
      lower: [null, 100, 90, null, null, null, null, 23, null, null, null, null, 2]
    };
  } else if (nominalSize >= 19) {
    return {
      letter: 'C',
      higher: [null, null, 100, 100, 90, null, null, 58, null, null, null, null, 10],
      lower: [null, null, 100, 90, null, null, null, 28, null, null, null, null, 2]
    };
  } else {
    return {
      letter: 'D',
      higher: [null, null, null, 100, 100, 90, null, 67, null, null, null, null, 12],
      lower: [null, null, null, 100, 90, null, null, 32, null, null, null, null, 2]
    };
  }
};
*/


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
