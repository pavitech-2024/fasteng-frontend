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

  // Função para determinar o método REAL (DMT ou GMM)
  const getRealMethod = (): 'DMT' | 'GMM' => {
    console.log('🔍 Detectando método REAL:');

    // Prioridade 1: Verificar no confirmedSpecificGravity (mais confiável)
    if (data?.confirmedSpecificGravity?.type) {
      const type = data.confirmedSpecificGravity.type;
      // Verificar se o tipo é válido
      if (type === 'DMT' || type === 'GMM') {
        console.log('✅ Método detectado: ' + type + ' (from confirmedSpecificGravity.type)');
        return type;
      }
    }

    // Prioridade 2: Verificar se tem GMM específico
    if (data?.gmm !== null && data?.gmm !== undefined && data.gmm > 0) {
      console.log('✅ Método detectado: GMM (has gmm value)');
      return 'GMM';
    }

    // Prioridade 3: Verificar no maximumMixtureDensityData
    if (maximumMixtureDensityData?.method) {
      const method = maximumMixtureDensityData.method;
      if (method === 'DMT' || method === 'GMM') {
        console.log('✅ Método detectado: ' + method + ' (from maximumMixtureDensityData.method)');
        return method as 'DMT' | 'GMM';
      }
    }

    // Prioridade 4: Verificar no maxSpecificGravity
    if (maximumMixtureDensityData?.maxSpecificGravity?.method) {
      const method = maximumMixtureDensityData.maxSpecificGravity.method;
      if (method === 'DMT' || method === 'GMM') {
        console.log('✅ Método detectado: ' + method + ' (from maxSpecificGravity.method)');
        return method as 'DMT' | 'GMM';
      }
    }

    // Default para DMT
    console.log('⚠️ Método não detectado, default para DMT');
    return 'DMT';
  };

  // Função para calcular valores volumétricos corrigidos
  const calculateCorrectedVolumetricValues = () => {
    if (!data?.confirmedVolumetricParameters?.values) return null;

    const values = data.confirmedVolumetricParameters.values;

    // ⚠️ SUPOSIÇÃO BASEADA NOS DADOS:
    // aggregateVolumeVoids do backend = VAM (Volume do Agregado de Vazios)
    const VAM_decimal = values.aggregateVolumeVoids || 0;
    const VAM = VAM_decimal * 100; // Converter para %

    // Cálculo de VBC (Vazios com Betume)
    const Gmb = values.apparentBulkSpecificGravity || 0;
    const teorLigante = optimumBinderContentData?.optimumBinder?.optimumContent || 0;
    const Gb = 1.027; // Massa específica do betume
    const VBC = (Gmb * teorLigante) / Gb;

    // ⚠️ CÁLCULO CORRETO: VV (Volume de Vazios) = VAM - VBC
    const VV = VAM - VBC;

    return {
      vamCalculated: VAM, // Volume do Agregado de Vazios (em %)
      vbcCalculated: VBC, // Vazios com Betume (em %)
      vvCalculated: VV, // Volume de Vazios (em %) - VAM - VBC
    };
  };

  // LOG inicial
  console.log('🔍 [RESUME] Estado inicial:');
  console.log('1. dosageId:', dosageId);
  console.log('2. Método REAL detectado:', getRealMethod());
  console.log('3. maximumMixtureDensityData:', maximumMixtureDensityData);
  console.log('4. data.confirmedSpecificGravity:', data?.confirmedSpecificGravity);
  console.log('5. data.gmm:', data?.gmm);

  useEffect(() => {
    console.log('🔄 [RESUME] useEffect principal executando');

    const fetchData = async () => {
      try {
        let newData = {};

        // Tentar buscar dosagem
        if (dosageId) {
          try {
            const foundDosage = await marshallDosageService.getMarshallDosage(dosageId);
            console.log('✅ [RESUME] Dosagem encontrada:', foundDosage);
            setDosage(foundDosage.data.dosage);
          } catch (dosageError) {
            console.warn('⚠ [RESUME] Não foi possível buscar a dosagem:', dosageError);
          }
        }

        const realMethod = getRealMethod();
        console.log('🎯 Método REAL para processamento:', realMethod);

        let response;

        if (realMethod === 'GMM') {
          console.log('🔍 [RESUME] Processando como GMM...');

          // Para GMM, criar objeto com tipo correto
          const gmmData = {
            ...data,
            confirmedSpecificGravity: {
              // Garantir que result existe
              result: data?.confirmedSpecificGravity?.result || 0,
              type: 'GMM' as const, // Usar 'as const' para garantir o tipo literal
            },
          };

          console.log('📤 Enviando dados GMM para confirmVolumetricParameters:', gmmData);

          response = await marshall.confirmVolumetricParameters(
            maximumMixtureDensityData,
            optimumBinderContentData,
            gmmData
          );
        } else {
          // Para DMT
          console.log('🔍 [RESUME] Processando como DMT...');

          const dmtData = {
            ...data,
            confirmedSpecificGravity: {
              // Garantir que result existe
              result: data?.confirmedSpecificGravity?.result || 0,
              type: 'DMT' as const, // Usar 'as const' para garantir o tipo literal
            },
          };

          console.log('📤 Enviando dados DMT para confirmVolumetricParameters:', dmtData);

          response = await marshall.confirmVolumetricParameters(
            maximumMixtureDensityData,
            optimumBinderContentData,
            dmtData
          );
        }

        console.log('✅ [RESUME] Resposta do confirmVolumetricParameters:', response);

        // Criar novo objeto de dados garantindo que todos os campos necessários existam
        newData = {
          ...data,
          ...response,
          // Garantir que confirmedSpecificGravity tem a estrutura correta
          confirmedSpecificGravity: {
            result: response?.confirmedSpecificGravity?.result || data?.confirmedSpecificGravity?.result || 0,
            type: response?.confirmedSpecificGravity?.type || data?.confirmedSpecificGravity?.type || realMethod,
          },
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
    createOptimumContentRows();
    createOptimumContentColumns();
    createOptimumContentGroupings();
    getQuantitativeCols();
    getQuantitativeRows();
    getQuantitativeGroupings();
  }, [materialSelectionData, optimumBinderContentData, data]);

  const calculateQuantitativeValues = (): string[] | null => {
    if (!data?.confirmedVolumetricParameters?.values) {
      console.log('📊 [CALC] Nenhum dado volumétrico disponível');
      return null;
    }

    // 1. Pegar VV CORRETO
    const VV_percent = correctedValues?.vvCalculated || 0; // VV em %

    // 2. Pegar Gmm
    const Gmm = data?.confirmedSpecificGravity?.result || 0; // g/cm³

    // ✅ CORREÇÃO: Fórmula correta para massa total em ton/m³
    // Massa Total (ton/m³) = (100 - VV)/100 × Gmm
    // Onde: (100 - VV)/100 = fração sólida da mistura
    //        Gmm = densidade máxima em g/cm³ = ton/m³
    const massaTotalTon = ((100 - VV_percent) / 100) * Gmm; // ton/m³

    console.log('🔍 CÁLCULO MASSA TOTAL CORRIGIDO:', {
      VV: VV_percent.toFixed(2) + '%',
      Gmm: Gmm.toFixed(3) + ' g/cm³',
      'Fração sólida': `(100 - ${VV_percent.toFixed(2)})/100 = ${((100 - VV_percent) / 100).toFixed(3)}`,
      'Massa Total': massaTotalTon.toFixed(4) + ' ton/m³',
      'Massa Total em kg': (massaTotalTon * 1000).toFixed(2) + ' kg/m³',
    });

    // 3. Calcular MASSA DO LIGANTE em TONELADAS
    const teorLigante = optimumBinderContentData?.optimumBinder?.optimumContent || 0; // %
    const massaLiganteTon = (teorLigante / 100) * massaTotalTon; // ton/m³

    console.log('🔍 CÁLCULO LIGANTE:', {
      'Teor ligante': teorLigante.toFixed(2) + '%',
      'Massa Ligante (ton)': massaLiganteTon.toFixed(4) + ' ton/m³',
      'Massa Ligante (kg)': (massaLiganteTon * 1000).toFixed(2) + ' kg/m³',
    });

    // 4. Calcular MASSA TOTAL DOS AGREGADOS em TONELADAS
    const massaTotalAgregadosTon = massaTotalTon - massaLiganteTon; // ton/m³

    console.log('🔍 MASSA TOTAL AGREGADOS:', {
      'Massa Total Agregados (ton)': massaTotalAgregadosTon.toFixed(4) + ' ton/m³',
      'Massa Total Agregados (kg)': (massaTotalAgregadosTon * 1000).toFixed(2) + ' kg/m³',
    });

    // 5. Distribuir MASSA DOS AGREGADOS
    if (!materialSelectionData?.aggregates) {
      console.log('📊 [CALC] Nenhum agregado disponível');
      return null;
    }

    const percentuaisAgregados = optimumBinderContentData?.optimumBinder?.confirmedPercentsOfDosage || [];

    return materialSelectionData.aggregates.map((material, idx) => {
      const percentual = percentuaisAgregados[idx] || 0; // %

      // Massa do agregado individual em TONELADAS
      const massaAgregadoTon = (percentual / 100) * massaTotalAgregadosTon; // ton/m³

      console.log(`🔍 Agregado ${material.name}:`, {
        Percentual: percentual.toFixed(2) + '%',
        'Massa (ton)': massaAgregadoTon.toFixed(4) + ' ton/m³',
        'Massa (kg)': (massaAgregadoTon * 1000).toFixed(2) + ' kg/m³',
      });

      // Retornar em kg (sem a unidade, só o número)
      return (massaAgregadoTon * 1000).toFixed(2);
    });
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

  const granulometricCompTableRows =
    granulometryCompositionData?.projections?.map((row, i) => {
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
        valueFormatter: ({ value }) => (typeof value === 'number' ? value.toFixed(2) : value),
      },
    ];

    materialSelectionData.aggregates.forEach((material) => {
      const column: GridColDef = {
        field: material._id,
        width: 250,
        headerName: material.name,
        valueFormatter: ({ value }) => (typeof value === 'number' ? value.toFixed(2) : value),
      };
      columns.push(column);
    });

    setOptimumContentCols(columns);
  };

  const createOptimumContentRows = () => {
    console.log('📝 [RESUME] Criando linhas de conteúdo ótimo');

    let rowsObj: RowsObj = {
      id: 0,
      optimumBinder: Number(optimumBinderContentData?.optimumBinder?.optimumContent?.toFixed(2)) || 0,
    };

    materialSelectionData.aggregates.forEach((material, idx) => {
      const percent = optimumBinderContentData?.optimumBinder?.confirmedPercentsOfDosage?.[idx];

      rowsObj = {
        ...rowsObj,
        [material._id]: percent ? Number(percent.toFixed(2)) : 0,
      };
    });

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
    setQuantitativeCols(newCols);
  };

  const getQuantitativeRows = () => {
    console.log('📝 [RESUME] Criando linhas quantitativas CORRIGIDAS');

    // Calcular usando a função corrigida
    const aggregateValues = calculateQuantitativeValues();

    // Calcular massa do ligante separadamente
    const VV_percent = correctedValues?.vvCalculated || 0;
    const Gmm = data?.confirmedSpecificGravity?.result || 0;

    // ✅ CORREÇÃO: Usar fórmula corrigida
    const massaTotalTon = ((100 - VV_percent) / 100) * Gmm;
    const teorLigante = optimumBinderContentData?.optimumBinder?.optimumContent || 0;
    const massaLiganteTon = (teorLigante / 100) * massaTotalTon;
    const massaLiganteKg = (massaLiganteTon * 1000).toFixed(2);

    let rowsObj: any = {
      id: 0,
      binder: massaLiganteKg,
    };

    materialSelectionData.aggregates.forEach((material, idx) => {
      let value = '-';

      if (aggregateValues && aggregateValues[idx] !== undefined) {
        value = aggregateValues[idx];
      } else {
        // Fallback
        const originalValue = data?.confirmedVolumetricParameters?.quantitative?.[idx + 1];
        if (typeof originalValue === 'number') {
          value = originalValue.toFixed(2);
        } else {
          value = '-';
        }
      }

      rowsObj = {
        ...rowsObj,
        [material._id]: value,
      };
    });

    console.log('📊 RESUMO FINAL QUANTITATIVO CORRIGIDO:', {
      'VV usado': VV_percent.toFixed(2) + '%',
      'Gmm usado': Gmm.toFixed(3) + ' g/cm³',
      'Massa Total corrigida': massaTotalTon.toFixed(4) + ' ton/m³',
      'Teor ligante': teorLigante.toFixed(2) + '%',
      'Massa Ligante corrigida': massaLiganteKg + ' kg',
      'Valores calculados': rowsObj,
    });

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

    setQuantitativeGroupings(quantitativeGroupArr);
  };

  // Calcular valores corrigidos
  const correctedValues = calculateCorrectedVolumetricValues();

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
      unity:
        data?.confirmedVolumetricParameters?.values?.ratioBitumenVoid !== undefined
          ? `${(data.confirmedVolumetricParameters.values.ratioBitumenVoid * 100).toFixed(2)}%`
          : '---',
      bearingLayer: '75 - 82',
      bondingLayer: '65 - 72',
    },
    {
      id: 2,
      param: t('asphalt.dosages.mixture-voids'),
      unity: correctedValues?.vvCalculated !== undefined ? `${correctedValues.vvCalculated.toFixed(2)}%` : '---',
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

  // DETERMINAR MÉTODO REAL para exibição
  const realMethod = getRealMethod();
  console.log('🎯 Método REAL para exibição:', realMethod);

  // CORREÇÃO: Usar o método REAL para determinar o label
  const volumetricMechanicParams = [
    {
      label: t('asphalt.dosages.optimum-binder'),
      value: optimumBinderContentData?.optimumBinder?.optimumContent?.toFixed(2) || '0.00',
      unity: '%',
      isValid: true,
    },
    {
      // Usar método REAL para mostrar DMT ou GMM
      label:
        realMethod === 'GMM'
          ? t('asphalt.dosages.gmm') // "Densidade máxima medida (GMM)"
          : t('asphalt.dosages.dmt'), // "Densidade máxima teórica (DMT)"

      // Usar valor do confirmedSpecificGravity ou valor apropriado
      value:
        data?.confirmedSpecificGravity?.result !== undefined
          ? data.confirmedSpecificGravity.result.toFixed(2)
          : realMethod === 'GMM' && maximumMixtureDensityData?.gmm?.[2]?.value
          ? maximumMixtureDensityData.gmm[2].value.toFixed(2)
          : '---',

      unity: 'g/cm³',
      isValid: true,
    },
    {
      label: t('asphalt.dosages.gmb'),
      value: data?.confirmedVolumetricParameters?.values?.apparentBulkSpecificGravity?.toFixed(2) || '---',
      unity: 'g/cm³',
      isValid: true,
    },
    {
      // ✅ CORRIGIDO: Volume de Vazios (VV) - calculado como VAM - VBC
      label: t('asphalt.dosages.vv') + ' (VV)',
      value: correctedValues?.vvCalculated !== undefined ? correctedValues.vvCalculated.toFixed(2) : '---',
      unity: '%',
      isValid: true,
    },
    {
      // ✅ CORRIGIDO: Volume do Agregado de Vazios (VAM) - do backend
      label: t('asphalt.dosages.vam') + ' (VAM)',
      value:
        data?.confirmedVolumetricParameters?.values?.aggregateVolumeVoids !== undefined
          ? (data.confirmedVolumetricParameters.values.aggregateVolumeVoids * 100).toFixed(2)
          : '---',
      unity: '%',
      isValid: true,
    },
    {
      // ✅ NOVO: Vazios com Betume (VBC) - calculado
      label: 'VBC (Vazios com Betume)',
      value: correctedValues?.vbcCalculated !== undefined ? correctedValues.vbcCalculated.toFixed(2) : '---',
      unity: '%',
      isValid: true,
    },
    {
      // ✅ CORRIGIDO: Relação Betume-Vazios (RBV) - do backend
      label: t('asphalt.dosages.rbv') + ' (RBV)',
      value:
        data?.confirmedVolumetricParameters?.values?.ratioBitumenVoid !== undefined
          ? (data.confirmedVolumetricParameters.values.ratioBitumenVoid * 100).toFixed(2)
          : '---',
      unity: '%',
      isValid: true,
    },
    {
      label: t('asphalt.dosages.marshall.stability'),
      value: data?.confirmedVolumetricParameters?.values?.stability?.toFixed(2) || '0.00',
      unity: 'N',
      isValid: true,
    },
    {
      label: t('asphalt.dosages.marshall.fluency'),
      value: data?.confirmedVolumetricParameters?.values?.fluency?.toFixed(2) || '0.00',
      unity: 'mm',
      isValid: true,
    },
    {
      label: t('asphalt.dosages.indirect-tensile-strength'),
      value: data?.confirmedVolumetricParameters?.values?.indirectTensileStrength?.toFixed(2) || '0.00',
      unity: 'MPa',
      isValid: true,
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
        {/* Informação do método usado */}
        <Box sx={{ p: 1, bgcolor: 'info.light', borderRadius: 1, mb: 2 }}>
          <Typography variant="body2" color="info.contrastText">
            Método de densidade:{' '}
            <strong>{realMethod === 'GMM' ? 'GMM - Densidade máxima medida' : 'DMT - Densidade máxima teórica'}</strong>
          </Typography>
        </Box>

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
                <Typography variant="body2">⚠ Tabela não disponível</Typography>
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
                <Typography variant="body2">⚠ Tabela quantitativa não disponível</Typography>
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
                const isValidValue =
                  item.value &&
                  item.value !== 'NaN' &&
                  item.value !== 'undefined' &&
                  item.value !== '---' &&
                  item.value !== 'null' &&
                  !isNaN(parseFloat(item.value));

                if (isValidValue) {
                  return (
                    <Result_Card key={item.label} label={item.label} value={String(item.value)} unity={item.unity} />
                  );
                }
                return null;
              })}
            </Box>
          </Box>

          <Box id="volumetric-params" sx={{ width: '100%', overflowX: 'auto' }}>
            <ResultSubTitle title={t('asphalt.dosages.volumetric-params')} sx={{ margin: '.65rem' }} />
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
                <Typography variant="body2">⚠ Parâmetros volumétricos não disponíveis</Typography>
              </Box>
            )}
          </Box>

          <Box id="mineral-aggregate-voids" sx={{ width: '100%', overflowX: 'auto' }}>
            <ResultSubTitle title={t('asphalt.dosages.mineral-aggregate-voids')} sx={{ margin: '.65rem' }} />
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
