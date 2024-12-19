import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore, { SuperpaveData } from '@/stores/asphalt/superpave/superpave.store';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Table, TableContainer, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { AllSieves } from '@/interfaces/common';
import CurvesTable from './tables/curvesTable';
import { toast } from 'react-toastify';
import { t } from 'i18next';
import Graph from '@/services/asphalt/dosages/marshall/graph/graph';

const Superpave_Step3 = ({
  nextDisabled,
  setNextDisabled,
  superpave,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const { granulometryCompositionData: data, materialSelectionData, generalData, setData } = useSuperpaveStore();

  const { user } = useAuth();

  const peneiras = AllSieves.map((peneira) => {
    return { peneira: peneira.label };
  });

  const arrayResponse = data?.percentsToList;
  const bandsHigher = data?.bands?.higher;
  const bandsLower = data?.bands?.lower;

  let tableDataLower;
  let tableDataAverage;
  let tableDataHigher;

  let tableCompositionInputsLower = {};
  let tableCompositionInputsAverage = {};
  let tableCompositionInputsHigher = {};

  const selectedMaterials = materialSelectionData?.aggregates;
  const [inferior, setInferior] = useState(data.chosenCurves.lower);
  const [intermediaria, setIntermediaria] = useState(data.chosenCurves.average);
  const [superior, setSuperior] = useState(data.chosenCurves.higher);

  useEffect(() => {
    if (data.percentsToList.length > 0) {
      setLoading(false);
    }

    toast.promise(
      async () => {
        try {
          const dosageData = sessionStorage.getItem('asphalt-superpave-store');
          const sessionDataJson = JSON.parse(dosageData);
          const dosageDataJson = sessionDataJson.state as SuperpaveData;

          const response = await superpave.getStep3Data(dosageDataJson, user._id);
          console.log('🚀 ~ response:', response);

          setData({
            step: 2,
            value: {
              ...dosageDataJson.granulometryCompositionData,
              ...response,
            },
          });
          setLoading(false);
        } catch (error) {
          setLoading(false);
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

  const handleCheckboxChange = (checked, setChecked) => {
    setChecked(!checked);
  };

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
    let aux: any = convertNumber(value);
    if (validateNumber(aux)) {
      const formato = { minimumFractionDigits: digits, maximumFractionDigits: digits };
      aux = aux.toLocaleString('pt-BR', formato);
    } else {
      aux = '';
    }
    return aux;
  };

  const setPercentsToListTotal = (peneiras, percentsToList) => {
    const tableData = Array.from({ length: percentsToList.length }, () => []);

    percentsToList?.forEach((item, i) => {
      item.forEach((value, j) => {
        if (value !== null) {
          if (i > 0) {
            tableData[i][j] = {
              ...peneiras[j],
              ...tableData[i][j], // Mantém os dados existentes
              ['keyTotal' + i]: numberRepresentation(value[1]),
            };
          } else {
            tableData[i][j] = {
              ...peneiras[j],
              ['keyTotal' + i]: numberRepresentation(value[1]),
            };
          }
        }
      });
    });

    return tableData;
  };

  const tableDataAux = setPercentsToListTotal(peneiras, arrayResponse);

  const setBandsHigherLower = (tableData, bandsHigher, bandsLower, arrayResponse, peneiras) => {
    const arraySize = tableData[0]?.length;

    // Inicializa o arrayAux com objetos vazios de acordo com o tamanho descoberto
    const arrayAux = Array(arraySize).fill({});

    tableData.forEach((element) => {
      element.forEach((item, index2) => {
        if (bandsLower[index2] === null && bandsHigher[index2] === null) {
          arrayAux[index2] = {
            ...arrayAux[index2],
            ...item,
            bandsCol1: '',
            bandsCol2: '',
          };
        } else {
          arrayAux[index2] = {
            ...arrayAux[index2],
            ...item,
            bandsCol1: numberRepresentation(bandsHigher[index2]),
            bandsCol2: numberRepresentation(bandsLower[index2]),
          };
        }
      });
    });

    return arrayAux;
  };

  const tableData = setBandsHigherLower(tableDataAux, bandsHigher, bandsLower, arrayResponse, peneiras);
  tableDataLower = tableData;
  tableDataAverage = tableData;
  tableDataHigher = tableData;

  tableDataLower = tableData;
  tableDataAverage = tableData;
  tableDataHigher = tableData;

  console.log('🚀 ~ tableDataLower:', tableDataLower);

  tableCompositionInputsLower = {};
  tableCompositionInputsAverage = {};
  tableCompositionInputsHigher = {};

  selectedMaterials.forEach((item, i) => {
    tableCompositionInputsLower['input' + (i * 2 + 1)] = '';
    tableCompositionInputsAverage['input' + (i * 2 + 1)] = '';
    tableCompositionInputsHigher['input' + (i * 2 + 1)] = '';
  });

  const onChangeInputsTables = (e, tableName, index) => {
    [tableName] = {
      ...[tableName],
      ['input' + index]: Number(e.target.value),
    };
  };

  const clearTable = () => {
    const newInputs = data.percentageInputs.map((input) => ({
      material_1: null,
      material_2: null,
    }));

    setInferior(false);
    setIntermediaria(false);
    setSuperior(false);

    const prevData = data;

    const newData = {
      ...prevData,
      graphData: [],
      percentageInputs: newInputs,
      lowerComposition: {
        percentsOfMaterials: null,
        sumOfPercents: null,
      },
      averageComposition: {
        percentsOfMaterials: null,
        sumOfPercents: null,
      },
      higherComposition: {
        percentsOfMaterials: null,
        sumOfPercents: null,
      },
    };

    setData({ step: 2, value: newData });
  };

  const updateDataArray = (data) => {
    const emptyTitles = [];
    const result = data;
    if (data.length > 0) {
      if (data[0].some((value) => value !== '')) {
        data[0].forEach(() => emptyTitles.push(''));
        result.unshift(emptyTitles);
      }
    }
    return result;
  };

  const updateGraph = (points) => {
    const pointsOfCurve = updateDataArray(points);
    const prevData = { ...data };
    const newData = { ...prevData, graphData: pointsOfCurve };
    setData({ step: 2, value: newData });
  };

  const calcular = (curve: string) => {
    let valueCount = 0;
    let valueIsValid = false;

    // Deve ser exatamente 100;
    if (curve === 'lower') {
      valueCount = Object.values(data.percentageInputs[0]).reduce((acc, item) => acc + Number(item), 0);
      if (valueCount === 100) {
        valueIsValid = true;
      }
    } else if (curve === 'average') {
      valueCount = Object.values(data.percentageInputs[1]).reduce((acc, item) => acc + Number(item), 0);
      if (valueCount === 100) {
        valueIsValid = true;
      }
    } else if (curve === 'higher') {
      valueCount = Object.values(data.percentageInputs[2]).reduce((acc, item) => acc + Number(item), 0);
      if (valueCount === 100) {
        valueIsValid = true;
      }
    }

    if (valueIsValid) {
      toast.promise(
        async () => {
          try {
            const chosenCurves = {
              lower: inferior,
              average: intermediaria,
              higher: superior,
            };

            const composition = await superpave.calculateGranulometryComposition(
              data,
              materialSelectionData,
              generalData,
              chosenCurves
            );

            const prevData = data;

            const newData = {
              ...prevData,
              ...composition,
            };

            setData({ step: 2, value: newData });
            //setLoading(false);
          } catch (error) {
            //setLoading(false);
            throw error;
          }
        },
        {
          pending: t('loading.materials.pending'),
          success: t('loading.materials.success'),
          error: t('loading.materials.error'),
        }
      );
    } else {
      toast.error(t('asphalt.dosages.superpave.invalid-granulometry-values'));
    }
  };

  useEffect(() => {
    if (data.pointsOfCurve.length > 0) {
      updateGraph(data.pointsOfCurve);
    }
  }, [data.pointsOfCurve]);

  if (data.graphData.length > 0) {
    setNextDisabled(false);
  }

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
          <FormGroup sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <FormControlLabel
              control={<Checkbox checked={inferior} onChange={() => handleCheckboxChange(inferior, setInferior)} />}
              label={t('asphalt.dosages.superpave.lower-curve')}
              value={inferior}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={intermediaria}
                  onChange={() => handleCheckboxChange(intermediaria, setIntermediaria)}
                />
              }
              label={t('asphalt.dosages.superpave.average-curve')}
              value={intermediaria}
            />
            <FormControlLabel
              control={<Checkbox checked={superior} onChange={() => handleCheckboxChange(superior, setSuperior)} />}
              label={t('asphalt.dosages.superpave.higher-curve')}
              value={superior}
            />
          </FormGroup>

          {inferior && (
            <TableContainer>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 100px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: '10px',
                }}
              >
                <Typography>{t('asphalt.dosages.superpave.lower-curve')}</Typography>
                <Button onClick={clearTable} variant="outlined">
                  {t('asphalt.dosages.superpave.clear-table')}
                </Button>
              </Box>
              <CurvesTable
                materials={selectedMaterials}
                dnitBandsLetter={data?.bands?.letter}
                tableInputs={tableCompositionInputsLower}
                tableName="lowerComposition"
                tableData={tableDataLower}
                onChangeInputsTables={onChangeInputsTables}
              />
              <div style={{ marginTop: '1%' }}>
                <Button onClick={() => calcular('lower')} variant="outlined" sx={{ width: '100%' }}>
                  {t('asphalt.dosages.superpave.calculate-lower-curve')}
                </Button>
              </div>
            </TableContainer>
          )}

          {intermediaria && (
            <TableContainer>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 100px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: '10px',
                }}
              >
                <Typography>{t('asphalt.dosages.superpave.average-curve')}</Typography>
                <Button onClick={clearTable}>{t('asphalt.dosages.superpave.clear-table')}</Button>
              </Box>
              <CurvesTable
                materials={selectedMaterials}
                dnitBandsLetter={data?.bands?.letter}
                tableInputs={tableCompositionInputsAverage}
                tableName="averageComposition"
                tableData={tableDataAverage}
                onChangeInputsTables={onChangeInputsTables}
              />
              <div style={{ marginTop: '1%' }}>
                <Button onClick={() => calcular('average')} variant="outlined" sx={{ width: '100%' }}>
                  {t('asphalt.dosages.superpave.calculate-average-curve')}
                </Button>
              </div>
            </TableContainer>
          )}

          {superior && (
            <TableContainer>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 100px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: '10px',
                }}
              >
                <Typography>{t('asphalt.dosages.superpave.higher-curve')}</Typography>
                <Button onClick={clearTable}>{t('asphalt.dosages.superpave.clear-table')}</Button>
              </Box>
              <CurvesTable
                materials={selectedMaterials}
                dnitBandsLetter={data?.bands?.letter}
                tableInputs={tableCompositionInputsHigher}
                tableName="higherComposition"
                tableData={tableDataHigher}
                onChangeInputsTables={onChangeInputsTables}
              />
              <div style={{ marginTop: '1%' }}>
                <Button onClick={() => calcular('higher')} variant="outlined" sx={{ width: '100%' }}>
                  {t('asphalt.dosages.superpave.calculate-higher-curve')}
                </Button>
              </div>
            </TableContainer>
          )}

          {data.graphData.length > 0 && (
            <>
              <Typography>
                {t('asphalt.dosages.superpave.maximum-nominal-size')}: {data.nominalSize.value} mm
              </Typography>
              <Graph data={data.graphData} />
            </>
          )}
        </Box>
      )}
    </>
  );
};

export default Superpave_Step3;
