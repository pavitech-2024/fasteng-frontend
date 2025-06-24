import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, Button, Checkbox, FormControlLabel, TableContainer, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { AllSievesSuperpaveUpdatedAstm } from '@/interfaces/common';
import CurvesTable from './tables/curvesTable';
import { toast } from 'react-toastify';
import { t } from 'i18next';
import Graph from '@/services/asphalt/dosages/marshall/graph/graph';

const Superpave_Step4 = ({ setNextDisabled, superpave }: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    granulometryCompositionData: data,
    granulometryResultsData,
    granulometryEssayData,
    generalData,
    setData,
    hasHydrated,
  } = useSuperpaveStore();

  const { user } = useAuth();

  const [lower, setLower] = useState(false);
  const [average, setAverage] = useState(false);
  const [higher, setHigher] = useState(false);

  const [chosenCurves, setChosenCurves] = useState({
    lower: false,
    average: false,
    higher: false,
  });

  const peneiras = AllSievesSuperpaveUpdatedAstm.map((peneira) => {
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

  const selectedMaterials = granulometryEssayData.materials
    .map((material) => {
      if (material.type !== 'asphaltBinder' && material.type !== 'CAP') {
        return {
          name: material.name,
          _id: material._id,
        };
      }
    })
    .filter((material) => material !== undefined);

  const checkBoxes = [
    {
      key: 'lower',
      label: t('asphalt.dosages.superpave.step-3.lower'),
      value: lower,
    },
    {
      key: 'average',
      label: t('asphalt.dosages.superpave.step-3.average'),
      value: average,
    },
    {
      key: 'higher',
      label: t('asphalt.dosages.superpave.step-3.higher'),
      value: higher,
    },
  ];

  /**
   * Hydrates the store with the data from the backend.
   * If the data is already present in the store, it doesn't do anything.
   */
  // useEffect(() => {
  //   if (!hasHydrated) return;

  //   if (data.percentsToList.length > 0) {
  //     setLoading(false);
  //     return;
  //   }

  //   toast.promise(
  //     async () => {
  //       try {
  //         const storeState = useSuperpaveStore.getState();
  //         const response = await superpave.getGranulometricCompositionData(storeState, user._id);

  //         setData({
  //           step: 2,
  //           value: {
  //             ...storeState.granulometryCompositionData,
  //             ...response,
  //           },
  //         });

  //         setLoading(false);
  //       } catch (error) {
  //         setLoading(false);
  //         throw error;
  //       }
  //     },
  //     {
  //       pending: t('loading.data.pending'),
  //       success: t('loading.data.success'),
  //       error: t('loading.data.error'),
  //     }
  //   );
  // }, [hasHydrated]);

  const toggleSelectedCurve = (label: string) => {
    switch (label) {
      case 'lower':
        setLower(!lower);
        break;
      case 'average':
        setAverage(!average);
        break;
      case 'higher':
        setHigher(!higher);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    let curves = chosenCurves;
    if (data.pointsOfCurve.lower?.length > 0) curves.lower = true;
    if (data.pointsOfCurve.average?.length > 0) curves.average = true;
    if (data.pointsOfCurve.higher?.length > 0) curves.higher = true;

    setData({ step: 3, key: 'chosenCurves', value: curves });
  }, [data.pointsOfCurve]);

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

  const setPercentsToListTotal = (peneiras: { peneira: string }[], percentsToList) => {

    const tableData = Array.from({ length: percentsToList?.length }, () => []);

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

  const inputsInit = (key: string) => {
    tableCompositionInputsLower[key] = '';
    tableCompositionInputsAverage[key] = '';
    tableCompositionInputsHigher[key] = '';
  };

  selectedMaterials.forEach((_, i) => {
    inputsInit(`input${i * 2 + 1}`);
  });

  const tables = [
    {
      key: 'lower',
      data: tableDataLower,
      inputs: tableCompositionInputsLower,
      name: 'lowerComposition',
      isActive: lower,
      title: t('asphalt.dosages.superpave.lower-curve'),
    },
    {
      key: 'average',
      data: tableDataAverage,
      inputs: tableCompositionInputsAverage,
      name: 'averageComposition',
      isActive: average,
      title: t('asphalt.dosages.superpave.average-curve'),
    },
    {
      key: 'higher',
      data: tableDataHigher,
      inputs: tableCompositionInputsHigher,
      name: 'higherComposition',
      isActive: higher,
      title: t('asphalt.dosages.superpave.higher-curve'),
    },
  ];

  /**
   * Update the selected table inputs when the user changes one of them
   * @param {ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - The input change event
   * @param {string} tableName - The name of the table ('lower', 'average', 'higher')
   * @param {number} index - The index of the material in the table
   */
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

    setLower(false);
    setAverage(false);
    setHigher(false);

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
      if (data[0]?.some((value) => value !== '')) {
        data[0].forEach(() => emptyTitles.push(''));
        result.unshift(emptyTitles);
      }
    }
    return result;
  };

  const updateGraph = (points, curve) => {
    const pointsOfCurve = updateDataArray(points);
    const prevData = { ...data.pointsOfCurve };
    const newData = { ...prevData, [curve]: pointsOfCurve };
    setData({ step: 3, key: 'pointsOfCurve', value: newData });
  };

  const calculate = (curve: string) => {
    const index = curve === 'lower' ? 0 : curve === 'average' ? 1 : 2;
    const valueCount = Object.values(data.percentageInputs[index]).reduce((acc, item) => acc + Number(item), 0);
    const valueIsValid = valueCount === 100;

    if (valueIsValid) {
      toast.promise(
        async () => {
          try {
            const response = await superpave.calculateGranulometryComposition(
              data,
              granulometryEssayData,
              generalData,
              curve
            );
            console.log("🚀 ~ response:", response)
            setData({ step: 3, value: response });

            updateGraph(response.pointsOfCurve[curve], curve);
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

  if (Object.entries(data.pointsOfCurve).some(([key, value]) => value)) {
    setNextDisabled(false);
  } else {
    setNextDisabled(true);
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
          <Box
            sx={{
              display: 'flex',
              gap: '5rem',
              justifyContent: 'center',
            }}
          >
            {checkBoxes.map((box) => (
              <FormControlLabel
                key={box.key}
                control={<Checkbox checked={box.value} />}
                onChange={() => toggleSelectedCurve(box.key)}
                label={box.label}
                sx={{ display: 'flex', width: 'fit-content' }}
              />
            ))}

            <Box sx={{ width: 'fit-content', display: 'flex', justifyContent: 'end' }}>
              <Button onClick={() => clearTable()} variant="outlined">
                {t('asphalt.dosages.superpave.clear-table')}
              </Button>
            </Box>
          </Box>

          {(lower || average || higher) &&
            tables.map((table) => {
              if (table.isActive) {
                return (
                  <TableContainer key={table.key}>
                    <Box
                      sx={{
                        display: 'grid',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '10px',
                      }}
                    >
                      <Typography sx={{ textAlign: 'center', marginTop: '2rem', fontSize: '1.5rem' }}>
                        {table.title}
                      </Typography>
                    </Box>
                    <CurvesTable
                      materials={selectedMaterials}
                      dnitBandsLetter={data?.bands?.letter}
                      tableInputs={table.inputs}
                      tableName={table.name}
                      tableData={table.data}
                      onChangeInputsTables={onChangeInputsTables}
                    />

                    {data.pointsOfCurve[table.key]?.length > 0 && <Graph data={data.pointsOfCurve[table.key]} />}

                    <Button
                      onClick={() => calculate(table.key)}
                      variant="outlined"
                      sx={{ width: '100%', marginTop: '2%' }}
                    >
                      {t(`asphalt.dosages.superpave.calculate-${table.key}-curve`)}
                    </Button>
                  </TableContainer>
                );
              }
            })}
        </Box>
      )}
    </>
  );
};

export default Superpave_Step4;
