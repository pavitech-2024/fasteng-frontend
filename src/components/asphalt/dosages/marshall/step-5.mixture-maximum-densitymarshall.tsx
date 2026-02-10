import DropDown from '@/components/atoms/inputs/dropDown';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import Loading from '@/components/molecules/loading';
import ModalBase from '@/components/molecules/modals/modal';
import { EssayPageProps } from '@/components/templates/essay';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import useMarshallStore from '@/stores/asphalt/marshall/marshall.store';
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

const Marshall_Step5_MixtureMaximumDensity = ({
  setNextDisabled,
  marshall,
}: EssayPageProps & { marshall: Marshall_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { materialSelectionData, maximumMixtureDensityData: data, binderTrialData, setData } = useMarshallStore();
  const [enableRiceTest, setEnableRiceTest] = useState(false);
  const [gmmRows, setGmmRows] = useState<GmmTableRows[]>([]);
  const [gmmColumns, setGmmColumns] = useState<GridColDef[]>([]);
  const [selectedMethod, setSelectedMethod] = useState({
    dmt: data?.method === 'DMT',
    gmm: data?.method === 'GMM',
  });
  const [riceTestTableRows, setRiceTestTableRows] = useState<RiceTestRows[]>([]);
  const [riceTestTableColumns, setRiceTestTableColumns] = useState<GridColDef[]>([]);
  const [riceTestModalIsOpen, setRiceTestModalIsOpen] = useState(false);
  const [DMTModalIsOpen, setDMTModalISOpen] = useState(false);
  const [gmmErrorMsg, setGmmErrorMsg] = useState('');

  /**
   * This useEffect is responsible for calculating the indexes of missing specific
   * gravity values in the GMM table and setting the initial values of the rice
   * test table.
   *
   * If the GMM table is completed, the function will return and do nothing.
   *
   * After the calculation is done, the function will update the data in the store
   * with the new values and set the loading state to false.
   */
  useEffect(() => {
    toast.promise(
      async () => {
        try {
          const response = await marshall.getIndexesOfMissesSpecificGravity(materialSelectionData);

          const newData = {
            ...data,
            missingSpecificMass: response,
          };

          const gmmData = [];
          for (let i = 1; i <= 5; i++) {
            gmmData.push({ id: i, insert: true, value: null });
          }

          newData.gmm = gmmData;

          newData.riceTest =
            newData.riceTest ||
            Array.from({ length: 5 }, (_, i) => ({
              id: i + 1,
              teor: null,
              massOfDrySample: null,
              massOfContainerWaterSample: null,
              massOfContainerWater: null,
            }));

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

  const methodDropdownValues = [
    {
      label: t('asphalt.dosages.dmt'),
      value: 'DMT',
    },
    {
      label: t('asphalt.dosages.gmm'),
      value: 'GMM',
    },
  ];

  const waterTemperatureList = Object.entries({
    '15°C': 0.9991,
    '16°C': 0.9989,
    '17°C': 0.9988,
    '18°C': 0.9986,
    '19°C': 0.9984,
    '20°C': 0.9982,
    '21°C': 0.998,
    '22°C': 0.9978,
    '23°C': 0.9975,
    '24°C': 0.9973,
    '25°C': 0.997,
    '26°C': 0.9968,
    '27°C': 0.9965,
    '28°C': 0.9962,
    '29°C': 0.9959,
    '30°C': 0.9956,
  }).map(([label, value]) => ({ label, value }));

  const dmtRows = binderTrialData.percentsOfDosage[binderTrialData.percentsOfDosage.length - 1].map((item, index) => ({
    id: index + 1,
    DMT: data?.maxSpecificGravity?.result?.lessOne?.toFixed(2),
    Teor: item.value,
  }));

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

  /**
   * Handles the submission process for calculating the maximum mixture density (DMT).
   * It triggers a toast notification indicating the status of the calculation process.
   * On successful calculation, it updates the data store with the new maximum specific gravity
   * and a list of specific gravities, and closes the DMT modal.
   *
   * @async
   * @throws Will throw an error if the calculation fails.
   */
  const handleSubmitDmt = async () => {
    toast.promise(
      async () => {
        try {
          const dmtResult = await marshall.calculateMaximumMixtureDensityDMT(
            materialSelectionData,
            binderTrialData,
            data
          );

          const updatedData = {
            ...data,
            maxSpecificGravity: {
              result: dmtResult.maxSpecificGravity,
              method: dmtResult.method,
            },
            listOfSpecificGravities: dmtResult.listOfSpecificGravities,
          };

          setData({ step: 4, value: updatedData });
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

  /**
   * useEffect hook that runs when the `data.gmm` changes.
   * It extracts the GMM and Teor values from the `data.gmm` array and stores them in the `gmmRows` state.
   * It also generates the DataGrid columns and stores them in the `gmmColumns` state.
   *
   * @param {Object} data - The dosage calculation results.
   */
useEffect(() => {
  if (!data?.gmm) {
    setGmmRows([]);
    return;
  }

  const gmmRows = data.gmm.map((gmmItem, index) => {
    // Type assertion para acessar value
    const item = gmmItem as any;
    const teor = binderTrialData.trial + (index - 2) * 0.5;
    return {
      id: item.id || index + 1,
      GMM: item.value ?? null,
      Teor: teor
    };
  });

  setGmmRows(gmmRows);
  setGmmColumns([
    {
      field: 'Teor',
      headerName: t('asphalt.dosages.marshall.tenor'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'GMM',
      headerName: 'GMM',
      renderCell: ({ row }) => (
        <InputEndAdornment
          adornment={''}
          type="number"
          value={row.GMM ?? ''}
          onChange={(e) => {
            const newData = [...(data.gmm || [])];
            const itemIndex = row.id - 1;
            if (newData[itemIndex]) {
              (newData[itemIndex] as any).value = e.target.value === '' ? null : Number(e.target.value);
              setData({ step: 4, value: { ...data, gmm: newData } });
            }
          }}
        />
      ),
    },
  ]);
}, [data?.gmm, binderTrialData.trial]);

  /**
   * Calculates the GMM data using the dosage calculation results.
   * If the dosage calculation results are invalid, it will throw an error.
   * If the dosage calculation results are valid, it will update the data store with the new GMM data.
   *
   * @async
   * @throws Will throw an error if the calculation fails.
   */
  const calculateGmmData = async () => {
    if (data.temperatureOfWater === null) {
      setGmmErrorMsg('errors.empty-water-temperature');
      toast.error(t('errors.empty-water-temperature'));
      return;
    }

    toast.promise(
      async () => {
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
          console.error(error);
        }
      },
      {
        pending: t('submiting.data.pending'),
        success: t('submiting.data.success'),
        error: t('submiting.data.error'),
      }
    );
  };

  /**
   * Calculates the rice test data using the dosage calculation results.
   * If the dosage calculation results are invalid, it will throw an error.
   * If the dosage calculation results are valid, it will update the data store with the new rice test data.
   *
   * @async
   * @throws Will throw an error if the calculation fails.
   */
  const calculateRiceTest = () => {
     console.log('=== DEBUG RICE TEST ===');
  console.log('data.riceTest:', data.riceTest);
  console.log('binderTrialData:', binderTrialData);

    let errorMsg = '';
    let errorIndex;

    const hasNullValues = data.riceTest.some((tenor, idx) => {
      const isInvalid = Object.values(tenor).some((value) => value === null || value < 1);
      if (isInvalid) errorIndex = idx;
      return isInvalid;
    });

    const invalidValues = data.riceTest.find(
      (tenor) =>
        tenor.massOfDrySample > tenor.massOfContainerWater ||
        tenor.massOfDrySample > tenor.massOfContainerWaterSample ||
        tenor.massOfContainerWater > tenor.massOfContainerWaterSample
    );
    if (hasNullValues) errorMsg = 'errors.rice-test-empty-fields';
    if (!errorMsg && invalidValues) {
      if (invalidValues.massOfContainerWaterSample <= invalidValues.massOfDrySample) {
        errorMsg = 'errors.invalid-gmm-mass-value';
      } else if (invalidValues.massOfContainerWater > invalidValues.massOfContainerWaterSample) {
        errorMsg = 'errors.invalid-gmm-container-mass-value';
      }
    }

    toast.promise(
      async () => {
        if (errorMsg) throw new Error(errorMsg);

        try {
          const riceTest = await marshall.calculateRiceTest(data);
          setRiceTestModalIsOpen(false);

          const formattedGmm = riceTest?.maxSpecificGravity.map(({ id, Teor, GMM }) => ({ id, Teor, GMM }));
          const formattedGmmData = riceTest?.maxSpecificGravity.map((item, i) => ({
            id: i + 1,
            insert: false,
            value: item.GMM,
          }));

          setGmmRows(formattedGmm);
          setData({
            step: 4,
            value: {
              ...data,
              ...riceTest,
              gmm: formattedGmmData,
            },
          });
          setNextDisabled(false);
        } catch (error) {
          throw new Error(error.message || 'errors.general');
        }
      },
      {
        pending: t('submiting.data.pending'),
        success: t('submiting.data.success'),
        error: `${t('errors.rice-test-empty-fields')}${binderTrialData.percentsOfDosage?.[2]?.[errorIndex]?.value ?? ''}%`,
      }
    );
  };

  useEffect(() => {
    if (data.riceTest?.length > 0) {
      const newRiceTestRows = binderTrialData.percentsOfDosage[2]?.map((e, i) => {
        const teor =
          i === 0
            ? binderTrialData.trial - 1
            : i === 1
            ? binderTrialData.trial - 0.5
            : i === 2
            ? binderTrialData.trial
            : i === 3
            ? binderTrialData.trial + 0.5
            : binderTrialData.trial + 1;
        return {
          id: i + 1,
          teor: teor,
          massOfDrySample: data.riceTest[i]?.massOfDrySample,
          massOfContainerWaterSample: data?.riceTest[i]?.massOfContainerWaterSample,
          massOfContainerWater: data?.riceTest[i]?.massOfContainerWater,
        };
      });

      setRiceTestTableRows(newRiceTestRows);
    }
  }, [binderTrialData.percentsOfDosage, data.riceTest]);

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
          const { id, teor } = row;
          const index = data?.riceTest?.findIndex((r) => r.id === id);
          return (
            <InputEndAdornment
              adornment="g"
              type="number"
              value={data.riceTest[index]?.massOfDrySample ?? ''}
              inputProps={{ step: 'any' }}
              onChange={(e) => {
                const newData = [...data.riceTest];
                const value = e.target.value;
                newData[index].massOfDrySample = value === '' ? null : parseFloat(value);
                newData[index].teor = teor;
                setData({ step: 4, value: { ...data, riceTest: newData } });
              }}
            />
          );
        },
      },
      {
        field: 'massOfContainerWaterSample',
        headerName: t('asphalt.dosages.marshall.container-sample-water-mass'),
        width: 220,
        renderCell: ({ row }) => {
          const { id, teor } = row;
          const index = data?.riceTest?.findIndex((r) => r.id === id);
          return (
            <InputEndAdornment
              adornment={'g'}
              type="number"
              value={data.riceTest[index]?.massOfContainerWaterSample}
              onChange={(e) => {
                const newData = [...data.riceTest];
                const value = e.target.value;
                newData[index].massOfContainerWaterSample = value === '' ? null : parseFloat(value);
                newData[index].teor = teor;
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
          const { id, teor } = row;
          const index = data?.riceTest?.findIndex((r) => r.id === id);
          return (
            <InputEndAdornment
              adornment={'g'}
              type="number"
              value={data.riceTest[index]?.massOfContainerWater}
              onChange={(e) => {
                const newData = [...data.riceTest];
                const value = e.target.value;
                newData[index].massOfContainerWater = value === '' ? null : parseFloat(e.target.value);
                newData[index].teor = teor;
                setData({ step: 4, value: { ...data, riceTest: newData } });
              }}
            />
          );
        },
      },
    ]);
  }, [data.riceTest]);

  /**
   * Effect that checks if there is any null value in the data.
   * If there is, it sets the nextDisabled state to true.
   * The nextDisabled state is used to disable the next button
   * if the user has not filled all the required data.
   */
  useEffect(() => {
    if (selectedMethod.dmt) {
      const hasNullValue = dmtRows?.some((e) => Object.values(e).includes(null));
      setNextDisabled(hasNullValue || data.temperatureOfWater === null);
    } else if (selectedMethod.gmm) {
        const hasNullValue = data.gmm?.some((e: any) => e.value === null);
        setNextDisabled(hasNullValue || data.temperatureOfWater === null);
    }
  }, [data.temperatureOfWater, selectedMethod, gmmRows, dmtRows]);

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
            options={methodDropdownValues}
            callback={(selectedOption) => {
              if (selectedOption === 'DMT') {
                setDMTModalISOpen(true);
                setSelectedMethod({ dmt: true, gmm: false });
              } else if (selectedOption === 'GMM') {
                setSelectedMethod({ dmt: false, gmm: true });
                setEnableRiceTest(true);
              }
            }}
            value={{
              label: selectedMethod.dmt ? t('asphalt.dosages.dmt') : t('asphalt.dosages.gmm'),
              value: selectedMethod.dmt ? 'DMT' : 'GMM',
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

          {selectedMethod.gmm && !riceTestModalIsOpen && (
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

          {selectedMethod.dmt && !DMTModalIsOpen && !dmtRows.some((e) => !e.Teor) && (
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

export default Marshall_Step5_MixtureMaximumDensity;
