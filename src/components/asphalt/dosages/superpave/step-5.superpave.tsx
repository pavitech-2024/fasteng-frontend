import DropDown from '@/components/atoms/inputs/dropDown';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import Loading from '@/components/molecules/loading';
import ModalBase from '@/components/molecules/modals/modal';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';
import { t } from 'i18next';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

const Superpave_Step5 = ({
  nextDisabled,
  setNextDisabled,
  superpave,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    materialSelectionData,
    granulometryCompositionData,
    initialBinderData,
    firstCompressionData: data,
    setData,
  } = useSuperpaveStore();

  const [stepStatus, setStepStatus] = useState('');
  const [riceTestModalIsOpen, setRiceTestModalIsOpen] = useState(false);
  //Water temperature list;
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
  const waterTemperatureList = [];

  const formatedWaterTempList = Object.keys(list).forEach((key) => {
    waterTemperatureList.push({
      label: key,
      value: list[key],
    });
  });

  // const documentName = {
  //   inferior: data.inferiorRows[0].document,
  //   intermediaria: data.intermediariaRows[0].document,
  //   superior: data.superiorRows[0].document,
  // };

  const { user } = useAuth();

  const [inferiorRows, setInferiorRows] = useState([]);
  const [intermediariaRows, setIntermediariaRows] = useState([]);
  const [superiorRows, setSuperiorRows] = useState([]);
  const [actualCurve, setActualCurve] = useState('');

  const generateRiceTestInputs = (curve: string) => [
    {
      key: 'drySampleMass',
      label: 'Massa da amostra seca em ar',
      adornment: 'g',
      value: data.riceTest?.find((obj) => obj.curve === curve)
        ? data.riceTest.find((obj) => obj.curve === curve).drySampleMass
        : null,
    },
    {
      key: 'waterSampleContainerMass',
      label: 'Massa do recipiente + água',
      adornment: 'g',
      value: data.riceTest.find((obj) => obj.curve === curve)
        ? data.riceTest.find((obj) => obj.curve === curve).waterSampleContainerMass
        : null,
    },
    {
      key: 'waterSampleMass',
      label: 'Massa do recipiente + amostra + água',
      adornment: 'g',
      value: data.riceTest.find((obj) => obj.curve === curve)
        ? data.riceTest.find((obj) => obj.curve === curve).waterSampleMass
        : null,
    },
  ];

  useEffect(() => {
    if (data.inferiorRows.length !== inferiorRows.length) {
      setInferiorRows(data.inferiorRows);
    }
    if (data.intermediariaRows.length !== intermediariaRows.length) {
      setIntermediariaRows(data.intermediariaRows);
    }
    if (data.superiorRows.length !== superiorRows.length) {
      setSuperiorRows(data.superiorRows);
    }
  }, [data]);

  useEffect(() => {
    let prevData = [...data.riceTest];

    if (granulometryCompositionData.chosenCurves.lower) {
      if (!prevData.some((obj) => obj.curve === 'lower')) {
        if (prevData.some((obj) => obj.curve === null)) {
          let index = prevData.findIndex((obj) => obj.curve === null);
          prevData[index] = { ...prevData[index], curve: 'lower' };
        } else {
          const newData = { ...prevData[0], curve: 'lower' };
          prevData.push(newData);
        }
        setData({ step: 4, value: { ...data, riceTest: prevData } });
      }
    }

    if (granulometryCompositionData.chosenCurves.average) {
      if (!prevData.some((obj) => obj.curve === 'average')) {
        if (prevData.some((obj) => obj.curve === null)) {
          let index = prevData.findIndex((obj) => obj.curve === null);
          prevData[index] = { ...prevData[index], curve: 'average' };
        } else {
          const newData = { ...prevData[0], curve: 'average' };
          prevData.push(newData);
        }
        setData({ step: 4, value: { ...data, riceTest: prevData } });
      }
    }

    if (granulometryCompositionData.chosenCurves.higher) {
      if (!prevData.some((obj) => obj.curve === 'higher')) {
        if (prevData.some((obj) => obj.curve === null)) {
          let index = prevData.findIndex((obj) => obj.curve === null);
          prevData[index] = { ...prevData[index], curve: 'higher' };
        } else {
          const newData = { ...prevData[0], curve: 'higher' };
          prevData.push(newData);
        }
        setData({ step: 4, value: { ...data, riceTest: prevData } });
      }
    }
  }, [granulometryCompositionData.chosenCurves]);

  const generateColumns = (curve: string): GridColDef[] => [
    {
      field: 'diammeter',
      headerName: 'Diâmetro',
      width: 100,
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data[curve].findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type="text"
            value={data[curve][index].diammeter}
            onChange={(e) => {
              let prevData = [...data[curve]];
              prevData[index].diammeter = Number(e.target.value);
              setData({ step: 4, value: { ...data, [curve]: prevData } });
            }}
          />
        );
      },
    },
    {
      field: 'dryMass',
      headerName: 'Massa seca (g)',
      width: 150,
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data[curve].findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type="text"
            value={data[curve][index].dryMass}
            onChange={(e) => {
              let prevData = [...data[curve]];
              prevData[index].dryMass = Number(e.target.value);
              setData({ step: 4, value: { ...data, [curve]: prevData } });
            }}
          />
        );
      },
    },
    {
      field: 'submergedMass',
      headerName: 'Massa submersa (g)',
      width: 150,
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data[curve].findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type="text"
            value={data[curve][index].submergedMass}
            onChange={(e) => {
              let prevData = [...data[curve]];
              prevData[index].submergedMass = Number(e.target.value);
              setData({ step: 4, value: { ...data, [curve]: prevData } });
            }}
          />
        );
      },
    },
    {
      field: 'drySurfaceSaturatedMass',
      headerName: 'Massa saturada com superfície seca (g)',
      width: 210,
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data[curve].findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type="text"
            value={data[curve][index].drySurfaceSaturatedMass}
            onChange={(e) => {
              let prevData = [...data[curve]];
              prevData[index].drySurfaceSaturatedMass = Number(e.target.value);
              setData({ step: 4, value: { ...data, [curve]: prevData } });
            }}
          />
        );
      },
    },
    {
      field: 'waterTemperatureCorrection',
      headerName: 'Fator de correção da temperatura da água (N)',
      width: 210,
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data[curve].findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type="text"
            value={data[curve][index].waterTemperatureCorrection}
            onChange={(e) => {
              let prevData = [...data[curve]];
              prevData[index].waterTemperatureCorrection = Number(e.target.value);
              setData({ step: 4, value: { ...data, [curve]: prevData } });
            }}
          />
        );
      },
    },
    {
      field: 'document',
      headerName: 'Planilha (.xlsx)',
      width: 150,
      valueFormatter: ({ value }) => (value ? `${value}` : ''),
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data[curve].findIndex((r) => r.id === id);
        const fileInputRef = useRef(null);
        return (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Button
                onClick={() => fileInputRef.current.click()}
                variant="contained"
                sx={{ display: { xl: 'none', xs: 'block' }, color: 'white' }}
              >
                Upload
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(e) => addPlanilha(curve, index, e)}
              />
              <Typography sx={{ textAlign: 'center' }}>
                {data[curve][index]?.planilha ? 'Selecionado' : `Vazio`}
              </Typography>
            </Box>
          </>
        );
      },
    },
  ];

  const inferiorGroupings: GridColumnGroupingModel = [
    {
      groupId: `Curva inferior`,
      children: [
        { field: 'diammeter' },
        { field: 'dryMass' },
        { field: 'submergedMass' },
        { field: 'drySurfaceSaturatedMass' },
        { field: 'waterTemperatureCorrection' },
      ],
      headerAlign: 'center',
      headerName: `Curva inferior`,
    },
  ];

  const intermediariaGroupings: GridColumnGroupingModel = [
    {
      groupId: `Curva intermediaria`,
      children: [
        { field: 'diammeter' },
        { field: 'dryMass' },
        { field: 'submergedMass' },
        { field: 'drySurfaceSaturatedMass' },
        { field: 'waterTemperatureCorrection' },
      ],
      headerAlign: 'center',
      headerName: `Curva intermediaria`,
    },
  ];

  const superiorGroupings: GridColumnGroupingModel = [
    {
      groupId: `Curva superior`,
      children: [
        { field: 'diammeter' },
        { field: 'height' },
        { field: 'dryMass' },
        { field: 'submergedMass' },
        { field: 'drySurfaceSaturatedMass' },
        { field: 'waterTemperatureCorrection' },
      ],
      headerAlign: 'center',
      headerName: `Curva superior`,
    },
  ];

  const handleErase = (curve: string) => {
    try {
      if (data[curve].length > 1) {
        const newRows = [...data[curve]];
        newRows.pop();
        setData({ step: 4, value: { ...data, [curve]: newRows } });
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
    setData({ step: 4, value: { ...data, [curve]: newRows } });
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
            setData({ step: 4, key: 'spreadSheetTemplate', value: 'Modelo75Giros' });
            break;
          case 115:
            spreadSheet = 'Superpave Planilha Modelo 115 Giros.xlsx';
            setData({ step: 4, key: 'spreadSheetTemplate', value: 'Modelo115Giros' });
            break;
          case 160:
            spreadSheet = 'Superpave Planilha Modelo 160 Giros.xlsx';
            setData({ step: 4, key: 'spreadSheetTemplate', value: 'Modelo160Giros' });
            break;
          default:
            spreadSheet = 'Superpave Planilha Modelo 205 Giros.xlsx';
            setData({ step: 4, key: 'spreadSheetTemplate', value: 'Modelo205Giros' });
            break;
        }
      }
      const link = document.createElement('a');
      link.download = spreadSheet;
      link.href = `/superpave-docs/${spreadSheet}`;
      link.click();
    } catch (error) {
      console.error('Erro ao baixar o arquivo:', error);
    }
  };

  const readExcel = (file, tableName, index) => {
    const promise = new Promise((resolve, reject) => {
      file = file[0];
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: 'buffer' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d: any[]) => {
      let arrayAux = data[tableName];
      if (initialBinderData.turnNumber) {
        if (initialBinderData.turnNumber.maxN == d.length) {
          arrayAux[index].planilha = d;
          setData({ step: 4, value: { ...data, [tableName]: arrayAux } });
          setStepStatus('process');
          toast.success('Planilha Escolhida');
        } else {
          setStepStatus('error');
          toast.error(
            `Número de Giros inválido. Para um trânsito ${initialBinderData.turnNumber.tex} é necessário uma Planilha contendo ${initialBinderData.turnNumber.maxN} Giros.`
          );
        }
      } else {
        arrayAux[index].planilha = d;
        setData({ step: 4, value: { ...data, [tableName]: arrayAux } });
        setStepStatus('process');
        toast.success('Planilha Escolhida');
      }
    });
  };

  const addPlanilha = (tableName, index, e) => {
    const file = e.target.files;

    readExcel(file, tableName, index);
  };

  const calculateRiceTest = () => {
    toast.promise(
      async () => {
        try {
          const response = await superpave.calculateGmm(data);
          console.log("🚀 ~ response:", response)

          if (response.lower !== 0) {
            let index = data.riceTest.findIndex((e) => e.curve === 'lower');
            let arr = [...data.riceTest];
            arr[index].gmm = response.lower.gmm;
            setData({ step: 4, value: {...data, riceTest: arr}})
          }

          if (response.average !== 0) {
            let index = data.riceTest.findIndex((e) => e.curve === 'average');
            let arr = [...data.riceTest];
            arr[index].gmm = response.average.gmm;
            setData({ step: 4, value: {...data, riceTest: arr}})
          }

          if (response.higher !== 0) {
            let index = data.riceTest.findIndex((e) => e.curve === 'higher');
            let arr = [...data.riceTest];
            arr[index].gmm = response.higher.gmm;
            setData({ step: 4, value: {...data, riceTest: arr}})
          }

          setRiceTestModalIsOpen(false);
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
  };

  const showModal = (curve: string) => {
    let prevData = [...data.riceTest];

    if (!prevData.find((obj) => obj.curve === curve)) {
      if (prevData.some((obj) => obj.curve === null)) {
        let index = prevData.findIndex((obj) => obj.curve === null);
        prevData[index] = { ...prevData[index], curve: curve };
      } else {
        const newData = { ...prevData[0], curve: curve };
        prevData.push(newData);
      }

      setData({ step: 4, value: { ...data, riceTest: prevData } });
    }

    setActualCurve(curve);
    setRiceTestModalIsOpen(true);
  };

  nextDisabled && setNextDisabled(false);

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
              Planilha Modelo
            </Button>

            {granulometryCompositionData.chosenCurves.lower && (
              <DataGrid
                key="inferior"
                columns={generateColumns('inferiorRows')}
                rows={inferiorRows}
                columnGroupingModel={inferiorGroupings}
                experimentalFeatures={{ columnGrouping: true }}
                density="comfortable"
                disableColumnMenu
                disableColumnSelector
                slots={{ footer: () => ExpansionToolbar('inferiorRows') }}
              />
            )}

            {granulometryCompositionData.chosenCurves.average && (
              <DataGrid
                key="intermediaria"
                columns={generateColumns('intermediariaRows')}
                rows={intermediariaRows}
                columnGroupingModel={intermediariaGroupings}
                experimentalFeatures={{ columnGrouping: true }}
                density="comfortable"
                disableColumnMenu
                disableColumnSelector
                slots={{ footer: () => ExpansionToolbar('intermediariaRows') }}
              />
            )}

            {granulometryCompositionData.chosenCurves.higher && (
              <DataGrid
                key="superior"
                columns={generateColumns('superiorRows')}
                rows={superiorRows}
                columnGroupingModel={superiorGroupings}
                experimentalFeatures={{ columnGrouping: true }}
                density="comfortable"
                disableColumnMenu
                disableColumnSelector
                slots={{ footer: () => ExpansionToolbar('superiorRows') }}
              />
            )}

            {/* <Button onClick={setVolumetricParams}>Confirmar</Button> */}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '2rem', marginY: '2rem' }}>
            <Typography sx={{ textAlign: 'center' }}>Densidade máxima medida</Typography>

            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
              {granulometryCompositionData.chosenCurves.lower && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    alignItems: 'center',
                    gap: '2rem',
                  }}
                >
                  <Typography>Curva inferior</Typography>
                  <Button onClick={() => showModal('lower')} variant="outlined">
                    Calcular denasidade máxima
                  </Button>
                </Box>
              )}

              {granulometryCompositionData.chosenCurves.average && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    alignItems: 'center',
                    gap: '2rem',
                  }}
                >
                  <Typography>Curva intermediaria</Typography>
                  <Button onClick={() => showModal('average')} variant="outlined">
                    Calcular denasidade máxima
                  </Button>
                </Box>
              )}

              {granulometryCompositionData.chosenCurves.higher && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    alignItems: 'center',
                    gap: '2rem',
                  }}
                >
                  <Typography>Curva superior</Typography>
                  <Button onClick={() => showModal('higher')} variant="outlined">
                    Calcular denasidade máxima
                  </Button>
                </Box>
              )}
            </Box>
          </Box>

          <ModalBase
            title={'Calcular por Rice Test'}
            leftButtonTitle={'cancelar'}
            rightButtonTitle={'confirmar'}
            onCancel={() => setRiceTestModalIsOpen(false)}
            open={riceTestModalIsOpen}
            size={'large'}
            onSubmit={() => {
              calculateRiceTest();
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <InputEndAdornment
                adornment=""
                label="Inserir Gmm"
                sx={{ width: '20rem' }}
                value={data.riceTest?.find((obj) => obj.curve === actualCurve)?.gmm}
                onChange={(e) => {
                  const value = e.target.value;
                  let prevData = [...data.riceTest];
                  const index = prevData.findIndex((obj) => obj.curve === actualCurve);
                  const newData = { ...prevData[index], gmm: Number(value) };
                  prevData[index] = newData;
                  setData({ step: 4, value: { ...data, riceTest: prevData } });
                }}
              />

              <Box sx={{ display: 'flex', flexDirection: 'row', gap: '2rem' }}>
                {generateRiceTestInputs(actualCurve).map((input) => (
                  <InputEndAdornment
                    adornment={input.adornment}
                    label={input.label}
                    value={input.value}
                    sx={{ width: '15rem' }}
                    onChange={(e) => {
                      const value = e.target.value;
                      let prevData = [...data.riceTest];
                      const index = prevData.findIndex((obj) => obj.curve === actualCurve);
                      const newData = { ...prevData[index], [input.key]: Number(value) };
                      prevData[index] = newData;
                      setData({ step: 4, value: { ...data, riceTest: prevData } });
                    }}
                  />
                ))}
              </Box>

              <DropDown
                key={'water'}
                variant="standard"
                label={'Selecione o fator de correção para a temperatura da água'}
                options={waterTemperatureList}
                callback={(selectedValue) => {
                  let prevData = [...data.riceTest];
                  const index = prevData.findIndex((obj) => obj.curve === actualCurve);
                  const newData = { ...prevData[index], temperatureOfWater: Number(selectedValue) };
                  prevData[index] = newData;
                  setData({ step: 4, value: { ...data, riceTest: prevData } });
                }}
                size="medium"
                sx={{ width: '20rem' }}
              />
            </Box>
          </ModalBase>
        </>
      )}
    </>
  );
};

export default Superpave_Step5;
