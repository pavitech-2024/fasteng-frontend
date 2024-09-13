import DropDown, { DropDownOption } from '@/components/atoms/inputs/dropDown';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import Loading from '@/components/molecules/loading';
import ModalBase from '@/components/molecules/modals/modal';
import { EssayPageProps } from '@/components/templates/essay';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import useMarshallStore, { MarshallData } from '@/stores/asphalt/marshall/marshall.store';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

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
    granulometryCompositionData,
    setData,
  } = useMarshallStore();

  const [DMTModalIsOpen, setDMTModalISOpen] = useState(false);
  const [riceTestModalIsOpen, setRiceTestModalIsOpen] = useState(false);
  const materials = materialSelectionData.aggregates.map((item) => item.name);
  const [methodGmm, setMethodGmm] = useState(false);
  const [methodDmt, setMethodDmt] = useState(false);
  const [method, setMethod] = useState('');
  const optimumBinderRows = data?.optimumBinder;

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          let newData = {};
          const response = await marshall.confirmSpecificGravity(
            granulometryCompositionData,
            maximumMixtureDensityData,
            optimumBinderContentData,
            data,
            false
          );

          newData = {
            ...data,
            ...response,
          };

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
            type='number'
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
            type='number'
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
            type='number'
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
            type='number'
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
            type='number'
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
            type='number'
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
            type='number'
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
            type='number'
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

  const optimumBinderColumnGroup: GridColumnGroupingModel = [
    {
      groupId: 'binder',
      headerAlign: 'center',
      headerName: `${optimumBinderContentData?.optimumBinder?.optimumContent.toFixed(2)}%`,
      children: [
        { field: 'diammeter' },
        { field: 'height' },
        { field: 'dryMass' },
        { field: 'submergedMass' },
        { field: 'drySurfaceSaturatedMass' },
        { field: 'stability' },
        { field: 'fluency' },
        { field: 'diametricalCompressionStrength' },
      ],
    },
  ];

  // Method option dropdown;
  const calcMethodOptions: DropDownOption[] = [
    { label: 'DMT - Densidade máxima teórica', value: 'DMT - Densidade máxima teórica' },
    { label: 'GMM - Densidade máxima medida', value: 'GMM - Densidade máxima medida' },
  ];

  const riceTestRows = [data?.riceTest];

  const riceTestColumns: GridColDef[] = [
    {
      field: 'Teor',
      headerName: 'Teor',
      valueFormatter: () => `${optimumBinderContentData?.optimumBinder?.optimumContent.toFixed(2)}%`,
    },
    {
      field: 'massOfDrySample',
      headerName: 'Massa da amostra seca em ar (g)',
      renderCell: () => {
        return (
          <InputEndAdornment
            adornment={'g'}
            type="number"
            value={data?.riceTest?.massOfDrySample}
            onChange={(e) => {
              const prevData = data.riceTest;
              const newData = { ...prevData, massOfDrySample: e.target.value };
              setData({ step: 7, value: { ...data, riceTest: newData } });
            }}
          />
        );
      },
    },
    {
      field: 'massOfContainerWaterSample',
      headerName: 'Massa do recipiente + amostra + água (g)',
      renderCell: () => {
        return (
          <InputEndAdornment
            adornment={'g'}
            type="text"
            value={data?.riceTest?.massOfContainerWaterSample}
            onChange={(e) => {
              const prevData = data.riceTest;
              const newData = { ...prevData, massOfContainerWaterSample: e.target.value };
              setData({ step: 7, value: { ...data, riceTest: newData } });
            }}
          />
        );
      },
    },
    {
      field: 'massOfContainerWater',
      headerName: 'Massa do recipiente + água (g)',
      renderCell: () => {
        return (
          <InputEndAdornment
            adornment={'g'}
            type="text"
            value={data?.riceTest?.massOfContainerWater}
            onChange={(e) => {
              const prevData = data.riceTest;
              const newData = { ...prevData, massOfContainerWater: e.target.value };
              setData({ step: 7, value: { ...data, riceTest: newData } });
            }}
          />
        );
      },
    },
  ];

  const handleSubmitDmt = async () => {
    setMethodDmt(true);
    setMethodGmm(false);
    toast.promise(
      async () => {
        try {
          const dmt = await marshall.calculateMaximumMixtureDensityDMT(
            materialSelectionData,
            binderTrialData,
            maximumMixtureDensityData
          );

          const newData = {
            ...data,
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
        pending: t('loading.materials.pending'),
        success: t('loading.materials.success'),
        error: t('loading.materials.error'),
      }
    );
  };

  const calculateRiceTest = () => {
    toast.promise(
      async () => {
        try {
          let newData = {};
          const riceTest = await marshall.confirmSpecificGravity(
            granulometryCompositionData,
            maximumMixtureDensityData,
            optimumBinderContentData,
            data,
            true
          );

          newData = {
            ...data,
            ...riceTest,
          };

          setRiceTestModalIsOpen(false);

          setData({ step: 7, value: newData });
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

  const handleConfirm = () => {
    toast.promise(
      async () => {
        try {
          let newData = {};
          const confirmVP = await marshall.confirmVolumetricParameters(
            maximumMixtureDensityData,
            optimumBinderContentData,
            data
          );

          newData = {
            ...data,
            ...confirmVP,
          };

          setData({ step: 7, value: newData });
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
            gap: '3rem',
          }}
        >
          <DropDown
            key={'density'}
            variant="standard"
            label={'Selecione o método de cálculo da densidade da mistura'}
            options={calcMethodOptions}
            defaultValue={{
              label:
                method === 'DMT'
                  ? 'DMT - Densidade máxima teórica'
                  : method === 'GMM'
                  ? 'GMM - Densidade máxima medida'
                  : '',
              value:
                method === 'DMT'
                  ? 'DMT - Densidade máxima teórica'
                  : method === 'GMM'
                  ? 'GMM - Densidade máxima medida'
                  : '',
            }}
            callback={(selectedOption) => {
              if (
                selectedOption === 'DMT - Densidade máxima teórica'
                // && maximumMixtureDensityData?.maxSpecificGravity?.method !== 'DMT'
              ) {
                setMethod('DMT');
                setDMTModalISOpen(true);
              } else if (selectedOption === 'GMM - Densidade máxima medida') {
                setMethod('GMM');
                setMethodGmm(true);
              } else {
                setMethod('');
              }
            }}
            size="medium"
            sx={{ width: '75%', marginX: 'auto' }}
          />

          {maximumMixtureDensityData?.maxSpecificGravity?.method === 'DMT' ? (
            <Typography>{`DMT do teor de ligante ótimo: ${data?.confirmedSpecificGravity?.result?.toFixed(
              2
            )} g/cm³`}</Typography>
          ) : (
            <Box>
              <Typography>{`Insira a Gmm ou calcule pelo Rice Test`}</Typography>
              <Typography>{`Gmm calculada pelo Rice Test: ${data?.confirmedSpecificGravity?.result}`}</Typography>
              <InputEndAdornment
                adornment={'g/cm³'}
                label={'Gmm do teor de ligante asfáltico:'}
                value={data?.gmm}
                onChange={(e) => {
                  const prevData: MarshallData['confirmationCompressionData'] = data;
                  const newData = { ...prevData, gmm: e.target.value };
                  setData({ step: 7, value: newData });
                }}
              />
              <Button onClick={() => setRiceTestModalIsOpen(true)}>Rice Test</Button>
            </Box>
          )}

          <DataGrid
            key={'optimumBinder'}
            columns={generateColumns.map((col) => ({
              ...col,
              width: 150,
              flex: 1
            }))}
            rows={optimumBinderRows}
            experimentalFeatures={{ columnGrouping: true }}
            columnGroupingModel={optimumBinderColumnGroup}
            density="comfortable"
            disableColumnMenu
            disableColumnSelector
            slots={{ footer: () => ExpansionToolbar() }}
          />

          <Button onClick={handleConfirm} variant='outlined'>Confirmar</Button>

          <ModalBase
            title={'Insira a massa específica real dos materiais abaixo'}
            leftButtonTitle={'cancelar'}
            rightButtonTitle={'confirmar'}
            onCancel={() => setDMTModalISOpen(false)}
            open={DMTModalIsOpen}
            size={'large'}
            onSubmit={() => handleSubmitDmt()}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginY: '2rem' }}>
              {maximumMixtureDensityData.missingSpecificMass && maximumMixtureDensityData.missingSpecificMass.map((material) => (
                <InputEndAdornment
                  key={material._id}
                  adornment={'g/cm³'}
                  label={material.name}
                  value={material.value}
                  onChange={(e) => {
                    const prevState = maximumMixtureDensityData;
                    const prevDmt = maximumMixtureDensityData.missingSpecificMass;
                    const newState = {
                      ...prevState,
                      missingSpecificMass: { ...prevDmt, [material.name]: e.target.value },
                    };
                    setData({ step: 7, value: newState });
                  }}
                />
              ))}
            </Box>
          </ModalBase>

          <ModalBase
            title={'Dados do Rice Test'}
            leftButtonTitle={'cancelar'}
            rightButtonTitle={'confirmar'}
            onCancel={() => setRiceTestModalIsOpen(false)}
            open={riceTestModalIsOpen}
            size={'large'}
            onSubmit={() => {
              calculateRiceTest();
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
              <DataGrid 
                columns={riceTestColumns} 
                rows={riceTestRows} 
                hideFooter 
              />
            </Box>
          </ModalBase>
        </Box>
      )}
    </>
  );
};

export default Marshall_Step8;
