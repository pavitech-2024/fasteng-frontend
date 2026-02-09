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
import FatigueOrResilienceCard from './FatigueOrResilienceCard';

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

    // Prioridade 1: Verificar no confirmedSpecificGravity (mais confiável)
    if (data?.confirmedSpecificGravity?.type) {
      const type = data.confirmedSpecificGravity.type;
      // Verificar se o tipo é válido
      if (type === 'DMT' || type === 'GMM') {
        return type;
      }
    }

    // Prioridade 2: Verificar se tem GMM específico
    if (data?.gmm !== null && data?.gmm !== undefined && data.gmm > 0) {
      return 'GMM';
    }

    // Prioridade 3: Verificar no maximumMixtureDensityData
    if (maximumMixtureDensityData?.method) {
      const method = maximumMixtureDensityData.method;
      if (method === 'DMT' || method === 'GMM') {
        return method as 'DMT' | 'GMM';
      }
    }

    // Prioridade 4: Verificar no maxSpecificGravity
    if (maximumMixtureDensityData?.maxSpecificGravity?.method) {
      const method = maximumMixtureDensityData.maxSpecificGravity.method;
      if (method === 'DMT' || method === 'GMM') {
        return method as 'DMT' | 'GMM';
      }
    }

    // Default para DMT
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


  useEffect(() => {

    const fetchData = async () => {
      try {
        let newData = {};

        // Tentar buscar dosagem
        if (dosageId) {
          try {
            console.log('🔍 [RESUME] Estado inicial:');
  
  const storeRaw = sessionStorage.getItem('asphalt-marshall-store');
  console.log('📦 Store raw do sessionStorage:', storeRaw);
  
  const store = storeRaw ? JSON.parse(storeRaw) : null;
  console.log('📦 Store parseada:', store);
  
  const dosageId = store?.state?._id;
  console.log('🆔 DosageId extraído:', dosageId);
  console.log('🆔 Tipo do dosageId:', typeof dosageId);
  console.log('🔍 URL que está sendo chamada:', 
  `http://localhost:8080/asphalt/dosages/marshall/by-id/${dosageId}`
);
  
            const foundDosage = await marshallDosageService.getMarshallDosage(dosageId);
            
            setDosage(foundDosage.data.dosage);
          } catch (dosageError) {
            console.warn('⚠ [RESUME] Não foi possível buscar a dosagem:', dosageError);
          }
        }

        const realMethod = getRealMethod();

        let response;

        if (realMethod === 'GMM') {

          // Para GMM, criar objeto com tipo correto
          const gmmData = {
            ...data,
            confirmedSpecificGravity: {
              // Garantir que result existe
              result: data?.confirmedSpecificGravity?.result || 0,
              type: 'GMM' as const, // Usar 'as const' para garantir o tipo literal
            },
          };


          response = await marshall.confirmVolumetricParameters(
            maximumMixtureDensityData,
            optimumBinderContentData,
            gmmData
          );
        } else {
          // Para DMT

          const dmtData = {
            ...data,
            confirmedSpecificGravity: {
              // Garantir que result existe
              result: data?.confirmedSpecificGravity?.result || 0,
              type: 'DMT' as const, // Usar 'as const' para garantir o tipo literal
            },
          };


          response = await marshall.confirmVolumetricParameters(
            maximumMixtureDensityData,
            optimumBinderContentData,
            dmtData
          );
        }


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

    if (
      !materialSelectionData ||
      !materialSelectionData.aggregates ||
      !optimumBinderContentData ||
      !data ||
      !data.confirmedVolumetricParameters
    ) {
      return;
    }

    createOptimumContentRows();
    createOptimumContentColumns();
    createOptimumContentGroupings();
    getQuantitativeCols();
    getQuantitativeRows();
    getQuantitativeGroupings();
  }, [materialSelectionData, optimumBinderContentData, data]);

  const calculateQuantitativeValues = (): string[] | null => {
    if (!data?.confirmedVolumetricParameters?.values) {
      return null;
    }

    // 1. Pegar VV CORRETO
    const VV_percent = correctedValues?.vvCalculated || 0; // VV em %

    // 2. Pegar Gmm
    const Gmm = data?.confirmedSpecificGravity?.result || 0; // g/cm³

    // ✅ Fórmula correta para massa total em ton/m³
    const massaTotalTon = ((100 - VV_percent) / 100) * Gmm; // ton/m³

    

    // 3. Calcular MASSA DO LIGANTE em TONELADAS
    const teorLigante = optimumBinderContentData?.optimumBinder?.optimumContent || 0; // %
    const massaLiganteTon = (teorLigante / 100) * massaTotalTon; // ton/m³

 

    // 4. Calcular MASSA TOTAL DOS AGREGADOS em TONELADAS
    const massaTotalAgregadosTon = massaTotalTon - massaLiganteTon; // ton/m³

  

    // 5. Distribuir MASSA DOS AGREGADOS
    if (!materialSelectionData?.aggregates) {
      return null;
    }

    const percentuaisAgregados = optimumBinderContentData?.optimumBinder?.confirmedPercentsOfDosage || [];

    return materialSelectionData.aggregates.map((material, idx) => {
      const percentual = percentuaisAgregados[idx] || 0; // %

      // Massa do agregado individual em TONELADAS
      const massaAgregadoTon = (percentual / 100) * massaTotalAgregadosTon; // ton/m³

     

      // ✅ CORREÇÃO: Retornar em TONELADAS (sem multiplicar por 1000)
      return massaAgregadoTon.toFixed(4); // ton/m³
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

    const newCols: GridColDef[] = [];

    const binderObj: GridColDef = {
      field: 'binder',
      width: 250,
      headerName: t('asphalt.dosages.marshall.asphaltic-binder') + ' (ton/m³)', // ✅ Alterado para ton/m³
      valueFormatter: ({ value }) => `${value}`,
    };

    materialSelectionData.aggregates.forEach((material) => {
      const col: GridColDef = {
        field: `${material._id}`,
        width: 250,
        headerName: `${material.name} (ton/m³)`, // ✅ Alterado para ton/m³
        valueFormatter: ({ value }) => `${value}`,
      };
      newCols.push(col);
    });

    newCols.unshift(binderObj);
    setQuantitativeCols(newCols);
  };

  const getQuantitativeRows = () => {

    // Calcular usando a função corrigida (agora retorna ton/m³)
    const aggregateValues = calculateQuantitativeValues();

    // Calcular massa do ligante separadamente EM TONELADAS
    const VV_percent = correctedValues?.vvCalculated || 0;
    const Gmm = data?.confirmedSpecificGravity?.result || 0;

    // Fórmula correta para massa total em ton/m³
    const massaTotalTon = ((100 - VV_percent) / 100) * Gmm;
    const teorLigante = optimumBinderContentData?.optimumBinder?.optimumContent || 0;
    const massaLiganteTon = (teorLigante / 100) * massaTotalTon;

    // ✅ AGORA EM TONELADAS
    const massaLiganteParaMostrar = massaLiganteTon.toFixed(4); // 0.1272 ton/m³

    let rowsObj: any = {
      id: 0,
      binder: massaLiganteParaMostrar, // ✅ EM TONELADAS
    };

    materialSelectionData.aggregates.forEach((material, idx) => {
      let value = '-';

      if (aggregateValues && aggregateValues[idx] !== undefined) {
        value = aggregateValues[idx]; // ✅ JÁ EM TONELADAS (0.8980, 0.6735, etc.)
      } else {
        // Fallback - se vier do backend, converter de kg para ton
        const originalValue = data?.confirmedVolumetricParameters?.quantitative?.[idx + 1];
        if (typeof originalValue === 'number') {
          value = (originalValue / 1000).toFixed(4); // ✅ CONVERTE kg para ton
        } else {
          value = '-';
        }
      }

      rowsObj = {
        ...rowsObj,
        [material._id]: value,
      };
    });

   

    setQuantitativeRows([rowsObj]);
  };

  const getQuantitativeGroupings = () => {

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
        <FatigueOrResilienceCard
  title="Curva de Fadiga à Compressão Diametral"
  fields={[
    { name: 'ncp', label: 'Nº CPs' },
    { name: 'k1', label: 'k1' },
    { name: 'k2', label: 'k2' },
    { name: 'r2', label: 'R²' },
    { name: 'obs', label: 'Observações' },
  ]}
  onConfirm={(values) => {
    console.log('🎯 [STEP 9 - FATIGUE] Botão Confirmar clicado');
    console.log('📦 [STEP 9 - FATIGUE] Valores recebidos:', values);
    console.log('🆔 [STEP 9 - FATIGUE] DosageId:', dosageId);
    
    if (!dosageId) {
      console.error('❌ [STEP 9 - FATIGUE] dosageId não encontrado!');
      toast.error('ID da dosagem não encontrado');
      return;
    }
    
    // Verificar se há valores preenchidos
    const hasValues = Object.values(values).some(value => value && value.trim() !== '');
    if (!hasValues) {
      console.warn('⚠️ [STEP 9 - FATIGUE] Nenhum valor preenchido!');
      toast.warning('Preencha pelo menos um campo para salvar');
      return;
    }
    
    console.log('🚀 [STEP 9 - FATIGUE] Chamando saveFatigueCurve...');
    
    marshall.saveFatigueCurve({
      dosageId,
      ...values,
    })
    .then((response) => {
      console.log('✅ [STEP 9 - FATIGUE] Sucesso! Resposta:', response);
      toast.success('Curva de fadiga salva com sucesso!');
      
      // Opcional: Recarregar dados ou atualizar estado
      console.log('🔄 [STEP 9 - FATIGUE] Dados atualizados no banco');
    })
    .catch((error) => {
      console.error('❌ [STEP 9 - FATIGUE] Erro ao salvar:', {
        message: error.message,
        error: error
      });
      toast.error(`Erro ao salvar fadiga: ${error.message}`);
    });
  }}
/>

<FatigueOrResilienceCard
  title="Módulo de Resiliência"
  fields={[
    { name: 'k1', label: 'k1' },
    { name: 'k2', label: 'k2' },
    { name: 'k3', label: 'k3' },
    { name: 'r2', label: 'R²' },
  ]}
  onConfirm={(values) => {
    console.log('🎯 [STEP 9 - RESILIENCE] Botão Confirmar clicado');
    console.log('📦 [STEP 9 - RESILIENCE] Valores recebidos:', values);
    console.log('🆔 [STEP 9 - RESILIENCE] DosageId:', dosageId);
    
    if (!dosageId) {
      console.error('❌ [STEP 9 - RESILIENCE] dosageId não encontrado!');
      toast.error('ID da dosagem não encontrado');
      return;
    }
    
    // Verificar se há valores preenchidos
    const hasValues = Object.values(values).some(value => value && value.trim() !== '');
    if (!hasValues) {
      console.warn('⚠️ [STEP 9 - RESILIENCE] Nenhum valor preenchido!');
      toast.warning('Preencha pelo menos um campo para salvar');
      return;
    }
    
    console.log('🚀 [STEP 9 - RESILIENCE] Chamando saveResilienceModule...');
    
    marshall.saveResilienceModule({
      dosageId,
      ...values,
    })
    .then((response) => {
      console.log('✅ [STEP 9 - RESILIENCE] Sucesso! Resposta:', response);
      toast.success('Módulo de resiliência salvo com sucesso!');
      
      // Opcional: Recarregar dados ou atualizar estado
      console.log('🔄 [STEP 9 - RESILIENCE] Dados atualizados no banco');
    })
    .catch((error) => {
      console.error('❌ [STEP 9 - RESILIENCE] Erro ao salvar:', {
        message: error.message,
        error: error
      });
      toast.error(`Erro ao salvar resiliência: ${error.message}`);
    });
  }}
/>
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default Marshall_Step9_ResumeDosage;
