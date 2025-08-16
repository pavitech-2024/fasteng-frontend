import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, Button, Checkbox, FormControlLabel, TableContainer, Typography } from '@mui/material';
import { useState } from 'react';
import { AllSievesSuperpaveUpdatedAstm } from '@/interfaces/common';
import CurvesTable from './tables/curvesTable';
import { toast } from 'react-toastify';
import { t } from 'i18next';
import Graph from '@/services/asphalt/dosages/marshall/graph/graph';

const Superpave_Step4_GranulometryComposition = ({ setNextDisabled, superpave }: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    granulometryCompositionData: data,
    granulometryEssayData,
    generalData,
    setData,
    hasHydrated,
  } = useSuperpaveStore();

  const [lower, setLower] = useState(false);
  const [average, setAverage] = useState(false);
  const [higher, setHigher] = useState(false);

  const peneiras = AllSievesSuperpaveUpdatedAstm.map((peneira) => {
    return { peneira: peneira.label };
  });

  const arrayResponse = data?.percentsToList;
  const bandsHigher = data?.bands?.higher;
  const bandsLower = data?.bands?.lower;

  let tableDataLower;
  let tableDataAverage;
  let tableDataHigher;

  const tableCompositionInputsLower = {};
  const tableCompositionInputsAverage = {};
  const tableCompositionInputsHigher = {};

  const selectedMaterials = granulometryEssayData?.materials
    ?.map((material) => {
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

  const convertNumber = (value) => {
    let aux = value;
    if (typeof aux !== 'number' && aux !== null && aux !== undefined && aux.includes(','))
      aux = aux.replace('.', '').replace(',', '.');
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

  const setBandsHigherLower = (tableData, bandsHigher, bandsLower) => {
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

  const tableData = setBandsHigherLower(tableDataAux, bandsHigher, bandsLower);

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

  selectedMaterials?.forEach((_, i) => {
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

  const clearTable = (index: number) => {
    const currentInputs = data.percentageInputs[index];
    const newInputs: Record<string, number | null> = {};

    Object.keys(currentInputs).forEach((key) => {
      newInputs[key] = null;
    });

    const prevData = data;

    const newData = {
      ...prevData,
      graphData: [],
      pointsOfCurve: [],
      percentageInputs: [
        ...prevData.percentageInputs.slice(0, index),
        newInputs,
        ...prevData.percentageInputs.slice(index + 1),
      ],
      lowerComposition: {
        percentsOfMaterials: null,
        sumOfPercents: [],
      },
      averageComposition: {
        percentsOfMaterials: null,
        sumOfPercents: [],
      },
      higherComposition: {
        percentsOfMaterials: null,
        sumOfPercents: [],
      },
    };

    setData({ step: 3, value: newData });
  };

  /**
   * Insere uma linha de títulos vazios no início do array de dados
   * se a primeira linha contiver algum valor não vazio.
   *
   * @param {Array<any[]>} data - O array de entrada contendo linhas de dados.
   * @returns {Array<any[]>} O array de dados atualizado com uma linha de títulos vazios opcional.
   */
  const addEmptyTitles = (data) => {
    const emptyTitles = data[0]?.some((value) => value !== '') ? data[0].map(() => '') : [];
    return [emptyTitles, ...data];
  };

  /**
   * Atualiza o gráfico com os novos pontos de curva.
   * Recebe um array de pontos de curva e o atualiza no estado.
   * @param {number[][]} points - Os pontos da curva do gráfico a serem atualizados.
   */
  const updateGraph = (points) => {
    const pointsOfCurve = addEmptyTitles(points);
    setData({ step: 3, key: 'pointsOfCurve', value: pointsOfCurve });
  };

  /**
   * Calcula a composição granulométrica com base nas curvas selecionadas.
   *
   * @param {string[]} curves - As curvas selecionadas a serem consideradas para o cálculo.
   * @returns {Promise<void>} Uma promessa que resolve com o novo estado atualizado.
   */
  const calculate = (curves: string[]) => {
    // Determina o índice com base na curva selecionada
    const indexes = curves.map((item) => {
      if (item === 'lower') return 0;
      if (item === 'average') return 1;
      if (item === 'higher') return 2;
    });

    // Soma os valores de entrada para a curva selecionada e verifica se a soma é 100
    const valueCounts = indexes.map((index) =>
      Object.values(data.percentageInputs[index]).reduce((acc, item) => acc + Number(item), 0)
    );

    const valueIsValid = valueCounts.every((valueCount) => valueCount === 100);
    const noEmptyInputs = data.percentageInputs.every((item) => Object.values(item).some((value) => value !== 0));

    if (valueIsValid && noEmptyInputs) {
      toast.promise(
        async () => {
          try {
            const response = await superpave.calculateGranulometryComposition(
              data,
              granulometryEssayData,
              generalData,
              curves
            );

            setData({ step: 3, value: response });

            // Atualiza o gráfico com os novos pontos de curva
            updateGraph(response.pointsOfCurve);
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
    } else {
      if (noEmptyInputs) {
        toast.error(t('asphalt.dosages.superpave.empty-granulometry-values'));
      } else {
        toast.error(t('asphalt.dosages.superpave.invalid-granulometry-values'));
      }
    }
  };

  if (data.pointsOfCurve?.length > 0) {
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
          </Box>

          {(lower || average || higher) &&
            tables.map((table, index) => {
              const enabledCurves = tables.filter((table) => table.isActive).map((table) => table.key);
              if (table.isActive) {
                return (
                  <TableContainer key={table.key}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '10px',
                        marginTop: '2rem',
                      }}
                    >
                      <Typography sx={{ textAlign: 'center', fontSize: '1.5rem' }}>{table.title}</Typography>

                      <Button onClick={() => clearTable(index)} variant="outlined">
                        {t('asphalt.dosages.superpave.clear-table')}
                      </Button>
                    </Box>
                    <CurvesTable
                      materials={selectedMaterials}
                      dnitBandsLetter={data?.bands?.letter}
                      tableInputs={table.inputs}
                      tableName={table.name}
                      tableData={table.data}
                      onChangeInputsTables={onChangeInputsTables}
                    />

                    <Button
                      onClick={() => calculate(enabledCurves)}
                      variant="outlined"
                      sx={{ width: '100%', marginTop: '2%' }}
                    >
                      {t(`asphalt.dosages.superpave.calculate-${table.key}-curve`)}
                    </Button>
                  </TableContainer>
                );
              }
            })}

          {data?.pointsOfCurve?.length > 0 && <Graph data={data?.pointsOfCurve} />}
        </Box>
      )}
    </>
  );
};

export default Superpave_Step4_GranulometryComposition;
