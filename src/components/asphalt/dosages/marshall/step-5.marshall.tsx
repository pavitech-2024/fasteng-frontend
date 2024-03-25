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

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          const indexes = await marshall.getIndexesOfMissesSpecificGravity(materialSelectionData);
          console.log('🚀 ~ indexes:', indexes);
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
  const [GMMModalIsOpen, setGMMModalISOpen] = useState(false);

  const { user } = useAuth();

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

  const gmmRows = [
    {
      id: 1,
      GMM: data?.gmm?.lessOne,
      Teor: binderTrialData.percentsOfDosage[2][0],
    },
    {
      id: 2,
      GMM: data?.gmm?.lessHalf,
      Teor: binderTrialData.percentsOfDosage[2][1],
    },
    {
      id: 3,
      GMM: data?.gmm?.normal,
      Teor: binderTrialData.percentsOfDosage[2][2],
    },
    {
      id: 4,
      GMM: data?.gmm?.plusHalf,
      Teor: binderTrialData.percentsOfDosage[2][3],
    },
    {
      id: 5,
      GMM: data?.gmm?.plusOne,
      Teor: binderTrialData.percentsOfDosage[2][4],
    },
  ];

  const gmmColumns: GridColDef[] = [
    {
      field: 'Teor',
      headerName: 'Teor',
      valueFormatter: ({ value }) => `${value}`
    },
    {
      field: 'GMM',
      headerName: 'GMM',
      renderCell: ({ row }) => {
        const { id } = row;
        const index = gmmRows.findIndex((r) => r.id === id);
        console.log("🚀 ~ index:", index)
        return (
          <InputEndAdornment
            adornment={''}
            type="text"
            value={gmmRows[index].GMM}
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...gmmRows];
              newRows[index].GMM = Number(e.target.value);
              const prevData = data;
              const newData = { ...prevData, gmm: newRows }
              setData({ step: 4, value: newData });
            }}
          />
        );
      },
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
  console.log("🚀 ~ hasNull:", hasNull)

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
            key={'dropdown'}
            variant="standard"
            label={'Selecione o método de cálculo da densidade da mistura'}
            options={calcMethodOptions}
            callback={(selectedOption) => {
              if (selectedOption === 'DMT - Densidade máxima teórica') {
                setDMTModalISOpen(true);
              } else {
                setEnableRiceTest(true);
              }
            }}
            size="medium"
            sx={{ width: '75%', marginX: 'auto' }}
          />
          <DropDown
            key={'dropdown'}
            variant="standard"
            label={'Selecione o fator de correção para a temperatura da água'}
            options={array}
            callback={() => console.log('clicou')}
            size="medium"
            sx={{ width: '75%', marginX: 'auto' }}
          />

          {enableRiceTest && (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography>Insira o Gmm e/ou calcule pelo Rice Test</Typography>
              <Button>RiceTest</Button>

              <DataGrid columns={gmmColumns} rows={gmmRows} />
            </Box>
          )}

          {hasNull && !enableRiceTest && <DataGrid columns={dmtColumns} rows={dmtRows} />}

          <ModalBase
            title={'Insira a massa específica real dos materiais abaixo'}
            children={
              <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <InputEndAdornment
                  adornment={'g/cm³'}
                  label={materials[0]}
                  value={data?.dmt?.material_1}
                  onChange={(e) => {
                    const prevState = data;
                    const prevDmt = data.dmt;
                    const newState = { ...prevState, dmt: { ...prevDmt, material_1: e.target.value } };
                    setData({ step: 4, value: newState });
                  }}
                />
                <InputEndAdornment
                  adornment={'g/cm³'}
                  label={materials[1]}
                  value={data?.dmt?.material_2}
                  onChange={(e) => {
                    const prevState = data;
                    const prevDmt = data.dmt;
                    const newState = { ...prevState, dmt: { ...prevDmt, material_2: e.target.value } };
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
        </Box>
      )}
    </>
  );
};

export default Marshall_Step5;
