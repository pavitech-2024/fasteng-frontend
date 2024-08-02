import DropDown from '@/components/atoms/inputs/dropDown';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import Loading from '@/components/molecules/loading';
import ModalBase from '@/components/molecules/modals/modal';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColumnGroupingModel } from '@mui/x-data-grid';
import { t } from 'i18next';
import { ChangeEvent, useState } from 'react';
import { toast } from 'react-toastify';

const Superpave_Step10 = ({
  nextDisabled,
  setNextDisabled,
  superpave,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { materialSelectionData, confirmationCompressionData: data, setData } = useSuperpaveStore();

  const [modalIsOpen, setModalIsOpen] = useState(false);

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

  const waterTemperatureList = [];

  const formatedWaterTempList = Object.keys(list).forEach((key) => {
    waterTemperatureList.push({
      label: key,
      value: list[key],
    });
  });

  const confirmationCompressionCols = [
    {
      field: 'averageDiammeter',
      headerName: 'Diâmetro médio (cm)',
      width: 160,
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data.table.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type="text"
            value={data.table[index]?.averageDiammeter}
            onChange={(e) => {
              const prevData = [...data.table];
              prevData[index].averageDiammeter = parseFloat(e.target.value);
              setData({ step: 9, value: { ...data, table: prevData } });
            }}
          />
        );
      },
    },
    {
      field: 'averageHeight',
      headerName: 'Altura média (cm)',
      width: 150,
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data.table.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type="number"
            value={data.table[index]?.averageHeight}
            onChange={(e) => {
              const prevData = [...data.table];
              prevData[index].averageHeight = parseFloat(e.target.value);
              setData({ step: 7, value: { ...data, table: prevData } });
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
        const index = data.table.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'g'}
            type="number"
            value={data.table[index]?.dryMass}
            onChange={(e) => {
              const prevData = [...data.table];
              prevData[index].dryMass = parseFloat(e.target.value);
              setData({ step: 7, value: { ...data, table: prevData } });
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
        const index = data.table.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type="number"
            value={data.table[index]?.submergedMass}
            onChange={(e) => {
              const prevData = [...data.table];
              prevData[index].submergedMass = parseFloat(e.target.value);
              setData({ step: 7, value: { ...data, table: prevData } });
            }}
          />
        );
      },
    },
    {
      field: 'drySurfaceSaturatedMass',
      headerName: 'Massa saturada com superfície seca (g)',
      width: 150,
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data.table.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type="number"
            value={data.table[index]?.drySurfaceSaturatedMass}
            onChange={(e) => {
              const prevData = [...data.table];
              prevData[index].drySurfaceSaturatedMass = parseFloat(e.target.value);
              setData({ step: 7, value: { ...data, table: prevData } });
            }}
          />
        );
      },
    },
    {
      field: 'waterTemperatureCorrection',
      headerName: 'Fator de correção da temperatura da água (N)',
      width: 150,
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data.table.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type="number"
            value={data.table[index]?.waterTemperatureCorrection}
            onChange={(e) => {
              const prevData = [...data.table];
              prevData[index].waterTemperatureCorrection = parseFloat(e.target.value);
              setData({ step: 7, value: { ...data, table: prevData } });
            }}
          />
        );
      },
    },
    {
      field: 'diametralTractionResistance',
      headerName: 'Resistência à tração por compressão diametral (MPa)',
      width: 150,
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data.table.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type="number"
            value={data.table[index]?.diametralTractionResistance}
            onChange={(e) => {
              const prevData = [...data.table];
              prevData[index].diametralTractionResistance = parseFloat(e.target.value);
              setData({ step: 7, value: { ...data, table: prevData } });
            }}
          />
        );
      },
    },
  ];

  const confirmationCompressionRows = [
    {
      id: data.table[0].id,
      averageDiammeter: data.table[0].averageDiammeter,
      averageHeight: data.table[0].averageHeight,
      dryMass: data.table[0].dryMass,
      submergedMass: data.table[0].submergedMass,
      drySurfaceSaturatedMass: data.table[0].drySurfaceSaturatedMass,
      waterTemperatureCorrection: data.table[0].waterTemperatureCorrection,
      diametralTractionResistance: data.table[0].diametralTractionResistance,
    },
  ];

  const gmmInputs = [
    {
      key: 'sampleAirDryMass',
      value: data.riceTest.sampleAirDryMass,
      adornment: 'g',
      placeHolder: 'Massa da amostra seca ao ar',
    },
    {
      key: 'containerSampleWaterMass',
      value: data.riceTest.containerSampleWaterMass,
      adornment: 'g',
      placeHolder: 'Massa do recipiente + amostra + água (g)',
    },
    {
      key: 'containerWaterMass',
      value: data.riceTest.containerWaterMass,
      adornment: 'g',
      placeHolder: 'Massa do recipiente + água (g)',
    },
  ];

  const handleErase = () => {
    try {
      if (data.table.length > 1) {
        const newRows = [...data.table];
        newRows.pop();
        setData({ step: 7, value: { ...data, table: newRows } });
      } else throw t('superpave.error.minReads');
    } catch (error) {
      toast.error(error);
    }
  };

  const handleAdd = () => {
    const newRows = [...data.table];
    newRows.push({
      id: data.table.length,
      averageDiammeter: null,
      averageHeight: null,
      dryMass: null,
      submergedMass: null,
      drySurfaceSaturatedMass: null,
      waterTemperatureCorrection: null,
      diametralTractionResistance: null,
    });
    setData({ step: 7, value: { ...data, table: newRows } });
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

  const handleGmmSubmit = () => {
    const { temperatureOfWater, ...riceTestWithoutWaterTemp } = data.riceTest;
    const riceTestHasValues = Object.values(riceTestWithoutWaterTemp).some((item) => item !== null)
    if (riceTestHasValues) {
      toast.error(t('asphalt.dosages.superpave.rice-test-empty-values'))
    } else if (!riceTestHasValues && data.gmm === null) {
      toast.error(t('asphalt.dosages.superpave.gmm-empty'))
    } else if (!riceTestHasValues && data.gmm !== null && data.riceTest.temperatureOfWater === null) {
      toast.error(t('asphalt.dosages.superpave.water-temperature-empty'))
    } else {
      toast.promise(
        async () => {
          try {
            const {
              data: resData,
              success,
              error,
            } = await superpave.calculateRiceTestStep9(data);
  
            if (success) {
              const newData = { ...data, ...resData };
              setData({
                step: 9,
                value: newData,
              });
              setModalIsOpen(false)
            } else {
              console.error(`${error}`);
            }
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
    }
  }

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
          <Typography>Gmm do teor de ligante asfaltico ótimo: {data.gmm}</Typography>

          <Button variant="outlined" onClick={() => setModalIsOpen(true)}>
            Calcular densidade máxima da mistura
          </Button>

          <DataGrid
            hideFooter
            disableColumnMenu
            disableColumnFilter
            experimentalFeatures={{ columnGrouping: true }}
            columns={confirmationCompressionCols}
            rows={confirmationCompressionRows}
            slots={{ footer: ExpansionToolbar }}
          />

          <ModalBase
            leftButtonTitle={'cancelar'}
            rightButtonTitle={'confirmar'}
            oneButton={true}
            onCancel={() => setModalIsOpen(false)}
            open={modalIsOpen}
            size={'large'}
            title={''}
            onSubmit={handleGmmSubmit}
            singleButtonTitle={t('asphalt.dosages.superpave.confirm')}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              <InputEndAdornment
                adornment={''}
                label={t('asphalt.dosages.superpave.insert-gmm')}
                value={data.gmm}
                onChange={(e) => setData({ step: 9, key: 'gmm', value: e.target.value })}
              />

              <Box sx={{ display: 'flex', flexDirection: 'row', gap: '2rem' }}>
                {gmmInputs.map((input) => (
                  <InputEndAdornment
                    key={input.key}
                    adornment={input.adornment}
                    placeholder={input.placeHolder}
                    value={input.value}
                    onChange={(e) => {
                      const prevData = { ...data.riceTest };
                      prevData[input.key] = e.target.value;
                      setData({ step: 9, value: { ...data, riceTest: prevData } });
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
                  let prevData = { ...data.riceTest };
                  const newData = { ...prevData, temperatureOfWater: Number(selectedValue) };
                  prevData = newData;
                  setData({ step: 9, value: { ...data, riceTest: prevData } });
                }}
                size="medium"
                sx={{ width: '100%' }}
              />
            </Box>
          </ModalBase>
        </Box>
      )}
    </>
  );
};

export default Superpave_Step10;
