import Api from '@/api';
import DropDown, { DropDownOption } from '@/components/atoms/inputs/dropDown';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import Loading from '@/components/molecules/loading';
import ModalBase from '@/components/molecules/modals/modal';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import useMarshallStore from '@/stores/asphalt/marshall/marshall.store';
import { Label } from '@mui/icons-material';
import { Box, Button, TextField, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Marshall_Step5 = ({
  nextDisabled,
  setNextDisabled,
  marshall,
}: EssayPageProps & { marshall: Marshall_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { materialSelectionData, maximumMixtureDensityData: data, binderTrialData, setData } = useMarshallStore();
  const [enableRiceTest, setEnableRiceTest] = useState(false);
  const [GMMModalIsOpen, setGMMModalIsOpen] = useState(false);
  const [gmmRows, setGmmRows] = useState([]);
  const [gmmColumns, setGmmColumns] = useState<GridColDef[]>([]);
  const [methodGmm, setMethodGmm] = useState(false);
  const [methodDmt, setMethodDmt] = useState(false);

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          const indexes = await marshall.getIndexesOfMissesSpecificGravity(materialSelectionData);
          const prevData = data;
          const newData = {
            ...prevData,
            indexesOfMissesSpecificGravity: indexes,
          };
          setData({ step: 4, value: newData });
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
  }, []);

  const [DMTModalIsOpen, setDMTModalISOpen] = useState(false);

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

  const array = [];

  const teste = Object.keys(list).forEach((key) => {
    array.push({
      label: key,
      value: list[key],
    });
  });

  const calcMethodOptions: DropDownOption[] = [
    { label: 'DMT - Densidade máxima teórica', value: 'DMT - Densidade máxima teórica' },
    { label: 'GMM - Densidade máxima medida', value: 'GMM - Densidade máxima medida' },
  ];

  const materials = materialSelectionData.aggregates.map((item) => item.name);

  const handleSubmitDmt = async () => {
    setMethodDmt(true);
    setMethodGmm(false);
    toast.promise(
      async () => {
        try {
          const result = await marshall.calculateMaximumMixtureDensityDMT(materialSelectionData, binderTrialData, data);
          console.log('🚀 ~ result:', result);
          const prevData = data;

          const newData = {
            ...prevData,
            ...result,
          };

          setData({ step: 4, value: newData });
          setDMTModalISOpen(false);
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

  const dmtRows = [
    {
      id: 1,
      DMT: data?.maxSpecificGravity?.lessOne?.toFixed(2),
      Teor: binderTrialData.percentsOfDosage[2][0],
    },
    {
      id: 2,
      DMT: data?.maxSpecificGravity?.lessHalf?.toFixed(2),
      Teor: binderTrialData.percentsOfDosage[2][1],
    },
    {
      id: 3,
      DMT: data?.maxSpecificGravity?.normal?.toFixed(2),
      Teor: binderTrialData.percentsOfDosage[2][2],
    },
    {
      id: 4,
      DMT: data?.maxSpecificGravity?.plusHalf?.toFixed(2),
      Teor: binderTrialData.percentsOfDosage[2][3],
    },
    {
      id: 5,
      DMT: data?.maxSpecificGravity?.plusOne?.toFixed(2),
      Teor: binderTrialData.percentsOfDosage[2][4],
    },
  ];

  const dmtColumns: GridColDef[] = [
    {
      field: 'Teor',
      headerName: 'Teor',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'DMT',
      headerName: 'DMT',
      valueFormatter: ({ value }) => `${value}`,
    },
  ];

  const [hasNull, setHasNull] = useState(true);

  useEffect(() => {
    function hasNullValue(obj) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] === null) {
          setHasNull(false);
        }
      }
      setHasNull(true);
    }
    hasNullValue(data.maxSpecificGravity);
  }, [data.maxSpecificGravity]);

  const calculateRiceTest = () => {
    toast.promise(
      async () => {
        try {
          const riceTest = await marshall.calculateRiceTest(data);
          console.log('🚀 ~ riceTest:', riceTest);
          const prevData = data;
          const newData = {
            ...prevData,
            ...riceTest,
          };
          setData({ step: 4, value: newData });
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
  };

  useEffect(() => {
    console.log('🚀 ~ gmmRows:', gmmRows);
  }, [gmmRows]);

  const handleGMM = (index, e) => {
    if (e.target.value === null) return;

    const newState = [...data.gmm];
    const newValue = Number(e.target.value);

    if (newState[index].value !== null) {
      // If the input field already has a value, update it
      newState[index] = { ...newState[index], value: newValue };
    } else {
      // If the input field is new, add it to the gmmRows array
      newState.splice(index, 0, { id: index + 1, insert: true, value: newValue });
    }

    console.log('🚀 ~ handleGMM ~ newState:', newState);

    // Update gmmRows directly
    setGmmRows((prevRows) => {
      const updatedRows = [...prevRows];
      updatedRows[index] = { ...updatedRows[index], GMM: newValue };
      return updatedRows;
    });

    console.log('🚀 ~ handleGMM ~ gmmRows:', gmmRows);

    // Create a new copy of the state object with the updated gmmRows array
    //setGmmRows([...gmmRows, gmmRows[index].GMM = newValue])
    setData({ step: 4, value: { ...data, gmm: newState } });
  };

  useEffect(() => {
    const newArrayOfObjects = gmmRows.map((item) => ({
      id: item.id,
      insert: item.GMM !== null,
      value: item.GMM
    }));

    setData({ step: 4, value: {...data, gmm: newArrayOfObjects }})
  },[gmmRows])

  const handleSelectGMM = () => {
    setGMMModalIsOpen(false);
    setMethodGmm(true);
    setMethodDmt(false);
  };

  useEffect(() => {
    if (methodGmm) {
      setGmmRows([
        {
          id: 1,
          GMM: data?.gmm[0].value,
          Teor: binderTrialData.percentsOfDosage[2][0],
        },
        {
          id: 2,
          GMM: data?.gmm[1].value,
          Teor: binderTrialData.percentsOfDosage[2][1],
        },
        {
          id: 3,
          GMM: data?.gmm[2].value,
          Teor: binderTrialData.percentsOfDosage[2][2],
        },
        {
          id: 4,
          GMM: data?.gmm[3].value,
          Teor: binderTrialData.percentsOfDosage[2][3],
        },
        {
          id: 5,
          GMM: data?.gmm[4].value,
          Teor: binderTrialData.percentsOfDosage[2][4],
        },
      ]);

      setGmmColumns([
        {
          field: 'Teor',
          headerName: 'Teor',
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
                type="text"
                value={gmmRows[index]?.GMM}
                onChange={(e) => {
                  handleGMM(index, e);
                }}
              />
            );
          },
        },
      ]);
    }
  }, [methodGmm]);

  const calculateGmmData = () => {
    toast.promise(
      async () => {
        try {
          const gmm = await marshall.calculateGmmData(materialSelectionData, data);
          console.log('🚀 ~ gmm:', gmm);
          const prevData = data;
          const newData = {
            ...prevData,
            maxSpecificGravity: gmm.maxSpecificGravity,
            method: gmm.method,
          };
          setData({ step: 4, value: { ...data, maxSpecificGravity: gmm.maxSpecificGravity } });
          const prevGmmRows = [...gmmRows];
          const newGmmRows = prevGmmRows.map((item) => {
            if (item.id === 1) {
              item.GMM = gmm.maxSpecificGravity.lessOne;
            }
            if (item.id === 2) {
              item.GMM = gmm.maxSpecificGravity.lessHalf;
            }
            if (item.id === 3) {
              item.GMM = gmm.maxSpecificGravity.normal;
            }
            if (item.id === 4) {
              item.GMM = gmm.maxSpecificGravity.plusHalf;
            }
            if (item.id === 5) {
              item.GMM = gmm.maxSpecificGravity.plusOne;
            }
            return item;
          });
          console.log('🚀 ~ newGmmRows ~ newGmmRows:', newGmmRows);

          setGmmRows(newGmmRows);
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
          <DropDown
            key={'density'}
            variant="standard"
            label={'Selecione o método de cálculo da densidade da mistura'}
            options={calcMethodOptions}
            callback={(selectedOption) => {
              if (selectedOption === 'DMT - Densidade máxima teórica') {
                setDMTModalISOpen(true);
              } else {
                setGMMModalIsOpen(true);
                setEnableRiceTest(true);
              }
            }}
            size="medium"
            sx={{ width: '75%', marginX: 'auto' }}
          />
          <DropDown
            key={'water'}
            variant="standard"
            label={'Selecione o fator de correção para a temperatura da água'}
            options={array}
            callback={(selectedValue) => {
              const prevData = data;
              const newData = { ...prevData, temperatureOfWater: Number(selectedValue) };
              setData({ step: 4, value: newData });
            }}
            size="medium"
            sx={{ width: '75%', marginX: 'auto' }}
          />

          {methodGmm && (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ display: 'flex', justifyContent: 'center' }}>
                Insira o Gmm e/ou calcule pelo Rice Test
              </Typography>
              <Button onClick={calculateRiceTest}>Rice Test</Button>

              <DataGrid columns={gmmColumns} rows={gmmRows} hideFooter />

              <Button onClick={calculateGmmData}>Confirmar</Button>
            </Box>
          )}

          {methodDmt && <DataGrid columns={dmtColumns} rows={dmtRows} hideFooter />}

          <ModalBase
            title={'Insira a massa específica real dos materiais abaixo'}
            children={
              <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <InputEndAdornment
                  adornment={'g/cm³'}
                  label={materials[0]}
                  value={data?.missingSpecificMass?.material_1}
                  onChange={(e) => {
                    const prevState = data;
                    const prevDmt = data.missingSpecificMass;
                    const newState = { ...prevState, missingSpecificMass: { ...prevDmt, material_1: e.target.value } };
                    setData({ step: 4, value: newState });
                  }}
                />
                <InputEndAdornment
                  adornment={'g/cm³'}
                  label={materials[1]}
                  value={data?.missingSpecificMass?.material_2}
                  onChange={(e) => {
                    const prevState = data;
                    const prevDmt = data.missingSpecificMass;
                    const newState = { ...prevState, missingSpecificMass: { ...prevDmt, material_2: e.target.value } };
                    setData({ step: 4, value: newState });
                  }}
                />
              </Box>
            }
            leftButtonTitle={'cancelar'}
            rightButtonTitle={'confirmar'}
            onCancel={() => setDMTModalISOpen(false)}
            open={DMTModalIsOpen}
            size={'large'}
            onSubmit={() => handleSubmitDmt()}
          />

          <ModalBase
            title={'Insira a massa específica real dos materiais abaixo'}
            children={
              <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <InputEndAdornment
                  adornment={'g/cm³'}
                  label={materials[0]}
                  value={data?.missingSpecificMass?.material_1}
                  onChange={(e) => {
                    const prevState = data;
                    const prevDmt = data.missingSpecificMass;
                    const newState = { ...prevState, missingSpecificMass: { ...prevDmt, material_1: e.target.value } };
                    setData({ step: 4, value: newState });
                  }}
                />
                <InputEndAdornment
                  adornment={'g/cm³'}
                  label={materials[1]}
                  value={data?.missingSpecificMass?.material_2}
                  onChange={(e) => {
                    const prevState = data;
                    const prevDmt = data.missingSpecificMass;
                    const newState = { ...prevState, missingSpecificMass: { ...prevDmt, material_2: e.target.value } };
                    setData({ step: 4, value: newState });
                  }}
                />
              </Box>
            }
            leftButtonTitle={'cancelar'}
            rightButtonTitle={'confirmar'}
            onCancel={() => setGMMModalIsOpen(false)}
            open={GMMModalIsOpen}
            size={'large'}
            onSubmit={() => handleSelectGMM()}
          />
        </Box>
      )}
    </>
  );
};

export default Marshall_Step5;
