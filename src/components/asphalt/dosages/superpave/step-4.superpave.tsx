import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, Button, Checkbox, FormControlLabel, TableContainer, Typography } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { AllSievesSuperpaveUpdatedAstm } from '@/interfaces/common';
import CurvesTable from './tables/curvesTable';
import { toast } from 'react-toastify';
import { t } from 'i18next';
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
    setData,
  } = useSuperpaveStore();

  const hasInitializedRef = useRef(false);
  const isCalculatingRef = useRef(false);

  const dnitBand = data?.bands?.letter || data?.dnitBand || granulometryEssayData?.bands?.letter;
  
  const [lower, setLower] = useState(false);
  const [average, setAverage] = useState(false);
  const [higher, setHigher] = useState(false);

  const [percentageInputs, setPercentageInputs] = useState<Record<string, any>[]>([{}, {}, {}]);

  const peneiras = AllSievesSuperpaveUpdatedAstm.map((peneira) => {
    return { peneira: peneira.label };
  });

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

  useEffect(() => {
    if (hasInitializedRef.current || !data || !selectedMaterials.length) return;

    console.log('🔄 STEP 4 - Inicializando dados...');
    
    if (data.percentageInputs && Array.isArray(data.percentageInputs) && data.percentageInputs.length > 0) {
      console.log('📥 Carregando inputs existentes:', data.percentageInputs);
      setPercentageInputs(data.percentageInputs);
      hasInitializedRef.current = true;
    } else {
      console.log('🆕 Criando novos inputs');
      const initialInputs = Array(3).fill({}).map(() => {
        const inputs: Record<string, string> = {};
        selectedMaterials.forEach((material, index) => {
          if (material && material._id) {
            const fieldKey = `material_${material._id}_${index + 1}`;
            inputs[fieldKey] = '';
          }
        });
        return inputs;
      });

      console.log('🆕 Inputs inicializados:', initialInputs);
      setPercentageInputs(initialInputs);
      
      setData({
        step: 4,
        value: {
          ...data,
          percentageInputs: initialInputs
        }
      });
      hasInitializedRef.current = true;
    }
  }, [data, selectedMaterials, setData]);

  useEffect(() => {
    if (data?.percentageInputs && Array.isArray(data.percentageInputs)) {
      setPercentageInputs(data.percentageInputs);
    }
  }, [data?.percentageInputs]);

  if (!data?.percentsToList || data.percentsToList.length === 0) {
    return (
      <Box>
        <Typography variant="h6" color="error">
          {t('asphalt.dosages.superpave.data-not-loaded')}
        </Typography>
        <Button onClick={() => window.history.back()} variant="contained">
          {t('asphalt.dosages.superpave.back-to-step-3')}
        </Button>
      </Box>
    );
  }

  const arrayResponse = data.percentsToList;
  const bandsHigher = data.bands?.higher || [];
  const bandsLower = data.bands?.lower || [];

 

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

  const convertNumber = (value: any): number => {
    if (value === null || value === undefined) return 0;
    
    let aux = value;
    if (typeof aux === 'string' && aux.includes(',')) {
      aux = aux.replace('.', '').replace(',', '.');
    }
    const result = parseFloat(aux);
    return isNaN(result) ? 0 : result;
  };

  const validateNumber = (value: any): boolean => {
    const auxValue = convertNumber(value);
    return !isNaN(auxValue) && typeof auxValue === 'number';
  };

  const numberRepresentation = (value: any, digits = 2): string => {
    const aux = convertNumber(value);
    if (validateNumber(aux)) {
      const formato = { minimumFractionDigits: digits, maximumFractionDigits: digits };
      return aux.toLocaleString('pt-BR', formato);
    }
    return '';
  };

  const setPercentsToListTotal = (peneiras: { peneira: string }[], percentsToList: any[][]) => {
    if (!percentsToList || !Array.isArray(percentsToList)) return [];

    const tableData = Array.from({ length: percentsToList.length }, () => []);

    percentsToList.forEach((item, i) => {
      if (!Array.isArray(item)) return;
      
      item.forEach((value, j) => {
        if (value !== null && peneiras[j]) {
          const tableItem = {
            ...peneiras[j],
            ['keyTotal' + i]: numberRepresentation(Array.isArray(value) ? value[1] : value),
          };

          if (i > 0 && tableData[i][j]) {
            tableData[i][j] = { ...tableData[i][j], ...tableItem };
          } else {
            tableData[i][j] = tableItem;
          }
        }
      });
    });
    
    return tableData;
  };

  const tableDataAux = setPercentsToListTotal(peneiras, arrayResponse);

  const setBandsHigherLower = (tableData: any[], bandsHigher: any[], bandsLower: any[]) => {
    if (!tableData || !Array.isArray(tableData) || tableData.length === 0) return [];

    const arraySize = tableData[0]?.length || 0;
    const arrayAux = Array(arraySize).fill({});

    tableData.forEach((element) => {
      if (!Array.isArray(element)) return;
      
      element.forEach((item, index2) => {
        if (item && typeof item === 'object') {
          const bandsCol1 = bandsHigher[index2] === null ? '' : numberRepresentation(bandsHigher[index2]);
          const bandsCol2 = bandsLower[index2] === null ? '' : numberRepresentation(bandsLower[index2]);
          
          arrayAux[index2] = {
            ...arrayAux[index2],
            ...item,
            bandsCol1,
            bandsCol2,
          };
        }
      });
    });

    return arrayAux;
  };

  const tableData = setBandsHigherLower(tableDataAux, bandsHigher, bandsLower);

const onChangeInputsTables = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, 
  tableName: string, 
  materialIndex: number
) => {
  try {
    const value = String(e.target?.value || '');
    const fieldName = String((e.target as any)?.dataset?.fieldMaterial || '');
    
    console.log('📝 onChangeInputsTables (SAFE):', { fieldName, value, tableName, materialIndex });

    if (!fieldName) {
      console.error('❌ fieldName não encontrado no dataset!');
      return;
    }

    const tableIndex = tableName === 'lowerComposition' ? 0 : 
                      tableName === 'averageComposition' ? 1 : 2;

    const updatedInputs = percentageInputs.map(input => 
      input ? { ...input } : {}
    );
    
    if (!updatedInputs[tableIndex]) {
      updatedInputs[tableIndex] = {};
    }
    
    updatedInputs[tableIndex][fieldName] = value;

    setPercentageInputs(updatedInputs);

    const simpleDataForStore = {
      ...data,
      percentageInputs: updatedInputs.map(input => 
        input ? { ...input } : {}
      )
    };

    setData({
      step: 4,
      value: simpleDataForStore
    });

    console.log('💾 Inputs atualizados com sucesso!');

  } catch (error) {
    console.error('❌ Erro em onChangeInputsTables:', error);
    
    const cleanInputs = Array(3).fill({}).map(() => ({}));
    setPercentageInputs(cleanInputs);
    setData({
      step: 4,
      value: {
        ...data,
        percentageInputs: cleanInputs
      }
    });
  }
};

  const clearTable = (index: number) => {
    const clearedInputs = { ...percentageInputs[index] };
    
    // Limpar todos os inputs
    Object.keys(clearedInputs).forEach(key => {
      clearedInputs[key] = '';
    });

    const updatedInputs = [...percentageInputs];
    updatedInputs[index] = clearedInputs;

    setPercentageInputs(updatedInputs);

    setData({
      step: 4,
      value: {
        ...data,
        percentageInputs: updatedInputs,
        graphData: [],
        pointsOfCurve: [],
        ...(index === 0 && { lowerComposition: null }),
        ...(index === 1 && { averageComposition: null }),
        ...(index === 2 && { higherComposition: null }),
      }
    });
  };

  const addEmptyTitles = (data: any[][]) => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];
    
    const emptyTitles = data[0]?.some((value) => value !== '') ? data[0].map(() => '') : [];
    return [emptyTitles, ...data];
  };

  const updateGraph = (points: any[][]) => {
    const pointsOfCurve = addEmptyTitles(points);
    setData({ 
      step: 4, 
      key: 'pointsOfCurve', 
      value: pointsOfCurve 
    });
  };

const calculate = async (curves: string[]) => {
  if (isCalculatingRef.current) {
    console.log('⚠️ Cálculo já em andamento...');
    return;
  }

  isCalculatingRef.current = true;
  setLoading(true);

  try {
    console.log('=== CALCULATE STEP 4 ===');
    console.log('Curves selecionadas:', curves);

    // 1️⃣ Validar dados antes do cálculo
    if (!data || !data.percentageInputs) {
      toast.error(t('asphalt.dosages.superpave.empty-granulometry-values'));
      return;
    }

    const indexes = curves
      .map((item) => {
        if (item === 'lower') return 0;
        if (item === 'average') return 1;
        if (item === 'higher') return 2;
        return -1;
      })
      .filter((index) => index !== -1);

    const validIndexes = indexes.filter(
      (index) => data.percentageInputs[index] && Object.keys(data.percentageInputs[index]).length > 0
    );

    if (validIndexes.length === 0) {
      toast.error(t('asphalt.dosages.superpave.empty-granulometry-values'));
      return;
    }
const valueCounts = validIndexes.map((index) => {
  const sum = Object.values(data.percentageInputs[index]).reduce((acc: number, item: any) => {
    const num = typeof item === 'string' ? parseFloat(item.replace(',', '.')) : Number(item);

    return acc + (isNaN(num) ? 0 : num);
  }, 0); 

  console.log(`Soma para índice ${index}:`, sum);
  return sum;
});

const valueIsValid = valueCounts.every((v) => {
  const num = typeof v === 'number' ? v : 0;
  return Math.abs(num - 100) < 0.01;
});

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

    let bands = { letter: dnitBand, lower: [], higher: [] };
    if (data?.nominalSize?.value) {
      bands = calculateBands(data.nominalSize.value);
    }

    const bandLetter = bands.letter || dnitBand;

    const calculationData: any = {
      chosenCurves: curves,
      percentageInputs: data.percentageInputs,
      percentsToList: data.percentsToList || [],
      dnitBand: bandLetter,
      bands,
      materials: granulometryEssayData?.materials || [],
      nominalSize: data.nominalSize || { value: 19.1 },
      graphData: data.graphData || [],
      pointsOfCurve: data.pointsOfCurve || [],
      lowerComposition: data.lowerComposition || null,
      averageComposition: data.averageComposition || null,
      higherComposition: data.higherComposition || null,
    };

    console.log('📤 Dados enviados para cálculo:', calculationData);

    await toast.promise(
      async () => {
        const response = await (superpave as any).calculateGranulometryComposition(
          calculationData,
          granulometryEssayData,
          curves 
        );

        console.log('📥 Resposta do cálculo:', response);

        if (response && response.data) {
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

          if (response.data.pointsOfCurve) {
            updateGraph(response.data.pointsOfCurve);
          }
        } else {
          console.error('❌ Resposta sem dados:', response);
          throw new Error('Resposta sem dados do cálculo');
        }
      },
      {
        pending: t('loading.materials.pending'),
        success: t('loading.materials.success'),
        error: t('loading.materials.error'),
      }
    );

  } catch (error) {
    console.error('❌ Erro no cálculo:', error);
    toast.error('Erro ao calcular composição granulométrica');
  } finally {
    isCalculatingRef.current = false;
    setLoading(false);
  }
};

  useEffect(() => {
    if (data?.pointsOfCurve?.length > 0) {
      setNextDisabled(false);
    } else {
      setNextDisabled(true);
    }
  }, [data?.pointsOfCurve, setNextDisabled]);

  const tables = [
    {
      key: 'lower',
      data: tableData,
      inputs: percentageInputs[0] || {},
      name: 'lowerComposition',
      isActive: lower,
      title: t('asphalt.dosages.superpave.lower-curve'),
    },
    {
      key: 'average',
      data: tableData,
      inputs: percentageInputs[1] || {},
      name: 'averageComposition',
      isActive: average,
      title: t('asphalt.dosages.superpave.average-curve'),
    },
    {
      key: 'higher',
      data: tableData,
      inputs: percentageInputs[2] || {},
      name: 'higherComposition',
      isActive: higher,
      title: t('asphalt.dosages.superpave.higher-curve'),
    },
  ];

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Box sx={{ display: 'flex', gap: '5rem', justifyContent: 'center' }}>
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
              const enabledCurves = tables
                .filter((table) => table.isActive)
                .map((table) => table.key);

              if (table.isActive && table.data && Array.isArray(table.data)) {
                return (
                  <TableContainer key={table.key}>
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '10px',
                      marginTop: '2rem',
                    }}>
                      <Typography sx={{ textAlign: 'center', fontSize: '1.5rem' }}>
                        {table.title} - Banda {dnitBand}
                      </Typography>

                      <Button onClick={() => clearTable(index)} variant="outlined">
                        {t('asphalt.dosages.superpave.clear-table')}
                      </Button>
                    </Box>

                    <CurvesTable
                      materials={selectedMaterials}
                      dnitBandsLetter={dnitBand}
                      tableInputs={table.inputs}
                      tableName={table.name}
                      tableData={table.data}
                      onChangeInputsTables={onChangeInputsTables}
                    />

                    <Button
                      onClick={() => calculate(enabledCurves)}
                      variant="outlined"
                      sx={{ width: '100%', marginTop: '2%' }}
                      disabled={isCalculatingRef.current}
                    >
                      {isCalculatingRef.current 
                        ? t('loading.materials.pending')
                        : t(`asphalt.dosages.superpave.calculate-${table.key}-curve`)
                      }
                    </Button>
                  </TableContainer>
                );
              }
              return null;
            })}

          {data?.pointsOfCurve?.length > 0 && (
            <GranulometricCurvesGraph data={data.pointsOfCurve} />
          )}
        </Box>
      )}
    </>
  );
};

export default Superpave_Step4_GranulometryComposition;