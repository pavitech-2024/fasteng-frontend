import DropDown from '@/components/atoms/inputs/dropDown';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import Loading from '@/components/molecules/loading';
import ModalBase from '@/components/molecules/modals/modal';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Superpave_Step9_SecondCompaction = ({ setNextDisabled, superpave }: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    secondCompressionData: data,
    setData,
    granulometryCompositionData,
    initialBinderData,
    chosenCurvePercentagesData,
    firstCurvePercentagesData,
  } = useSuperpaveStore();

  const [riceTestModalIsOpen, setRiceTestModalIsOpen] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
  });

  const [nProjectPercentsRows_halfLess, setNProjectPercentsRows_halfLess] = useState([]);
  const [nProjectPercentsRows_halfPlus, setNProjectPercentsRows_halfPlus] = useState([]);
  const [nProjectPercentsRows_normal, setNProjectPercentsRows_normal] = useState([]);
  const [nProjectPercentsRows_onePlus, setNProjectPercentsRows_onePlus] = useState([]);

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

  useEffect(() => {
    if (data?.halfLess?.length > 0) setNProjectPercentsRows_halfLess(data.halfLess);
    if (data?.halfPlus?.length > 0) setNProjectPercentsRows_halfPlus(data.halfPlus);
    if (data?.normal?.length > 0) setNProjectPercentsRows_normal(data.normal);
    if (data?.onePlus?.length > 0) setNProjectPercentsRows_onePlus(data.onePlus);
  }, [data]);

  const generateColumns = (idx: string): GridColDef[] => [
    {
      field: 'averageDiammeter',
      headerName: 'Diâmetro médio (cm)',
      width: 160,
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data[`${idx}`].findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type="number"
            value={data[`${idx}`][index]?.averageDiammeter}
            onChange={(e) => {
              const prevData = [...data[`${idx}`]];
              prevData[index].averageDiammeter = parseFloat(e.target.value);
              setData({ step: 8, value: { ...data, [`${idx}`]: prevData } });
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
        const index = data[`${idx}`].findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type="number"
            value={data[`${idx}`][index]?.averageHeight}
            onChange={(e) => {
              const prevData = [...data[`${idx}`]];
              prevData[index].averageHeight = parseFloat(e.target.value);
              setData({ step: 8, value: { ...data, [`${idx}`]: prevData } });
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
        const index = data[`${idx}`].findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'g'}
            type="number"
            value={data[`${idx}`][index]?.dryMass}
            onChange={(e) => {
              const prevData = [...data[`${idx}`]];
              prevData[index].dryMass = parseFloat(e.target.value);
              setData({ step: 8, value: { ...data, [`${idx}`]: prevData } });
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
        const index = data[`${idx}`].findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'g'}
            type="number"
            value={data[`${idx}`][index]?.submergedMass}
            onChange={(e) => {
              const prevData = [...data[`${idx}`]];
              prevData[index].submergedMass = parseFloat(e.target.value);
              setData({ step: 8, value: { ...data, [`${idx}`]: prevData } });
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
        const index = data[`${idx}`].findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'g'}
            type="number"
            value={data[`${idx}`][index]?.drySurfaceSaturatedMass}
            onChange={(e) => {
              const prevData = [...data[`${idx}`]];
              prevData[index].drySurfaceSaturatedMass = parseFloat(e.target.value);
              setData({ step: 8, value: { ...data, [`${idx}`]: prevData } });
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
        const index = data[`${idx}`].findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'N'}
            type="number"
            value={data[`${idx}`][index]?.waterTemperatureCorrection}
            onChange={(e) => {
              const prevData = [...data[`${idx}`]];
              prevData[index].waterTemperatureCorrection = parseFloat(e.target.value);
              setData({ step: 8, value: { ...data, [`${idx}`]: prevData } });
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
        const index = data[`${idx}`].findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'MPa'}
            type="number"
            value={data[`${idx}`][index]?.diametralTractionResistance}
            onChange={(e) => {
              const prevData = [...data[`${idx}`]];
              prevData[index].diametralTractionResistance = parseFloat(e.target.value);
              setData({ step: 8, value: { ...data, [`${idx}`]: prevData } });
            }}
          />
        );
      },
    },
  ];

  const nProjectPercentsGroupings: GridColumnGroupingModel = [
    {
      groupId: `NProject`,
      children: [
        { field: 'averageDiammeter' },
        { field: 'averageHeight' },
        { field: 'dryMass' },
        { field: 'submergedMass' },
        { field: 'drySurfaceSaturatedMass' },
        { field: 'waterTemperatureCorrection' },
        { field: 'diametralTractionResistance' },
      ],
      headerAlign: 'center',
      headerName: `N Projeto`,
    },
  ];

  const handleErase = (idx: string) => {
    try {
      if (data[`${idx}`].length > 1) {
        const newRows = [...data[`${idx}`]];
        newRows.pop();
        setData({ step: 8, value: { ...data, [`${idx}`]: newRows } });
      } else throw t('superpave.error.minReads');
    } catch (error) {
      toast.error(error);
    }
  };

  const handleAdd = (idx: string) => {
    const newRows = [...data[`${idx}`]];
    newRows.push({
      id: data[`${idx}`].length,
      averageDiammeter: null,
      averageHeight: null,
      dryMass: null,
      submergedMass: null,
      drySurfaceSaturatedMass: null,
      waterTemperatureCorrection: null,
      diametralTractionResistance: null,
    });
    setData({ step: 8, value: { ...data, [`${idx}`]: newRows } });
    setNextDisabled(true);
  };

  const ExpansionToolbar = (idx: string) => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem', flexWrap: 'wrap' }}>
        <Button sx={{ color: 'secondaryTons.red' }} onClick={() => handleErase(idx)}>
          {t('erase')}
        </Button>
        <Button sx={{ color: 'secondaryTons.green' }} onClick={() => handleAdd(idx)}>
          {t('add')}
        </Button>
      </Box>
    );
  };

  const maximumDensitiesContainers = [
    {
      id: 0,
      adornment: '',
      label: 'Teor de:',
      value: chosenCurvePercentagesData.listOfPlis[0],
      insertedGmm: null,
      riceTest: {
        sampleAirDryMass: null,
        containerMassWaterSample: null,
        containerWaterMass: null,
        waterTemperatureCorrection: null,
      },
    },
    {
      id: 1,
      adornment: '',
      label: 'Teor de:',
      value: chosenCurvePercentagesData.listOfPlis[1],
      insertedGmm: null,
      riceTest: {
        sampleAirDryMass: null,
        containerMassWaterSample: null,
        containerWaterMass: null,
        waterTemperatureCorrection: null,
      },
    },
    {
      id: 2,
      adornment: '',
      label: 'Teor de:',
      value: chosenCurvePercentagesData.listOfPlis[2],
      insertedGmm: null,
      riceTest: {
        sampleAirDryMass: null,
        containerMassWaterSample: null,
        containerWaterMass: null,
        waterTemperatureCorrection: null,
      },
    },
    {
      id: 3,
      adornment: '',
      label: 'Teor de:',
      value: chosenCurvePercentagesData.listOfPlis[3],
      insertedGmm: null,
      riceTest: {
        sampleAirDryMass: null,
        containerMassWaterSample: null,
        containerWaterMass: null,
        waterTemperatureCorrection: null,
      },
    },
  ];

  const confirmBtn = () => {
    toast.promise(
      async () => {
        try {
          console.log('chegou aqui');
          const response = await superpave.confirmSecondCompression(
            data,
            granulometryCompositionData,
            initialBinderData,
            firstCurvePercentagesData
          );

          const value = response;

          let prevData = { ...data };

          prevData = { ...prevData, ...value };

          setData({ step: 8, value: prevData });
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
    const allTablesAreComplete = [data.halfLess, data.halfPlus, data.onePlus, data.normal].every((table) =>
      table.every((row) => Object.values(row).every((value) => value !== null))
    );

    const maximumDensitiesAreComplete = data.maximumDensities.every((container) => container.insertedGmm !== null);

    if (allTablesAreComplete && maximumDensitiesAreComplete) {
      setNextDisabled(false);
    } else {
      setNextDisabled(true);
    }
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
          }}
        >
          <Box>
            <Typography variant="h6" style={{ textAlign: 'center' }}>
              Porcentagem dos materiais a partir do teor de ligante estimado para Vv:{' '}
              {`${chosenCurvePercentagesData.listOfPlis[0].toFixed(2)}`}
            </Typography>
            {nProjectPercentsRows_halfLess?.length > 0 && (
              <DataGrid
                disableColumnMenu
                disableColumnFilter
                experimentalFeatures={{ columnGrouping: true }}
                columnGroupingModel={nProjectPercentsGroupings}
                columns={generateColumns('halfLess').map((column) => ({
                  ...column,
                  disableColumnMenu: true,
                  sortable: false,
                  align: 'center',
                  headerAlign: 'center',
                  minWidth: 100,
                  flex: 1,
                }))}
                rows={nProjectPercentsRows_halfLess}
                slots={{ footer: () => ExpansionToolbar('halfLess') }}
              />
            )}
          </Box>

          <Box>
            <Typography variant="h6" style={{ textAlign: 'center' }}>
              Porcentagem dos materiais a partir do teor de ligante estimado para Vv:{' '}
              {`${chosenCurvePercentagesData.listOfPlis[1].toFixed(2)}`}
            </Typography>
            <DataGrid
              disableColumnMenu
              disableColumnFilter
              experimentalFeatures={{ columnGrouping: true }}
              columnGroupingModel={nProjectPercentsGroupings}
              columns={generateColumns('halfPlus').map((column) => ({
                ...column,
                disableColumnMenu: true,
                sortable: false,
                align: 'center',
                headerAlign: 'center',
                minWidth: 100,
                flex: 1,
              }))}
              rows={nProjectPercentsRows_halfPlus}
              slots={{ footer: () => ExpansionToolbar('halfPlus') }}
            />
          </Box>

          <Box>
            <Typography variant="h6" style={{ textAlign: 'center' }}>
              Porcentagem dos materiais a partir do teor de ligante estimado para Vv:
              {`${chosenCurvePercentagesData.listOfPlis[2].toFixed(2)}`}
            </Typography>
            <DataGrid
              disableColumnMenu
              disableColumnFilter
              experimentalFeatures={{ columnGrouping: true }}
              columnGroupingModel={nProjectPercentsGroupings}
              columns={generateColumns('normal').map((column) => ({
                ...column,
                disableColumnMenu: true,
                sortable: false,
                align: 'center',
                headerAlign: 'center',
                minWidth: 100,
                flex: 1,
              }))}
              rows={nProjectPercentsRows_normal}
              slots={{ footer: () => ExpansionToolbar('normal') }}
            />
          </Box>

          <Box>
            <Typography variant="h6" style={{ textAlign: 'center' }}>
              Porcentagem dos materiais a partir do teor de ligante estimado para Vv:
              {`${chosenCurvePercentagesData.listOfPlis[3].toFixed(2)}`}
            </Typography>
            <DataGrid
              disableColumnMenu
              disableColumnFilter
              experimentalFeatures={{ columnGrouping: true }}
              columnGroupingModel={nProjectPercentsGroupings}
              columns={generateColumns('onePlus').map((column) => ({
                ...column,
                disableColumnMenu: true,
                sortable: false,
                align: 'center',
                headerAlign: 'center',
                minWidth: 100,
                flex: 1,
              }))}
              rows={nProjectPercentsRows_onePlus}
              slots={{ footer: () => ExpansionToolbar('onePlus') }}
            />
          </Box>

          <Box style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Typography variant="h6" style={{ textAlign: 'center' }}>
              Densidade máxima medida
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '2rem' }}>
              {maximumDensitiesContainers.map((item, idx) => (
                <>
                  <Box style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Typography style={{ textAlign: 'center' }}>
                      {item.label} {item.value.toFixed(2)}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => setRiceTestModalIsOpen({ ...riceTestModalIsOpen, [idx]: true })}
                    >
                      Calcular densidade máxima da mistura
                    </Button>
                  </Box>
                  {Object.values(riceTestModalIsOpen).some((item) => item === true) && (
                    <ModalBase
                      title={t('asphalt.dosages.superpave.calculate-rice-test')}
                      leftButtonTitle={'cancelar'}
                      rightButtonTitle={'confirmar'}
                      onCancel={() => setRiceTestModalIsOpen({ ...riceTestModalIsOpen, [idx]: false })}
                      open={riceTestModalIsOpen[idx]}
                      size={'large'}
                      onSubmit={() => setRiceTestModalIsOpen({ ...riceTestModalIsOpen, [idx]: false })}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <InputEndAdornment
                          adornment=""
                          type="number"
                          label="Inserir Gmm"
                          sx={{ width: '20rem' }}
                          value={data.maximumDensities[idx].insertedGmm}
                          onChange={(e) => {
                            const value = e.target.value;
                            const prevData = [...data.maximumDensities];
                            const newData = { ...prevData[idx], insertedGmm: parseFloat(value) };
                            prevData[idx] = newData;
                            setData({ step: 8, value: { ...data, maximumDensities: prevData } });
                          }}
                        />

                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '2rem' }}>
                          {Object.keys(item.riceTest)
                            .filter((key) => key !== 'waterTemperatureCorrection')
                            .map((key) => (
                              <InputEndAdornment
                                key={key}
                                adornment={item.adornment}
                                label={key}
                                type="number"
                                value={data.maximumDensities[idx]?.riceTest[key] || ''}
                                sx={{ width: '15rem' }}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const prevData = [...data.maximumDensities];
                                  const newRiceTest = { ...prevData[idx].riceTest, [key]: Number(value) };
                                  prevData[idx] = { ...prevData[idx], riceTest: newRiceTest };
                                  setData({ step: 8, value: { ...data, maximumDensities: prevData } });
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
                            const prevData = [...data.maximumDensities];

                            const newRiceTest = {
                              ...prevData[idx].riceTest,
                              waterTemperatureCorrection: Number(selectedValue),
                            };

                            prevData[idx] = { ...prevData[idx], riceTest: newRiceTest };

                            setData({ step: 8, value: { ...data, maximumDensities: prevData } });
                          }}
                          size="medium"
                          sx={{ width: '20rem' }}
                        />
                      </Box>
                    </ModalBase>
                  )}
                </>
              ))}
            </Box>

            <Button onClick={() => confirmBtn()} variant="outlined" sx={{ width: '100%' }}>
              {t('asphalt.dosages.superpave.confirm')}
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Superpave_Step9_SecondCompaction;
