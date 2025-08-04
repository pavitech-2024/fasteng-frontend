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

  const [finalProportionsRows, setFinalProportionsRows] = useState([]);
  const [quantitativeRows, setQuantitativeRows] = useState([]);
  const [dosage, setDosage] = useState(null);
  const store = JSON.parse(sessionStorage.getItem('asphalt-superpave-store'));
  const dosageId = store?.state._id ? store?.state._id : store.state.undefined._id;

  const finalProportionsCols = granulometryEssayData.data?.materials
    ?.filter((material) => material.type !== 'asphaltBinder' && material.type !== 'CAP')
    .map((material) => ({
      field: material.name,
      headerName: material.name,
      valueFormatter: ({ value }) => `${value}`,
    }));

  finalProportionsCols?.unshift({
    field: 'optimumBinder',
    headerName: t('asphalt.dosages.superpave.optimum-binder'),
    valueFormatter: ({ value }) => `${value}`,
  });

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

      data.ponderatedPercentsOfDosage?.forEach((materialPercent, index) => {
        const materialName = granulometryEssayData.data?.materials[index]?.name;
        prevRowsData[materialName] = materialPercent;
      });

      setFinalProportionsRows([prevRowsData]);
    }
  }, [data.ponderatedPercentsOfDosage]);

  useEffect(() => {
    if (data?.quantitative?.length > 0) {
      const arr = { id: 1 };
      data.quantitative?.forEach((material, index) => {
        const materialName = granulometryEssayData.data?.materials[index - 1]?.name;
        if (index > 0) {
          arr[materialName] = material.toFixed(2);
        }
      });

      const newRowsData = [arr];

      setQuantitativeRows(newRowsData);
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
      value: data?.Vv * 100,
      unity: '%',
    },
    {
      label: t('Vazios do agregado mineral (VAM):'),
      value: data?.Vam,
      unity: '%',
    },
    {
      label: t('asphalt.dosages.rbv') + ' (RBV):',
      value: data?.RBV * 100,
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
            <Box id="general-results" sx={{ width: '100%', overflowX: 'auto' }}>
              <ResultSubTitle title={t('superpave.step-12')} sx={{ margin: '.65rem' }} />

              {/* <DataGrid
                hideFooter
                disableColumnMenu
                disableColumnFilter
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
              /> */}
            </Box>

            <Box sx={{ width: '100%', overflowX: 'auto' }}>
              <ResultSubTitle
                title={t('asphalt.dosages.superpave.asphalt-mass-quantitative')}
                sx={{ margin: '.65rem' }}
              />
              {/* <DataGrid
                hideFooter
                disableColumnMenu
                disableColumnFilter
                columns={finalProportionsCols?.map((col) => ({
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
              /> */}
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
              {resultCards?.map((card) => {
                if (card.value !== undefined) {
                  return (
                    <Result_Card
                      key={card.label}
                      label={card.label}
                      value={card.value?.toFixed(2).toString()}
                      unity={card.unity}
                    />
                  );
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
