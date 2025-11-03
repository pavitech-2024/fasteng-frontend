import DropDown, { DropDownOption } from '@/components/atoms/inputs/dropDown';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import Loading from '@/components/molecules/loading';
import ModalBase from '@/components/molecules/modals/modal';
import { EssayPageProps } from '@/components/templates/essay';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import useMarshallStore, { MarshallData } from '@/stores/asphalt/marshall/marshall.store';
import { waterTemperatureList } from '@/utils/waterTemperatureList';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Marshall_Step8_ConfirmCompression = ({
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
    granulometryCompositionData,
    setData,
  } = useMarshallStore();

  const [DMTModalIsOpen, setDMTModalISOpen] = useState(false);
  const [riceTestModalIsOpen, setRiceTestModalIsOpen] = useState(false);
  const [method, setMethod] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const optimumBinderRows = data?.optimumBinder;

  const allMaterials = [...materialSelectionData.aggregates, materialSelectionData.binder];

  const generateColumns: GridColDef[] = [
    {
      field: 'diammeter',
      headerName: t('asphalt.dosages.marshall.diammeter') + '(cm)',
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data?.optimumBinder.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            value={data?.optimumBinder[index]?.diammeter}
            type="number"
            onChange={(e) => {
              const value = e.target.value;

              // Atualiza o estado com a string diretamente
              const newState = [...data.optimumBinder];
              newState[index] = { ...newState[index], diammeter: parseFloat(value) };
              setData({ step: 7, value: { ...data, optimumBinder: newState } });
            }}
          />
        );
      },
    },
    {
      field: 'height',
      headerName: t('asphalt.dosages.marshall.height') + '(cm)',
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data?.optimumBinder.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type="number"
            value={data?.optimumBinder[index]?.height}
            onChange={(e) => {
              const value = e.target.value;

              // Atualiza o estado com a string diretamente
              const newState = [...data.optimumBinder];
              newState[index] = { ...newState[index], height: parseFloat(value) };
              setData({ step: 7, value: { ...data, optimumBinder: newState } });
            }}
          />
        );
      },
    },
    {
      field: 'dryMass',
      headerName: t('asphalt.dosages.marshall.dry-mass') + '(g)',
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data?.optimumBinder.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'g'}
            value={data?.optimumBinder[index]?.dryMass}
            type="number"
            onChange={(e) => {
              const value = e.target.value;

              // Atualiza o estado com a string diretamente
              const newState = [...data.optimumBinder];
              newState[index] = { ...newState[index], dryMass: parseFloat(value) };
              setData({ step: 7, value: { ...data, optimumBinder: newState } });
            }}
          />
        );
      },
    },
    {
      field: 'submergedMass',
      headerName: t('asphalt.dosages.marshall.submerged-mass') + '(g)',
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data.optimumBinder.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'g'}
            value={data?.optimumBinder[index]?.submergedMass}
            type="number"
            onChange={(e) => {
              const value = e.target.value;

              // Atualiza o estado com a string diretamente
              const newState = [...data.optimumBinder];
              newState[index] = { ...newState[index], submergedMass: parseFloat(value) };
              setData({ step: 7, value: { ...data, optimumBinder: newState } });
            }}
          />
        );
      },
    },
    {
      field: 'drySurfaceSaturatedMass',
      headerName: t('asphalt.dosages.marshall.dry-surface-saturated-mass') + '(g)',
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data?.optimumBinder.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'g'}
            value={data?.optimumBinder[index]?.drySurfaceSaturatedMass}
            type="number"
            onChange={(e) => {
              const value = e.target.value;

              // Atualiza o estado com a string diretamente
              const newState = [...data.optimumBinder];
              newState[index] = { ...newState[index], drySurfaceSaturatedMass: parseFloat(value) };
              setData({ step: 7, value: { ...data, optimumBinder: newState } });
            }}
          />
        );
      },
    },
    {
      field: 'stability',
      headerName: t('asphalt.dosages.stability') + ' (kgf)',
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data.optimumBinder.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'kgf'}
            value={data?.optimumBinder[index]?.stability}
            type="number"
            onChange={(e) => {
              const value = e.target.value;

              // Atualiza o estado com a string diretamente
              const newState = [...data.optimumBinder];
              newState[index] = { ...newState[index], stability: parseFloat(value) };
              setData({ step: 7, value: { ...data, optimumBinder: newState } });
            }}
          />
        );
      },
    },
    {
      field: 'fluency',
      headerName: t('asphalt.dosages.marshall.fluency') + ' (mm)',
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data.optimumBinder.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'mm'}
            value={data?.optimumBinder[index]?.fluency}
            type="number"
            onChange={(e) => {
              const value = e.target.value;

              // Atualiza o estado com a string diretamente
              const newState = [...data.optimumBinder];
              newState[index] = { ...newState[index], fluency: parseFloat(value) };
              setData({ step: 7, value: { ...data, optimumBinder: newState } });
            }}
          />
        );
      },
    },
    {
      field: 'diametricalCompressionStrength',
      headerName: t('asphalt.dosages.indirect-tensile-strength') + '(MPa)',
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data?.optimumBinder.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'Mpa'}
            type="number"
            value={data?.optimumBinder[index]?.diametricalCompressionStrength}
            onChange={(e) => {
              const value = e.target.value;

              // Atualiza o estado com a string diretamente
              const newState = [...data.optimumBinder];
              newState[index] = { ...newState[index], diametricalCompressionStrength: parseFloat(value) };
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
      headerName: `${optimumBinderContentData?.optimumBinder?.optimumContent?.toFixed(2)}%`,
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
      headerName: t('asphalt.dosages.marshall.tenor'),
      valueFormatter: () => `${optimumBinderContentData?.optimumBinder?.optimumContent.toFixed(2)}%`,
    },
    {
      field: 'massOfDrySample',
      headerName: t('asphalt.dosages.marshall.dry-sample-mass'),
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
      headerName: t('asphalt.dosages.marshall.container-sample-water-mass'),
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
      headerName: t('asphalt.dosages.marshall.container-water-mass'),
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
    const hasNullValues = maximumMixtureDensityData.listOfSpecificGravities.some((g) => !g);

    if (hasNullValues) {
      toast.error(t('loading.data.nullValuesError'));
      return;
    }

    toast.promise(
      async () => {
        const dmt = await marshall.confirmSpecificGravity(
          granulometryCompositionData,
          maximumMixtureDensityData,
          optimumBinderContentData,
          data,
          false
        );

        const newData = {
          ...data,
          confirmedSpecificGravity: {
            result: dmt.confirmedSpecificGravity?.result,
            method: dmt.confirmedSpecificGravity?.type,
          },
          listOfSpecificGravities: dmt.listOfSpecificGravities,
        };

        setData({ step: 7, value: newData });
        setDMTModalISOpen(false);
      },
      {
        pending: t('loading.data.pending'),
        success: t('loading.data.success'),
        error: t('loading.data.error'),
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
        pending: t('loading.data.pending'),
        success: t('loading.data.success'),
        error: t('loading.data.error'),
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

          if (!data.confirmedSpecificGravity.result && data.gmmInput) {
            newData = {
              ...newData,
              confirmedSpecificGravity: {
                result: parseFloat(data.gmmInput.replace(',', '.')),
                method: 'GMM',
              },
            };
          }

          setIsConfirmed(true);
          setData({ step: 7, value: newData });
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

  useEffect(() => {
    if (method === 'DMT') {
      const prevState = { ...data };
      prevState.dmt = true;
      prevState.gmm = false;
      setData({ step: 7, value: prevState });
    } else if (method === 'GMM') {
      const prevState = { ...data };
      prevState.dmt = false;
      prevState.gmm = true;
      setData({ step: 7, value: prevState });
    }
  }, [method]);

  /**
   * Verifica se a próxima página pode ser acessada,
   * verifica se o método foi selecionado, se o botão de confirmação já foi clicado
   *  e se todos os campos
   * da tabela de compressão estão preenchidos.
   */
  useEffect(() => {
    const isConfirmed = data.confirmedSpecificGravity.result !== null && data.confirmedSpecificGravity.type !== null;
    const hasNullValues = data.optimumBinder.some((row) => Object.values(row).some((value) => value === null));
    const methodIsSelected = Boolean(data.dmt) || Boolean(data.gmm);

    setNextDisabled(!methodIsSelected && hasNullValues && isConfirmed);
  }, [data, method, isConfirmed]);

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
            label={t('asphalt.dosages.marshall.select-mixture-density-method')}
            options={calcMethodOptions}
            value={{
              label: data.dmt ? 'DMT - Densidade máxima teórica' : data.gmm ? 'GMM - Densidade máxima medida' : '',
              value: data.dmt ? 'DMT - Densidade máxima teórica' : data.gmm ? 'GMM - Densidade máxima medida' : '',
            }}
            callback={(selectedOption) => {
              if (selectedOption === 'DMT - Densidade máxima teórica') {
                setMethod('DMT');
                setDMTModalISOpen(true);
              } else if (selectedOption === 'GMM - Densidade máxima medida') {
                setMethod('GMM');
              } else {
                setMethod('');
              }
            }}
            size="medium"
            sx={{ width: '50%', marginX: 'auto' }}
          />

          <DropDown
            key={'water'}
            variant="standard"
            label={t('asphalt.dosages.marshall.water-temperature')}
            options={waterTemperatureList}
            callback={(selectedValue) => {
              const prevData = data;
              const newData = { ...prevData, temperatureOfWater: Number(selectedValue) };
              setData({ step: 7, value: newData });
            }}
            value={{
              label: waterTemperatureList.find((item) => item.value === data.temperatureOfWater)?.label,
              value: data.temperatureOfWater,
            }}
            size="medium"
            sx={{ width: '50%', marginX: 'auto' }}
          />

          {data.dmt ? (
            <Typography variant="h6">
              {t('asphalt.dosages.marshall.binder-trial-dmt') +
                `   ${data?.confirmedSpecificGravity?.result?.toFixed(2)} g/cm³`}
            </Typography>
          ) : data.gmm ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Typography variant="h6">{t('asphalt.dosages.marshall.insert-gmm')}</Typography>
              {data?.confirmedSpecificGravity?.result && (
                <Typography>
                  {t('asphalt.dosages.marshall.gmm-calculated-rice-test') +
                    ` ${
                      data?.confirmedSpecificGravity?.result
                        ? ` ${data?.confirmedSpecificGravity?.result?.toFixed(2)}  g/cm³`
                        : ' ---'
                    }`}
                </Typography>
              )}

              <InputEndAdornment
                adornment={'g/cm³'}
                label={t('asphalt.dosages.marshall.binder-trial-gmm')}
                value={data.gmmInput}
                sx={{ width: '40%' }}
                onChange={(e) => {
                  const prevData: MarshallData['confirmationCompressionData'] = data;
                  const newData = { ...prevData, gmmInput: e.target.value };
                  setData({ step: 7, value: newData });
                }}
              />
              <Button sx={{ width: '100%' }} variant="outlined" onClick={() => setRiceTestModalIsOpen(true)}>
                {t('asphalt.dosages.marshall.rice-test')}
              </Button>
            </Box>
          ) : null}

          <DataGrid
            key={'optimumBinder'}
            columns={generateColumns.map((col) => ({
              ...col,
              width: 150,
              flex: 1,
              headerAlign: 'center',
              align: 'center',
            }))}
            rows={optimumBinderRows}
            experimentalFeatures={{ columnGrouping: true }}
            columnGroupingModel={optimumBinderColumnGroup}
            density="comfortable"
            disableColumnMenu
            disableColumnSelector
            slots={{ footer: () => ExpansionToolbar() }}
          />

          <Button onClick={handleConfirm} variant="outlined">
            {t('asphalt.dosages.marshall.confirm')}
          </Button>

          <ModalBase
            title={t('asphalt.dosages.marshall.insert-real-specific-mass')}
            leftButtonTitle={t('asphalt.dosages.marshall.cancel')}
            rightButtonTitle={t('asphalt.dosages.marshall.confirm')}
            onCancel={() => {
              setData({ step: 7, key: 'dmt', value: false });
              setDMTModalISOpen(false);
            }}
            open={DMTModalIsOpen}
            size={'medium'}
            onSubmit={() => handleSubmitDmt()}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginY: '2rem' }}>
              {allMaterials.map((material, index) => (
                <InputEndAdornment
                  key={material._id}
                  adornment={'g/cm³'}
                  label={material.name}
                  value={maximumMixtureDensityData.listOfSpecificGravities?.length > 0 ? maximumMixtureDensityData.listOfSpecificGravities[index] : []}
                  onChange={(e) => {
                    const prevState = { ...maximumMixtureDensityData };
                    prevState.listOfSpecificGravities[index] = e.target.value;
                    setData({ step: 4, value: prevState });
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
            size={'larger'}
            onSubmit={() => {
              calculateRiceTest();
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
              <DataGrid
                columns={riceTestColumns.map((col, idx) => ({
                  ...col,
                  flex: idx === 0 ? 0.5 : 1,
                  width: 200,
                  headerAlign: 'center',
                  align: 'center',
                }))}
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

export default Marshall_Step8_ConfirmCompression;
