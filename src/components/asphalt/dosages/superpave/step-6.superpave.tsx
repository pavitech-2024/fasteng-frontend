import DropDown from '@/components/atoms/inputs/dropDown';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import Loading from '@/components/molecules/loading';
import ModalBase from '@/components/molecules/modals/modal';
import { EssayPageProps } from '@/components/templates/essay';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, Button, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DataGrid, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import RenderCellComponent from './functionalComponents/renderCell';

const Superpave_Step6_FirstCompaction = ({
  nextDisabled,
  setNextDisabled,
  superpave,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { granulometryCompositionData, initialBinderData, firstCompressionData: data, setData } = useSuperpaveStore();

  const [stepStatus, setStepStatus] = useState('');
  const [riceTestModalIsOpen, setRiceTestModalIsOpen] = useState(false);
  const [columnModalIsOpen, setColumnModalIsOpen] = useState(false);
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState({
    giros: '',
    altura: ''
  });
  const [currentFile, setCurrentFile] = useState<{ file: FileList; tableName: string; index: number } | null>(null);

  // Water temperature list
  const list = {
    '15°C - 0.9991': 0.9991,
    '16°C - 0.9989': 0.9989,
    '17°C - 0.9988': 0.9988,
    '18°C - 0.9986': 0.9986,
    '19°C - 0.9984': 0.9984,
    '20°C - 0.9982': 0.9982,
    '21°C - 0.9980': 0.998,
    '22°C - 0.9978': 0.9978,
    '23°C - 0.9975': 0.9975,
    '24°C - 0.9973': 0.9973,
    '25°C - 0.9970': 0.997,
    '26°C - 0.9968': 0.9968,
    '27°C - 0.9965': 0.9965,
    '28°C - 0.9962': 0.9962,
    '29°C - 0.9959': 0.9959,
    '30°C - 0.9956': 0.9956,
  };

  const waterTemperatureList = Object.keys(list).map((key) => ({
    label: key,
    value: list[key],
  }));

  const [inferiorRows, setInferiorRows] = useState([]);
  const [intermediariaRows, setIntermediariaRows] = useState([]);
  const [superiorRows, setSuperiorRows] = useState([]);
  const [actualCurve, setActualCurve] = useState('');

  const generateRiceTestInputs = (curve: string) => [
    {
      key: 'drySampleMass',
      label: t('asphalt.dosages.superpave.dry-sample-mass'),
      adornment: 'g',
      value: data.riceTest?.find((obj) => obj.curve === curve)
        ? data.riceTest.find((obj) => obj.curve === curve).drySampleMass
        : null,
    },
    {
      key: 'waterSampleContainerMass',
      label: t('asphalt.dosages.superpave.water-sample-container-mass'),
      adornment: 'g',
      value: data.riceTest?.find((obj) => obj.curve === curve)
        ? data.riceTest.find((obj) => obj.curve === curve).waterSampleContainerMass
        : null,
    },
    {
      key: 'waterSampleMass',
      label: t('asphalt.dosages.superpave.water-sample-mass'),
      adornment: 'g',
      value: data.riceTest?.find((obj) => obj.curve === curve)
        ? data.riceTest.find((obj) => obj.curve === curve).waterSampleMass
        : null,
    },
  ];

  useEffect(() => {
    if (data.inferiorRows && Array.isArray(data.inferiorRows) && data.inferiorRows.length !== inferiorRows?.length) {
      setInferiorRows(data.inferiorRows);
    }
    if (
      data.intermediariaRows &&
      Array.isArray(data.intermediariaRows) &&
      data.intermediariaRows.length !== intermediariaRows?.length
    ) {
      setIntermediariaRows(data.intermediariaRows);
    }
    if (data.superiorRows && Array.isArray(data.superiorRows) && data.superiorRows.length !== superiorRows?.length) {
      setSuperiorRows(data.superiorRows);
    }
  }, [data]);

  useEffect(() => {
    let prevData;
    if (data.riceTest) {
      prevData = [...data.riceTest];
    } else {
      prevData = [];
    }

    Object.entries(granulometryCompositionData.chosenCurves).forEach(([curve, value]) => {
      if (value && !prevData.some((obj) => obj.curve === curve)) {
        const index = prevData.findIndex((obj) => obj.curve === null);
        prevData[index] = { ...prevData[index], curve };
        setData({ step: 5, value: { ...data, riceTest: prevData } });
      }
    });
  }, [granulometryCompositionData.chosenCurves]);

  const generateColumns = (curve: string): GridColDef[] => [
    {
      field: 'diammeter',
      headerName: t('asphalt.dosages.superpave.diammeter'),
      width: 100,
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data[curve]?.findIndex((r) => r.id === id);

        return (
          <InputEndAdornment
            adornment={'cm'}
            type="number"
            value={data[curve][index]?.diammeter}
            onChange={(e) => {
              const prevData = [...data[curve]];
              prevData[index].diammeter = parseFloat(e.target.value);
              setData({ step: 5, value: { ...data, [curve]: prevData } });
            }}
          />
        );
      },
    },
    {
      field: 'dryMass',
      headerName: t('asphalt.dosages.superpave.dry-mass'),
      width: 150,
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data[curve].findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'g'}
            type="number"
            value={data[curve][index]?.dryMass}
            onChange={(e) => {
              const prevData = [...data[curve]];
              prevData[index].dryMass = parseFloat(e.target.value);
              setData({ step: 5, value: { ...data, [curve]: prevData } });
            }}
          />
        );
      },
    },
    {
      field: 'submergedMass',
      headerName: t('asphalt.dosages.superpave.submerged-mass'),
      width: 150,
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data[curve].findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'g'}
            type="number"
            value={data[curve][index]?.submergedMass}
            onChange={(e) => {
              const prevData = [...data[curve]];
              prevData[index].submergedMass = parseFloat(e.target.value);
              setData({ step: 5, value: { ...data, [curve]: prevData } });
            }}
          />
        );
      },
    },
    {
      field: 'drySurfaceSaturatedMass',
      headerName: t('asphalt.dosages.superpave.dry-surface-saturated-mass'),
      width: 210,
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data[curve].findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'g'}
            type="number"
            value={data[curve][index]?.drySurfaceSaturatedMass}
            onChange={(e) => {
              const prevData = [...data[curve]];
              prevData[index].drySurfaceSaturatedMass = parseFloat(e.target.value);
              setData({ step: 5, value: { ...data, [curve]: prevData } });
            }}
          />
        );
      },
    },
    {
      field: 'waterTemperatureCorrection',
      headerName: t('asphalt.dosages.superpave.water-temperature'),
      width: 210,
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data[curve].findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'N'}
            type="number"
            value={data[curve][index]?.waterTemperatureCorrection}
            onChange={(e) => {
              const prevData = [...data[curve]];
              prevData[index].waterTemperatureCorrection = parseFloat(e.target.value);
              setData({ step: 5, value: { ...data, [curve]: prevData } });
            }}
          />
        );
      },
    },
    {
      field: 'document',
      headerName: t('asphalt.dosages.superpave.spreadsheet'),
      width: 150,
      valueFormatter: ({ value }) => (value ? `${value}` : ''),
      renderCell: (params) => <RenderCellComponent {...params} curve={curve} data={data} addPlanilha={addPlanilha} />,
    },
  ];

  const generateGroupings = (curve: string): GridColumnGroupingModel => [
    {
      groupId: curve,
      children: [
        { field: 'diammeter' },
        { field: 'dryMass' },
        { field: 'submergedMass' },
        { field: 'drySurfaceSaturatedMass' },
        { field: 'waterTemperatureCorrection' },
        { field: 'document' },
      ],
      headerAlign: 'center',
      headerName: t(`asphalt.dosages.superpave.${curve}-curve`),
    },
  ];

  const handleErase = (curve: string) => {
    try {
      if (data[curve].length > 1) {
        const newRows = [...data[curve]];
        newRows.pop();
        setData({ step: 5, value: { ...data, [curve]: newRows } });
      } else throw t('superpave.error.minReads');
    } catch (error) {
      toast.error(error);
    }
  };

  const handleAdd = (curve: string) => {
    const newRows = [...data[curve]];
    newRows.push({
      id: data[curve].length,
      diammeter: null,
      dryMass: null,
      submergedMass: null,
      drySurfaceSaturatedMass: null,
      waterTemperatureCorrection: null,
    });
    setData({ step: 5, value: { ...data, [curve]: newRows } });
  };

  const ExpansionToolbar = (curve: string) => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem', flexWrap: 'wrap' }}>
        <Button sx={{ color: 'secondaryTons.red' }} onClick={() => handleErase(curve)}>
          {t('erase')}
        </Button>
        <Button sx={{ color: 'secondaryTons.green' }} onClick={() => handleAdd(curve)}>
          {t('add')}
        </Button>
      </Box>
    );
  };

  const onDownload = () => {
    try {
      let spreadSheet;
      if (initialBinderData.turnNumber) {
        switch (initialBinderData.turnNumber.maxN) {
          case 75:
            spreadSheet = 'Superpave Planilha Modelo 75 Giros.xlsx';
            setData({ step: 5, key: 'spreadSheetTemplate', value: 'Modelo75Giros' });
            break;
          case 115:
            spreadSheet = 'Superpave Planilha Modelo 115 Giros.xlsx';
            setData({ step: 5, key: 'spreadSheetTemplate', value: 'Modelo115Giros' });
            break;
          case 160:
            spreadSheet = 'Superpave Planilha Modelo 160 Giros.xlsx';
            setData({ step: 5, key: 'spreadSheetTemplate', value: 'Modelo160Giros' });
            break;
          default:
            spreadSheet = 'Superpave Planilha Modelo 205 Giros.xlsx';
            setData({ step: 5, key: 'spreadSheetTemplate', value: 'Modelo205Giros' });
            break;
        }
      }
      const link = document.createElement('a');
      link.download = spreadSheet;
      link.href = `/superpave-docs/${spreadSheet}`;
      link.click();
    } catch (error) {
      toast.error(t('asphalt.dosages.superpave.file-download-error-toast'));
    }
  };

  /**
   * @function readExcel
   * @description Lê um arquivo Excel (.xlsx) e mapeia as colunas para os nomes que o sistema reconhece
   */
const readExcel = (file, tableName, index, mapping: { giros: string; altura: string }) => {
  const promise = new Promise((resolve, reject) => {
    file = file[0];

    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = (e) => {
      const bufferArray = e.target.result;
      const wb = XLSX.read(bufferArray, { type: 'buffer' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      
      const allData = XLSX.utils.sheet_to_json(ws) as any[];

      // 🎯 DEBUG DETALHADO
      console.log('🟡🟡🟡 DEBUG PLANILHA 🟡🟡🟡');
      console.log('📊 TOTAL LINHAS:', allData.length);
      console.log('📋 PRIMEIRA LINHA:', allData[0]);
      console.log('📋 ÚLTIMA LINHA:', allData[allData.length - 1]);
      console.log('🔍 TODAS AS COLUNAS:', Object.keys(allData[0] || {}));
      console.log('🗺️ MAPEAMENTO USADO:', mapping);

      const mappedData = allData.map((row: any) => {
        const newRow = { ...row };
        
        if (mapping.giros && row[mapping.giros] !== undefined) {
          newRow.N_Giros = row[mapping.giros];
          console.log(`🎯 GIROS: ${row[mapping.giros]} → ${newRow.N_Giros}`);
        }
        if (mapping.altura && row[mapping.altura] !== undefined) {
          newRow.Altura_mm = row[mapping.altura];
          console.log(`📏 ALTURA: ${row[mapping.altura]} → ${newRow.Altura_mm}`);
        }
        
        return newRow;
      });

      console.log('✅ DADOS FINAIS (3 primeiras):', mappedData.slice(0, 3));
      resolve(mappedData);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });

  const prevData = [...data[tableName]];
  prevData[index].document = file.name;

  setData({ step: 5, value: { ...data, [tableName]: prevData } });

  promise.then((d: any[]) => {
    const arrayAux = data[tableName];
    if (initialBinderData.turnNumber) {
      if (initialBinderData.turnNumber.maxN == d.length) {
        arrayAux[index].planilha = d;
        setData({ step: 5, value: { ...data, [tableName]: arrayAux } });
        setStepStatus(t('asphalt.dosages.superpave.processing'));
        toast.success(t('asphalt.dosages.superpave.chosen-sheet-toast'));
      } else {
        setStepStatus('error');
        toast.error(
          `Número de Giros inválido. Para um trânsito ${initialBinderData.turnNumber.tex} é necessário uma Planilha contendo ${initialBinderData.turnNumber.maxN} Giros.`
        );
      }
    } else {
      arrayAux[index].planilha = d;
      setData({ step: 5, value: { ...data, [tableName]: arrayAux } });
      setStepStatus(t('asphalt.dosages.superpave.processing'));
      toast.success(t('asphalt.dosages.superpave.chosen-sheet-toast'));
    }
  });
};

  /**
   * @function getAvailableColumns
   * @description Obtém as colunas disponíveis no arquivo Excel
   */
  const getAvailableColumns = (file: FileList): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file[0]);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: 'buffer' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const sampleData = XLSX.utils.sheet_to_json(ws, { header: 1, range: 'A1:Z1' });

        const columns = (sampleData[0] as string[]) || [];
        console.log('🔍 COLUNAS DETECTADAS:', columns);
        resolve(columns);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const addPlanilha = async (tableName, index, e) => {
    const file = e.target.files;

    if (!file || file.length === 0) return;

    try {
      // Primeiro, obter as colunas disponíveis
      const columns = await getAvailableColumns(file);
      setAvailableColumns(columns);
      
      // Resetar o mapeamento
      setColumnMapping({
        giros: columns[0] || '', // Primeira coluna como giros por padrão
        altura: columns[1] || ''  // Segunda coluna como altura por padrão
      });
      
      setCurrentFile({ file, tableName, index });
      setColumnModalIsOpen(true);
    } catch (error) {
      toast.error('Erro ao ler o arquivo');
      console.error('Erro:', error);
    }
  };

  const handleColumnMappingConfirm = () => {
    if (currentFile && columnMapping.giros && columnMapping.altura) {
      readExcel(currentFile.file, currentFile.tableName, currentFile.index, columnMapping);
      setColumnModalIsOpen(false);
      setCurrentFile(null);
    } else {
      toast.error('Selecione as colunas para Giros e Altura');
    }
  };

  const calculateRiceTest = (curve: string) => {
    toast.promise(
      async () => {
        try {
          const riceTestData = data.riceTest.find((item) => item.curve === curve);
          const calculatedGmm = await superpave.calculateGmm_RiceTest(riceTestData);

          const updatedRiceTest = data.riceTest.map((item) =>
            item.curve === curve ? { ...item, gmm: calculatedGmm } : item
          );
          setData({ step: 5, key: 'riceTest', value: updatedRiceTest });

          const updatedMaximumDensity = {
            ...data.maximumDensity,
            [curve]: { ...data.maximumDensity[curve], gmm: calculatedGmm },
          };
          setData({ step: 5, key: 'maximumDensity', value: updatedMaximumDensity });

          setRiceTestModalIsOpen(false);
        } catch (error) {
          throw error;
        }
      },
      {
        pending: t('loading.materials.pending'),
        success: t('asphalt.dosages.superpave.rice-test-success-toast'),
        error: t('asphalt.dosages.superpave.rice-test-error-toast'),
      }
    );
  };

  const showRiceTestModal = (curve: string) => {
    const riceTestData = [...data.riceTest];

    const existingCurveIndex = riceTestData.findIndex((item) => item.curve === curve);

    if (existingCurveIndex === -1) {
      const newCurveData = {
        curve,
        drySampleMass: null,
        waterSampleMass: null,
        waterSampleContainerMass: null,
        gmm: null,
        temperatureOfWater: null,
      };

      riceTestData.push(newCurveData);
    }

    setData({ step: 5, key: 'riceTest', value: riceTestData });
    setActualCurve(curve);
    setRiceTestModalIsOpen(true);
  };

  useEffect(() => {
    const isRiceTestFinished =
      data.riceTest &&
      Array.isArray(data.riceTest) &&
      data.riceTest.length > 0 &&
      data.riceTest.every(({ gmm }) => gmm !== 0 && gmm !== null);

    const isCurvesComplete =
      data.riceTest &&
      Array.isArray(data.riceTest) &&
      data.riceTest.length === granulometryCompositionData.chosenCurves.length;

    const hasSpreadsheetForAllCurves = granulometryCompositionData.chosenCurves.every((curve) => {
      const curveName = curve === 'lower' ? 'inferiorRows' : curve === 'average' ? 'intermediariaRows' : 'superiorRows';
      return data[curveName]?.some((row) => row.document && row.document !== '');
    });

    setNextDisabled(!(isRiceTestFinished && isCurvesComplete && hasSpreadsheetForAllCurves));
  }, [
    data.inferiorRows,
    data.intermediariaRows,
    data.riceTest,
    data.superiorRows,
    granulometryCompositionData.chosenCurves,
  ]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '50px',
            }}
          >
            <Button
              variant="contained"
              onClick={onDownload}
              sx={{
                width: 'fit-content',
                display: 'flex',
                marginX: 'auto',
                color: 'white',
              }}
            >
              {t('asphalt.dosages.superpave.model-sheet')}
            </Button>

            {granulometryCompositionData.chosenCurves.map((curve, index) => {
              const curveName =
                curve === 'lower' ? 'inferiorRows' : curve === 'average' ? 'intermediariaRows' : 'superiorRows';
              return (
                <Box key={index}>
                  <DataGrid
                    columns={generateColumns(curveName).map((column) => ({
                      ...column,
                      disableColumnMenu: true,
                      sortable: false,
                      align: 'center',
                      headerAlign: 'center',
                      minWidth: 100,
                      flex: 1,
                    }))}
                    rows={curve === 'lower' ? inferiorRows : curve === 'average' ? intermediariaRows : superiorRows}
                    columnGroupingModel={generateGroupings(curve)}
                    experimentalFeatures={{ columnGrouping: true }}
                    density="comfortable"
                    disableColumnMenu
                    disableColumnSelector
                    slots={{ footer: () => ExpansionToolbar(curveName) }}
                  />
                </Box>
              );
            })}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '2rem', marginY: '2rem' }}>
            <Typography variant="h5" sx={{ textAlign: 'center' }}>
              {t('asphalt.dosages.superpave.measured-max-density')}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
              {granulometryCompositionData.chosenCurves.map((curve) => {
                return (
                  <Box
                    key={curve}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      alignItems: 'center',
                      gap: '2rem',
                    }}
                  >
                    <Typography>{t(`asphalt.dosages.superpave.${curve}-curve`)}</Typography>
                    <Button onClick={() => showRiceTestModal(curve)} variant="outlined">
                      {t('asphalt.dosages.superpave.calculate-max-density')}
                    </Button>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Modal para MAPEAMENTO de colunas - CORRIGIDO */}
          <ModalBase
            title="Mapear Colunas da Planilha"
            leftButtonTitle={t('materials.template.cancel')}
            rightButtonTitle={t('asphalt.dosages.superpave.confirm')}
            onCancel={() => {
              setColumnModalIsOpen(false);
              setCurrentFile(null);
            }}
            open={columnModalIsOpen}
            size={'medium'}
            onSubmit={handleColumnMappingConfirm}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '3rem', width: '100%' }}>
              <Typography variant="h6" sx={{ textAlign: 'center' }}>
                Selecione qual coluna corresponde a cada dado:
              </Typography>

              <FormControl fullWidth>
                <InputLabel>Coluna de Número de Giros</InputLabel>
                <Select
                  value={columnMapping.giros}
                  label="Coluna de Número de Giros"
                  onChange={(e) => setColumnMapping(prev => ({ ...prev, giros: e.target.value }))}
                >
                  <MenuItem value="">Selecione uma coluna</MenuItem>
                  {availableColumns.map((column) => (
                    <MenuItem key={column} value={column}>
                      {column}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Coluna de Altura (mm)</InputLabel>
                <Select
                  value={columnMapping.altura}
                  label="Coluna de Altura (mm)"
                  onChange={(e) => setColumnMapping(prev => ({ ...prev, altura: e.target.value }))}
                >
                  <MenuItem value="">Selecione uma coluna</MenuItem>
                  {availableColumns.map((column) => (
                    <MenuItem key={column} value={column}>
                      {column}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  <strong>Como funciona:</strong><br/>
                  1. Selecione qual coluna da sua planilha contém o <strong>Número de Giros</strong><br/>
                  2. Selecione qual coluna contém a <strong>Altura em mm</strong><br/>
                  3. O sistema irá renomear essas colunas para os nomes que ele reconhece
                </Typography>
              </Box>

              {columnMapping.giros && columnMapping.altura && (
                <Typography variant="body2" color="primary" sx={{ textAlign: 'center' }}>
                  ✅ Mapeamento: <strong>{columnMapping.giros}</strong> → N_Giros | <strong>{columnMapping.altura}</strong> → Altura_mm
                </Typography>
              )}
            </Box>
          </ModalBase>

          {/* Modal do Rice Test (existente) */}
          <ModalBase
            title={t('asphalt.dosages.superpave.calculate-rice-test')}
            leftButtonTitle={t('materials.template.cancel')}
            rightButtonTitle={t('asphalt.dosages.superpave.confirm')}
            onCancel={() => {
              const prevData = [...data.riceTest];
              const index = prevData.findIndex((obj) => obj.curve === actualCurve);
              prevData.splice(index, 1);
              setData({ step: 5, key: 'riceTest', value: prevData });
              setRiceTestModalIsOpen(false);
            }}
            open={riceTestModalIsOpen}
            size={'larger'}
            onSubmit={() => {
              calculateRiceTest(data.riceTest.find((obj) => obj.curve === actualCurve)?.curve);
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
              <InputEndAdornment
                adornment=""
                type="number"
                label={t('asphalt.dosages.superpave.insert-gmm')}
                sx={{ width: '50%' }}
                value={data.riceTest?.find((obj) => obj.curve === actualCurve)?.gmm}
                onChange={(e) => {
                  const value = e.target.value;
                  const prevData = [...data.riceTest];
                  const index = prevData.findIndex((obj) => obj.curve === actualCurve);
                  const newData = { ...prevData[index], gmm: parseFloat(value) };
                  prevData[index] = newData;
                  setData({ step: 5, value: { ...data, riceTest: prevData } });
                }}
              />

              <Box id="riceTestInputs" sx={{ display: 'flex', flexDirection: 'row', gap: '2rem', width: '100%' }}>
                {generateRiceTestInputs(actualCurve).map((input) => (
                  <InputEndAdornment
                    key={input.key}
                    adornment={input.adornment}
                    label={input.label}
                    value={input.value}
                    type="number"
                    fullWidth
                    onChange={(e) => {
                      const value = e.target.value;
                      const prevData = [...data.riceTest];
                      const index = prevData.findIndex((obj) => obj.curve === actualCurve);
                      const newData = { ...prevData[index], [input.key]: Number(value) };
                      prevData[index] = newData;
                      setData({ step: 5, value: { ...data, riceTest: prevData } });
                    }}
                  />
                ))}
              </Box>

              <DropDown
                key={'water'}
                variant="standard"
                label={t('asphalt.dosages.superpave.water-temperature-dropdown')}
                options={waterTemperatureList}
                value={{
                  value: data.riceTest?.find((obj) => obj.curve === actualCurve)?.temperatureOfWater,
                  label: '',
                }}
                callback={(selectedValue) => {
                  const prevData = [...data.riceTest];
                  const index = prevData.findIndex((obj) => obj.curve === actualCurve);
                  const newData = { ...prevData[index], temperatureOfWater: Number(selectedValue) };
                  prevData[index] = newData;
                  setData({ step: 5, value: { ...data, riceTest: prevData } });
                }}
                sx={{ width: '50%' }}
              />
            </Box>
          </ModalBase>
        </>
      )}
    </>
  );
};

export default Superpave_Step6_FirstCompaction;