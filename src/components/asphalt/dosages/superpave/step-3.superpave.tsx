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

  let arrayResponse = data?.percentsToList;
  let bandsHigher = data?.bands?.higher;
  let bandsLower = data?.bands?.lower;
  let tableDataAux;
  let tableData;

  let tableDataLower = tableData;
  let tableDataAverage = tableData;
  let tableDataHigher = tableData;

  let tableCompositionInputsLower = {};
  let tableCompositionInputsAverage = {};
  let tableCompositionInputsHigher = {};

  let selectedMaterials = materialSelectionData?.aggregates;
  const [inferior, setInferior] = useState(false);
  const [intermediaria, setIntermediaria] = useState(false);
  const [superior, setSuperior] = useState(false);

  // useEffect(() => {
  //   console.log("🚀 ~ tableData:", tableData)
  // },[tableData])

  useEffect(() => {
    if (data.percentsToList.length > 0) {
      setLoading(false);
    }
    if (generalData.step === 2) {
      toast.promise(
        async () => {
          try {
            const dosageData = sessionStorage.getItem('asphalt-superpave-store');
            const sessionDataJson = JSON.parse(dosageData);
            const dosageDataJson = sessionDataJson.state as SuperpaveData;

            const response = await superpave.getStep3Data(dosageDataJson, user._id);

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
    }
  }, []);

  const handleCheckboxChange = (checked, setChecked) => {
    if (checked) {
      setInferior(false);
      setIntermediaria(false);
      setSuperior(false);
      setChecked(true);
    } else {
      setChecked(false);
    }
  };

  const convertNumber = (value) => {
    let aux = value;
    if (typeof aux !== 'number' && aux !== null && aux !== undefined && aux.includes(',')) {
      aux = aux.replace('.', '').replace(',', '.');
    }

    return parseFloat(aux);
  };

  const validateNumber = (value) => {
    let auxValue = convertNumber(value);
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
    let arrayAux = [];
    let tableData = [];
    let second = 0;
    percentsToList?.forEach((item, i) => {
      arrayAux = [];
      second = 0;
      item.forEach((value, j) => {
        if (value !== null) {
          if (i > 0) {
            arrayAux.push({
              ...tableData[second],
              ['keyTotal' + i]: numberRepresentation(value[1]),
            });
            second++;
          } else {
            arrayAux.push({
              ...peneiras[j],
              ['keyTotal' + i]: numberRepresentation(value[1]),
            });
          }
        }
      });
      tableData = arrayAux;
    });
    return tableData;
  };

  tableDataAux = setPercentsToListTotal(peneiras, arrayResponse);

  const setBandsHigherLower = (tableData, bandsHigher, bandsLower, arrayResponse, peneiras) => {
    let arrayAux = [];
    let second = 0;
    for (let i = 0; i < bandsHigher?.length; i++) {
      if (arrayResponse[0][i] !== null && tableData[second]?.peneira === peneiras[i]?.peneira) {
        if (bandsHigher[i] === null && bandsLower[i] === null) {
          arrayAux.push({
            ...tableData[second],
            bandsCol1: '',
            bandsCol2: '',
          });
        } else {
          arrayAux.push({
            ...tableData[second],
            bandsCol1: numberRepresentation(bandsHigher[i]),
            bandsCol2: numberRepresentation(bandsLower[i]),
          });
        }
        second++;
      }
    }
    return arrayAux;
  };

  tableData = setBandsHigherLower(tableDataAux, bandsHigher, bandsLower, arrayResponse, peneiras);

  tableDataLower = tableData;
  tableDataAverage = tableData;
  tableDataHigher = tableData;

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
      ['input' + index]: e.target.value,
    };
  };

  const convertToNumberPercentsToList = (tableCompositionInputName) => {
    let keys = Object.keys(data.percentageInputs);
    let arrayAux = [];
    let inputAcess = '';
    let sum = 0;
    for (let i = 0; i < keys.length; i++) {
      inputAcess = keys[i];
      const valueMaterial_1 = convertNumber(data.percentageInputs[inputAcess].material_1);
      const valueMaterial_2 = convertNumber(data.percentageInputs[inputAcess].material_2);
      if (validateNumber(valueMaterial_1)) {
        arrayAux.push(valueMaterial_1);
        sum = Math.round((sum + valueMaterial_1) * 1e2) / 1e2;
      }
      if (validateNumber(valueMaterial_2)) {
        arrayAux.push(valueMaterial_2);
        sum = Math.round((sum + valueMaterial_2) * 1e2) / 1e2;
      }
    }
    return { totalSum: sum, valuesInput: arrayAux, tableCompositionInputName };
  };

  const updateTable = (percentsOfMaterials, sumOfPercentsToReturn, arrayTable) => {
    let tableData = [];
    let arrayResultAux = arrayTable;
    let second = 0;
    percentsOfMaterials.forEach((item, i) => {
      tableData = [];
      second = 0;
      item.forEach((value, j) => {
        if (value !== null) {
          tableData.push({
            ...arrayResultAux[second],
            ['key%' + i]: numberRepresentation(value),
          });
          second++;
        }
      });
      arrayResultAux = tableData;
    });
    tableData = [];
    second = 0;
    sumOfPercentsToReturn.forEach((item, i) => {
      if (item !== null) {
        tableData.push({
          ...arrayResultAux[second],
          Projeto: numberRepresentation(item),
        });
        second++;
      }
    });
    
    return tableData;
  };

  const clearTable = () => {
    let newInputs = data.percentageInputs;

    newInputs.map((input) => ({
      material_1: null,
      material_2: null
    }));

    setInferior(false);
    setIntermediaria(false);
    setSuperior(false);

    const newData = {
      ...data,
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
      }
    }
    
    setData({ step: 2, value: newData })
  };

  const updateDataArray = (data) => {
    let emptyTitles = [];
    let result = data;
    if (data.length > 0) {
      data[0].forEach(() => emptyTitles.push(''));
      result.unshift(emptyTitles);
    }

    return result;
  };

  const updateGraph = (points) => {
    let pointsOfCurve = updateDataArray(points);
    const prevData = { ...data };
    const newData = { ...prevData, graphData: pointsOfCurve };
    setData({ step: 2, value: newData });
  };

  const calcular = async (tableDataName, tableCompositionInputName) => {
    const resultInputsLower = convertToNumberPercentsToList('tableCompositionInputsLower');
    const resultInputsAverage = convertToNumberPercentsToList('tableCompositionInputsAverage');
    const resultInputsHigher = convertToNumberPercentsToList('tableCompositionInputsHigher');

    if (
      (resultInputsLower.valuesInput.length === 0 &&
        resultInputsLower.tableCompositionInputName === tableCompositionInputName) ||
      (resultInputsAverage.valuesInput.length === 0 &&
        resultInputsAverage.tableCompositionInputName === tableCompositionInputName) ||
      (resultInputsHigher.valuesInput.length === 0 &&
        resultInputsHigher.tableCompositionInputName === tableCompositionInputName)
    ) {
      toast.error('Todos os campos estão vazios');
    } else {
      if (
        (resultInputsLower.totalSum === 100 &&
          resultInputsLower.tableCompositionInputName === tableCompositionInputName) ||
        (resultInputsAverage.totalSum === 100 &&
          resultInputsAverage.tableCompositionInputName === tableCompositionInputName) ||
        (resultInputsHigher.totalSum === 100 &&
          resultInputsHigher.tableCompositionInputName === tableCompositionInputName)
      ) {
        let arraySend = [
          resultInputsLower.totalSum === 100 ? resultInputsLower.valuesInput : [],
          resultInputsAverage.totalSum === 100 ? resultInputsAverage.valuesInput : [],
          resultInputsHigher.totalSum === 100 ? resultInputsHigher.valuesInput : [],
        ];

        let chosenCurves = {
          lower: inferior,
          average: intermediaria,
          higher: superior,
        };

        await superpave
          .calculateGranulometryComposition(data, materialSelectionData, generalData, chosenCurves)
          .then((res) => {
            console.log("🚀 ~ .then ~ res:", res)
            const keys = ['averageComposition', 'higherComposition', 'lowerComposition'];
            let tablesNames = ['tableDataAverage', 'tableDataHigher', 'tableDataLower'];
            let response = res;
            let newData = response.newData
            console.log("🚀 ~ .then ~ newData:", newData)
            keys.forEach((key, i) => {
              if (response[key].percentsOfMaterials !== undefined) {
                let tableUpdate = updateTable(
                  response[key].percentsOfMaterials,
                  response[key].sumOfPercents,
                  tablesNames[i]
                );

                //Verificação por escolha de curvas
                if (
                  (inferior && resultInputsLower.totalSum !== 100) ||
                  (intermediaria && resultInputsAverage.totalSum !== 100) ||
                  (superior && resultInputsHigher.totalSum !== 100)
                ) {
                  tablesNames = tableUpdate;
                } else {
                  tablesNames = tableUpdate;
                  nominalSize: numberRepresentation(data?.nominalSize.value);
                }
              }

              setData({ step: 2, value: newData})
            });

            //Ajustar o gráfico para as curvas selecionadas
            updateGraph(data?.pointsOfCurve);
          });
      } else if (
        (resultInputsLower.valuesInput.length !== selectedMaterials.length &&
          resultInputsLower.tableCompositionInputName === tableCompositionInputName) ||
        (resultInputsAverage.valuesInput.length !== selectedMaterials.length &&
          resultInputsAverage.tableCompositionInputName === tableCompositionInputName) ||
        (resultInputsHigher.valuesInput.length !== selectedMaterials.length &&
          resultInputsHigher.tableCompositionInputName === tableCompositionInputName)
      ) {
        toast.error('Algum campo está vazio!');
      } else if (
        (resultInputsLower.totalSum < 100 &&
          resultInputsLower.tableCompositionInputName === tableCompositionInputName) ||
        (resultInputsAverage.totalSum < 100 &&
          resultInputsAverage.tableCompositionInputName === tableCompositionInputName) ||
        (resultInputsHigher.totalSum < 100 &&
          resultInputsHigher.tableCompositionInputName === tableCompositionInputName)
      ) {
        toast.error('A soma das porcentagens de cada agregado deve ser 100%.');
      } else {
        toast.error('Soma > 100%');
      }
    }
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
            gap: '10px',
          }}
        >
          <Typography>
            Escolha as curvas desejadas e insira as porcentagens de cada agregado na composição da mistura.
          </Typography>

          <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
            <FormControlLabel
              control={<Checkbox checked={inferior} onChange={() => handleCheckboxChange(!inferior, setInferior)} />}
              label="curva inferior"
              value={inferior}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={intermediaria}
                  onChange={() => handleCheckboxChange(!intermediaria, setIntermediaria)}
                />
              }
              label="curva intermediária"
              value={intermediaria}
            />
            <FormControlLabel
              control={<Checkbox checked={superior} onChange={() => handleCheckboxChange(!superior, setSuperior)} />}
              label="curva superior"
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
                <Typography>Curva inferior</Typography>
                <Button onClick={clearTable}>Limpar tabela</Button>
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
                <Button onClick={() => calcular('tableDataLower', 'tableCompositionInputsLower')}>
                  Calcular curva inferior
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
                <Typography>Curva intermediária</Typography>
                <Button onClick={clearTable}>Limpar tabela</Button>
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
                <Button onClick={() => calcular('tableDataAverage', 'tableCompositionInputsHigher')}>
                  Calcular curva intermediaria
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
                <Typography>Curva superior</Typography>
                <Button onClick={clearTable}>Limpar tabela</Button>
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
                <Button onClick={() => calcular('tableDataHigher', 'tableCompositionInputsHigher')}>
                  Calcular curva superior
                </Button>
              </div>
            </TableContainer>
          )}

          {data.graphData.length > 0 && (
            <>
              <Typography>Tamanho nominal máximo: {data.nominalSize.value} mm</Typography>
              <Graph data={data.graphData} />
            </>
          )}
        </Box>
      )}
    </>
  );
};

export default Superpave_Step3;
