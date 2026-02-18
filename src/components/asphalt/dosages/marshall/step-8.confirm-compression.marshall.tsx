import DropDown, { DropDownOption } from '@/components/atoms/inputs/dropDown';
import InputNumberBr from '@/components/atoms/inputs/inputNumberBr';
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
    binderTrialData,
    granulometryCompositionData,
    setData,
  } = useMarshallStore();

  const [DMTModalIsOpen, setDMTModalISOpen] = useState(false);
  const [riceTestModalIsOpen, setRiceTestModalIsOpen] = useState(false);
  const [method, setMethod] = useState('');
  const optimumBinderRows = data?.optimumBinder || [];

  // 🔥 LOG para debug e inicialização do method
  useEffect(() => {
    console.log('📊 Dados carregados na step 8:', {
      gmm: data?.gmm,
      confirmedSpecificGravity: data?.confirmedSpecificGravity,
      riceTest: data?.riceTest,
      method: data?.confirmedSpecificGravity?.type
    });
    
    if (data?.confirmedSpecificGravity?.type === 'DMT') {
      setMethod('DMT');
    } else if (data?.confirmedSpecificGravity?.type === 'GMM' || data?.gmm) {
      setMethod('GMM');
    }
  }, [data?.confirmedSpecificGravity, data?.gmm, data?.riceTest]);

  // Função para verificar se TODOS os campos estão preenchidos
  const checkAllFieldsComplete = () => {
    console.log('🔍 Verificando se todos os campos estão preenchidos...');

    // 1. Verificar se o método foi selecionado
    if (!method) {
      console.log('❌ Método não selecionado');
      return false;
    }

    // 2. Verificar se a temperatura da água está preenchida
    if (
      maximumMixtureDensityData?.temperatureOfWater === null ||
      maximumMixtureDensityData?.temperatureOfWater === undefined
    ) {
      console.log('❌ Temperatura da água não preenchida');
      return false;
    }

    // 3. Verificar se todos os campos da tabela optimumBinder estão preenchidos
    if (!optimumBinderRows || optimumBinderRows.length === 0) {
      console.log('❌ Tabela optimumBinder vazia');
      return false;
    }

    const hasEmptyFieldsInTable = optimumBinderRows.some((row) => {
      const isEmpty =
        row.diammeter === null ||
        row.diammeter === undefined ||
        row.height === null ||
        row.height === undefined ||
        row.dryMass === null ||
        row.dryMass === undefined ||
        row.submergedMass === null ||
        row.submergedMass === undefined ||
        row.drySurfaceSaturatedMass === null ||
        row.drySurfaceSaturatedMass === undefined ||
        row.stability === null ||
        row.stability === undefined ||
        row.fluency === null ||
        row.fluency === undefined ||
        row.diametricalCompressionStrength === null ||
        row.diametricalCompressionStrength === undefined;
      return isEmpty;
    });

    if (hasEmptyFieldsInTable) {
      console.log('❌ Campos da tabela optimumBinder não estão todos preenchidos');
      return false;
    }

    // 4. Verificar DMT ou GMM específico
    if (method === 'DMT') {
      // Para DMT: verificar se confirmedSpecificGravity está preenchido
      if (data?.confirmedSpecificGravity?.result === null || data?.confirmedSpecificGravity?.result === undefined) {
        console.log('❌ DMT: confirmedSpecificGravity não preenchido');
        return false;
      }
    } else if (method === 'GMM') {
      const hasGmmValue = data?.gmm !== null && data?.gmm !== undefined;
      const hasRiceTestValue =
        data?.confirmedSpecificGravity?.result !== null && data?.confirmedSpecificGravity?.result !== undefined;

      console.log('📊 GMM check:', {
        hasGmmValue,
        gmmValue: data?.gmm,
        hasRiceTestValue,
        riceTestValue: data?.confirmedSpecificGravity?.result,
      });

      if (!hasGmmValue && !hasRiceTestValue) {
        console.log('❌ GMM: nem gmm inserido nem riceTest calculado');
        return false;
      }

      console.log('✅ GMM: Valor válido encontrado (inserido ou calculado)');
    }

    console.log('✅ Todos os campos estão preenchidos!');
    return true;
  };

  // Efeito para controlar o botão "Próximo"
  useEffect(() => {
    const complete = checkAllFieldsComplete();

    if (setNextDisabled) {
      setNextDisabled(!complete);
      console.log(`🔄 Botão "Próximo" ${complete ? 'HABILITADO' : 'DESABILITADO'}`);
    }
  }, [
    method,
    maximumMixtureDensityData?.temperatureOfWater,
    data?.optimumBinder,
    data?.confirmedSpecificGravity,
    data?.gmm,
    data?.riceTest,
    optimumBinderRows,
    setNextDisabled,
  ]);

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
        pending: t('loading.data.pending'),
        success: t('loading.data.success'),
        error: t('loading.data.error'),
      }
    );
  }, []);

  const generateColumns: GridColDef[] = [
    {
      field: 'diammeter',
      headerName: t('asphalt.dosages.marshall.diammeter') + '(cm)',
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data?.optimumBinder?.findIndex((r) => r.id === id) || 0;
        return (
          <InputNumberBr
            adornment={'cm'}
            value={data?.optimumBinder?.[index]?.diammeter}
            onChange={(value: number | null) => {
              const newState = [...(data.optimumBinder || [])];
              newState[index] = { ...newState[index], diammeter: value };
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
        const index = data?.optimumBinder?.findIndex((r) => r.id === id) || 0;
        return (
          <InputNumberBr
            adornment={'cm'}
            value={data?.optimumBinder?.[index]?.height}
            onChange={(value: number | null) => {
              const newState = [...(data.optimumBinder || [])];
              newState[index] = { ...newState[index], height: value };
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
        const index = data?.optimumBinder?.findIndex((r) => r.id === id) || 0;
        return (
          <InputNumberBr
            adornment={'g'}
            value={data?.optimumBinder?.[index]?.dryMass}
            onChange={(value: number | null) => {
              const newState = [...(data.optimumBinder || [])];
              newState[index] = { ...newState[index], dryMass: value };
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
        const index = data?.optimumBinder?.findIndex((r) => r.id === id) || 0;
        return (
          <InputNumberBr
            adornment={'g'}
            value={data?.optimumBinder?.[index]?.submergedMass}
            onChange={(value: number | null) => {
              const newState = [...(data.optimumBinder || [])];
              newState[index] = { ...newState[index], submergedMass: value };
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
        const index = data?.optimumBinder?.findIndex((r) => r.id === id) || 0;
        return (
          <InputNumberBr
            adornment={'g'}
            value={data?.optimumBinder?.[index]?.drySurfaceSaturatedMass}
            onChange={(value: number | null) => {
              const newState = [...(data.optimumBinder || [])];
              newState[index] = { ...newState[index], drySurfaceSaturatedMass: value };
              setData({ step: 7, value: { ...data, optimumBinder: newState } });
            }}
          />
        );
      },
    },
    {
      field: 'stability',
      headerName: t('asphalt.dosages.stability') + ' (N)',
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data?.optimumBinder?.findIndex((r) => r.id === id) || 0;
        return (
          <InputNumberBr
            adornment={'N'}
            value={data?.optimumBinder?.[index]?.stability}
            onChange={(value: number | null) => {
              const newState = [...(data.optimumBinder || [])];
              newState[index] = { ...newState[index], stability: value };
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
        const index = data?.optimumBinder?.findIndex((r) => r.id === id) || 0;
        return (
          <InputNumberBr
            adornment={'mm'}
            value={data?.optimumBinder?.[index]?.fluency}
            onChange={(value: number | null) => {
              const newState = [...(data.optimumBinder || [])];
              newState[index] = { ...newState[index], fluency: value };
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
        const index = data?.optimumBinder?.findIndex((r) => r.id === id) || 0;
        return (
          <InputNumberBr
            adornment={'MPa'}
            value={data?.optimumBinder?.[index]?.diametricalCompressionStrength}
            onChange={(value: number | null) => {
              const newState = [...(data.optimumBinder || [])];
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
      headerName: `${optimumBinderContentData?.optimumBinder?.optimumContent?.toFixed(2) || '0.00'}%`,
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

  const calcMethodOptions: DropDownOption[] = [
    { label: 'DMT - Densidade máxima teórica', value: 'DMT - Densidade máxima teórica' },
    { label: 'GMM - Densidade máxima medida', value: 'GMM - Densidade máxima medida' },
  ];

  const riceTestRows = data?.riceTest ? [data.riceTest] : [];

  const riceTestColumns: GridColDef[] = [
    {
      field: 'Teor',
      headerName: t('asphalt.dosages.marshall.tenor'),
      valueFormatter: () => {
        const content = optimumBinderContentData?.optimumBinder?.optimumContent;
        return content ? `${content.toFixed(2)}%` : '---';
      },
    },
    {
      field: 'massOfDrySample',
      headerName: t('asphalt.dosages.marshall.dry-sample-mass'),
      renderCell: () => {
        return (
          <InputNumberBr
            adornment={'g'}
            value={data?.riceTest?.massOfDrySample}
            onChange={(value: number | null) => {
              const prevData = data.riceTest || {};
              const newData = { ...prevData, massOfDrySample: value };
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
          <InputNumberBr
            adornment={'g'}
            value={data?.riceTest?.massOfContainerWaterSample}
            onChange={(value: number | null) => {
              const prevData = data.riceTest || {};
              const newData = { ...prevData, massOfContainerWaterSample: value };
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
          <InputNumberBr
            adornment={'g'}
            value={data?.riceTest?.massOfContainerWater}
            onChange={(value: number | null) => {
              const prevData = data.riceTest || {};
              const newData = { ...prevData, massOfContainerWater: value };
              setData({ step: 7, value: { ...data, riceTest: newData } });
            }}
          />
        );
      },
    },
  ];

  const handleSubmitDmt = async () => {
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
            // 🔥 SALVA O RESULTADO NO confirmedSpecificGravity
            confirmedSpecificGravity: {
              result: dmt.maxSpecificGravity,
              type: 'DMT'
            }
          };

          setData({ step: 7, value: newData });
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
            // 🔥 GARANTE QUE O RESULTADO VAI PRO confirmedSpecificGravity
            confirmedSpecificGravity: {
              result: riceTest?.confirmedSpecificGravity?.result,
              type: 'GMM'
            }
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
    console.log('🔄 Iniciando cálculo de parâmetros volumétricos...');
    console.log('📊 Dados enviados:', {
      optimumBinderRows,
      method,
      temperature: maximumMixtureDensityData?.temperatureOfWater,
      confirmedSpecificGravity: data?.confirmedSpecificGravity,
      gmm: data?.gmm,
      gmmValueToUse:
        method === 'GMM' ? data?.gmm || data?.confirmedSpecificGravity?.result : data?.confirmedSpecificGravity?.result,
    });

    toast.promise(
      async () => {
        try {
          let newData = {};

          const dataToSend = {
            ...data,
            confirmedSpecificGravity: {
              result:
                method === 'GMM'
                  ? data?.gmm || data?.confirmedSpecificGravity?.result || 0
                  : data?.confirmedSpecificGravity?.result || 0,
              type: method,
            },
          };

          console.log('📤 Dados enviados para confirmVolumetricParameters:', dataToSend);

          const confirmVP = await marshall.confirmVolumetricParameters(
            maximumMixtureDensityData,
            optimumBinderContentData,
            dataToSend
          );

          console.log('✅ Resposta do backend:', confirmVP);

          newData = {
            ...data,
            ...confirmVP,
            // 🔥 MANTÉM O GMM TAMBÉM
            gmm: data?.gmm,
            confirmedSpecificGravity: {
              result: confirmVP?.confirmedSpecificGravity?.result || dataToSend.confirmedSpecificGravity.result,
              type: method,
            },
          };

          setData({ step: 7, value: newData });
        } catch (error) {
          console.error('💥 Erro no handleConfirm:', error);
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
      if (data?.optimumBinder && data.optimumBinder.length > 1) {
        const newRows = [...data.optimumBinder];
        newRows.pop();
        setData({ step: 7, value: { ...data, optimumBinder: newRows } });
      } else throw t('ddui.error.minReads');
    } catch (error) {
      toast.error(error as string);
    }
  };

  const handleAdd = () => {
    const newRows = [...(data?.optimumBinder || [])];
    newRows.push({
      id: newRows.length,
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
            sx={{ width: '75%', marginX: 'auto' }}
          />
          {maximumMixtureDensityData?.maxSpecificGravity?.method === 'DMT' ? (
            <Typography variant="h6">
              {t('asphalt.dosages.marshall.binder-trial-dmt') +
                `${data?.confirmedSpecificGravity?.result?.toFixed(2) || '0.00'} g/cm³`}
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Typography variant="h6">{t('asphalt.dosages.marshall.insert-gmm')}</Typography>
              <Typography>
                {t('asphalt.dosages.marshall.gmm-calculated-rice-test') +
                  ` ${
                    data?.gmm
                      ? `${Number(data.gmm).toFixed(2)} g/cm³`
                      : data?.confirmedSpecificGravity?.result
                      ? `${Number(data.confirmedSpecificGravity.result).toFixed(2)} g/cm³`
                      : '---'
                  }`}
              </Typography>
              <InputNumberBr
                adornment={'g/cm³'}
                label={t('asphalt.dosages.marshall.binder-trial-gmm')}
                value={data?.gmm}
                onChange={(value: number | null) => {
                  const prevData: MarshallData['confirmationCompressionData'] = data;
                  const newData = {
                    ...prevData,
                    gmm: value,
                    // 🔥 QUANDO DIGITA MANUAL, TAMBÉM ATUALIZA O confirmedSpecificGravity
                    confirmedSpecificGravity: {
                      result: value,
                      type: 'GMM'
                    }
                  };
                  setData({ step: 7, value: newData });
                }}
              />
              <Button sx={{ width: '100%' }} variant="outlined" onClick={() => setRiceTestModalIsOpen(true)}>
                {t('asphalt.dosages.marshall.rice-test')}
              </Button>
            </Box>
          )}
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
            onCancel={() => setDMTModalISOpen(false)}
            open={DMTModalIsOpen}
            size={'larger'}
            onSubmit={() => handleSubmitDmt()}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginY: '2rem' }}>
              {maximumMixtureDensityData.missingSpecificMass &&
                maximumMixtureDensityData.missingSpecificMass.map((material) => (
                  <InputNumberBr
                    key={material._id}
                    adornment={'g/cm³'}
                    label={material.name}
                    value={material.value}
                    onChange={(value: number | null) => {
                      const prevState = { ...maximumMixtureDensityData };
                      const updatedMissingMass = [...(prevState.missingSpecificMass || [])];
                      const index = updatedMissingMass.findIndex((item) => item._id === material._id);

                      if (index !== -1) {
                        updatedMissingMass[index] = { ...updatedMissingMass[index], value };
                        const newState = {
                          ...prevState,
                          missingSpecificMass: updatedMissingMass,
                        };
                        setData({ step: 4, value: newState });
                      }
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