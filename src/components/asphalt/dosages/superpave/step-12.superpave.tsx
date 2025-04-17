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

const Superpave_Step12 = ({
  nextDisabled,
  setNextDisabled,
  superpave,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    confirmationCompressionData,
    granulometryCompositionData,
    initialBinderData,
    firstCurvePercentagesData,
    secondCompressionPercentagesData,
    materialSelectionData,
    dosageResume: data,
    setData,
  } = useSuperpaveStore();

  const [finalProportionsRows, setFinalProportionsRows] = useState([]);
  const [finalProportionsCols, setFinalProportionsCols] = useState([]);
  const [quantitativeRows, setQuantitativeRows] = useState([]);
  const [quantitativeCols, setQuantitativeCols] = useState([]);
  const [dosage, setDosage] = useState(null);
  const store = JSON.parse(sessionStorage.getItem('asphalt-superpave-store'));
  const dosageId = store?.state._id;

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
          step: 10,
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
      const initialCols = [
        {
          field: 'optimumBinder',
          headerName: t('asphalt.dosages.optimum-binder'),
          valueFormatter: ({ value }) => `${value}`,
          width: 250,
        },
      ];

      const prevRowsData = {
        id: 0,
        optimumBinder: secondCompressionPercentagesData.optimumContent
          ? secondCompressionPercentagesData.optimumContent
          : '---',
      };

      const newColsData: GridColDef[] = [...initialCols];

      data.ponderatedPercentsOfDosage.forEach((materialPercent, index) => {
        const materialName = materialSelectionData.aggregates[index].name;

        prevRowsData[materialName] = materialPercent;

        const newFinalProportionsCols: GridColDef = {
          field: materialName,
          headerName: materialName,
          valueFormatter: ({ value }) => `${value}`,
          width: 150,
        };

        newColsData.push(newFinalProportionsCols);
      });

      setFinalProportionsRows([prevRowsData]);
      setFinalProportionsCols(newColsData);
    }
  }, [data?.ponderatedPercentsOfDosage]);

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
          const materialName = materialSelectionData.aggregates[index]?.name;

          return {
            ...prevRowsData,
            [materialName]: materialPercent.toFixed(2),
          };
        },
        { id: 0, asphaltBinder: typeof data.quantitative[0] === 'number' ? data.quantitative[0] : '---' }
      );

      const newColsData = materialSelectionData.aggregates.reduce(
        (prevColumns, material, index) => {
          const newQuantitativeCols: GridColDef = {
            field: material.name,
            headerName: `${material.name} (m³)`,
            valueFormatter: ({ value }) => `${value}`,
            width: 180,
          };

          return [...prevColumns, newQuantitativeCols];
        },
        [...initialCols]
      );

      setQuantitativeRows([newRowsData]);
      setQuantitativeCols(newColsData);

      setLoading(false);
    }
  }, [data?.quantitative]);

  const resultCards = [
    {
      label: t('asphalt.dosages.superpave.apparent-specific-mass') + ' (Gmb):',
      value: data?.Gmb.toFixed(2).toString(),
      unity: 'g/cm3',
    },
    {
      label: t('asphalt.dosages.superpave.void-volume') + ' (Vv):',
      value: (data?.Vv * 100).toFixed(2).toString(),
      unity: '%',
    },
    {
      label: t('Vazios do agregado mineral (VAM):'),
      value: data?.Vam?.toFixed(2).toString(),
      unity: '%',
    },
    {
      label: t('asphalt.dosages.rbv') + ' (RBV):',
      value: (data?.RBV * 100).toFixed(2).toString(),
      unity: '%',
    },
    {
      label: t('asphalt.dosages.absorbed-water'),
      value: data?.percentWaterAbs.toFixed(2).toString(),
      unity: '%',
    },
    {
      label: t('asphalt.dosages.superpave.specific-mass'),
      value: data?.specifiesMass.toFixed(2).toString(),
      unity: 'g/cm',
    },
  ];

  nextDisabled && setNextDisabled(false);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <FlexColumnBorder open={true} title={t('superpave.step-11')}>
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
            <ResultSubTitle title={t('superpave.step-11')} sx={{ margin: '.65rem' }} />

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
                  return <Result_Card key={card.label} label={card.label} value={card.value} unity={card.unity} />;
                }
              })}
            </Box>
          </Box>
        </FlexColumnBorder>
      )}
    </>
  );
};

export default Superpave_Step12;
