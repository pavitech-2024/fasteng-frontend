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
    confirmationCompressionData: data,
  } = useMarshallStore();

  const [dosage, setDosage] = useState(null);
  const [loading, setLoading] = useState(false);

  const storeRaw = sessionStorage.getItem('asphalt-marshall-store');
  const store = storeRaw ? JSON.parse(storeRaw) : null;
  const dosageId = store?.state?._id;

  const [fatigueData, setFatigueData] = useState<any>(null);
  const [resilienceData, setResilienceData] = useState<any>(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // 🔥 Simplificado: Pega o método DIRETAMENTE da store
  const realMethod = data?.method || data?.confirmedSpecificGravity?.type || 'DMT';

  // 🔥 Simplificado: Pega os valores volumétricos DIRETAMENTE da store
  const volumetricValues = data?.confirmedVolumetricParameters?.values;

  // Busca a dosagem do banco (apenas para PDF e dados complementares)
  useEffect(() => {
    const fetchDosage = async () => {
      if (dosageId && !initialLoadDone) {
        try {
          const foundDosage = await marshallDosageService.getMarshallDosage(dosageId);
          setDosage(foundDosage.data.dosage);

          const dosageFromDB = foundDosage.data.dosage;

          if (dosageFromDB?.fatigueCurveData) {
            setFatigueData(dosageFromDB.fatigueCurveData);
          }

          if (dosageFromDB?.resilienceModuleData) {
            setResilienceData(dosageFromDB.resilienceModuleData);
          }

          setInitialLoadDone(true);
        } catch (error) {
          console.warn('⚠ Não foi possível buscar a dosagem:', error);
        }
      }
    };

    fetchDosage();
  }, [dosageId, initialLoadDone]);

  // Verifica se os dados essenciais estão disponíveis
  useEffect(() => {
    if (!data || !volumetricValues) {
      setLoading(true);
      // Tenta carregar os dados se não estiverem disponíveis
      toast.error(
        'Dados volumétricos não encontrados. Por favor, volte para a etapa anterior e confirme os parâmetros.',
        { autoClose: 5000 }
      );
    } else {
      setLoading(false);
    }
  }, [data, volumetricValues]);

  useEffect(() => {
    if (nextDisabled && data && volumetricValues) {
      setNextDisabled(false);
    }
  }, [nextDisabled, setNextDisabled, data, volumetricValues]);

  // ============ CÁLCULOS DERIVADOS DOS DADOS DA STORE ============

  const calculateQuantitativeValues = (): string[] | null => {
    if (!volumetricValues || !data?.confirmedSpecificGravity?.result) {
      return null;
    }

    // VV (Volume de Vazios) em percentual
    const VV_decimal = volumetricValues.aggregateVolumeVoids || 0;
    const VBC = volumetricValues.bitumenVoids || 0;
    const VV_percent = Math.max(0, VV_decimal * 100 - VBC);

    // Gmm
    const Gmm = data.confirmedSpecificGravity.result;

    // Massa total em ton/m³
    const massaTotalTon = ((100 - VV_percent) / 100) * Gmm;

    // Massa do ligante em toneladas
    const teorLigante = optimumBinderContentData?.optimumBinder?.optimumContent || 0;
    const massaLiganteTon = (teorLigante / 100) * massaTotalTon;

    // Massa total dos agregados em toneladas
    const massaTotalAgregadosTon = massaTotalTon - massaLiganteTon;

    // Distribuir massa dos agregados
    if (!materialSelectionData?.aggregates) {
      return null;
    }

    const percentuaisAgregados = optimumBinderContentData?.optimumBinder?.confirmedPercentsOfDosage || [];

    return materialSelectionData.aggregates.map((material, idx) => {
      const percentual = percentuaisAgregados[idx] || 0;
      const massaAgregadoTon = (percentual / 100) * massaTotalAgregadosTon;
      return massaAgregadoTon.toFixed(4);
    });
  };

  const getFatigueInitialValues = () => {
    if (!fatigueData) return {};
    return {
      k1: fatigueData.k1?.toString() || '',
      k2: fatigueData.k2?.toString() || '',
      observacoes: fatigueData.observacoes || fatigueData.observations || '',
    };
  };

  const getResilienceInitialValues = () => {
    if (!resilienceData) return {};
    return {
      moduloMedio: resilienceData.moduloMedio?.toString() || '',
      moduloInstantaneo: resilienceData.moduloInstantaneo?.toString() || '',
      observacoes: resilienceData.observacoes || '',
    };
  };

  // ============ CONFIGURAÇÃO DAS TABELAS ============

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

  // Configuração da tabela de teor ótimo
  const optimumContentCols: GridColDef[] = [
    {
      field: 'optimumBinder',
      width: 250,
      headerName: t('asphalt.dosages.optimum-binder'),
      valueFormatter: ({ value }) => (typeof value === 'number' ? value.toFixed(2) : value),
    },
    ...(materialSelectionData?.aggregates?.map((material) => ({
      field: material._id,
      width: 250,
      headerName: material.name,
      valueFormatter: ({ value }) => (typeof value === 'number' ? value.toFixed(2) : value),
    })) || []),
  ];

  const optimumContentRows = [
    {
      id: 0,
      optimumBinder: Number(optimumBinderContentData?.optimumBinder?.optimumContent?.toFixed(2)) || 0,
      ...(materialSelectionData?.aggregates?.reduce((acc, material, idx) => {
        const percent = optimumBinderContentData?.optimumBinder?.confirmedPercentsOfDosage?.[idx];
        return {
          ...acc,
          [material._id]: percent ? Number(percent.toFixed(2)) : 0,
        };
      }, {}) || {}),
    },
  ];

  const optimumContentGroupings: GridColumnGroupingModel = [
    {
      groupId: 'optimumContent',
      headerName: t('asphalt.dosages.marshall.materials-final-proportions'),
      headerAlign: 'center',
      children: [
        { field: 'optimumBinder' },
        ...(materialSelectionData?.aggregates?.map((material) => ({
          field: material._id,
        })) || []),
      ],
    },
  ];

  // Configuração da tabela quantitativa
  const quantitativeValues = calculateQuantitativeValues();

  const quantitativeCols: GridColDef[] = [
    {
      field: 'binder',
      width: 250,
      headerName: t('asphalt.dosages.marshall.asphaltic-binder') + ' (t/m³)',
      valueFormatter: ({ value }) => `${value}`,
    },
    ...(materialSelectionData?.aggregates?.map((material) => ({
      field: `${material._id}`,
      width: 250,
      headerName: `${material.name} (t/m³)`,
      valueFormatter: ({ value }) => `${value}`,
    })) || []),
  ];

  const quantitativeRows =
    volumetricValues && data?.confirmedSpecificGravity?.result
      ? [
          {
            id: 0,
            binder: (() => {
              const VV_decimal = volumetricValues.aggregateVolumeVoids || 0;
              const VBC = volumetricValues.bitumenVoids || 0;
              const VV_percent = Math.max(0, VV_decimal * 100 - VBC);
              const Gmm = data.confirmedSpecificGravity.result;
              const massaTotalTon = ((100 - VV_percent) / 100) * Gmm;
              const teorLigante = optimumBinderContentData?.optimumBinder?.optimumContent || 0;
              return ((teorLigante / 100) * massaTotalTon).toFixed(4);
            })(),
            ...(materialSelectionData?.aggregates?.reduce((acc, material, idx) => {
              return {
                ...acc,
                [material._id]: quantitativeValues?.[idx] || '-',
              };
            }, {}) || {}),
          },
        ]
      : [];

  const quantitativeGroupings: GridColumnGroupingModel = [
    {
      groupId: 'quantitativeGrouping',
      headerName: t('asphalt.dosages.marshall.asphalt-mass-quantitative'),
      headerAlign: 'center',
      children: [
        { field: 'binder' },
        ...(materialSelectionData?.aggregates?.map((material) => ({
          field: `${material._id}`,
        })) || []),
      ],
    },
  ];

  // Configuração dos parâmetros volumétricos
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

  const volumetricParamsRows = volumetricValues
    ? [
        {
          id: 0,
          param: t('asphalt.dosages.stability'),
          unity: `${volumetricValues.stability?.toFixed(2) || '0.00'} Kgf`,
          bearingLayer: '≥500',
          bondingLayer: '≥500',
        },
        {
          id: 1,
          param: t('asphalt.dosages.rbv'),
          unity:
            volumetricValues.ratioBitumenVoid !== undefined
              ? `${(volumetricValues.ratioBitumenVoid * 100).toFixed(2)}%`
              : '---',
          bearingLayer: '75 - 82',
          bondingLayer: '65 - 72',
        },
        {
          id: 2,
          param: t('asphalt.dosages.mixture-voids'),
          unity: (() => {
            const VAM = volumetricValues.aggregateVolumeVoids || 0;
            const VBC = volumetricValues.bitumenVoids || 0;
            const VV = VAM * 100 - VBC;
            return `${VV.toFixed(2)}%`;
          })(),
          bearingLayer: '3 - 5',
          bondingLayer: '4 - 6',
        },
        {
          id: 3,
          param: `${t('asphalt.dosages.indirect-tensile-strength')} (25 °C)`,
          unity: `${(volumetricValues.indirectTensileStrength || 0).toFixed(2)} MPa`,
          bearingLayer: '≥ 0,65',
          bondingLayer: '≥ 0,65',
        },
      ]
    : [];

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
    { id: 0, tmn: '9,5mm', vam: '≥ 18' },
    { id: 1, tmn: '12,5mm', vam: '≥ 16' },
    { id: 3, tmn: '19,1mm', vam: '≥ 15' },
  ];

  const mineralAggregateVoidsGroup: GridColumnGroupingModel = [
    {
      groupId: 'mineralAggregateVoids',
      headerName: t('asphalt.dosages.mineral-aggregate-voids'),
      headerAlign: 'center',
      children: [{ field: 'tmn' }, { field: 'vam' }],
    },
  ];

  // Cards de parâmetros volumétricos e mecânicos
  const volumetricMechanicParams = volumetricValues
    ? [
        {
          label: t('asphalt.dosages.optimum-binder'),
          value: optimumBinderContentData?.optimumBinder?.optimumContent?.toFixed(2) || '0.00',
          unity: '%',
          isValid: true,
        },
        {
          label: realMethod === 'GMM' ? t('asphalt.dosages.gmm') : t('asphalt.dosages.dmt'),
          value:
            data?.confirmedSpecificGravity?.result != null
              ? Number(data.confirmedSpecificGravity.result).toFixed(2)
              : '---',
          unity: 'g/cm³',
          isValid: true,
        },
        {
          label: t('asphalt.dosages.gmb'),
          value: volumetricValues.apparentBulkSpecificGravity?.toFixed(2) || '---',
          unity: 'g/cm³',
          isValid: true,
        },
        {
          label: t('asphalt.dosages.vv') + ' (VV)',
          value: (() => {
            const VAM = volumetricValues.aggregateVolumeVoids || 0;
            const VBC = volumetricValues.bitumenVoids || 0;
            return (VAM * 100 - VBC).toFixed(2);
          })(),
          unity: '%',
          isValid: true,
        },
        {
          label: t('asphalt.dosages.vam') + ' (VAM)',
          value:
            volumetricValues.aggregateVolumeVoids !== undefined
              ? (volumetricValues.aggregateVolumeVoids * 100).toFixed(2)
              : '---',
          unity: '%',
          isValid: true,
        },
        {
          label: 'VBC (Vazios com Betume)',
          value: volumetricValues.bitumenVoids?.toFixed(2) || '---',
          unity: '%',
          isValid: true,
        },
        {
          label: t('asphalt.dosages.rbv') + ' (RBV)',
          value:
            volumetricValues.ratioBitumenVoid !== undefined
              ? (volumetricValues.ratioBitumenVoid * 100).toFixed(2)
              : '---',
          unity: '%',
          isValid: true,
        },
        {
          label: t('asphalt.dosages.marshall.stability'),
          value: volumetricValues.stability?.toFixed(2) || '0.00',
          unity: 'N',
          isValid: true,
        },
        {
          label: t('asphalt.dosages.marshall.fluency'),
          value: volumetricValues.fluency?.toFixed(2) || '0.00',
          unity: 'mm',
          isValid: true,
        },
        {
          label: t('asphalt.dosages.indirect-tensile-strength'),
          value: volumetricValues.indirectTensileStrength?.toFixed(2) || '0.00',
          unity: 'MPa',
          isValid: true,
        },
      ]
    : [];

  // ============ RENDERIZAÇÃO ============

  if (loading || !data || !volumetricValues) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Loading />
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          {!data || !volumetricValues
            ? 'Dados não disponíveis. Por favor, volte e complete a etapa anterior.'
            : 'Carregando dados...'}
        </Typography>
      </Box>
    );
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
          {/* Tabela de teor ótimo */}
          <Box id="general-results" sx={{ width: '100%', overflowX: 'auto' }}>
            <ResultSubTitle title={t('marshall.general-results')} sx={{ margin: '.65rem' }} />

            {optimumContentCols.length > 0 && optimumContentRows.length > 0 ? (
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
                sx={{ minWidth: '600px' }}
              />
            ) : (
              <Box sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
                <Typography variant="body2">⚠ Tabela não disponível</Typography>
              </Box>
            )}
          </Box>

          {/* Tabela quantitativa */}
          <Box id="asphalt-mass-quantitative" sx={{ width: '100%', overflowX: 'auto' }}>
            <ResultSubTitle
              title={t('asphalt.dosages.marshall.asphalt-mass-quantitative')}
              sx={{ marginX: '.65rem' }}
            />

            {quantitativeRows.length > 0 && quantitativeCols.length > 0 ? (
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
                sx={{ minWidth: '600px' }}
              />
            ) : (
              <Box sx={{ p: 2, bgcolor: 'warning.light', color: 'warning.contrastText', borderRadius: 1 }}>
                <Typography variant="body2">⚠ Tabela quantitativa não disponível</Typography>
              </Box>
            )}
          </Box>

          {/* Cards de parâmetros */}
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

          {/* Tabela de parâmetros volumétricos */}
          <Box id="volumetric-params" sx={{ width: '100%', overflowX: 'auto' }}>
            <ResultSubTitle title={t('asphalt.dosages.volumetric-params')} sx={{ margin: '.65rem' }} />
            {volumetricParamsRows.length > 0 ? (
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
                sx={{ minWidth: '600px' }}
              />
            ) : (
              <Box sx={{ p: 2, bgcolor: 'warning.light', color: 'warning.contrastText', borderRadius: 1 }}>
                <Typography variant="body2">⚠ Parâmetros volumétricos não disponíveis</Typography>
              </Box>
            )}
          </Box>

          {/* Tabela de VAM */}
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
              sx={{ minWidth: '100%' }}
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
                sx={{ minWidth: '500px' }}
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

          {/* Card de Curva de Fadiga */}
          <FatigueOrResilienceCard
            title="Curva de Fadiga à Compressão Diametral"
            fields={[
              { name: 'k1', label: 'K1' },
              { name: 'k2', label: 'K2' },
              { name: 'observacoes', label: 'Observações' },
            ]}
            initialValues={getFatigueInitialValues()}
            onConfirm={(values) => {
              if (!dosageId) {
                toast.error('ID da dosagem não encontrado');
                return;
              }

              const hasValues = Object.values(values).some((value) => value && value.trim() !== '');
              if (!hasValues) {
                toast.warning('Preencha pelo menos um campo para salvar');
                return;
              }

              const formattedValues = {
                k1: values.k1 ? parseFloat(values.k1) : undefined,
                k2: values.k2 ? parseFloat(values.k2) : undefined,
                observacoes: values.observacoes,
              };

              marshall
                .saveFatigueCurve({
                  dosageId,
                  ...formattedValues,
                })
                .then((response) => {
                  toast.success('Curva de fadiga salva com sucesso!');
                  if (response.dosage?.fatigueCurveData) {
                    setFatigueData(response.dosage.fatigueCurveData);
                  }
                })
                .catch((error) => {
                  toast.error(`Erro ao salvar fadiga: ${error.response?.data?.message || error.message}`);
                });
            }}
          />

          {/* Card de Módulo de Resiliência */}
          <FatigueOrResilienceCard
            title="Módulo de Resiliência"
            fields={[
              { name: 'moduloMedio', label: 'Módulo Médio (MPa)' },
              { name: 'moduloInstantaneo', label: 'Módulo Instantâneo (MPa)' },
              { name: 'observacoes', label: 'Observações' },
            ]}
            initialValues={getResilienceInitialValues()}
            onConfirm={(values) => {
              if (!dosageId) {
                toast.error('ID da dosagem não encontrado');
                return;
              }

              const hasValues = Object.values(values).some((value) => value && value.trim() !== '');
              if (!hasValues) {
                toast.warning('Preencha pelo menos um campo para salvar');
                return;
              }

              const formattedValues = {
                moduloMedio: values.moduloMedio ? parseFloat(values.moduloMedio) : undefined,
                moduloInstantaneo: values.moduloInstantaneo ? parseFloat(values.moduloInstantaneo) : undefined,
                observacoes: values.observacoes,
              };

              marshall
                .saveResilienceModule({
                  dosageId,
                  ...formattedValues,
                })
                .then((response) => {
                  toast.success('Módulo de resiliência salvo com sucesso!');
                  if (response.dosage?.resilienceModuleData) {
                    setResilienceData(response.dosage.resilienceModuleData);
                  }
                })
                .catch((error) => {
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
