import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, Button, Checkbox, FormControlLabel, TableContainer, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { AllSievesSuperpaveUpdatedAstm } from '@/interfaces/common';
import CurvesTable from './tables/curvesTable';
import { toast } from 'react-toastify';
import { t } from 'i18next';
import Graph from '@/services/asphalt/dosages/marshall/graph/marshal-granulometry-graph';
import GranulometricCurvesGraph from './graphs/granulometricCurvesGraph';
import { calculateBands } from './utils/calculateBands';
import useAuth from '@/contexts/auth'; 




const Superpave_Step4_GranulometryComposition = ({
  setNextDisabled,
  superpave,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    granulometryCompositionData: data,
    granulometryEssayData,
    generalData,
    setData,
    hasHydrated,
  } = useSuperpaveStore();

  const dnitBand = data?.bands?.letter || data?.dnitBand || granulometryEssayData?.bands?.letter;
  console.log('✅ Banda DNIT:', dnitBand);

  const [lower, setLower] = useState(false);
  const { user } = useAuth();
  const [average, setAverage] = useState(false);
  const [higher, setHigher] = useState(false);

  const peneiras = AllSievesSuperpaveUpdatedAstm.map((peneira) => {
    return { peneira: peneira.label };
  });

// NO STEP 4 - Adicionar este debug no início
console.log('=== DEBUG STEP 4 - O QUE CHEGOU ===');
console.log('granulometryCompositionData:', data);
console.log('Tem percentsToList?', !!data?.percentsToList);
console.log('percentsToList length:', data?.percentsToList?.length);
console.log('Tem nominalSize?', !!data?.nominalSize);
console.log('Tem bands?', !!data?.bands);

if (!data?.percentsToList || data.percentsToList.length === 0) {
  return (
    <Box>
      <Typography variant="h6" color="error">
        Dados não carregados - Volte para Step 3
      </Typography>
      <Button onClick={() => window.history.back()} variant="contained">
        Voltar para Etapa 3
      </Button>
    </Box>
  );
}

  //console.log('=== DEBUG STEP 4 ===');
  //console.log('data:', data);
  //console.log('percentsToList:', data.percentsToList);
  //console.log('bands:', data.bands);
  //console.log('nominalSize:', data.nominalSize);

  const arrayResponse = data?.percentsToList;
  const bandsHigher = data?.bands?.higher;
  const bandsLower = data?.bands?.lower;

  let tableDataLower;
  let tableDataAverage;
  let tableDataHigher;

  const tableCompositionInputsLower = {};
  const tableCompositionInputsAverage = {};
  const tableCompositionInputsHigher = {};

  const selectedMaterials =
    granulometryEssayData?.materials
      ?.map((material) => {
        if (material?.type !== 'asphaltBinder' && material?.type !== 'CAP') {
          return {
            name: material?.name || 'Material',
            _id: material?._id || `temp_${Date.now()}`,
          };
        }
        return null;
      })
      .filter((material) => material !== null) || [];

  //console.log('Selected materials:', selectedMaterials);

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


  
/*useEffect(() => {
  if (!hasHydrated || !user) return;

  const fetchData = async () => {
    setLoading(true);
    try {
      const storeState = useSuperpaveStore.getState();
      const response = await superpave.getGranulometricCompositionData(storeState, user._id); 
      
      console.log('✅ Response da etapa anterior:', {
        percentsToList: response?.percentsToList,
        nominalSize: response?.nominalSize,
        bands: response?.bands
      });

      if (response) {
        setData({
          step: 4,
          value: {
            ...storeState.granulometryCompositionData,
            ...response,
            // ⬇️⬇️⬇️ AGORA SEM ERROS DE TYPESCRIPT ⬇️⬇️⬇️
            percentsToList: response.percentsToList || storeState.granulometryCompositionData?.percentsToList,
            nominalSize: response.nominalSize || storeState.granulometryCompositionData?.nominalSize,
            bands: response.bands || storeState.granulometryCompositionData?.bands,
          },
        });
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      toast.error('Erro ao carregar os dados granulométricos');
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [hasHydrated, user]);

*/
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
  const value = Number(e.target.value);
  setData({
    step: 4,
    key: 'percentageInputs',
    value: {
      ...data.percentageInputs,
      [tableName]: {
        ...data.percentageInputs[tableName],
        ['input' + index]: value,
      },
    },
  });
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

  const calculate = async (curves: string[]) => {
   // console.log('=== CALCULATE STEP 4 ===');
    //console.log('Curves selecionadas:', curves);
    //console.log('Data completo:', data);
    //console.log('DnitBand:', dnitBand);

    // 1️⃣ Calcular bandas com base no nominalSize
    let bands = { letter: dnitBand, lower: [], higher: [] };
    if (data?.nominalSize?.value) {
      
      bands = calculateBands(data.nominalSize.value);
    }
    if (!data.nominalSize?.value) {
  setData({
    step: 4,
    key: 'nominalSize',
    value: { value: 19.1 } // ou outro valor real da peneira principal
  });
}

    const bandLetter = bands.letter || dnitBand;

    // 2️⃣ Validar dados antes do cálculo
    if (!data || !data.percentageInputs) {
      toast.error(t('asphalt.dosages.superpave.empty-granulometry-values'));
      return;
    }

    // 3️⃣ Determinar índices com base nas curvas selecionadas
    const indexes = curves
      .map((item) => {
        if (item === 'lower') return 0;
        if (item === 'average') return 1;
        if (item === 'higher') return 2;
        return -1;
      })
      .filter((index) => index !== -1);

    //console.log('Indexes calculados:', indexes);

    // 4️⃣ Verificar se há inputs válidos
    const validIndexes = indexes.filter(
      (index) => data.percentageInputs[index] && Object.keys(data.percentageInputs[index]).length > 0
    );

    if (validIndexes.length === 0) {
      toast.error(t('asphalt.dosages.superpave.empty-granulometry-values'));
      return;
    }

    // 5️⃣ Somar valores e verificar se cada curva soma 100%
    const valueCounts = validIndexes.map((index) => {
      const sum = Object.values(data.percentageInputs[index]).reduce((acc: number, item: any) => {
        const num = typeof item === 'string' ? parseFloat(item.replace(',', '.')) : Number(item);
        return acc + (isNaN(num) ? 0 : num);
      }, 0);
      console.log(`Soma para índice ${index}:`, sum);
      return sum;
    });

    const valueIsValid = valueCounts.every((v) => Math.abs(v - 100) < 0.01);

    const noEmptyInputs = validIndexes.every((index) =>
      Object.values(data.percentageInputs[index]).some((value) => {
        let numericValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : Number(value);
        return !isNaN(numericValue) && numericValue > 0;
      })
    );

    console.log('Value isValid:', valueIsValid);
    console.log('No empty inputs:', noEmptyInputs);

    if (!valueIsValid || !noEmptyInputs) {
      if (!noEmptyInputs) {
        toast.error(t('asphalt.dosages.superpave.empty-granulometry-values'));
      } else {
        toast.error(t('asphalt.dosages.superpave.invalid-granulometry-values'));
        console.log('Somas inválidas:', valueCounts);
      }
      return;
    }

    // 6️⃣ Montar dados para o cálculo
    // ✅ CORREÇÃO - PEGAR DADOS DA RESPOSTA DA ETAPA ANTERIOR
const calculationData: any = {
  chosenCurves: curves,
  percentageInputs: data.percentageInputs,
  
  // ⬇️⬇️⬇️ CORREÇÃO CRÍTICA AQUI ⬇️⬇️⬇️
  percentsToList: data.percentsToList || granulometryEssayData?.percentsToList || [],
  
  dnitBand: bandLetter,
  bands,
  materials: granulometryEssayData?.materials || [],
  
  // ⬇️⬇️⬇️ CORREÇÃO DO NOMINAL SIZE ⬇️⬇️⬇️
  nominalSize: data.nominalSize || granulometryEssayData?.nominalSize || { value: 19.1 },
  
  graphData: data.graphData || [],
  pointsOfCurve: data.pointsOfCurve || [],
  lowerComposition: data.lowerComposition || null,
  averageComposition: data.averageComposition || null,
  higherComposition: data.higherComposition || null,
};

    console.log('📤 Dados enviados para cálculo:', calculationData);

    // 7️⃣ Executar cálculo com toast.promise
    toast.promise(
      async () => {
        try {
          const response = await (superpave as any).calculateGranulometryComposition(
            calculationData,
            granulometryEssayData,
            generalData,
            curves
          );

          console.log('📥 Resposta do cálculo:', response);

          if (response && response.data) {
            // ✅ Aqui é o local correto:
            const graphData =
              response.data.pointsOfCurve?.map((row: any) => row.map((val: any) => (val === null ? 0 : val))) || [];

            setData({
              step: 4,
              value: {
                ...data,
                ...response.data,
                graphData,
                pointsOfCurve: response.data.pointsOfCurve || data.pointsOfCurve,
              },
            });

            // Atualiza o gráfico
            if (response.data.pointsOfCurve) {
              updateGraph(response.data.pointsOfCurve);
            }
          } else {
            console.error('❌ Resposta sem dados:', response);
          }
        } catch (error) {
          console.error('❌ Erro no cálculo:', error);
          throw error;
        }
      },
      {
        pending: t('loading.materials.pending'),
        success: t('loading.materials.success'),
        error: t('loading.materials.error'),
      }
    );
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

              // ⬇️⬇️⬇️ VALIDAÇÃO: Verificar se a tabela tem dados ⬇️⬇️⬇️
              if (table.isActive && table.data && Array.isArray(table.data)) {
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
                      <Typography sx={{ textAlign: 'center', fontSize: '1.5rem' }}>
                        {table.title} - Banda {dnitBand} {/* ⬅️ MOSTRAR BANDA */}
                      </Typography>

                      <Button onClick={() => clearTable(index)} variant="outlined">
                        {t('asphalt.dosages.superpave.clear-table')}
                      </Button>
                    </Box>

                    {/* ⬇️⬇️⬇️ PASSAR DNIT BAND CORRETAMENTE ⬇️⬇️⬇️ */}
                    <CurvesTable
                      materials={selectedMaterials}
                      dnitBandsLetter={dnitBand} // ⬅️ AGORA TEM VALOR
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
              return null;
            })}

          {data?.pointsOfCurve?.length > 0 && <GranulometricCurvesGraph data={data?.pointsOfCurve} />}
        </Box>
      )}
    </>
  );
};

export default Superpave_Step4_GranulometryComposition;
