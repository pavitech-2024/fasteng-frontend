import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, Typography } from '@mui/material';
import { DataGrid, GridColumnGroupingModel } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import GraphStep6 from './graphs/step6Graph';
import DropDown, { DropDownOption } from '@/components/atoms/inputs/dropDown';

const Superpave_Step7_FirstCompactionParams = ({
  setNextDisabled,
  superpave,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    granulometryCompositionData,
    initialBinderData,
    generalData,
    firstCurvePercentagesData: data,
    firstCompressionData,
    setData,
  } = useSuperpaveStore();
  console.log('🚀 ~ Superpave_Step7_FirstCompactionParams ~ data:', data);

  const [renderTable3, setRenderTable3] = useState(false);

  useEffect(() => {
    if (data.table3) {
      const table3Arr = Object.values(data.table3);
      if (table3Arr.some((e) => e !== null)) {
        setRenderTable3(true);
      }
    }
  }, [data?.table3]);

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          const {
            data: resData,
            success,
            error,
          } = await superpave.getStepFirstCurvePercentages(
            generalData,
            granulometryCompositionData,
            initialBinderData,
            firstCompressionData
          );

          const newData = { selectedCurve: data.selectedCurve, ...resData };

          if (success) {
            setData({
              step: 6,
              value: newData,
            });
          } else {
            console.error(`${error}`);
          }
        } catch (error) {
          throw error;
        }
      },
      {
        pending: t('loading.materials.pending'),
        success: t('loading.materials.success'),
        error: t('loading.materials.error'),
      }
    );
  }, []);

  const paramsCols = [
    {
      field: 'gmmInitialN',
      headerName: '%Gmm Ninicial (%)',
      valueFormatter: ({ value }) => `${value}`,
      width: 180,
    },
    {
      field: 'gmmNProj',
      headerName: '%Gmm Nproj (%)',
      valueFormatter: ({ value }) => `${value}`,
      width: 180,
    },
    {
      field: 'gmmNMax',
      headerName: '%Gmm Nmax (%)',
      valueFormatter: ({ value }) => `${value}`,
      width: 180,
    },
    {
      field: 'expectedVam',
      headerName: 'VAM (%)',
      valueFormatter: ({ value }) => `${value}`,
      width: 180,
    },
    {
      field: 'p_a',
      headerName: 'P/A (%)',
      valueFormatter: ({ value }) => `${value}`,
      width: 180,
    },
  ];

  const paramsGroupings: GridColumnGroupingModel = [
    {
      groupId: 'params',
      headerName: `Parâmteros para o nível de tráfego ${generalData.trafficVolume} e tamanho nominal máximo ${data.table1?.nominalSize}`,
      children: [
        { field: 'gmmInitialN' },
        { field: 'gmmNProj' },
        { field: 'gmmNMax' },
        { field: 'expectedVam' },
        { field: 'p_a' },
      ],
      headerAlign: 'center',
    },
  ];

  const paramsRows = [
    {
      id: 0,
      gmmInitialN: data.table1?.expectedPorcentageGmmInitialN ? data.table1?.expectedPorcentageGmmInitialN : '---',
      gmmNMax: data.table1?.expectedPorcentageGmmMaxN !== null ? data.table1?.expectedPorcentageGmmMaxN : '---',
      gmmNProj:
        data.table1?.expectedPorcentageGmmProjectN !== null ? data.table1?.expectedPorcentageGmmProjectN : '---',
      expectedVam: data.table1?.expectedVam !== null ? data.table1?.expectedVam : '---',
      p_a: '0,6 - 1,2',
    },
  ];

  const calculatedCurvesCols = [
    {
      field: 'mixture',
      headerName: 'Mistura',
      valueFormatter: ({ value }) => `${value}`,
      width: 130,
    },
    {
      field: 'gmmInitialN',
      headerName: '%Gmm Ninicial (%)',
      valueFormatter: ({ value }) => `${value}`,
      width: 130,
    },
    {
      field: 'gmmNProj',
      headerName: '%Gmm Nproj (%)',
      valueFormatter: ({ value }) => `${value}`,
      width: 130,
    },
    {
      field: 'gmmNMax',
      headerName: '%Gmm Nmax (%)',
      valueFormatter: ({ value }) => `${value}`,
      width: 130,
    },
    {
      field: 'expectedVam',
      headerName: 'VAM (%)',
      valueFormatter: ({ value }) => `${value}`,
      width: 130,
    },
    {
      field: 'p_a',
      headerName: 'P/A (%)',
      valueFormatter: ({ value }) => `${value}`,
      width: 130,
    },
    {
      field: 'specificMass',
      headerName: 'Massa Específica (g/cm³)',
      valueFormatter: ({ value }) => `${value}`,
      width: 130,
    },
    {
      field: 'absorbedWater',
      headerName: 'Água Absorvida (%)',
      valueFormatter: ({ value }) => `${value}`,
      width: 130,
    },
  ];

  const calculatedCurvesGroupings: GridColumnGroupingModel = [
    {
      groupId: 'calculatedCurves',
      headerName: `Parâmteros calculados das curvas granulométricas`,
      children: [
        { field: 'mixture' },
        { field: 'gmmInitialN' },
        { field: 'gmmNProj' },
        { field: 'gmmNMax' },
        { field: 'expectedVam' },
        { field: 'p_a' },
        { field: 'specificMass' },
        { field: 'absorbedWater' },
      ],
      headerAlign: 'center',
    },
  ];

  const expectedParamsRows = Object.entries(data.table3).map(([key, value], idx) => {
    const mixture = key.includes('Lower')
      ? 'Inferior'
      : key.includes('Average')
      ? 'Intermediária'
      : key.includes('Higher')
      ? 'Superior'
      : '';

    const curve = key.includes('Lower')
      ? 'Lower'
      : key.includes('Average')
      ? 'Average'
      : key.includes('Higher')
      ? 'Higher'
      : '';

    return {
      id: idx,
      mixture,
      expectedPli: value?.[`expectedPli${curve}`]?.toFixed(2),
      expectedPercentageGmmInitialN: value?.[`expectedPercentageGmmInitialN${curve}`]?.toFixed(2),
      expectedPercentageGmmMaxN: value?.[`expectedPercentageGmmMaxN${curve}`]?.toFixed(2),
      expectedRBV: value?.[`expectedRBV${curve}`]?.toFixed(2),
      expectedVam: value?.[`expectedVam${curve}`]?.toFixed(2),
      p_a: value?.[`expectedRatioDustAsphalt${curve}`],
    };
  });

  const calculatedCurvesRows = Object.entries(data.table2).map(([key, value], idx) => {
    const mixture = key.includes('Lower')
      ? 'Inferior'
      : key.includes('Average')
      ? 'Intermediária'
      : key.includes('Higher')
      ? 'Superior'
      : '';

    return {
      id: idx,
      mixture,
      gmmInitialN: value?.percentageGmmInitialN?.toFixed(2),
      gmmNProj: value?.percentageGmmProjectN?.toFixed(2),
      gmmNMax: value?.percentageGmmMaxN?.toFixed(2),
      expectedVam: value?.porcentageVam?.toFixed(2),
      p_a: value?.ratioDustAsphalt?.toFixed(2),
      specificMass: value?.specificMass?.toFixed(2),
      absorbedWater: value?.percentWaterAbs?.toFixed(2),
    };
  });

  const expectedParamsCols = [
    {
      field: 'mixture',
      headerName: t('asphalt.dosages.mixture'),
      valueFormatter: ({ value }) => `${value}`,
      width: 160,
    },
    {
      field: 'expectedPli',
      headerName: t('asphalt.dosages.estimated-binder-percentage'),
      valueFormatter: ({ value }) => `${value}`,
      width: 160,
    },
    {
      field: 'expectedVam',
      headerName: t('asphalt.dosages.estimated-vam'),
      valueFormatter: ({ value }) => `${value}`,
      width: 160,
    },
    {
      field: 'p_a',
      headerName: t('asphalt.dosages.expected-pa'),
      valueFormatter: ({ value }) => `${value}`,
      width: 160,
    },
    {
      field: 'expectedPercentageGmmInitialN',
      headerName: t('asphalt.dosages.gmm-n-initial'),
      valueFormatter: ({ value }) => `${value}`,
      width: 160,
    },
    {
      field: 'expectedPercentageGmmMaxN',
      headerName: t('asphalt.dosages.gmm-n-max'),
      valueFormatter: ({ value }) => `${value}`,
      width: 160,
    },
  ];

  const expectedParamsGroupings: GridColumnGroupingModel = [
    {
      groupId: 'expectedParams',
      headerName: `${t('asphalt.dosages.expected-params-vv')} ${0}`,
      children: [
        { field: 'mixture' },
        { field: 'expectedPli' },
        { field: 'expectedVam' },
        { field: 'p/a' },
        { field: 'expectedPercentageGmmInitialN' },
        { field: 'expectedPercentageGmmMaxN' },
      ],
      headerAlign: 'center',
    },
  ];

  const selectedCurveOptions: DropDownOption[] = [
    { label: t('asphalt.dosages.superpave.lower'), value: 'lower' },
    { label: t('asphalt.dosages.superpave.average'), value: 'average' },
    { label: t('asphalt.dosages.superpave.higher'), value: 'higher' },
  ];

  useEffect(() => {
    if (data.selectedCurve !== null && data.selectedCurve !== undefined) {
      setNextDisabled(false);
    } else {
      setNextDisabled(true);
    }
  }, [data.selectedCurve]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <DataGrid
            hideFooter
            disableColumnMenu
            disableColumnFilter
            experimentalFeatures={{ columnGrouping: true }}
            columnGroupingModel={paramsGroupings}
            columns={paramsCols.map((column) => ({
              ...column,
              disableColumnMenu: true,
              sortable: false,
              align: 'center',
              headerAlign: 'center',
              minWidth: 100,
              flex: 1,
            }))}
            rows={paramsRows}
          />

          <DataGrid
            hideFooter
            disableColumnMenu
            disableColumnFilter
            experimentalFeatures={{ columnGrouping: true }}
            columnGroupingModel={calculatedCurvesGroupings}
            columns={calculatedCurvesCols.map((column) => ({
              ...column,
              disableColumnMenu: true,
              sortable: false,
              align: 'center',
              headerAlign: 'center',
              minWidth: 100,
              flex: 1,
            }))}
            rows={calculatedCurvesRows}
          />

          <Box style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Typography variant="h5" style={{ width: '100%', textAlign: 'center' }}>
              {t('asphalt.dosages.superpave.volumetric-graphs')}
            </Typography>

            {['table4Lower', 'table4Average', 'table4Higher'].map((key, index) => {
              const curveData = data.table4[key]?.data;
              if (curveData?.length > 0) {
                const curveLabel = [
                  t('asphalt.dosages.superpave.lower-curve'),
                  t('asphalt.dosages.superpave.average-curve'),
                  t('asphalt.dosages.superpave.higher-curve'),
                ][index];
                return (
                  <Box key={key}>
                    <Typography variant="h6">{curveLabel}</Typography>
                    <GraphStep6 data={curveData} />
                  </Box>
                );
              }
              return null;
            })}

            <DataGrid
              hideFooter
              disableColumnMenu
              disableColumnFilter
              experimentalFeatures={{ columnGrouping: true }}
              columnGroupingModel={expectedParamsGroupings}
              columns={expectedParamsCols}
              rows={expectedParamsRows}
            />
          </Box>

          <Box sx={{ width: '100%' }}>
            <Typography>{t('asphalt.dosages.superpave.choose-curve')}</Typography>
            <DropDown
              label={''}
              sx={{ width: '40%' }}
              options={selectedCurveOptions}
              callback={(value) => setData({ step: 6, key: 'selectedCurve', value })}
              size="medium"
              variant="standard"
              value={{
                value: data.selectedCurve ? data.selectedCurve : null,
                label: `${data.selectedCurve === undefined ? 'Selecionar' : data.selectedCurve}`,
              }}
            />
          </Box>
        </Box>
      )}
    </>
  );
};

export default Superpave_Step7_FirstCompactionParams;
