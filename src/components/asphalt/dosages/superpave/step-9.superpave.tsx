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

const Superpave_Step9 = ({
  nextDisabled,
  setNextDisabled,
  superpave,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    secondCompressionData,
    secondCompressionPercentagesData: data,
    setData,
    chosenCurvePercentagesData,
    materialSelectionData,
  } = useSuperpaveStore();

  const { user } = useAuth();
  const [expectedVolumetricParamsRows, setExpectedVolumetricParamsRows] = useState([]);

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          const {
            data: resData,
            success,
            error,
          } = await superpave.getSecondCompressionPercentages(secondCompressionData);

          if (success) {
            const newData = { ...data, ...resData };
            setData({
              step: 8,
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
            binder: chosenCurvePercentagesData.listOfPlis[idx]?.toFixed(2),
            gmmNproject: secondCompressionData.composition[indexName]?.projectN.percentageGmm?.toFixed(2),
            vv: secondCompressionData.composition[indexName]?.Vv?.toFixed(2),
            vam: secondCompressionData.composition[indexName]?.ratioDustAsphalt?.toFixed(2),
            rbv:
              secondCompressionData.composition[indexName]?.RBV !== null
                ? secondCompressionData.composition[indexName]?.RBV?.toFixed(2)
                : '---',
            pa:
              secondCompressionData.composition[indexName]?.indirectTensileStrength !== null
                ? secondCompressionData.composition[indexName]?.indirectTensileStrength?.toFixed(2)
                : '---',
            specificMass: secondCompressionData.composition[indexName]?.specifiesMass?.toFixed(2),
            absorbedWater: secondCompressionData.composition[indexName]?.projectN.percentWaterAbs?.toFixed(2),
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

  const finalProportionsCols = [];

  secondCompressionData.ponderatedPercentsOfDosage?.forEach((value, idx) => {
    finalProportionsCols.push({
      field: `material_${idx + 1}`,
      headerName: `${materialSelectionData.aggregates[idx].name}`,
      valueFormatter: ({ value }) => `${value}`,
      width: 240,
    });
  });

  const finalProportionsRows = [
    {
      id: 1,
      material_1:
        secondCompressionData.ponderatedPercentsOfDosage[0] !== null
          ? secondCompressionData.ponderatedPercentsOfDosage[0]?.toFixed(2)
          : '---',
      material_2:
        secondCompressionData.ponderatedPercentsOfDosage[1] !== null
          ? secondCompressionData.ponderatedPercentsOfDosage[1]?.toFixed(2)
          : '---',
      material_3:
        secondCompressionData.ponderatedPercentsOfDosage[2] !== null
          ? secondCompressionData.ponderatedPercentsOfDosage[2]?.toFixed(2)
          : '---',
      material_4:
        secondCompressionData.ponderatedPercentsOfDosage[3] !== null
          ? secondCompressionData.ponderatedPercentsOfDosage[3]?.toFixed(2)
          : '---',
    },
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
          {typeof data?.optimumContent !== 'string' && (
            <Typography>Teor de ligante ótimo estimado (%): {data?.optimumContent?.toFixed(2)}</Typography>
          )}

          <DataGrid
            hideFooter
            disableColumnMenu
            disableColumnFilter
            experimentalFeatures={{ columnGrouping: true }}
            columnGroupingModel={expectedVolumetricParamsGroupings}
            columns={expectedVolumetricParamsCols}
            rows={expectedVolumetricParamsRows}
          />

          <Typography>Proporções finais dos materiais (%)</Typography>

          <DataGrid
            hideFooter
            disableColumnMenu
            disableColumnFilter
            experimentalFeatures={{ columnGrouping: true }}
            columnGroupingModel={[]}
            columns={finalProportionsCols}
            rows={finalProportionsRows}
          />

          <MiniGraphics data={data.graphs.graphVv} type="Vv" nameEixoY={'Vv (%)'} />

          <MiniGraphics nameEixoY="GMB (g/cm³)" type="GMB" data={data.graphs.graphGmb} />

          <MiniGraphics nameEixoY="GMM (g/cm³)" type="GMM" data={data.graphs.graphGmm} />

          {data.graphs.graphRBV.flat().every((e) => e !== null) && (
            <MiniGraphics nameEixoY="RBV (g/cm³)" type="RBV" data={data.graphs.graphRBV} />
          )}
          <MiniGraphics nameEixoY="VAM (g/cm³)" type="Vam" data={data.graphs.graphVam} />

          {isValid && <MiniGraphics nameEixoY="RT (MPa)" type="RT" data={data.graphs.graphRT} />}

          <MiniGraphics nameEixoY="PA" type="Relação pó/asfalto" data={data.graphs.graphPA} />
        </Box>
      )}
    </>
  );
};

export default Superpave_Step9;
