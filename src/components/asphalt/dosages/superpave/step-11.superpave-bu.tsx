import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import GenerateSuperpaveDosagePDF from '@/components/generatePDF/dosages/asphalt/superpave/generatePDFSuperpave';
import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import superpaveDosageService from '@/services/asphalt/dosages/superpave/superpave.consult.service';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore, { SuperpaveData } from '@/stores/asphalt/superpave/superpave.store';
import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Superpave_Step11 = ({
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
  const [dosage, setDosage] = useState<SuperpaveData>(null);
  const store = JSON.parse(sessionStorage.getItem('abcp-store'));
  const dosageId = store.state._id;

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          const response = await superpave.calculateDosageEquation(
            granulometryCompositionData,
            initialBinderData,
            firstCurvePercentagesData,
            secondCompressionPercentagesData,
            confirmationCompressionData
          );

          const foundDosage = await superpaveDosageService.getSuperpaveDosage(dosageId);

          setDosage(foundDosage.data);
          const newData = { ...data, ...response };

          setData({
            step: 10,
            value: newData,
          });
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

  useEffect(() => {
    if (data?.ponderatedPercentsOfDosage?.length > 0) {
      // Resetando as linhas e colunas iniciais
      setFinalProportionsRows([
        {
          id: 0,
          optimumBinder: '---',
        },
      ]);

      const initialCols = [
        {
          field: 'optimumBinder',
          headerName: t('asphalt.dosages.optimum-binder'),
          valueFormatter: ({ value }) => `${value}`,
          width: 250,
        },
      ];

      let prevRowsData = {
        id: 0,
        optimumBinder: secondCompressionPercentagesData.optimumContent
          ? secondCompressionPercentagesData.optimumContent
          : '---',
      };
      const newColsData: GridColDef[] = [...initialCols];

      for (let i = 0; i < data?.ponderatedPercentsOfDosage?.length; i++) {
        const materialName = materialSelectionData.aggregates[i].name;
        prevRowsData = { ...prevRowsData, [materialName]: data.ponderatedPercentsOfDosage[i] };

        const newFinalProportionsCols: GridColDef = {
          field: materialName,
          headerName: materialName,
          valueFormatter: ({ value }) => `${value}`,
          width: 150,
        };

        newColsData.push(newFinalProportionsCols);
      }

      setFinalProportionsRows([prevRowsData]);
      setFinalProportionsCols(newColsData);
    }
  }, [data?.ponderatedPercentsOfDosage]);

  useEffect(() => {
    if (data?.quantitative?.length > 0) {
      // Resetando as linhas e colunas iniciais
      setQuantitativeRows([
        {
          id: 0,
          asphaltBinder: '---',
        },
      ]);

      const initialCols = [
        {
          field: 'asphaltBinder',
          headerName: t('superpave.dosage.asphalt-binder'),
          valueFormatter: ({ value }) => `${value}`,
          width: 200,
        },
      ];

      let prevRowsData = {
        id: 0,
        asphaltBinder: typeof data.quantitative[0] === 'number' ? data.quantitative[0] : '---',
      };

      const newColsData: GridColDef[] = [...initialCols];

      for (let i = 1; i < data?.quantitative?.length; i++) {
        const materialName = materialSelectionData.aggregates[i - 1]?.name;

        prevRowsData = { ...prevRowsData, [materialName]: data.quantitative[i].toFixed(2) };

        const newQuantitativeCols: GridColDef = {
          field: materialName,
          headerName: `${materialName} (m³)`,
          valueFormatter: ({ value }) => `${value}`,
          width: 180,
        };

        newColsData.push(newQuantitativeCols);
      }

      setQuantitativeRows([prevRowsData]);
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
              gap: '10px',
              marginY: '20px',
            }}
          >
            <ResultSubTitle title={t('superpave.step-11')} />

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
            />

            <ResultSubTitle title={t('asphalt.dosages.superpave.asphalt-mass-quantitative')} />

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
            />

            <ResultSubTitle
              title={t('asphalt.dosages.superpave.mechanic-volumetric-params')}
              sx={{
                maxWidth: '103%',
                wordWrap: 'break-word',
              }}
            />

            <Box sx={{ display: 'flex', gap: '10px' }}>
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

export default Superpave_Step11;
