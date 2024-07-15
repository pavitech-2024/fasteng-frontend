import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Superpave_Step8 = ({
  nextDisabled,
  setNextDisabled,
  superpave,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    materialSelectionData,
    secondCompressionData: data,
    setData,
    chosenCurvePercentagesData,
  } = useSuperpaveStore();

  const [nProjectPercentsRows_0, setNProjectPercentsRows_0] = useState([]);
  const [nProjectPercentsRows_1, setNProjectPercentsRows_1] = useState([]);
  const [nProjectPercentsRows_2, setNProjectPercentsRows_2] = useState([]);
  const [nProjectPercentsRows_3, setNProjectPercentsRows_3] = useState([]);

  const { user } = useAuth();

  useEffect(() => {
    setNProjectPercentsRows_0(data.tableData_0);
    setNProjectPercentsRows_1(data.tableData_1);
    setNProjectPercentsRows_2(data.tableData_2);
    setNProjectPercentsRows_3(data.tableData_3);
  }, [data]);

  const generateColumns = (idx: string): GridColDef[] => [
    {
      field: 'averageDiammeter',
      headerName: 'Diâmetro médio (cm)',
      width: 160,
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data[`tableData${idx}`].findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type="text"
            value={data[`tableData${idx}`][index]?.averageDiammeter}
            onChange={(e) => {
              let prevData = [...data[`tableData${idx}`]];
              prevData[index].averageDiammeter = parseFloat(e.target.value);
              setData({ step: 7, value: { ...data, [`tableData${idx}`]: prevData } });
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
        const index = data[`tableData${idx}`].findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type="number"
            value={data[`tableData${idx}`][index]?.averageHeight}
            onChange={(e) => {
              let prevData = [...data[`tableData${idx}`]];
              prevData[index].averageHeight = parseFloat(e.target.value);
              setData({ step: 7, value: { ...data, [`tableData${idx}`]: prevData } });
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
        const index = data[`tableData${idx}`].findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type="number"
            value={data[`tableData${idx}`][index]?.submergedMass}
            onChange={(e) => {
              let prevData = [...data[`tableData${idx}`]];
              prevData[index].submergedMass = parseFloat(e.target.value);
              setData({ step: 7, value: { ...data, [`tableData${idx}`]: prevData } });
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
        const index = data[`tableData${idx}`].findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type="number"
            value={data[`tableData${idx}`][index]?.drySurfaceSaturatedMass}
            onChange={(e) => {
              let prevData = [...data[`tableData${idx}`]];
              prevData[index].drySurfaceSaturatedMass = parseFloat(e.target.value);
              setData({ step: 7, value: { ...data, [`tableData${idx}`]: prevData } });
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
        const index = data[`tableData${idx}`].findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type="number"
            value={data[`tableData${idx}`][index]?.waterTemperatureCorrection}
            onChange={(e) => {
              let prevData = [...data[`tableData${idx}`]];
              prevData[index].waterTemperatureCorrection = parseFloat(e.target.value);
              setData({ step: 7, value: { ...data, [`tableData${idx}`]: prevData } });
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
        const index = data[`tableData${idx}`].findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type="number"
            value={data[`tableData${idx}`][index]?.diametralTractionResistance}
            onChange={(e) => {
              let prevData = [...data[`tableData${idx}`]];
              prevData[index].diametralTractionResistance = parseFloat(e.target.value);
              setData({ step: 7, value: { ...data, [`tableData${idx}`]: prevData } });
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
      ],
      headerAlign: 'center',
      headerName: `N Projeto`,
    },
  ];

  const handleErase = (idx: string) => {
    try {
      if (data[`tableData${idx}`].length > 1) {
        const newRows = [...data[`tableData${idx}`]];
        newRows.pop();
        setData({ step: 7, value: { ...data, [`tableData${idx}`]: newRows } });
      } else throw t('superpave.error.minReads');
    } catch (error) {
      toast.error(error);
    }
  };

  const handleAdd = (idx: string) => {
    const newRows = [...data[`tableData${idx}`]];
    newRows.push({
      id: data[`tableData${idx}`].length,
      averageDiammeter: null,
      averageHeight: null,
      dryMass: null,
      submergedMass: null,
      drySurfaceSaturatedMass: null,
      waterTemperatureCorrection: null,
      diametralTractionResistance: null,
    });
    setData({ step: 7, value: { ...data, [`tableData${idx}`]: newRows } });
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
      label: 'Teor de:',
      value: chosenCurvePercentagesData.listOfPlis[0],
      insertedGmm: null,
      riceTest: {
        sampleAirDryMass: null,
        containerMassWaterSample: null,
        containerWaterMass: null,
        waterTemperatureCorrection: null
      }
    },
    {
      id: 1,
      label: 'Teor de:',
      value: chosenCurvePercentagesData.listOfPlis[1],
      insertedGmm: null,
      riceTest: {
        sampleAirDryMass: null,
        containerMassWaterSample: null,
        containerWaterMass: null,
        waterTemperatureCorrection: null
      }
    },
    {
      id: 2,
      label: 'Teor de:',
      value: chosenCurvePercentagesData.listOfPlis[2],
      insertedGmm: null,
      riceTest: {
        sampleAirDryMass: null,
        containerMassWaterSample: null,
        containerWaterMass: null,
        waterTemperatureCorrection: null
      }
    },
    {
      id: 3,
      label: 'Teor de:',
      value: chosenCurvePercentagesData.listOfPlis[3],
      insertedGmm: null,
      riceTest: {
        sampleAirDryMass: null,
        containerMassWaterSample: null,
        containerWaterMass: null,
        waterTemperatureCorrection: null
      }
    },
  ];

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
          <Typography>
            Porcentagem dos materiais a partir do teor de ligante estimado para Vv:{' '}
            {`${chosenCurvePercentagesData.listOfPlis[0].toFixed(2)}`}
          </Typography>
          <DataGrid
            disableColumnMenu
            disableColumnFilter
            experimentalFeatures={{ columnGrouping: true }}
            columnGroupingModel={nProjectPercentsGroupings}
            columns={generateColumns('_0')}
            rows={nProjectPercentsRows_0}
            slots={{ footer: () => ExpansionToolbar('_0') }}
          />

          <Typography>
            Porcentagem dos materiais a partir do teor de ligante estimado para Vv:{' '}
            {`${chosenCurvePercentagesData.listOfPlis[1].toFixed(2)}`}
          </Typography>
          <DataGrid
            disableColumnMenu
            disableColumnFilter
            experimentalFeatures={{ columnGrouping: true }}
            columnGroupingModel={nProjectPercentsGroupings}
            columns={generateColumns('_1')}
            rows={nProjectPercentsRows_1}
            slots={{ footer: () => ExpansionToolbar('_1') }}
          />

          <Typography>
            Porcentagem dos materiais a partir do teor de ligante estimado para Vv:
            {`${chosenCurvePercentagesData.listOfPlis[2].toFixed(2)}`}
          </Typography>
          <DataGrid
            disableColumnMenu
            disableColumnFilter
            experimentalFeatures={{ columnGrouping: true }}
            columnGroupingModel={nProjectPercentsGroupings}
            columns={generateColumns('_2')}
            rows={nProjectPercentsRows_2}
            slots={{ footer: () => ExpansionToolbar('_2') }}
          />

          <Typography>
            Porcentagem dos materiais a partir do teor de ligante estimado para Vv:
            {`${chosenCurvePercentagesData.listOfPlis[3].toFixed(2)}`}
          </Typography>
          <DataGrid
            disableColumnMenu
            disableColumnFilter
            experimentalFeatures={{ columnGrouping: true }}
            columnGroupingModel={nProjectPercentsGroupings}
            columns={generateColumns('_3')}
            rows={nProjectPercentsRows_3}
            slots={{ footer: () => ExpansionToolbar('_3') }}
          />

          <Typography>Densidade máxima medida</Typography>
          <Box></Box>
        </Box>
      )}
    </>
  );
};

export default Superpave_Step8;
