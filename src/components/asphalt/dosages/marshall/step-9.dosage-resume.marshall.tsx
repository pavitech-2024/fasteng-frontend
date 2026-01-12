import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import GenerateMarshallDosagePDF from '@/components/generatePDF/dosages/asphalt/marshall/generatePDFMarshall';
import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import Graph from '@/services/asphalt/dosages/marshall/graph/marshal-granulometry-graph';
import marshallDosageService from '@/services/asphalt/dosages/marshall/marshall.consult.service';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import useMarshallStore from '@/stores/asphalt/marshall/marshall.store';
import { Box, Typography } from '@mui/material';
import { DataGrid, GridAlignment, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export type RowsObj = {
  id: number;
  [key: string]: number | string;
  optimumBinder: number;
};

const Marshall_Step9_ResumeDosage = ({
  nextDisabled,
  setNextDisabled,
  marshall,
}: EssayPageProps & { marshall: Marshall_SERVICE }) => {
  const {
    generalData,
    materialSelectionData,
    granulometryCompositionData,
    optimumBinderContentData,
    maximumMixtureDensityData,
    confirmationCompressionData: data,
    setData,
  } = useMarshallStore();

  const [dosage, setDosage] = useState(null);
  const [loading, setLoading] = useState(true);

  const storeRaw = sessionStorage.getItem('asphalt-marshall-store');
  const store = storeRaw ? JSON.parse(storeRaw) : null;
  const dosageId = store?.state?._id;

  const [optimumContentRows, setOptimumContentRows] = useState([]);
  const [optimumContentCols, setOptimumContentCols] = useState([]);
  const [optimumContentGroupings, setOptimumContentGroupings] = useState<GridColumnGroupingModel>([]);

  const [quantitativeRows, setQuantitativeRows] = useState([]);
  const [quantitativeCols, setQuantitativeCols] = useState([]);
  const [quantitativeGroupings, setQuantitativeGroupings] = useState<GridColumnGroupingModel>([]);

  // LOG 1: Estado inicial
  console.log('🔍 [RESUME] Estado inicial:');
  console.log('1. dosageId:', dosageId);
  console.log('2. materialSelectionData:', materialSelectionData);
  console.log('3. optimumBinderContentData:', optimumBinderContentData);
  console.log('4. data (confirmationCompressionData):', data);
  console.log('5. maximumMixtureDensityData:', maximumMixtureDensityData);

  useEffect(() => {
    console.log('=== GRANULOMETRY DATA DEBUG ===');
    console.log('Tem tableWithBands?', !!granulometryCompositionData?.tableWithBands);
    console.log('tableWithBands:', granulometryCompositionData?.tableWithBands);
    console.log('Tem bands?', !!granulometryCompositionData?.bands);
    console.log('bands.lowerBand:', granulometryCompositionData?.bands?.lowerBand);
    console.log('bands.higherBand:', granulometryCompositionData?.bands?.higherBand);
    console.log('Tem projections?', !!granulometryCompositionData?.projections);
    console.log('projections:', granulometryCompositionData?.projections);
  }, [granulometryCompositionData]);

  useEffect(() => {
    console.log('🔄 [RESUME] useEffect principal executando');
    
    const fetchData = async () => {
      try {
        let newData = {};

        // Tentar buscar dosagem, mas não bloquear se falhar
        if (dosageId) {
          try {
            console.log('📋 [RESUME] Buscando dosagem:', dosageId);
            const foundDosage = await marshallDosageService.getMarshallDosage(dosageId);
            console.log('✅ [RESUME] Dosagem encontrada:', foundDosage);
            setDosage(foundDosage.data.dosage);
          } catch (dosageError) {
            console.warn('⚠ [RESUME] Não foi possível buscar a dosagem, continuando...', dosageError);
          }
        }

        // ⚠️ CORREÇÃO: Preparar dados corretos baseados no método (DMT vs GMM)
        console.log('🔍 [RESUME] Método detectado:', maximumMixtureDensityData?.method);
        
        let response;
        
        if (maximumMixtureDensityData?.method === 'GMM') {
          console.log('🔍 [RESUME] Processando GMM...');
          
          // Para GMM, precisamos extrair o valor correto do confirmedSpecificGravity
          let confirmedSpecificGravityValue: number;
          
          // Verificar diferentes formatos possíveis
          if (data?.confirmedSpecificGravity?.result !== undefined) {
            confirmedSpecificGravityValue = typeof data.confirmedSpecificGravity.result === 'string' 
              ? parseFloat(data.confirmedSpecificGravity.result)
              : data.confirmedSpecificGravity.result;
          } else if (maximumMixtureDensityData?.maxSpecificGravity?.result?.normal) {
            confirmedSpecificGravityValue = typeof maximumMixtureDensityData.maxSpecificGravity.result.normal === 'string'
              ? parseFloat(maximumMixtureDensityData.maxSpecificGravity.result.normal)
              : maximumMixtureDensityData.maxSpecificGravity.result.normal;
          } else {
            // Fallback: pegar o primeiro valor de GMM da tabela
            const gmmTable = maximumMixtureDensityData?.gmm || [];
            const middleIndex = Math.floor(gmmTable.length / 2); // Teor normal está no meio
            const gmmValue = gmmTable[middleIndex]?.value || 0;
            confirmedSpecificGravityValue = typeof gmmValue === 'string' ? parseFloat(gmmValue) : gmmValue;
          }
          
          console.log('🔍 [RESUME] GMM - confirmedSpecificGravityValue:', confirmedSpecificGravityValue);
          
          // Criar dados corrigidos para GMM
          const correctedData = {
            ...data,
            confirmedSpecificGravity: {
              result: confirmedSpecificGravityValue,
              type: 'GMM' // Adicionando a propriedade type que estava faltando
            }
          };
          
          response = await marshall.confirmVolumetricParameters(
            maximumMixtureDensityData,
            optimumBinderContentData,
            correctedData
          );
          
        } else {
          // Para DMT, usar dados normais
          console.log('🔍 [RESUME] Processando DMT...');
          
          // Garantir que confirmedSpecificGravity tenha a propriedade type
          const dmtData = {
            ...data,
            confirmedSpecificGravity: {
              ...(data?.confirmedSpecificGravity || {}),
              result: data?.confirmedSpecificGravity?.result || 0,
              type: 'DMT' // Adicionando a propriedade type que estava faltando
            }
          };
          
          response = await marshall.confirmVolumetricParameters(
            maximumMixtureDensityData,
            optimumBinderContentData,
            dmtData
          );
        }

        console.log('✅ [RESUME] Resposta do confirmVolumetricParameters:', response);

        newData = {
          ...data,
          ...response,
        };

        console.log('📋 [RESUME] Setando novos dados:', newData);
        setData({ step: 8, value: newData });
        setLoading(false);
      } catch (error) {
        console.error('💥 [RESUME] Erro no useEffect principal:', error);
        setLoading(false);
        throw error;
      }
    };

    toast.promise(fetchData, {
      pending: t('loading.dosage.pending'),
      success: t('loading.dosage.success'),
      error: t('loading.dosage.error'),
    });
  }, []);

  useEffect(() => {
    console.log('🔧 [RESUME] useEffect secundário executando');
    console.log('🔧 Condição de execução:', {
      materialSelectionData: !!materialSelectionData,
      aggregates: !!materialSelectionData?.aggregates,
      optimumBinderContentData: !!optimumBinderContentData,
      data: !!data,
      confirmedVolumetricParameters: !!data?.confirmedVolumetricParameters
    });

    if (
      !materialSelectionData ||
      !materialSelectionData.aggregates ||
      !optimumBinderContentData ||
      !data ||
      !data.confirmedVolumetricParameters
    ) {
      console.log('⏸️ [RESUME] useEffect secundário NÃO executado - dados incompletos');
      return;
    }

    console.log('✅ [RESUME] Criando tabelas...');
    console.log('📊 Aggregates:', materialSelectionData.aggregates);
    console.log('📊 Optimum Binder Data:', optimumBinderContentData);
    console.log('📊 Data confirmedVolumetricParameters:', data.confirmedVolumetricParameters);

    createOptimumContentRows();
    createOptimumContentColumns();
    createOptimumContentGroupings();

    getQuantitativeCols();
    getQuantitativeRows();
    getQuantitativeGroupings();
  }, [materialSelectionData, optimumBinderContentData, data]);

  // CORREÇÃO: Função para calcular valores quantitativos
  const calculateQuantitativeValues = (): string[] | null => {
    if (!data?.confirmedVolumetricParameters?.quantitative) {
      console.log('📊 [CALC] Nenhum dado quantitativo disponível');
      return null;
    }

    // Se o array quantitative tem valores nulos, vamos calcular baseado nas porcentagens
    const quantitative = data.confirmedVolumetricParameters.quantitative.map(val => 
      typeof val === 'string' ? parseFloat(val) : val
    );
    
    console.log('📊 [CALC] Quantitative array original convertido:', quantitative);

    // Se apenas o binder tem valor, vamos calcular os agregados
    if (quantitative[0] !== null && quantitative[0] !== undefined && materialSelectionData?.aggregates) {
      const binderValue = quantitative[0];
      const totalPercent = optimumBinderContentData?.optimumBinder?.confirmedPercentsOfDosage?.reduce((sum, percent) => sum + percent, 0) || 100;
      
      return materialSelectionData.aggregates.map((material, idx) => {
        const percent = optimumBinderContentData?.optimumBinder?.confirmedPercentsOfDosage?.[idx] || 0;
        // Calcular proporcionalmente ao binder
        const calculatedValue = binderValue * (percent / (100 - optimumBinderContentData?.optimumBinder?.optimumContent || 50));
        return calculatedValue.toFixed(2);
      });
    }

    // Retorna todos menos o binder, convertendo para string
    return quantitative.slice(1).map(val => val?.toFixed(2) || '0.00');
  };

  const granulometricCompTableColumns: GridColDef[] = [
    {
      field: 'sieve_label',
      headerName: t('granulometry-asphalt.sieves'),
    },
    {
      field: 'projections',
      headerName: t('asphalt.dosages.marshall.projections'),
    },
    {
      field: 'lowerBand',
      headerName: t('asphalt.dosages.marshall.inferiorBand'),
    },
    {
      field: 'higherBand',
      headerName: t('asphalt.dosages.marshall.superiorBand'),
    },
  ];

  // Mapeamento por label → band index
  const sieveToBandIndex: { [key: string]: number } = {
    '3/4 pol - 19mm': 6,
    '3/8 pol - 9,5mm': 8,
    'Nº4 - 4,8mm': 10,
    'Nº8 - 2,4mm': 12,
    'Nº16 - 1,2mm': 14,
    'Nº30 - 0,6mm': 15,
    'Nº50 - 0,3mm': 17,
    'Nº100 - 0,15mm': 19,
  };

  const granulometricCompTableRows = granulometryCompositionData?.projections?.map((row, i) => {
    const sieveLabel = row.label;
    const bandIndex = sieveToBandIndex[sieveLabel];
    
    let lowerBandValue = null;
    let higherBandValue = null;
    
    if (bandIndex !== undefined) {
      const lower = granulometryCompositionData.bands?.lowerBand?.[bandIndex];
      const higher = granulometryCompositionData.bands?.higherBand?.[bandIndex];
      
      lowerBandValue = lower !== null && lower !== undefined ? lower.toFixed(2) : null;
      higherBandValue = higher !== null && higher !== undefined ? higher.toFixed(2) : null;
    }
    
    console.log(`${sieveLabel} → bandIndex: ${bandIndex}, lower: ${lowerBandValue}, higher: ${higherBandValue}`);
    
    return {
      id: i,
      sieve_label: sieveLabel,
      projections: row.value,
      lowerBand: lowerBandValue,
      higherBand: higherBandValue,
    };
  }) || [];

  const granulometricCompTableGroupings: GridColumnGroupingModel = [
    {
      groupId: 'granulometry',
      headerAlign: 'center' as GridAlignment,
      headerName:
        t('asphalt.dosages.marshall.specification') +
        ` (${t('asphalt.dosages.marshall.band')} ${generalData.dnitBand})`,
      children: [{ field: 'lowerBand' }, { field: 'higherBand' }],
    },
  ];

  const createOptimumContentColumns = () => {
    console.log('📐 [RESUME] Criando colunas de conteúdo ótimo');
    
    const columns: GridColDef[] = [
      {
        field: 'optimumBinder',
        width: 250,
        headerName: t('asphalt.dosages.optimum-binder'),
        valueFormatter: ({ value }) => typeof value === 'number' ? value.toFixed(2) : value,
      },
    ];

    materialSelectionData.aggregates.forEach((material) => {
      console.log(`📐 Adicionando coluna para agregado: ${material.name} (${material._id})`);
      const column: GridColDef = {
        field: material._id,
        width: 250,
        headerName: material.name,
        valueFormatter: ({ value }) => typeof value === 'number' ? value.toFixed(2) : value,
      };
      columns.push(column);
    });

    console.log('✅ [RESUME] Colunas criadas:', columns);
    setOptimumContentCols(columns);
  };

  const createOptimumContentRows = () => {
    console.log('📝 [RESUME] Criando linhas de conteúdo ótimo');
    
    let rowsObj: RowsObj = {
      id: 0,
      optimumBinder: Number(optimumBinderContentData?.optimumBinder?.optimumContent?.toFixed(2)) || 0,
    };

    console.log('📝 optimumBinder value:', rowsObj.optimumBinder);
    console.log('📝 confirmedPercentsOfDosage:', optimumBinderContentData?.optimumBinder?.confirmedPercentsOfDosage);

    materialSelectionData.aggregates.forEach((material, idx) => {
      const percent = optimumBinderContentData?.optimumBinder?.confirmedPercentsOfDosage?.[idx];
      console.log(`📝 Agregado ${idx} (${material.name}): percent = ${percent}`);
      
      rowsObj = {
        ...rowsObj,
        [material._id]: percent ? Number(percent.toFixed(2)) : 0,
      };
    });

    console.log('✅ [RESUME] Linha criada:', rowsObj);
    setOptimumContentRows([rowsObj]);
  };

  const createOptimumContentGroupings = () => {
    console.log('📊 [RESUME] Criando agrupamentos de conteúdo ótimo');
    
    const groupings: GridColumnGroupingModel = [
      {
        groupId: 'optimumContent',
        headerName: t('asphalt.dosages.marshall.materials-final-proportions'),
        headerAlign: 'center',
        children: [{ field: 'optimumBinder' }],
      },
    ];

    materialSelectionData.aggregates.forEach((material) => {
      groupings[0].children.push({ field: material._id });
    });

    console.log('✅ [RESUME] Agrupamentos criados:', groupings);
    setOptimumContentGroupings(groupings);
  };

  const getQuantitativeCols = () => {
    console.log('📐 [RESUME] Criando colunas quantitativas');
    
    const newCols: GridColDef[] = [];

    const binderObj: GridColDef = {
      field: 'binder',
      width: 250,
      headerName: t('asphalt.dosages.marshall.asphaltic-binder') + '(kg)',
      valueFormatter: ({ value }) => `${value}`,
    };

    materialSelectionData.aggregates.forEach((material) => {
      const col: GridColDef = {
        field: `${material._id}`,
        width: 250,
        headerName: `${material.name} (m³)`,
        valueFormatter: ({ value }) => `${value}`,
      };
      newCols.push(col);
    });

    newCols.unshift(binderObj);

    console.log('✅ [RESUME] Colunas quantitativas criadas:', newCols);
    setQuantitativeCols(newCols);
  };

  const getQuantitativeRows = () => {
    console.log('📝 [RESUME] Criando linhas quantitativas');
    
    let rowsObj: any = {
      id: 0,
      binder:
        data?.confirmedVolumetricParameters?.quantitative?.[0] != null
          ? data.confirmedVolumetricParameters.quantitative[0].toFixed(2)
          : '-',
    };

    console.log('📝 Binder value:', rowsObj.binder);
    console.log('📝 Quantitative array:', data?.confirmedVolumetricParameters?.quantitative);

    // Usar a função de cálculo para obter valores dos agregados
    const aggregateValues = calculateQuantitativeValues();
    
    materialSelectionData.aggregates.forEach((material, idx) => {
      let value = '-';
      
      if (aggregateValues && aggregateValues[idx] !== undefined) {
        value = aggregateValues[idx];
      } else {
        // Fallback: tentar obter do array original
        const originalValue = data?.confirmedVolumetricParameters?.quantitative?.[idx + 1];
        if (typeof originalValue === 'number') {
          value = originalValue.toFixed(2);
        } else if (originalValue !== null && originalValue !== undefined) {
          value = String(originalValue);
        }
      }
      
      console.log(`📝 Agregado ${idx} (${material.name}): value = ${value}`);
      
      rowsObj = {
        ...rowsObj,
        [material._id]: value,
      };
    });

    console.log('✅ [RESUME] Linha quantitativa criada:', rowsObj);
    setQuantitativeRows([rowsObj]);
  };

  const getQuantitativeGroupings = () => {
    console.log('📊 [RESUME] Criando agrupamentos quantitativos');
    
    const quantitativeGroupArr: GridColumnGroupingModel = [
      {
        groupId: 'quantitativeGrouping',
        headerName: t('asphalt.dosages.marshall.asphalt-mass-quantitative'),
        headerAlign: 'center',
        children: [{ field: 'binder' }],
      },
    ];

    materialSelectionData.aggregates.forEach((material) => {
      quantitativeGroupArr[0].children.push({ field: `${material._id}` });
    });

    console.log('✅ [RESUME] Agrupamentos quantitativos criados:', quantitativeGroupArr);
    setQuantitativeGroupings(quantitativeGroupArr);
  };

  const volumetricParamsCols: GridColDef[] = [
    {
      field: 'param',
      headerName: t('asphalt.dosages.marshall.parameter'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'unity',
      headerName: t('asphalt.dosages.marshall.unity'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'bearingLayer',
      headerName: t('asphalt.dosages.marshall.bearing-layer'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'bondingLayer',
      headerName: t('asphalt.dosages.marshall.bonding-layer'),
      valueFormatter: ({ value }) => `${value}`,
    },
  ];

  const volumetricParamsRows = [
    {
      id: 0,
      param: t('asphalt.dosages.stability'),
      unity: `${data?.confirmedVolumetricParameters?.values?.stability?.toFixed(2) || '0.00'}` + ' Kgf',
      bearingLayer: '≥500',
      bondingLayer: '≥500',
    },
    {
      id: 1,
      param: t('asphalt.dosages.rbv'),
      unity: `${(data?.confirmedVolumetricParameters?.values?.ratioBitumenVoid || 0)?.toFixed(2)}` + ' (%)',
      bearingLayer: '75 - 82',
      bondingLayer: '65 - 72',
    },
    {
      id: 2,
      param: t('asphalt.dosages.mixture-voids'),
      unity: `${(data?.confirmedVolumetricParameters?.values?.aggregateVolumeVoids || 0)?.toFixed(2)}` + ' (%)',
      bearingLayer: '3 - 5',
      bondingLayer: '4 - 6',
    },
    {
      id: 3,
      param: `${t('asphalt.dosages.indirect-tensile-strength')}` + `(25 °C)`,
      unity: `${(data?.confirmedVolumetricParameters?.values?.indirectTensileStrength || 0)?.toFixed(2)}` + ' MPa',
      bearingLayer: '≥ 0,65',
      bondingLayer: '≥ 0,65',
    },
  ];

  const mineralAggregateVoidsCols: GridColDef[] = [
    {
      field: 'tmn',
      headerName: 'TMN',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'vam',
      headerName: 'Vam (%)',
      valueFormatter: ({ value }) => `${value}`,
    },
  ];

  const mineralAggregateVoidsRows = [
    {
      id: 0,
      tmn: '9,5mm',
      vam: '≥ 18',
    },
    {
      id: 1,
      tmn: '12,5mm',
      vam: '≥ 16',
    },
    {
      id: 3,
      tmn: '19,1mm',
      vam: '≥ 15',
    },
  ];

  const mineralAggregateVoidsGroup: GridColumnGroupingModel = [
    {
      groupId: 'mineralAggregateVoids',
      headerName: t('asphalt.dosages.mineral-aggregate-voids'),
      headerAlign: 'center',
      children: [{ field: 'tmn' }, { field: 'vam' }],
    },
  ];

  // CORREÇÃO: Adicionar validações nos valores
 const volumetricMechanicParams = [
  {
    label: t('asphalt.dosages.optimum-binder'),
    value: optimumBinderContentData?.optimumBinder?.optimumContent?.toFixed(2) || '0.00',
    unity: '%',
    isValid: true
  },
  {
    label: t('asphalt.dosages.dmt'),
    // CORREÇÃO: Comparar com número, não string
    value: data?.confirmedSpecificGravity?.result !== undefined && 
           data.confirmedSpecificGravity.result !== 43 && // ← número 43, não string '43'
           typeof data.confirmedSpecificGravity.result === 'number' ? 
           data.confirmedSpecificGravity.result.toFixed(2) : '---',
    unity: 'g/cm³',
    isValid: true
  },
  {
    label: t('asphalt.dosages.gmb'),
    value: data?.confirmedVolumetricParameters?.values?.apparentBulkSpecificGravity?.toFixed(2) || '---',
    unity: 'g/cm³',
    isValid: true
  },
  {
    label: t('asphalt.dosages.vv'),
    value: ((data?.confirmedVolumetricParameters?.values?.aggregateVolumeVoids || 0) * 100)?.toFixed(2),
    unity: '%',
    isValid: true
  },
  {
    label: t('asphalt.dosages.vam'),
    value: (data?.confirmedVolumetricParameters?.values?.voidsFilledAsphalt || 0)?.toFixed(2),
    unity: '%',
    isValid: true
  },
  {
    label: t('asphalt.dosages.rbv') + ' (RBV)',
    value: ((data?.confirmedVolumetricParameters?.values?.ratioBitumenVoid || 0) * 100)?.toFixed(2),
    unity: '%',
    isValid: true
  },
  {
    label: t('asphalt.dosages.marshall.stability'),
    value: data?.confirmedVolumetricParameters?.values?.stability?.toFixed(2) || '0.00',
    unity: 'N',
    isValid: true
  },
  {
    label: t('asphalt.dosages.marshall.fluency'),
    value: data?.confirmedVolumetricParameters?.values?.fluency?.toFixed(2) || '0.00',
    unity: 'mm',
    isValid: true
  },
  {
    label: t('asphalt.dosages.indirect-tensile-strength'),
    value: data?.confirmedVolumetricParameters?.values?.indirectTensileStrength?.toFixed(2) || '0.00',
    unity: 'MPa',
    isValid: true
  },
];

  useEffect(() => {
    if (nextDisabled) {
      setNextDisabled(false);
    }
  }, [nextDisabled, setNextDisabled]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <FlexColumnBorder title={t('results')} open={true}>
        {/* CORREÇÃO: Adicionar verificação para evitar erro no PDF */}
        {dosage && <GenerateMarshallDosagePDF dosage={dosage} />}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: { mobile: '5px', notebook: '4rem' },
            marginY: '20px',
          }}
        >
          <Box id="general-results" sx={{ width: '100%', overflowX: 'auto' }}>
            <ResultSubTitle title={t('marshall.general-results')} sx={{ margin: '.65rem' }} />
            
            {optimumContentCols.length > 0 && optimumContentRows.length > 0 && optimumContentGroupings.length > 0 ? (
              <DataGrid
                key={'optimumContent'}
                columns={optimumContentCols.map((col) => ({
                  ...col,
                  flex: 1,
                  headerAlign: 'center',
                  align: 'center',
                }))}
                rows={optimumContentRows}
                columnGroupingModel={optimumContentGroupings}
                experimentalFeatures={{ columnGrouping: true }}
                disableColumnMenu
                disableColumnSelector
                hideFooter
                sx={{
                  minWidth: '600px',
                }}
              />
            ) : (
              <Box sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
                <Typography variant="body2">
                  ⚠ Tabela não disponível. Dados faltando:
                  <br />
                  • Colunas: {optimumContentCols.length}
                  <br />
                  • Linhas: {optimumContentRows.length}
                </Typography>
              </Box>
            )}
          </Box>

          <Box id="asphalt-mass-quantitative" sx={{ width: '100%', overflowX: 'auto' }}>
            <ResultSubTitle
              title={t('asphalt.dosages.marshall.asphalt-mass-quantitative')}
              sx={{ marginX: '.65rem' }}
            />
            
            {quantitativeRows.length > 0 && quantitativeCols.length > 0 && quantitativeGroupings.length > 0 ? (
              <DataGrid
                columns={quantitativeCols.map((col) => ({
                  ...col,
                  flex: 1,
                  sortable: false,
                  headerAlign: 'center',
                  align: 'center',
                }))}
                rows={quantitativeRows}
                columnGroupingModel={quantitativeGroupings}
                experimentalFeatures={{ columnGrouping: true }}
                disableColumnMenu
                disableColumnSelector
                hideFooter
                sx={{
                  minWidth: '600px',
                }}
              />
            ) : (
              <Box sx={{ p: 2, bgcolor: 'warning.light', color: 'warning.contrastText', borderRadius: 1 }}>
                <Typography variant="body2">
                  ⚠ Tabela quantitativa não disponível
                </Typography>
              </Box>
            )}
          </Box>

          <Box id="volumetric-mechanic-params">
            <ResultSubTitle
              title={t('asphalt.dosages.binder-volumetric-mechanic-params')}
              sx={{
                maxWidth: '103%',
                wordWrap: 'break-word',
                marginX: '.65rem',
              }}
            />

            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: { mobile: 'center', notebook: 'flex-start' },
                flexWrap: 'wrap',
                gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' },
                gap: '10px',
                mt: '20px',
              }}
            >
              {volumetricMechanicParams.map((item) => {
                // FIX: Corrigir a verificação de valor válido
                const isValidValue = item.value && 
                  item.value !== 'NaN' && 
                  item.value !== 'undefined' && 
                  item.value !== '---' &&
                  item.value !== 'null' &&
                  !isNaN(parseFloat(item.value));
                
                if (isValidValue) {
                  // FIX: Converter value para string para evitar erro de tipo
                  return (
                    <Result_Card 
                      key={item.label} 
                      label={item.label} 
                      value={String(item.value)} 
                      unity={item.unity} 
                    />
                  );
                }
                return null;
              })}
            </Box>
          </Box>

          <Box id="volumetric-params" sx={{ width: '100%', overflowX: 'auto' }}>
            <ResultSubTitle
              title={t('asphalt.dosages.volumetric-params')}
              sx={{ margin: '.65rem' }}
            />
            {data?.confirmedVolumetricParameters?.values ? (
              <DataGrid
                rows={volumetricParamsRows}
                columns={volumetricParamsCols.map((col) => ({
                  ...col,
                  flex: 1,
                  headerAlign: 'center',
                  align: 'center',
                  sortable: false,
                }))}
                disableColumnMenu
                disableColumnSelector
                hideFooter
                sx={{
                  minWidth: '600px',
                }}
              />
            ) : (
              <Box sx={{ p: 2, bgcolor: 'warning.light', color: 'warning.contrastText', borderRadius: 1 }}>
                <Typography variant="body2">
                  ⚠ Parâmetros volumétricos não disponíveis
                </Typography>
              </Box>
            )}
          </Box>

          <Box id="mineral-aggregate-voids" sx={{ width: '100%', overflowX: 'auto' }}>
            <ResultSubTitle
              title={t('asphalt.dosages.mineral-aggregate-voids')}
              sx={{ margin: '.65rem' }}
            />
            <DataGrid
              rows={mineralAggregateVoidsRows}
              columns={mineralAggregateVoidsCols.map((column) => ({
                ...column,
                sortable: false,
                align: 'center',
                headerAlign: 'center',
                flex: 1,
              }))}
              columnGroupingModel={mineralAggregateVoidsGroup}
              experimentalFeatures={{ columnGrouping: true }}
              disableColumnMenu
              disableColumnSelector
              hideFooter
              sx={{
                minWidth: '100%',
              }}
            />
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title={t('asphalt.dosages.marshall.granulometric-composition')} open={true}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '4rem',
            marginY: '20px',
          }}
        >
          <Box
            id="granulometric-composition-table"
            sx={{ paddingX: { mobile: '0px', notebook: '6rem' }, width: '100%', overflowX: 'auto' }}
          >
            {granulometricCompTableRows.length > 0 ? (
              <DataGrid
                rows={granulometricCompTableRows}
                columns={granulometricCompTableColumns.map((col) => ({
                  ...col,
                  flex: 1,
                  sortable: false,
                  align: 'center',
                  headerAlign: 'center',
                }))}
                columnGroupingModel={granulometricCompTableGroupings}
                experimentalFeatures={{ columnGrouping: true }}
                disableColumnMenu
                hideFooter
                sx={{
                  minWidth: '500px',
                }}
              />
            ) : (
              <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                Dados de composição granulométrica não disponíveis
              </Box>
            )}
          </Box>

          <Box id="chart-div-granulometricCurve" sx={{ paddingX: { mobile: '0px', notebook: '6rem' } }}>
            {granulometryCompositionData?.graphData?.length > 1 ? (
              <Graph data={granulometryCompositionData?.graphData} />
            ) : (
              <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                Gráfico de curva granulométrica não disponível
              </Box>
            )}
          </Box>
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default Marshall_Step9_ResumeDosage;