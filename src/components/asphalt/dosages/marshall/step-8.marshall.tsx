import DropDown, { DropDownOption } from '@/components/atoms/inputs/dropDown';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import Loading from '@/components/molecules/loading';
import ModalBase from '@/components/molecules/modals/modal';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import useMarshallStore from '@/stores/asphalt/marshall/marshall.store';
import { Box, Button, TextField, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { RiceTestRows } from './step-5.marshall';

const Marshall_Step8 = ({
  nextDisabled,
  setNextDisabled,
  marshall,
}: EssayPageProps & { marshall: Marshall_SERVICE }) => {

  const [loading, setLoading] = useState<boolean>(false);
  const {
    materialSelectionData,
    confirmationCompressionData: data,
    maximumMixtureDensityData,
    optimumBinderContentData,
    binderTrialData,
    setData,
  } = useMarshallStore();
  const [DMTModalIsOpen, setDMTModalISOpen] = useState(false);
  const [GMMModalIsOpen, setGMMModalIsOpen] = useState(false);
  const [enableRiceTest, setEnableRiceTest] = useState(false);
  const [riceTestModalIsOpen, setRiceTestModalIsOpen] = useState(false);
  const materials = materialSelectionData.aggregates.map((item) => item.name);
  const [methodGmm, setMethodGmm] = useState(false);
  const [methodDmt, setMethodDmt] = useState(false);
  const [gmmRows, setGmmRows] = useState([]);

  const [riceTestTableRows, setRiceTestTableRows] = useState<RiceTestRows[]>([]);
  const [riceTestTableColumns, setRiceTestTableColumns] = useState<GridColDef[]>([]);

  const optimumBinderRows = data?.optimumBinder;
  console.log("🚀 ~ optimumBinderRows:", optimumBinderRows)

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          let newData;
          const response = await marshall.confirmSpecificGravity(
            maximumMixtureDensityData,
            binderTrialData,
            optimumBinderContentData,
            data
          );

          newData = {
            ...data,
            ...response
          }

          setData({ step: 7, value: newData });
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

  const generateColumns: GridColDef[] = [
    {
      field: 'diammeter',
      headerName: 'Diâmetro (cm)',
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data?.optimumBinder.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            value={data?.optimumBinder[index]?.diammeter}
            onChange={(e) => {
              const value = Number(e.target.value);
              const newState = [...data.optimumBinder];
              newState[index] = { ...newState[index], diammeter: value };
              setData({ step: 7, value: { ...data, optimumBinder: newState } });
            }}
          />
        );
      },
    },
    {
      field: 'height',
      headerName: 'Altura (cm)',
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data?.optimumBinder.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            value={data?.optimumBinder[index]?.height}
            onChange={(e) => {
              const value = Number(e.target.value);
              const newState = [...data.optimumBinder];
              newState[index] = { ...newState[index], height: value };
              setData({ step: 7, value: { ...data, optimumBinder: newState } });
            }}
          />
        );
      },
    },
    {
      field: 'dryMass',
      headerName: 'Massa seca (g)',
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data?.optimumBinder.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'g'}
            value={data?.optimumBinder[index]?.dryMass}
            onChange={(e) => {
              const value = Number(e.target.value);
              const newState = [...data.optimumBinder];
              newState[index] = { ...newState[index], dryMass: value };
              setData({ step: 7, value: { ...data, optimumBinder: newState } });
            }}
          />
        );
      },
    },
    {
      field: 'submergedMass',
      headerName: 'Massa submersa (g)',
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data.optimumBinder.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'g'}
            value={data?.optimumBinder[index]?.submergedMass}
            onChange={(e) => {
              const value = Number(e.target.value);
              const newState = [...data.optimumBinder];
              newState[index] = { ...newState[index], submergedMass: value };
              setData({ step: 7, value: { ...data, optimumBinder: newState } });
            }}
          />
        );
      },
    },
    {
      field: 'drySurfaceSaturatedMass',
      headerName: 'Massa saturada com superfície seca (g)',
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data?.optimumBinder.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'g'}
            value={data?.optimumBinder[index]?.drySurfaceSaturatedMass}
            onChange={(e) => {
              const value = Number(e.target.value);
              const newState = [...data.optimumBinder];
              newState[index] = { ...newState[index], drySurfaceSaturatedMass: value };
              setData({ step: 7, value: { ...data, optimumBinder: newState } });
            }}
          />
        );
      },
    },
    {
      field: 'stability',
      headerName: 'Estabilidade (N)',
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data.optimumBinder.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'N'}
            value={data?.optimumBinder[index]?.stability}
            onChange={(e) => {
              const value = Number(e.target.value);
              const newState = [...data.optimumBinder];
              newState[index] = { ...newState[index], stability: value };
              setData({ step: 7, value: { ...data, optimumBinder: newState } });
            }}
          />
        );
      },
    },
    {
      field: 'fluency',
      headerName: 'Fluência (mm)',
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data.optimumBinder.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'mm'}
            value={data?.optimumBinder[index]?.fluency}
            onChange={(e) => {
              const value = Number(e.target.value);
              const newState = [...data.optimumBinder];
              newState[index] = { ...newState[index], fluency: value };
              setData({ step: 7, value: { ...data, optimumBinder: newState } });
            }}
          />
        );
      },
    },
    {
      field: 'diametricalCompressionStrength',
      headerName: 'Resistência à tração por compressão diametral (MPa)',
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data?.optimumBinder.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            value={data?.optimumBinder[index]?.diametricalCompressionStrength}
            onChange={(e) => {
              const value = Number(e.target.value);
              const newState = [...data.optimumBinder];
              newState[index] = { ...newState[index], diametricalCompressionStrength: value };
              setData({ step: 7, value: { ...data, optimumBinder: newState } });
            }}
          />
        );
      },
    },
  ];
  console.log("🚀 ~ generateColumns:", generateColumns.length)

  // Method option dropdown;
  const calcMethodOptions: DropDownOption[] = [
    { label: 'DMT - Densidade máxima teórica', value: 'DMT - Densidade máxima teórica' },
    { label: 'GMM - Densidade máxima medida', value: 'GMM - Densidade máxima medida' },
  ];

  const handleSubmitDmt = async () => {
    setMethodDmt(true);
    setMethodGmm(false);
    toast.promise(
      async () => {
        try {
          const dmt = await marshall.calculateMaximumMixtureDensityDMT(materialSelectionData, binderTrialData, maximumMixtureDensityData);
          console.log("🚀 ~ dmt:", dmt)
          const prevData = data;

          const newData = {
            ...prevData,
            maxSpecificGravity: {
              result: dmt.maxSpecificGravity,
              method: dmt.method,
            },
            listOfSpecificGravities: dmt.listOfSpecificGravities
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

  const handleRiceTestOnChange = (index: number, e: any, prop: string) => {
    if (e.target.value === null) return;

    const newState = [...maximumMixtureDensityData.riceTest];
    const newValue = Number(e.target.value);

    if (newState[index]?.[prop] !== null) {
      // If the input field already has a value, update it
      newState[index] = { ...newState[index], [prop]: newValue };
    } else {
      // If the input field is new, add it to the gmmRows waterTemperatureList
      newState.splice(index, 0, { ...newState[index], id: index + 1, [prop]: newValue });
    }

    // Update gmmRows directly
    setRiceTestTableRows((prevRows) => {
      const updatedRows = [...prevRows];
      updatedRows[index] = { ...updatedRows[index], [prop]: newValue };
      return updatedRows;
    });

    console.log("riceTestRows", maximumMixtureDensityData?.riceTest);

    // // Create a new copy of the state object with the updated gmmRows waterTemperatureList
    setData({ step: 4, value: { ...maximumMixtureDensityData, riceTest: newState } });
  }

  const calculateRiceTest = () => {

    toast.promise(
      async () => {
        try {
          const riceTest = await marshall.calculateRiceTest(maximumMixtureDensityData);
          const prevData = maximumMixtureDensityData;
          const newData = {
            ...prevData,
            ...riceTest,
          };

          setRiceTestModalIsOpen(false);

          const formattedGmm = riceTest?.maxSpecificGravity.map((item) => {
            return {
              id: item.id,
              Teor: item.Teor,
              GMM: item.GMM
            }
          });

          setGmmRows(formattedGmm)
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
  
  //Activated when gmm method is selected
  const handleSelectGMM = () => {
    setGMMModalIsOpen(false);
    setMethodGmm(true);
    setMethodDmt(false);
  };

  const handleErase = () => {
    try {
      if (data?.optimumBinder.length > 1) {
        const newRows = [...data?.optimumBinder];
        newRows.pop();
        setData({ step: 7, value: { ...data, optimumBinder: newRows } });
      } else throw t('ddui.error.minReads');
    } catch (error) {
      toast.error(error);
    }
  };

  const handleAdd = () => {
    const newRows = [...data?.optimumBinder];
    newRows.push({
      id: data?.optimumBinder.length,
      diammeter: null,
      height: null,
      dryMass: null,
      submergedMass: null,
      drySurfaceSaturatedMass: null,
      stability: null,
      fluency: null,
      diametricalCompressionStrength: null,
    });
    setData({ step: 7, value: { ...data, optimumBinder: newRows } });
  };

  const ExpansionToolbar = () => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem', flexWrap: 'wrap' }}>
        <Button sx={{ color: 'secondaryTons.red' }} onClick={() => handleErase()}>
          {t('erase')}
        </Button>
        <Button sx={{ color: 'secondaryTons.green' }} onClick={() => handleAdd()}>
          {t('add')}
        </Button>
      </Box>
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
              if (
                selectedOption === 'DMT - Densidade máxima teórica' &&
                maximumMixtureDensityData?.maxSpecificGravity?.method !== 'DMT'
              ) {
                setDMTModalISOpen(true);
              } else {
                setGMMModalIsOpen(true);
                setEnableRiceTest(true);
              }
            }}
            size="medium"
            sx={{ width: '75%', marginX: 'auto' }}
          />

          <Typography>{`DMT do teor de ligante ótimo:`}</Typography>

          <DataGrid
            key={'optimumBinder'}
            columns={generateColumns}
            rows={optimumBinderRows}
            density="comfortable"
            disableColumnMenu
            disableColumnSelector
            slots={{ footer: () => ExpansionToolbar() }}
          />

          <ModalBase
            title={'Insira a massa específica real dos materiais abaixo'}
            children={
              <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <InputEndAdornment
                  adornment={'g/cm³'}
                  label={materials[0]}
                  value={maximumMixtureDensityData?.missingSpecificMass?.material_1}
                  onChange={(e) => {
                    const prevState = maximumMixtureDensityData;
                    const prevDmt = maximumMixtureDensityData.missingSpecificMass;
                    const newState = { ...prevState, missingSpecificMass: { ...prevDmt, material_1: e.target.value } };
                    setData({ step: 4, value: newState });
                  }}
                />
                <InputEndAdornment
                  adornment={'g/cm³'}
                  label={materials[1]}
                  value={maximumMixtureDensityData?.missingSpecificMass?.material_2}
                  onChange={(e) => {
                    const prevState = maximumMixtureDensityData;
                    const prevDmt = maximumMixtureDensityData.missingSpecificMass;
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
                  value={maximumMixtureDensityData?.missingSpecificMass?.material_1}
                  onChange={(e) => {
                    const prevState = maximumMixtureDensityData;
                    const prevDmt = maximumMixtureDensityData.missingSpecificMass;
                    const newState = { ...prevState, missingSpecificMass: { ...prevDmt, material_1: e.target.value } };
                    setData({ step: 4, value: newState });
                  }}
                />
                <InputEndAdornment
                  adornment={'g/cm³'}
                  label={materials[1]}
                  value={maximumMixtureDensityData?.missingSpecificMass?.material_2}
                  onChange={(e) => {
                    const prevState = maximumMixtureDensityData;
                    const prevDmt = maximumMixtureDensityData.missingSpecificMass;
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

          <ModalBase
            title={'Dados do Rice Test'}
            children={
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                <DataGrid columns={riceTestTableColumns} rows={riceTestTableRows} hideFooter />
              </Box>
            }
            leftButtonTitle={'cancelar'}
            rightButtonTitle={'confirmar'}
            onCancel={() => setRiceTestModalIsOpen(false)}
            open={riceTestModalIsOpen}
            size={'large'}
            onSubmit={() => {
              calculateRiceTest();
            }}
          />
        </Box>
      )}
    </>
  );
};

export default Marshall_Step8;
