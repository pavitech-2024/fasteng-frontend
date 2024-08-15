import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, Typography } from '@mui/material';
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
  console.log("🚀 ~ finalProportionsCols:", finalProportionsCols)
  console.log('🚀 ~ finalProportionsRows:', finalProportionsRows);

  const { user } = useAuth();

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
          console.log('🚀 ~ response:', response);

          const newData = { ...data, ...response };
          console.log('🚀 ~ newData:', newData);
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

  const initialCols: GridColDef[] = [
    {
      field: 'optimumBinder',
      headerName: 'Teor ótimo de ligante asfáltico',
      valueFormatter: ({ value }) => `${value}`,
    },
  ];

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
          headerName: "Teor ótimo de ligante asfáltico",
          valueFormatter: ({ value }) => `${value}`,
          width: 250
        }
      ];
  
      let prevRowsData = { id: 0, optimumBinder: secondCompressionPercentagesData.optimumContent ? secondCompressionPercentagesData.optimumContent : '---' };
      let newColsData: GridColDef[] = [...initialCols];
  
      for (let i = 0; i < data?.ponderatedPercentsOfDosage?.length; i++) {
        let materialName = materialSelectionData.aggregates[i].name;
        prevRowsData = { ...prevRowsData, [materialName]: data.ponderatedPercentsOfDosage[i] };
  
        let newFinalProportionsCols: GridColDef = {
          field: materialName,
          headerName: materialName,
          valueFormatter: ({ value }) => `${value}`,
          width: 150
        };
  
        newColsData.push(newFinalProportionsCols);
      }
  
      setFinalProportionsRows([prevRowsData]);
      setFinalProportionsCols(newColsData);
    }
  }, [data?.ponderatedPercentsOfDosage]);
  

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
          <Typography>Proporção final dos materiais</Typography>

          <DataGrid
            hideFooter
            disableColumnMenu
            disableColumnFilter
            columns={finalProportionsCols}
            rows={finalProportionsRows}
          />
        </Box>
      )}
    </>
  );
};

export default Superpave_Step11;
