import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import GenerateSuperpaveDosagePDF from '@/components/generatePDF/dosages/asphalt/superpave/generatePDFSuperpave';
import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import superpaveDosageService from '@/services/asphalt/dosages/superpave/superpave.consult.service';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Superpave_Step12_ResumeDosage = ({
  nextDisabled,
  setNextDisabled,
  superpave,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    confirmationCompressionData,
    granulometryEssayData,
    granulometryCompositionData,
    initialBinderData,
    firstCurvePercentagesData,
    secondCompressionPercentagesData,
    dosageResume: data,
    setData,
  } = useSuperpaveStore();
    console.log("🚀 ~ Superpave_Step12_ResumeDosage ~ data:", data)

  const [finalProportionsRows, setFinalProportionsRows] = useState([]);
  // const [finalProportionsCols, setFinalProportionsCols] = useState([]);
  const [quantitativeRows, setQuantitativeRows] = useState([]);
  const [quantitativeCols, setQuantitativeCols] = useState([]);
  const [dosage, setDosage] = useState(null);
  const store = JSON.parse(sessionStorage.getItem('asphalt-superpave-store'));
  const dosageId = store?.state._id;

  const finalProportionsCols = granulometryEssayData.materials.map((material) => ({
    field: material.name,
    headerName: material.name,
    valueFormatter: ({ value }) => `${value}`,
  }))

  useEffect(() => {
    const fetchDosage = async () => {
      try {
        const response = await superpave.calculateDosageEquation(
          granulometryCompositionData,
          initialBinderData,
          firstCurvePercentagesData,
          secondCompressionPercentagesData,
          confirmationCompressionData
        );

        const foundDosage = await superpaveDosageService.getSuperpaveDosage(dosageId);

        setDosage(foundDosage.data.dosage);
        const newData = { ...data, ...response };

        setData({
          step: 11,
          value: newData,
        });
      } catch (error) {
        throw error;
      }
    };

    toast.promise(fetchDosage(), {
      pending: t('loading.dosages.pending'),
      success: t('loading.dosages.success'),
      error: t('loading.dosages.error'),
    });
  }, []);

  useEffect(() => {
    if (data?.ponderatedPercentsOfDosage?.length > 0) {
      const prevRowsData = {
        id: 0,
        optimumBinder: secondCompressionPercentagesData.optimumContent
          ? secondCompressionPercentagesData.optimumContent
          : '---',
      };

      data.ponderatedPercentsOfDosage.forEach((materialPercent) => {
        const materialName = '';
        prevRowsData[materialName] = materialPercent;
      });

      setFinalProportionsRows([prevRowsData]);
    }
  }, []);

  useEffect(() => {
    if (data?.quantitative?.length > 0) {
      const initialCols: GridColDef[] = [
        {
          field: 'asphaltBinder',
          headerName: t('superpave.dosage.asphalt-binder'),
          valueFormatter: ({ value }) => `${value}`,
          width: 200,
        },
      ];

      const newRowsData = data.quantitative.reduce(
        (prevRowsData, materialPercent, index) => {
          // const materialName = materialSelectionData.aggregates[index]?.name;
          const materialName = "";

          return {
            ...prevRowsData,
            [materialName]: materialPercent,
          };
        },
        { id: 0, asphaltBinder: typeof data.quantitative[0] === 'number' ? data.quantitative[0] : '---' }
      );

      // const newColsData = materialSelectionData.aggregates.reduce(
      //   (prevColumns, material, index) => {
      //     const newQuantitativeCols: GridColDef = {
      //       field: material.name,
      //       headerName: `${material.name} (m³)`,
      //       valueFormatter: ({ value }) => `${value}`,
      //       width: 180,
      //     };

      //     return [...prevColumns, newQuantitativeCols];
      //   },
      //   [...initialCols]
      // );

      setQuantitativeRows([newRowsData]);
      // setQuantitativeCols(newColsData);

      setLoading(false);
    }
  }, [data?.quantitative]);

  const resultCards = [
    {
      label: t('asphalt.dosages.superpave.apparent-specific-mass') + ' (Gmb):',
      value: data?.Gmb,
      unity: 'g/cm3',
    },
    {
      label: t('asphalt.dosages.superpave.void-volume') + ' (Vv):',
      value: (data?.Vv * 100),
      unity: '%',
    },
    {
      label: t('Vazios do agregado mineral (VAM):'),
      value: data?.Vam,
      unity: '%',
    },
    {
      label: t('asphalt.dosages.rbv') + ' (RBV):',
      value: (data?.RBV * 100),
      unity: '%',
    },
    {
      label: t('asphalt.dosages.absorbed-water'),
      value: data?.percentWaterAbs,
      unity: '%',
    },
    {
      label: t('asphalt.dosages.superpave.specific-mass'),
      value: data?.specifiesMass,
      unity: 'g/cm',
    },
  ];

  nextDisabled && setNextDisabled(false);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <FlexColumnBorder open={true} title={t('superpave.results')}>
          <GenerateSuperpaveDosagePDF dosage={dosage} />
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: { mobile: '5px', notebook: '4rem' },
              marginY: '20px',
            }}
          >
            <ResultSubTitle title={t('superpave.step-12')} sx={{ margin: '.65rem' }} />

            <Box id="general-results" sx={{ width: '100%', overflowX: 'auto' }}>
              <DataGrid
                hideFooter
                disableColumnMenu
                disableColumnFilter
                columns={finalProportionsCols.map((col) => ({
                  ...col,
                  flex: 1,
                  autoWidth: true,
                  maxWidth: 180,
                  headerAlign: 'center',
                  align: 'center',
                }))}
                rows={finalProportionsRows}
                sx={{
                  minWidth: '800px',
                }}
              />
            </Box>

            <ResultSubTitle
              title={t('asphalt.dosages.superpave.asphalt-mass-quantitative')}
              sx={{ margin: '.65rem' }}
            />

            <Box sx={{ width: '100%', overflowX: 'auto' }}>
              <DataGrid
                hideFooter
                disableColumnMenu
                disableColumnFilter
                columns={quantitativeCols.map((col) => ({
                  ...col,
                  flex: 1,
                  width: 200,
                  headerAlign: 'center',
                  align: 'center',
                }))}
                rows={quantitativeRows}
                sx={{
                  minWidth: '800px',
                }}
              />
            </Box>

            <ResultSubTitle
              title={t('asphalt.dosages.superpave.mechanic-volumetric-params')}
              sx={{
                maxWidth: '103%',
                wordWrap: 'break-word',
                margin: '.65rem',
              }}
            />

            <Box
              sx={{
                display: 'flex',
                flexDirection: { mobile: 'column', notebook: 'row' },
                gap: '10px',
                alignItems: { mobile: 'center', notebook: 'flex-start' },
                justifyContent: { mobile: 'center', notebook: 'flex-start' },
              }}
            >
              {resultCards.map((card) => {
                if (card.value !== undefined) {
                  return <Result_Card key={card.label} label={card.label} value={card.value?.toString()} unity={card.unity} />;
                }
              })}
            </Box>
          </Box>
        </FlexColumnBorder>
      )}
    </>
  );
};

export default Superpave_Step12_ResumeDosage;
