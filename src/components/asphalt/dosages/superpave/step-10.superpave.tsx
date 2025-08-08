import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { t } from 'i18next';
import { DataGrid, GridColumnGroupingModel } from '@mui/x-data-grid';
import MiniGraphics from '../marshall/graphs/miniGraph';

const Superpave_Step10_SecondCompactionParams = ({
  nextDisabled,
  setNextDisabled,
  superpave,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    firstCompressionParamsData,
    secondCompressionData,
    secondCompressionPercentagesData: data,
    setData,
    chosenCurvePercentagesData,
    granulometryEssayData,
  } = useSuperpaveStore();
  console.log('🚀 ~ Superpave_Step10_SecondCompactionParams ~ data:', data);

  const aggregateMaterials = granulometryEssayData?.materials?.filter(
    ({ type }) => type.includes('Aggregate') || type.includes('filler')
  );

  const [expectedVolumetricParamsRows, setExpectedVolumetricParamsRows] = useState([]);

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          const {
            data: resData,
            success,
            error,
          } = await superpave.getSecondCompressionPercentages(firstCompressionParamsData, secondCompressionData);

          if (success) {
            const newData = { ...data, ...resData };
            setData({
              step: 9,
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

  let isValid = false;
  let nullCount = 0;

  data.graphs?.graphRT.forEach((row, i) => {
    if (row[1] === null) {
      nullCount++;
    }
  });

  isValid = nullCount < 4;

  useEffect(() => {
    if (data.graphs?.graphGmb.length > 0) {
      const newRows = data.graphs?.graphGmb
        .map((e, idx) => {
          const indexName =
            idx === 0 ? 'halfLess' : idx === 1 ? 'normal' : idx === 2 ? 'halfPlus' : idx === 3 ? 'onePlus' : '';
          if (!indexName) return null; // Ignora iterações onde indexName é uma string vazia
          return {
            id: idx,
            binder: chosenCurvePercentagesData.listOfPlis[idx]?.toFixed(2) ?? '---',
            gmmNproject: secondCompressionData.composition[indexName]?.projectN.percentageGmm?.toFixed(2),
            vv: secondCompressionData.composition[indexName]?.Vv?.toFixed(2),
            vam: secondCompressionData.composition[indexName]?.ratioDustAsphalt?.toFixed(2),
            rbv:
              secondCompressionData.composition[indexName]?.RBV !== null
                ? secondCompressionData.composition[indexName]?.RBV?.toFixed(2)
                : '---',
            pa:
              secondCompressionData.composition[indexName]?.ratioDustAsphalt !== null
                ? secondCompressionData.composition[indexName]?.ratioDustAsphalt?.toFixed(2)
                : '---',
            specificMass: secondCompressionData.composition[indexName]?.specifiesMass?.toFixed(2),
            absorbedWater: secondCompressionData.composition[indexName]?.projectN.percentWaterAbs?.toFixed(2),
            rt: secondCompressionData.composition[indexName]?.indirectTensileStrength?.toFixed(2),
          };
        })
        .filter((row) => row !== null);
      setExpectedVolumetricParamsRows(newRows);
    }
  }, [data.graphs, chosenCurvePercentagesData.listOfPlis, secondCompressionData.composition]);

  const expectedVolumetricParamsCols = [
    {
      field: 'binder',
      headerName: 'Teor de ligante (%)',
      valueFormatter: ({ value }) => `${value}`,
      width: 125,
    },
    {
      field: 'gmmNproject',
      headerName: `Gmm Nproject (%)`,
      valueFormatter: ({ value }) => `${value}`,
      width: 125,
    },
    {
      field: 'vv',
      headerName: `Vv (%)`,
      valueFormatter: ({ value }) => `${value}`,
      width: 125,
    },
    {
      field: 'vam',
      headerName: `VAM (%)`,
      valueFormatter: ({ value }) => `${value}`,
      width: 80,
    },
    {
      field: 'rbv',
      headerName: `RBV (%)`,
      valueFormatter: ({ value }) => `${value}`,
      width: 80,
    },
    {
      field: 'pa',
      headerName: `P/A (%)`,
      valueFormatter: ({ value }) => `${value}`,
      width: 80,
    },
    {
      field: 'specificMass',
      headerName: `Massa específica (g/cm³)`,
      valueFormatter: ({ value }) => `${value}`,
      width: 125,
    },
    {
      field: 'absorbedWater',
      headerName: `Água absorvida (%)`,
      valueFormatter: ({ value }) => `${value}`,
      width: 125,
    },
    {
      field: 'rt',
      headerName: `RT (MPa)`,
      valueFormatter: ({ value }) => `${value}`,
      width: 125,
    },
  ];

  const expectedVolumetricParamsGroupings: GridColumnGroupingModel = [
    {
      groupId: 'expectedVolumetricParams',
      headerName: `Parâmetros volumétricos estimados`,
      children: [
        { field: 'binder' },
        { field: 'gmmNproject' },
        { field: 'vv' },
        { field: 'vam' },
        { field: 'rbv' },
        { field: 'pa' },
        { field: 'specificMass' },
        { field: 'absorbedWater' },
        { field: 'rt' },
      ],
      headerAlign: 'center',
    },
  ];

  const finalProportionsCols = secondCompressionData.ponderatedPercentsOfDosage?.map((value, idx) => ({
    field: `material_${aggregateMaterials[idx]?._id}_${idx + 1}`,
    headerName: `${aggregateMaterials[idx]?.name}`,
    valueFormatter: ({ value }) => `${value}`,
  }));

  const finalProportionsRows = [
    secondCompressionData.ponderatedPercentsOfDosage?.reduce((prev: Record<string, string | number>, value, index) => {
      return {
        ...prev,
        [`material_${aggregateMaterials[index]?._id}_${index + 1}`]: value?.toFixed(2) || '---',
        id: 1,
      };
    }, {} as Record<string, string | number>),
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
            gap: '2rem',
          }}
        >
          {typeof data?.optimumContent !== 'string' && (
            <Typography>Teor de ligante ótimo estimado (%): {data?.optimumContent?.toFixed(2)}</Typography>
          )}

          <DataGrid
            hideFooter
            disableColumnMenu
            disableColumnFilter
            experimentalFeatures={{ columnGrouping: true }}
            columnGroupingModel={expectedVolumetricParamsGroupings}
            columns={expectedVolumetricParamsCols.map((column) => ({
              ...column,
              disableColumnMenu: true,
              sortable: false,
              align: 'center',
              headerAlign: 'center',
              minWidth: 100,
              flex: 1,
            }))}
            rows={expectedVolumetricParamsRows}
          />

          {finalProportionsRows?.length > 0 && finalProportionsCols?.length > 0 && (
            <Box>
              <Typography variant="h6" sx={{ textAlign: 'center' }}>
                Proporções finais dos materiais (%)
              </Typography>
              <DataGrid
                hideFooter
                disableColumnMenu
                disableColumnFilter
                experimentalFeatures={{ columnGrouping: true }}
                columnGroupingModel={[]}
                columns={finalProportionsCols?.map((column) => ({
                  ...column,
                  disableColumnMenu: true,
                  sortable: false,
                  align: 'center',
                  headerAlign: 'center',
                  minWidth: 100,
                  flex: 1,
                }))}
                rows={finalProportionsRows}
              />
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {data.graphs?.graphVv.length > 0 && (
              <MiniGraphics data={data.graphs?.graphVv} type="Vv" nameEixoY={'Vv (%)'} />
            )}

            {data.graphs?.graphGmb.length > 0 && (
              <MiniGraphics nameEixoY="GMB (g/cm³)" type="GMB" data={data.graphs?.graphGmb} />
            )}

            {data.graphs?.graphGmm.length > 0 && (
              <MiniGraphics nameEixoY="GMM (g/cm³)" type="GMM" data={data.graphs?.graphGmm} />
            )}

            {data.graphs?.graphRBV.length > 0 && (
              <MiniGraphics nameEixoY="RBV (g/cm³)" type="RBV" data={data.graphs?.graphRBV} />
            )}

            {data.graphs?.graphVam.length > 0 && (
              <MiniGraphics nameEixoY="VAM (g/cm³)" type="VAM" data={data.graphs?.graphVam} />
            )}

            {isValid && data.graphs?.graphRT.length > 0 && <MiniGraphics nameEixoY="RT (MPa)" type="RT" data={data.graphs?.graphRT} />}

            {data.graphs?.graphPA.length > 0 && (
              <MiniGraphics nameEixoY="PA (MPa)" type="PA" data={data.graphs?.graphPA} />
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default Superpave_Step10_SecondCompactionParams;
