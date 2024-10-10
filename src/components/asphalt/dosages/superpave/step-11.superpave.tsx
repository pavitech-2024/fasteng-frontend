import Result_Card from '@/components/atoms/containers/result-card';
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
  const [quantitativeRows, setQuantitativeRows] = useState([]);
  const [quantitativeCols, setQuantitativeCols] = useState([]);

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
          headerName: 'Teor ótimo de ligante asfáltico',
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
          headerName: 'Ligante asfáltico (kg)',
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
    }
  }, [data?.quantitative]);

  const convertNumber = (value) => {
    let aux = value;
    if (typeof aux !== 'number' && aux !== null && aux !== undefined && aux.includes(',')) {
      aux = aux.replace('.', '').replace(',', '.');
    }

    return parseFloat(aux);
  };

  const validateNumber = (value) => {
    const auxValue = convertNumber(value);
    if (!isNaN(auxValue) && typeof auxValue === 'number') {
      return true;
    } else {
      return false;
    }
  };

  const numberRepresentation = (value, digits = 2) => {
    let aux = convertNumber(value);
    if (validateNumber(aux)) {
      const formato = { minimumFractionDigits: digits, maximumFractionDigits: digits };
      aux = Number(aux.toLocaleString('pt-BR', formato));
    } else {
      aux = 0;
    }

    return aux;
  };

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
            gap: '3rem',
          }}
        >
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

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <Typography>Quantitativo para 1 metro cúbico de massa asfáltica</Typography>

            <DataGrid
              hideFooter
              disableColumnMenu
              disableColumnFilter
              columns={quantitativeCols}
              rows={quantitativeRows}
            />
          </Box>

          <Typography>Parâmetros volumétricos e mecânicos da mistura no teor ótimo de ligante asfáltico</Typography>

          <Box sx={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <Result_Card
              label={'Massa específica aparente (Gmb):'}
              value={data?.Gmb.toFixed(2).toString()}
              unity={'g/cm³'}
            />

            <Result_Card label={'Volume de vazios (Vv):'} value={(data?.Vv * 100).toFixed(2).toString()} unity={'%'} />

            {data?.Vam && (
              <Result_Card label={'Vazios do agregado mineral (VAM):'} value={`${data?.Vam}`} unity={'%'} />
            )}

            {numberRepresentation(data?.RBV * 100) > 0 ||
              !(
                Number.isNaN(numberRepresentation(data?.RBV * 100)) && (
                  <Result_Card
                    label={'Relação betume-vazios (RBV):'}
                    value={`${numberRepresentation(data?.RBV * 100)}`}
                    unity={'%'}
                  />
                )
              )}

            {convertNumber(data?.percentWaterAbs) > 0 ||
              (Number.isNaN(convertNumber(data?.percentWaterAbs)) && (
                <Result_Card
                  label={'Água absorvida:'}
                  value={`${numberRepresentation(data?.percentWaterAbs)}`}
                  unity={'%'}
                />
              ))}

            {convertNumber(data?.specifiesMass) > 0 && (
              <Result_Card label={'Massa específica:'} value={`${data?.specifiesMass.toFixed(2)}`} unity={'g/cm'} />
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default Superpave_Step11;
