import DropDown from '@/components/atoms/inputs/dropDown';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import Loading from '@/components/molecules/loading';
import ModalBase from '@/components/molecules/modals/modal';
import { EssayPageProps } from '@/components/templates/essay';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import RenderCellComponent from './functionalComponents/renderCell';

const Superpave_Step6 = ({
  nextDisabled,
  setNextDisabled,
  superpave,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { granulometryCompositionData, initialBinderData, firstCompressionData: data, setData } = useSuperpaveStore();

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
      value: data.riceTest.find((obj) => obj.curve === curve)
        ? data.riceTest.find((obj) => obj.curve === curve).waterSampleContainerMass
        : null,
    },
    {
      key: 'waterSampleMass',
      label: t('asphalt.dosages.superpave.water-sample-mass'),
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

  // useEffect(() => {
  //   const prevData = [...data.riceTest];

  //   if (granulometryCompositionData.chosenCurves.lower) {
  //     if (!prevData.some((obj) => obj.curve === 'lower')) {
  //       if (prevData.some((obj) => obj.curve === null)) {
  //         const index = prevData.findIndex((obj) => obj.curve === null);
  //         prevData[index] = { ...prevData[index], curve: 'lower' };
  //       } else {
  //         const newData = { ...prevData[0], curve: 'lower' };
  //         prevData.push(newData);
  //       }
  //       setData({ step: 5, value: { ...data, riceTest: prevData } });
  //     }
  //   }

  //   if (granulometryCompositionData.chosenCurves.average) {
  //     if (!prevData.some((obj) => obj.curve === 'average')) {
  //       if (prevData.some((obj) => obj.curve === null)) {
  //         const index = prevData.findIndex((obj) => obj.curve === null);
  //         prevData[index] = { ...prevData[index], curve: 'average' };
  //       } else {
  //         const newData = { ...prevData[0], curve: 'average' };
  //         prevData.push(newData);
  //       }
  //       setData({ step: 5, value: { ...data, riceTest: prevData } });
  //     }
  //   }

  //   if (granulometryCompositionData.chosenCurves.higher) {
  //     if (!prevData.some((obj) => obj.curve === 'higher')) {
  //       if (prevData.some((obj) => obj.curve === null)) {
  //         const index = prevData.findIndex((obj) => obj.curve === null);
  //         prevData[index] = { ...prevData[index], curve: 'higher' };
  //       } else {
  //         const newData = { ...prevData[0], curve: 'higher' };
  //         prevData.push(newData);
  //       }
  //       setData({ step: 5, value: { ...data, riceTest: prevData } });
  //     }
  //   }
  // }, [granulometryCompositionData.chosenCurves]);
  useEffect(() => {
    const prevData = [...data.riceTest];

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
            type="text"
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
            adornment={'cm'}
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
            adornment={'cm'}
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
            adornment={'cm'}
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
            adornment={'cm'}
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

  const addPlanilha = (tableName, index, e) => {
    const file = e.target.files;

    readExcel(file, tableName, index);
  };

  const calculateRiceTest = () => {
    toast.promise(
      async () => {
        try {
          const response = await superpave.calculateGmm(data);

          //todo: tipar esse any
          Object.values(response).forEach((e: any, i) => {
            if (e !== 0) {
              const index = data.riceTest.findIndex((e) => e.curve === Object.keys(response)[i]);
              const arr = [...data.riceTest];
              arr[index].gmm = e.gmm;
              setData({ step: 5, value: { ...data, riceTest: arr } });
            }
          });

          // if (response.lower !== 0) {
          //   const index = data.riceTest.findIndex((e) => e.curve === 'lower');
          //   const arr = [...data.riceTest];
          //   arr[index].gmm = response.lower.gmm;
          //   setData({ step: 5, value: { ...data, riceTest: arr } });
          // }

          // if (response.average !== 0) {
          //   const index = data.riceTest.findIndex((e) => e.curve === 'average');
          //   const arr = [...data.riceTest];
          //   arr[index].gmm = response.average.gmm;
          //   setData({ step: 5, value: { ...data, riceTest: arr } });
          // }

          // if (response.higher !== 0) {
          //   const index = data.riceTest.findIndex((e) => e.curve === 'higher');
          //   const arr = [...data.riceTest];
          //   arr[index].gmm = response.higher.gmm;
          //   setData({ step: 5, value: { ...data, riceTest: arr } });
          // }

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

  const showModal = (curve: string) => {
    const prevData = [...data.riceTest];

    if (!prevData.find((obj) => obj.curve === curve)) {
      if (prevData.some((obj) => obj.curve === null)) {
        const index = prevData.findIndex((obj) => obj.curve === null);
        prevData[index] = { ...prevData[index], curve: curve };
      } else {
        const newData = { ...prevData[0], curve: curve };
        prevData.push(newData);
      }

      setData({ step: 5, value: { ...data, riceTest: prevData } });
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
              {t('asphalt.dosages.superpave.model-sheet')}
            </Button>

            {Object.entries(granulometryCompositionData.chosenCurves).map(([key, value]) => {
              if (value) {
                const curveName =
                  key === 'lower' ? 'inferiorRows' : key === 'average' ? 'intermediariaRows' : 'superiorRows';
                return (
                  <>
                    <DataGrid
                      key={key}
                      columns={generateColumns(curveName).map((column) => ({
                        ...column,
                        disableColumnMenu: true,
                        sortable: false,
                        align: 'center',
                        headerAlign: 'center',
                        minWidth: 100,
                        flex: 1,
                      }))}
                      rows={key === 'lower' ? inferiorRows : key === 'average' ? intermediariaRows : superiorRows}
                      columnGroupingModel={generateGroupings(key)}
                      experimentalFeatures={{ columnGrouping: true }}
                      density="comfortable"
                      disableColumnMenu
                      disableColumnSelector
                      slots={{ footer: () => ExpansionToolbar(curveName) }}
                    />
                  </>
                );
              }
            })}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '2rem', marginY: '2rem' }}>
            <Typography sx={{ textAlign: 'center' }}>{t('asphalt.dosages.superpave.measured-max-density')}</Typography>

            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
              {Object.entries(granulometryCompositionData.chosenCurves).map(([key, value]) => {
                if (value) {
                  return (
                    <Box
                      key={key}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        alignItems: 'center',
                        gap: '2rem',
                      }}
                    >
                      <Typography>{t(`asphalt.dosages.superpave.${key}-curve`)}</Typography>
                      <Button onClick={() => showModal(key)} variant="outlined">
                        {t('asphalt.dosages.superpave.calculate-max-density')}
                      </Button>
                    </Box>
                  );
                }
              })}

              {/* {granulometryCompositionData.chosenCurves.lower && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    alignItems: 'center',
                    gap: '2rem',
                  }}
                >
                  <Typography>{t('asphalt.dosages.superpave.lower-curve')}</Typography>
                  <Button onClick={() => showModal('lower')} variant="outlined">
                    {t('asphalt.dosages.superpave.calculate-max-density')}
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
                  <Typography>{t('asphalt.dosages.superpave.average-curve')}</Typography>
                  <Button onClick={() => showModal('average')} variant="outlined">
                    {t('asphalt.dosages.superpave.calculate-max-density')}
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
                  <Typography>{t('asphalt.dosages.superpave.higher-curve')}</Typography>
                  <Button onClick={() => showModal('higher')} variant="outlined">
                    {t('asphalt.dosages.superpave.calculate-max-density')}
                  </Button>
                </Box>
              )} */}
            </Box>
          </Box>

          <ModalBase
            title={t('asphalt.dosages.superpave.calculate-rice-test')}
            leftButtonTitle={t('asphalt.dosages.superpave.confirm')}
            rightButtonTitle={t('materials.template.cancel')}
            onCancel={() => setRiceTestModalIsOpen(false)}
            open={riceTestModalIsOpen}
            size={'larger'}
            onSubmit={() => {
              calculateRiceTest();
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

              <Box id="riceTestInputs" sx={{ display: 'flex', flexDirection: 'row', gap: '2rem', width: '100%'}}>
                {generateRiceTestInputs(actualCurve).map((input) => (
                  <InputEndAdornment
                    key={input.key}
                    adornment={input.adornment}
                    label={input.label}
                    value={input.value}
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

export default Superpave_Step6;
