import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import Graph from '@/services/asphalt/dosages/marshall/graph/graph';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, Typography } from '@mui/material';
import { DataGrid, GridColumnGroupingModel } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import GraphStep6 from './graphs/step6Graph';
import DropDown, { DropDownOption } from '@/components/atoms/inputs/dropDown';
import { Widgets } from '@mui/icons-material';

const Superpave_Step6 = ({
  nextDisabled,
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

  const [renderTable3, setRenderTable3] = useState(false);

  useEffect(() => {
    const table3Arr = Object.values(data.table3);
    console.log('🚀 ~ useEffect ~ table3Arr:', table3Arr);
    if (table3Arr.some((e) => e !== null)) {
      setRenderTable3(true);
    }
  }, [data?.table3]);

  const table2Arr = [data.table2.table2Lower, data.table2.table2Average, data.table2.table2Higher];

  const { user } = useAuth();

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

          if (success) {
            setData({
              step: 5,
              value: resData,
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
      field: 'p/a',
      headerName: 'P/A (%)',
      valueFormatter: ({ value }) => `${value}`,
      width: 180,
    },
  ];

  const paramsGroupings: GridColumnGroupingModel = [
    {
      groupId: 'params',
      headerName: `Parâmteros para o nível de tráfego ${generalData.trafficVolume} e tamanho nominal máximo ${data.table1.nominalSize}`,
      children: [
        { field: 'gmmInitialN' },
        { field: 'gmmNProj' },
        { field: 'gmmNMax' },
        { field: 'expectedVam' },
        { field: 'p/a' },
      ],
      headerAlign: 'center',
    },
  ];

  const paramsRows = [
    {
      id: 0,
      gmmInitialN: data.table1.expectedPorcentageGmmInitialN ? data.table1.expectedPorcentageGmmInitialN : '',
      gmmNMax: data.table1.expectedPorcentageGmmMaxN,
      gmmNProj: data.table1.expectedPorcentageGmmProjectN,
      expectedVam: data.table1.expectedVam,
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
      field: 'p/a',
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
        { field: 'p/a' },
        { field: 'specificMass' },
        { field: 'absorbedWater' },
      ],
      headerAlign: 'center',
    },
  ];

  const calculatedCurvesRows = table2Arr.map((arr, idx) => ({
    id: idx,
    mixture: idx === 0 ? 'Inferior' : idx === 1 ? 'Intermediária' : idx === 2 ? 'Superior' : '',
    gmmInitialN: arr.percentageGmmInitialN,
    gmmNMax: Number(arr.percentageGmmMaxN).toFixed(2),
    gmmNProj: arr.percentageGmmProjectN,
    expectedVam: Number(arr.porcentageVam).toFixed(2),
    specificMass: Number(arr.specificMass).toFixed(2),
    absorbedWater: Number(arr.percentWaterAbs).toFixed(2),
  }));

  const expectedParamsRows = [
    {
      id: 0,
      mixture: 'Inferior',
      expectedPli: data.table3.table3Lower.expectedPliLower?.toFixed(2),
      expectedPercentageGmmInitialN: data.table3.table3Lower.expectedPercentageGmmInitialNLower?.toFixed(2),
      expectedPercentageGmmMaxN: data.table3.table3Lower.expectedPercentageGmmMaxNLower?.toFixed(2),
      expectedRBV: data.table3.table3Lower.expectedRBVLower?.toFixed(2),
      expectedVam: data.table3.table3Lower.expectedVamLower?.toFixed(2),
      expectedRatioDustAsphalt: data.table3.table3Lower.expectedRatioDustAsphaltLower,
    },
    {
      id: 1,
      mixture: 'Intermediária',
      expectedPli: data.table3.table3Average.expectedPliAverage?.toFixed(2),
      expectedPercentageGmmInitialN: data.table3.table3Average.expectedPercentageGmmInitialNAverage?.toFixed(2),
      expectedPercentageGmmMaxN: data.table3.table3Average.expectedPercentageGmmMaxNAverage?.toFixed(2),
      expectedRBV: data.table3.table3Average.expectedRBVAverage?.toFixed(2),
      expectedVam: data.table3.table3Average.expectedVamAverage?.toFixed(2),
      expectedRatioDustAsphalt: data.table3.table3Average.expectedRatioDustAsphaltAverage,
    },
    {
      id: 2,
      mixture: 'Superior',
      expectedPli: data.table3.table3Higher.expectedPliHigher?.toFixed(2),
      expectedPercentageGmmInitialN: data.table3.table3Higher.expectedPercentageGmmInitialNHigher?.toFixed(2),
      expectedPercentageGmmMaxN: data.table3.table3Higher.expectedPercentageGmmMaxNHigher?.toFixed(2),
      expectedRBV: data.table3.table3Higher.expectedRBVHigher?.toFixed(2),
      expectedVam: data.table3.table3Higher.expectedVamHigher?.toFixed(2),
      expectedRatioDustAsphalt: data.table3.table3Higher.expectedRatioDustAsphaltHigher,
    },
  ];

  const expectedParamsCols = [
    {
      field: 'mixture',
      headerName: t("asphalt.dosages.mixture"),
      valueFormatter: ({ value }) => `${value}`,
      width: 160,
    },
    {
      field: 'expectedPli',
      headerName: t("asphalt.dosages.estimated-binder-percentage"),
      valueFormatter: ({ value }) => `${value}`,
      width: 160,
    },
    {
      field: 'expectedVam',
      headerName: t("asphalt.dosages.estimated-vam"),
      valueFormatter: ({ value }) => `${value}`,
      width: 160,
    },
    {
      field: 'p/a',
      headerName: t("asphalt.dosages.expected-pa"),
      valueFormatter: ({ value }) => `${value}`,
      width: 160,
    },
    {
      field: 'expectedPercentageGmmInitialN',
      headerName: t("asphalt.dosages.gmm-n-initial"),
      valueFormatter: ({ value }) => `${value}`,
      width: 160,
    },
    {
      field: 'expectedPercentageGmmMaxN',
      headerName: t("asphalt.dosages.gmm-n-max"),
      valueFormatter: ({ value }) => `${value}`,
      width: 160,
    },
  ];

  const expectedParamsGroupings: GridColumnGroupingModel = [
    {
      groupId: 'expectedParams',
      headerName: `${t("asphalt.dosages.expected-params-vv")} ${0}`,
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
    { label: t("asphalt.dosages.superpave.lower"), value: 'lower' },
    { label: t("asphalt.dosages.superpave.average"), value: 'average' },
    { label: t("asphalt.dosages.superpave.higher"), value: 'higher' },
  ];

  nextDisabled && setNextDisabled(false);

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
            columns={paramsCols}
            rows={paramsRows}
          />

          <DataGrid
            hideFooter
            disableColumnMenu
            disableColumnFilter
            experimentalFeatures={{ columnGrouping: true }}
            columnGroupingModel={calculatedCurvesGroupings}
            columns={calculatedCurvesCols}
            rows={calculatedCurvesRows}
          />

          <Typography>{t("asphalt.dosages.superpave.volumetric-graphs")}</Typography>

          <Typography>{t("asphalt.dosages.superpave.lower-curve")}</Typography>
          <GraphStep6 data={data.table4.table4Lower.data} />

          <Typography>{t("asphalt.dosages.superpave.average-curve")}</Typography>
          <GraphStep6 data={data.table4.table4Average.data} />

          <Typography>{t("asphalt.dosages.superpave.higher-curve")}</Typography>
          <GraphStep6 data={data.table4.table4Higher.data} />

          <DataGrid
            hideFooter
            disableColumnMenu
            disableColumnFilter
            experimentalFeatures={{ columnGrouping: true }}
            columnGroupingModel={expectedParamsGroupings}
            columns={expectedParamsCols}
            rows={expectedParamsRows}
          />

          <Box sx={{ width: '100%' }}>
            <Typography>{t("asphalt.dosages.superpave.choose-curve")}</Typography>
            <DropDown
              label={''}
              options={selectedCurveOptions}
              callback={(value) => setData({ step: 5, key: 'selectedCurve', value })}
              size="medium"
              variant="standard"
            />
          </Box>
        </Box>
      )}
    </>
  );
};

export default Superpave_Step6;
