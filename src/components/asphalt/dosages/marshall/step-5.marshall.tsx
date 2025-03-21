import DropDown, { DropDownOption } from '@/components/atoms/inputs/dropDown';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import Loading from '@/components/molecules/loading';
import ModalBase from '@/components/molecules/modals/modal';
import { EssayPageProps } from '@/components/templates/essay';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import useMarshallStore, { GmmRows } from '@/stores/asphalt/marshall/marshall.store';
import { Box, Button, styled, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const CustomDataGrid = styled(DataGrid)({
  '& .MuiDataGrid-columnHeaderTitle': {
    whiteSpace: 'normal',
    lineHeight: '1.2',
    textAlign: 'center',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
  },
  '& .MuiDataGrid-columnHeader': {
    whiteSpace: 'normal',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '8px',
  },
});

export type RiceTestRows = {
  id: number;
  teor?: number;
  massOfDrySample: number;
  massOfContainerWaterSample: number;
  massOfContainerWater: number;
};

type GmmTableRows = {
  id: number;
  GMM: number;
  Teor: number;
};

const Marshall_Step5 = ({ setNextDisabled, marshall }: EssayPageProps & { marshall: Marshall_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { materialSelectionData, maximumMixtureDensityData: data, binderTrialData, setData } = useMarshallStore();
  const [enableRiceTest, setEnableRiceTest] = useState(false);
  const [GMMModalIsOpen, setGMMModalIsOpen] = useState(false);
  const [gmmRows, setGmmRows] = useState<GmmTableRows[]>([]);
  const [gmmColumns, setGmmColumns] = useState<GridColDef[]>([]);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [riceTestTableRows, setRiceTestTableRows] = useState<RiceTestRows[]>([]);
  const [riceTestTableColumns, setRiceTestTableColumns] = useState<GridColDef[]>([]);
  const [riceTestModalIsOpen, setRiceTestModalIsOpen] = useState(false);
  const [DMTModalIsOpen, setDMTModalISOpen] = useState(false);
  const materials = materialSelectionData.aggregates;
  const [hasNull, setHasNull] = useState(true);
  const [gmmErrorMsg, setGmmErrorMsg] = useState('');

  // Activated on page render to get the indexes of each material;
  useEffect(() => {
    toast.promise(
      async () => {
        try {
          const response = await marshall.getIndexesOfMissesSpecificGravity(materialSelectionData);

          const newData = {
            ...data,
            missingSpecificMass: response,
          };

          setData({ step: 4, value: newData });

          setLoading(false);
        } catch (error) {
          setLoading(false);
          throw error;
        }
      },
      {
        pending: t('loading.data.pending'),
        success: t('loading.data.success'),
        error: t('loading.data.error'),
      }
    );
  }, []);

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

  // Method option dropdown;
  const calcMethodOptions: DropDownOption[] = [
    { label: 'DMT - Densidade máxima teórica', value: 'DMT - Densidade máxima teórica' },
    { label: 'GMM - Densidade máxima medida', value: 'GMM - Densidade máxima medida' },
  ];

  useEffect(() => {
    function hasNullValue(obj) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] === null) {
          setHasNull(false);
        }
      }
      setHasNull(true);
    }
    hasNullValue(data.maxSpecificGravity);
  }, [data.maxSpecificGravity]);

  const dmtRows = [
    {
      id: 1,
      DMT: data?.maxSpecificGravity?.result?.lessOne?.toFixed(2),
      Teor: binderTrialData.percentsOfDosage[binderTrialData.percentsOfDosage.length - 1][0].value,
    },
    {
      id: 2,
      DMT: data?.maxSpecificGravity?.result?.lessHalf?.toFixed(2),
      Teor: binderTrialData.percentsOfDosage[binderTrialData.percentsOfDosage.length - 1][1].value,
    },
    {
      id: 3,
      DMT: data?.maxSpecificGravity?.result?.normal?.toFixed(2),
      Teor: binderTrialData.percentsOfDosage[binderTrialData.percentsOfDosage.length - 1][2].value,
    },
    {
      id: 4,
      DMT: data?.maxSpecificGravity?.result?.plusHalf?.toFixed(2),
      Teor: binderTrialData.percentsOfDosage[binderTrialData.percentsOfDosage.length - 1][3].value,
    },
    {
      id: 5,
      DMT: data?.maxSpecificGravity?.result?.plusOne?.toFixed(2),
      Teor: binderTrialData.percentsOfDosage[binderTrialData.percentsOfDosage.length - 1][4].value,
    },
  ];

  const dmtColumns: GridColDef[] = [
    {
      field: 'Teor',
      headerName: t('asphalt.dosages.marshall.tenor'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'DMT',
      headerName: 'DMT',
      valueFormatter: ({ value }) => `${value}`,
    },
  ];

  const handleSubmitDmt = async () => {
    setSelectedMethod('DMT');
    toast.promise(
      async () => {
        try {
          const dmt = await marshall.calculateMaximumMixtureDensityDMT(materialSelectionData, binderTrialData, data);
          const prevData = data;

          const newData = {
            ...prevData,
            maxSpecificGravity: {
              result: dmt.maxSpecificGravity,
              method: dmt.method,
            },
            listOfSpecificGravities: dmt.listOfSpecificGravities,
          };

          setData({ step: 4, value: newData });
          setDMTModalISOpen(false);
        } catch (error) {
          throw error;
        }
      },
      {
        pending: t('loading.data.pending'),
        success: t('loading.data.success'),
        error: t('loading.data.error'),
      }
    );
  };

  const handleGmmOnChange = (index: number, value: string) => {
    if (value === null) return;

    const newState = [...data.gmm];
    const newValue = Number(value);

    if (newState[index].value !== null) {
      // If the input field already has a value, update it
      newState[index] = { ...newState[index], value: newValue };
    } else {
      // If the input field is new, add it to the gmmRows waterTemperatureList
      newState.splice(index, 0, { id: index + 1, insert: true, value: newValue });
    }

    const updatedRows = gmmRows.map((row) => {
      if (row.id === index + 1) {
        return { ...row, GMM: newValue };
      }
      return row;
    });

    // Update gmmRows directly
    setGmmRows(updatedRows);

    // Create a new copy of the state object with the updated gmmRows waterTemperatureList
    setData({ step: 4, value: { ...data, gmm: newState } });
  };

  //Activated when gmm method is selected
  const handleSelectGMM = () => {
    setGMMModalIsOpen(false);
    setSelectedMethod('GMM');
  };

  // Creates the gmm method rows and columns
  useEffect(() => {
    if (selectedMethod === 'GMM') {
      const gmmRows: GmmTableRows[] = [];

      for (let i = 0; i < data.gmm.length; i++) {
        gmmRows.push({
          id: i + 1,
          GMM: data?.gmm[i].value,
          Teor: binderTrialData.percentsOfDosage[2][i]?.value,
        });
      }

      setGmmRows(gmmRows);

      const hasNull = data?.riceTest.some((obj) => Object.values(obj).some((value) => value === null));

      if (hasNull) {
        setGmmColumns([
          {
            field: 'Teor',
            headerName: t('asphalt.dosages.marshall.tenor'),
            valueFormatter: ({ value }) => `${value}`,
          },
          {
            field: 'GMM',
            headerName: 'GMM',
            renderCell: ({ row }) => {
              const { id } = row;
              const index = data?.gmm?.findIndex((r) => r.id === id);
              return (
                <InputEndAdornment
                  adornment={''}
                  type="number"
                  value={gmmRows[index]?.GMM}
                  onChange={(e) => {
                    handleGmmOnChange(index, e.target.value);
                  }}
                />
              );
            },
          },
        ]);
      } else {
        const formattedGmm2 = Object.values(data?.maxSpecificGravity).map((item, idx) => {
          return {
            id: idx + 1,
            Teor: binderTrialData.percentsOfDosage[2][idx],
            GMM: gmmRows[idx]?.GMM,
          };
        });
        setGmmColumns([
          {
            field: 'Teor',
            headerName: 'Teor',
            valueFormatter: ({ value }) => `${value}`,
          },
          {
            field: 'GMM',
            headerName: 'GMM',
            valueFormatter: ({ value }) => `${value}`,
          },
        ]);
      }
    }
  }, [selectedMethod, data.gmm]);

  // Format the gmmRows for the store data structure
  useEffect(() => {
    const gmmValuesToStore = gmmRows.map((item) => ({
      id: item.id,
      insert: item.GMM !== null,
      value: item.GMM,
    }));

    setData({ step: 4, value: { ...data, gmm: gmmValuesToStore } });
  }, [gmmRows]);

  const calculateGmmData = () => {
    toast.promise(
      async () => {
        if (data.temperatureOfWater === null) {
          const error = 'errors.empty-water-temperature';
          setGmmErrorMsg(error);
          throw new Error(error);
        } else {
          try {
            const gmm = await marshall.calculateGmmData(materialSelectionData, data);

            const newData = {
              ...data,
              listOfSpecificGravities: gmm.listOfSpecificGravities,
              maxSpecificGravity: {
                results: gmm.maxSpecificGravity,
                method: gmm.method,
              },
            };

            setData({ step: 4, value: newData });

            const newGmmRows = gmmRows.map((item) => {
              if (item.id === 1) item.GMM = gmm.maxSpecificGravity.lessOne;
              if (item.id === 2) item.GMM = gmm.maxSpecificGravity.lessHalf;
              if (item.id === 3) item.GMM = gmm.maxSpecificGravity.normal;
              if (item.id === 4) item.GMM = gmm.maxSpecificGravity.plusHalf;
              if (item.id === 5) item.GMM = gmm.maxSpecificGravity.plusOne;
              return item;
            });

            setGmmRows(newGmmRows);
          } catch (error) {
            const message = error.message === 'errors.empty-water-temperature' ? error.message : 'errors.general';
            setGmmErrorMsg(message);
            throw new Error(message);
          }
        }
      },
      {
        pending: t('loading.data.pending'),
        success: t('loading.data.success'),
        error: t(`${gmmErrorMsg}`),
      }
    );
  };

  const calculateRiceTest = () => {
    let errorMsg = ''; // Inicializar errorMsg para garantir que nunca seja undefined
    let errorIndex;

    // Validações
    const hasNullValues = data.riceTest.some((tenor, idx) => {
      // Verifica se algum valor dentro do objeto tenor é null ou menor que 1
      const isInvalid = Object.values(tenor).some((value) => value === null || value < 1);
      if (isInvalid) {
        errorIndex = idx; // Atualiza o índice do erro
      }
      return isInvalid; // Retorna true se algum valor for inválido
    });

    const valuesAreValid = data.riceTest.find(
      (tenor) =>
        tenor.massOfDrySample > tenor.massOfContainerWater ||
        tenor.massOfDrySample > tenor.massOfContainerWaterSample ||
        tenor.massOfContainerWater > tenor.massOfContainerWaterSample
    );

    if (hasNullValues) {
      errorMsg = 'errors.rice-test-empty-fields';
    }
    if (
      errorMsg === '' &&
      valuesAreValid &&
      (valuesAreValid.massOfDrySample > valuesAreValid.massOfContainerWater ||
        valuesAreValid.massOfDrySample > valuesAreValid.massOfContainerWaterSample)
    ) {
      errorMsg = 'errors.invalid-gmm-mass-value';
    }
    if (
      errorMsg === '' &&
      valuesAreValid &&
      valuesAreValid.massOfContainerWater > valuesAreValid.massOfContainerWaterSample
    ) {
      errorMsg = 'errors.invalid-gmm-container-mass-value';
    }

    toast.promise(
      async () => {
        if (errorMsg === '') {
          try {
            const riceTest = await marshall.calculateRiceTest(data);
            const prevData = data;
            const newData = {
              ...prevData,
              ...riceTest,
            };

            setRiceTestModalIsOpen(false);

            const formattedGmm = riceTest?.maxSpecificGravity.map((item) => {
              return {
                id: item.id,
                Teor: item.Teor,
                GMM: item.GMM,
              };
            });

            setGmmRows(formattedGmm);
            setData({ step: 4, value: newData });
            // setLoading(false);
          } catch (error) {
            errorMsg = error.message || 'errors.general';
            throw new Error(errorMsg);
          }
        } else {
          throw new Error(errorMsg);
        }
      },
      {
        pending: t('loading.data.pending'),
        success: t('loading.data.success'),
        error: t('errors.rice-test-empty-fields') + `${binderTrialData.percentsOfDosage[2][errorIndex]}%`,
      }
    );
  };

  useEffect(() => {
    if (data.riceTest && data.riceTest?.length > 0) {
      const newRiceTestRows = [
        {
          id: 1,
          teor: binderTrialData.percentsOfDosage[2][0].value,
          massOfDrySample: data?.riceTest[0]?.massOfDrySample,
          massOfContainerWaterSample: data?.riceTest[0]?.massOfContainerWaterSample,
          massOfContainerWater: data?.riceTest[0]?.massOfContainerWater,
        },
        {
          id: 2,
          teor: binderTrialData.percentsOfDosage[2][1].value,
          massOfDrySample: data?.riceTest[1]?.massOfDrySample,
          massOfContainerWaterSample: data?.riceTest[1]?.massOfContainerWaterSample,
          massOfContainerWater: data?.riceTest[1]?.massOfContainerWater,
        },
        {
          id: 3,
          teor: binderTrialData.percentsOfDosage[2][2].value,
          massOfDrySample: data?.riceTest[2]?.massOfDrySample,
          massOfContainerWaterSample: data?.riceTest[2]?.massOfContainerWaterSample,
          massOfContainerWater: data?.riceTest[2]?.massOfContainerWater,
        },
        {
          id: 4,
          teor: binderTrialData.percentsOfDosage[2][3].value,
          massOfDrySample: data?.riceTest[3]?.massOfDrySample,
          massOfContainerWaterSample: data?.riceTest[3]?.massOfContainerWaterSample,
          massOfContainerWater: data?.riceTest[3]?.massOfContainerWater,
        },
        {
          id: 5,
          teor: binderTrialData.percentsOfDosage[2][4].value,
          massOfDrySample: data?.riceTest[4]?.massOfDrySample,
          massOfContainerWaterSample: data?.riceTest[4]?.massOfContainerWaterSample,
          massOfContainerWater: data?.riceTest[4]?.massOfContainerWater,
        },
      ];
      setRiceTestTableRows(newRiceTestRows);
    }
  }, []);

  useEffect(() => {
    if (selectedMethod === 'GMM') {
      setData({ step: 4, value: { ...data, riceTest: riceTestTableRows } });
    }
  }, [riceTestTableRows, selectedMethod]);

  useEffect(() => {
    setRiceTestTableColumns([
      {
        field: 'teor',
        headerName: t('asphalt.dosages.marshall.tenor'),
        valueFormatter: ({ value }) => `${value}`,
        width: 50,
      },
      {
        field: 'massOfDrySample',
        headerName: t('asphalt.dosages.marshall.dry-sample-mass'),
        width: 200,
        renderCell: ({ row }) => {
          const { id } = row;
          const index = data?.riceTest?.findIndex((r) => r.id === id);
          return (
            <InputEndAdornment
              adornment={'g'}
              type="number"
              value={data.riceTest[index]?.massOfDrySample}
              onChange={(e) => {
                const newData = [...data.riceTest];
                newData[index].massOfDrySample = Number(e.target.value);
                setData({ step: 4, value: { ...data, riceTest: newData } });
              }}
            />
          );
        },
      },
      {
        field: 'massOfContainerWaterSample',
        headerName: t('asphalt.dosages.marshall.dry-sample-mass'),
        width: 220,
        renderCell: ({ row }) => {
          const { id } = row;
          const index = data?.riceTest?.findIndex((r) => r.id === id);
          return (
            <InputEndAdornment
              adornment={'g'}
              type="number"
              value={data.riceTest[index]?.massOfContainerWaterSample}
              onChange={(e) => {
                const newData = [...data.riceTest];
                newData[index].massOfContainerWaterSample = Number(e.target.value);
                setData({ step: 4, value: { ...data, riceTest: newData } });
              }}
            />
          );
        },
      },
      {
        field: 'massOfContainerWater',
        headerName: t('asphalt.dosages.marshall.container-water-mass'),
        width: 210,
        renderCell: ({ row }) => {
          const { id } = row;
          const index = data?.riceTest?.findIndex((r) => r.id === id);
          return (
            <InputEndAdornment
              adornment={'g'}
              type="number"
              value={data.riceTest[index]?.massOfContainerWater}
              onChange={(e) => {
                const newData = [...data.riceTest];
                newData[index].massOfContainerWater = Number(e.target.value);
                setData({ step: 4, value: { ...data, riceTest: newData } });
              }}
            />
          );
        },
      },
    ]);
  }, [data.riceTest]);

  useEffect(() => {
    setNextDisabled(true);
    const hasNullValue = data.dmt?.some((e) => Object.values(e).includes(null));

    if (selectedMethod === 'DMT' && !hasNullValue && data.temperatureOfWater !== null) {
      setNextDisabled(false);
    }
    if (selectedMethod === 'GMM' && data?.gmm?.every((e) => e.value !== null) && data.temperatureOfWater !== null) {
      setNextDisabled(false);
    }
  }, [selectedMethod, data.temperatureOfWater]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box
          sx={{
            display: 'flex',
            marginX: 'auto',
            width: '60%',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <DropDown
            key={'density'}
            variant="standard"
            label={t('asphalt.dosages.marshall.select-mixture-density-method')}
            options={calcMethodOptions}
            callback={(selectedOption) => {
              if (selectedOption === 'DMT - Densidade máxima teórica') {
                setDMTModalISOpen(true);
                setSelectedMethod('DMT');
              } else if (selectedOption === 'GMM - Densidade máxima medida') {
                setSelectedMethod('GMM');
                setEnableRiceTest(true);
              } else {
                setSelectedMethod('');
              }
            }}
            value={{
              label:
                selectedMethod === 'DMT'
                  ? 'DMT - Densidade máxima teórica'
                  : selectedMethod === 'GMM'
                  ? 'GMM - Densidade máxima medida'
                  : '',
              value:
                selectedMethod === 'GMM'
                  ? 'GMM - Densidade máxima medida'
                  : selectedMethod === 'DMT'
                  ? 'DMT - Densidade máxima teórica'
                  : '',
            }}
            size="medium"
            sx={{ width: '75%', marginX: 'auto' }}
          />
          <DropDown
            key={'water'}
            variant="standard"
            label={t('asphalt.dosages.marshall.water-temperature')}
            options={waterTemperatureList}
            callback={(selectedValue) => {
              const prevData = data;
              const newData = { ...prevData, temperatureOfWater: Number(selectedValue) };
              setData({ step: 4, value: newData });
            }}
            value={{
              label: '',
              value: data.temperatureOfWater,
            }}
            size="medium"
            sx={{ width: '75%', marginX: 'auto' }}
          />

          {selectedMethod === 'GMM' && (
            <Box sx={{ display: 'flex', gap: '1rem', marginY: '2rem', flexDirection: 'column' }}>
              <Typography sx={{ display: 'flex', justifyContent: 'center' }}>
                Insira o Gmm e/ou calcule pelo Rice Test
              </Typography>
              <Button onClick={() => setRiceTestModalIsOpen(true)} variant="outlined">
                Rice Test
              </Button>

              <DataGrid
                columns={gmmColumns.map((col) => ({
                  ...col,
                  disableColumnMenu: true,
                  sortable: false,
                  flex: 1,
                  moinWidth: 100,
                  headerAlign: 'center',
                  align: 'center',
                }))}
                rows={gmmRows}
                hideFooter
                sx={{ marginY: '2rem' }}
              />

              <Button onClick={calculateGmmData} variant="outlined">
                {t('asphalt.dosages.marshall.confirm')}
              </Button>
            </Box>
          )}

          {selectedMethod === 'DMT' && !DMTModalIsOpen && !dmtRows.some((e) => !e.Teor) && (
            <DataGrid
              columns={dmtColumns.map((col) => ({
                ...col,
                flex: 1,
                width: 200,
                headerAlign: 'center',
                align: 'center',
              }))}
              rows={dmtRows}
              hideFooter
            />
          )}

          <ModalBase
            title={t('asphalt.dosages.marshall.insert-real-specific-mass')}
            leftButtonTitle={t('asphalt.dosages.marshall.cancel')}
            rightButtonTitle={t('asphalt.dosages.marshall.confirm')}
            onCancel={(event, reason) => {
              if (reason !== 'backdropClick') {
                setDMTModalISOpen(false);
              }
            }}
            open={DMTModalIsOpen}
            size={'medium'}
            onSubmit={() => handleSubmitDmt()}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'space-around' }}>
              {data.missingSpecificMass?.length > 0 &&
                data.missingSpecificMass?.map((material, index) => (
                  <InputEndAdornment
                    key={`${index}`}
                    adornment={'g/cm³'}
                    label={material.name}
                    value={material.value}
                    onChange={(e) => {
                      const prevState = [...data.missingSpecificMass];
                      const index = prevState.findIndex((idx) => idx.name === material.name);
                      prevState[index] = { ...prevState[index], value: Number(e.target.value) };
                      setData({ step: 4, value: { ...data, missingSpecificMass: prevState } });
                    }}
                  />
                ))}
            </Box>
          </ModalBase>

          <ModalBase
            title={t('asphalt.dosages.marshall.rice-test-data')}
            leftButtonTitle={t('asphalt.dosages.marshall.cancel')}
            rightButtonTitle={t('asphalt.dosages.marshall.confirm')}
            onCancel={() => setRiceTestModalIsOpen(false)}
            open={riceTestModalIsOpen}
            size={'large'}
            onSubmit={() => {
              calculateRiceTest();
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
              <CustomDataGrid
                columns={riceTestTableColumns.map((col) => ({
                  ...col,
                  disableColumnMenu: true,
                  sortable: false,
                  flex: 1,
                  minWidth: 100,
                  headerAlign: 'center',
                  align: 'center',
                }))}
                rows={riceTestTableRows}
                hideFooter
              />

              <DropDown
                key={'water'}
                variant="standard"
                label={t('asphalt.dosages.marshall.water-temperature')}
                options={waterTemperatureList}
                callback={(selectedValue) => {
                  const prevData = data;
                  const newData = { ...prevData, temperatureOfWater: Number(selectedValue) };
                  setData({ step: 4, value: newData });
                }}
                value={{
                  label: '',
                  value: data.temperatureOfWater,
                }}
                size="medium"
                sx={{ width: '75%', marginX: 'auto' }}
              />
            </Box>
          </ModalBase>
        </Box>
      )}
    </>
  );
};

export default Marshall_Step5;
