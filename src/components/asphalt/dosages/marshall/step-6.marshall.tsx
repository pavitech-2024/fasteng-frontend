import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import useMarshallStore, { MarshallData } from '@/stores/asphalt/marshall/marshall.store';
import { Box, Button } from '@mui/material';
import { DataGrid, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';
import { useState } from 'react';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { toast } from 'react-toastify';
import { t } from 'i18next';
import debounce from 'lodash/debounce';

const Marshall_Step6 = ({
  nextDisabled,
  setNextDisabled,
  marshall,
}: EssayPageProps & { marshall: Marshall_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { 
    materialSelectionData, 
    volumetricParametersData: data, 
    binderTrialData, 
    maximumMixtureDensityData,
    setData 
  } = useMarshallStore();

  const { user } = useAuth();

  nextDisabled && setNextDisabled(false);

  const lessOneRows = data?.lessOne;
  const lessHalfRows = data?.lessHalf;
  const normalRows = data?.normal;
  const plusHalfRows = data?.plusHalf;
  const plusOneRows = data?.plusOne;

  const [tableIsDisabled, setTableIsDisabled] = useState({
    lessOne: true,
    lessHalf: true,
    normal: true,
    plusHalf: true,
    plusOne: true,
  });

  const debouncedSetData = debounce((newData) => {
    setData({ step: 5, value: newData });
  }, 300);

  const generateColumns = (tenor: string): GridColDef[] => [
    {
      field: 'diammeter',
      headerName: 'Diâmetro (cm)',
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data[tenor]?.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            value={data[tenor][index]?.diammeter}
            onChange={(e) => {
              const value = Number(e.target.value);
              const newState = [...data[tenor]];
              newState[index] = { ...newState[index], diammeter: value };
              // setData({ step: 5, value: { ...data, [tenor]: newState } });
              debouncedSetData({ ...data, [tenor]: newState });
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
        const index = data[tenor]?.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            value={data[tenor][index]?.height}
            onChange={(e) => {
              const value = Number(e.target.value);
              const newState = [...data[tenor]];
              newState[index] = { ...newState[index], height: value };
              setData({ step: 5, value: { ...data, [tenor]: newState } });
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
        const index = data[tenor]?.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'g'}
            value={data[tenor][index]?.dryMass}
            onChange={(e) => {
              const value = Number(e.target.value);
              const newState = [...data[tenor]];
              newState[index] = { ...newState[index], dryMass: value };
              setData({ step: 5, value: { ...data, [tenor]: newState } });
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
        const index = data[tenor].findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'g'}
            value={data[tenor][index]?.submergedMass}
            onChange={(e) => {
              const value = Number(e.target.value);
              const newState = [...data[tenor]];
              newState[index] = { ...newState[index], submergedMass: value };
              setData({ step: 5, value: { ...data, [tenor]: newState } });
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
        const index = data[tenor]?.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'g'}
            value={data[tenor][index]?.drySurfaceSaturatedMass}
            onChange={(e) => {
              const value = Number(e.target.value);
              const newState = [...data[tenor]];
              newState[index] = { ...newState[index], drySurfaceSaturatedMass: value };
              setData({ step: 5, value: { ...data, [tenor]: newState } });
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
        const index = data[tenor].findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'N'}
            value={data[tenor][index]?.stability}
            onChange={(e) => {
              const value = Number(e.target.value);
              const newState = [...data[tenor]];
              newState[index] = { ...newState[index], stability: value };
              setData({ step: 5, value: { ...data, [tenor]: newState } });
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
        const index = data[tenor].findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'mm'}
            value={data[tenor][index]?.fluency}
            onChange={(e) => {
              const value = Number(e.target.value);
              const newState = [...data[tenor]];
              newState[index] = { ...newState[index], fluency: value };
              setData({ step: 5, value: { ...data, [tenor]: newState } });
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
        const index = data[tenor]?.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            value={data[tenor][index]?.diametricalCompressionStrength}
            onChange={(e) => {
              const value = Number(e.target.value);
              const newState = [...data[tenor]];
              newState[index] = { ...newState[index], diametricalCompressionStrength: value };
              setData({ step: 5, value: { ...data, [tenor]: newState } });
            }}
          />
        );
      },
    },
  ];

  const lessOneColumnsGroupings: GridColumnGroupingModel = [
    {
      groupId: `${binderTrialData.percentsOfDosage[2][0]},00 %`,
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
      headerAlign: 'center',
      renderHeaderGroup: (params) => {
        return (
          <div>
            {params.headerName}
            <Button
              startIcon={<LockOpenIcon />}
              onClick={() => setTableIsDisabled({ ...tableIsDisabled, lessOne: !tableIsDisabled.lessOne })}
            >
              {tableIsDisabled.lessOne ? 'Liberar' : 'Não usar teor'}
            </Button>
          </div>
        );
      },
    },
  ];

  const lessHalfColumnsGroupings: GridColumnGroupingModel = [
    {
      groupId: `${binderTrialData.percentsOfDosage[2][1]},00 %`,
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
      headerAlign: 'center',
      renderHeaderGroup: (params) => {
        return (
          <div>
            {params.headerName}
            <Button
              startIcon={<LockOpenIcon />}
              onClick={() => setTableIsDisabled({ ...tableIsDisabled, lessHalf: !tableIsDisabled.lessHalf })}
            >
              {tableIsDisabled.lessHalf ? 'Liberar' : 'Não usar teor'}
            </Button>{' '}
          </div>
        );
      },
    },
  ];

  const normalColumnsGroupings: GridColumnGroupingModel = [
    {
      groupId: `${binderTrialData.percentsOfDosage[2][2]},00 %`,
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
      headerAlign: 'center',
      renderHeaderGroup: (params) => {
        return (
          <div>
            {params.headerName}
            <Button
              startIcon={<LockOpenIcon />}
              onClick={() => setTableIsDisabled({ ...tableIsDisabled, normal: !tableIsDisabled.normal })}
            >
              {tableIsDisabled.normal ? 'Liberar' : 'Não usar teor'}
            </Button>{' '}
          </div>
        );
      },
    },
  ];

  const plusHalfColumnsGroupings: GridColumnGroupingModel = [
    {
      groupId: `${binderTrialData.percentsOfDosage[2][3]},00 %`,
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
      headerAlign: 'center',
      renderHeaderGroup: (params) => {
        return (
          <div>
            {params.headerName}
            <Button
              startIcon={<LockOpenIcon />}
              onClick={() => setTableIsDisabled({ ...tableIsDisabled, plusHalf: !tableIsDisabled.plusHalf })}
            >
              {tableIsDisabled.plusHalf ? 'Liberar' : 'Não usar teor'}
            </Button>{' '}
          </div>
        );
      },
    },
  ];

  const plusOneColumnsGroupings: GridColumnGroupingModel = [
    {
      groupId: `${binderTrialData.percentsOfDosage[2][4]},00 %`,
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
      headerAlign: 'center',
      renderHeaderGroup: (params) => {
        return (
          <div>
            {params.headerName}
            <Button
              startIcon={<LockOpenIcon />}
              onClick={() => setTableIsDisabled({ ...tableIsDisabled, plusOne: !tableIsDisabled.plusOne })}
            >
              {tableIsDisabled.plusOne ? 'Liberar' : 'Não usar teor'}
            </Button>
          </div>
        );
      },
    },
  ];

  const setVolumetricParams = () => {
    toast.promise(
      async () => {
        try {
          const volumetricParams = await marshall.setVolumetricParametersData(data, binderTrialData, maximumMixtureDensityData);
          const prevData = data;
          const newData = {
            ...prevData,
            ...volumetricParams,
          };

          setData({ step: 5, value: newData });
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

  const handleErase = (type: string) => {
    try {
      if (data[type].length > 1) {
        const newRows = [...data[type]];
        newRows.pop();
        setData({ step: 5, value: { ...data, [type]: newRows } });
      } else throw t('ddui.error.minReads');
    } catch (error) {
      toast.error(error);
    }
  };

  const handleAdd = (type: string) => {
    const newRows = [...data[type]];
    newRows.push({
      id: data[type].length,
      diammeter: null,
      height: null,
      dryMass: null,
      submergedMass: null,
      drySurfaceSaturatedMass: null,
      stability: null,
      fluency: null,
      diametricalCompressionStrength: null,
    });
    setData({ step: 5, value: { ...data, [type]: newRows } });
  };

  const ExpansionToolbar = (type: string) => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem', flexWrap: 'wrap' }}>
        <Button sx={{ color: 'secondaryTons.red' }} onClick={() => handleErase(type)}>
          {t('erase')}
        </Button>
        <Button sx={{ color: 'secondaryTons.green' }} onClick={() => handleAdd(type)}>
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
            gap: '50px',
          }}
        >
          <DataGrid
            key={'lessOne'}
            columns={generateColumns('lessOne')}
            rows={lessOneRows}
            columnGroupingModel={lessOneColumnsGroupings}
            experimentalFeatures={{ columnGrouping: true }}
            sx={tableIsDisabled.lessOne ? { backgroundColor: 'grey' } : {}}
            density="comfortable"
            disableColumnMenu
            disableColumnSelector
            slots={{ footer: () => ExpansionToolbar('lessOne') }}
          />

          <DataGrid
            key={'lessHalf'}
            columns={generateColumns('lessHalf')}
            rows={lessHalfRows}
            columnGroupingModel={lessHalfColumnsGroupings}
            experimentalFeatures={{ columnGrouping: true }}
            sx={tableIsDisabled.lessHalf ? { backgroundColor: 'grey' } : {}}
            density="comfortable"
            disableColumnMenu
            disableColumnSelector
            slots={{ footer: () => ExpansionToolbar('lessHalf') }}
          />

          <DataGrid
            key={'normal'}
            columns={generateColumns('normal')}
            rows={normalRows}
            columnGroupingModel={normalColumnsGroupings}
            experimentalFeatures={{ columnGrouping: true }}
            sx={tableIsDisabled.normal ? { backgroundColor: 'grey' } : {}}
            density="comfortable"
            disableColumnMenu
            disableColumnSelector
            slots={{ footer: () => ExpansionToolbar('normal') }}
          />

          <DataGrid
            key={'plusHalf'}
            columns={generateColumns('plusHalf')}
            rows={plusHalfRows}
            columnGroupingModel={plusHalfColumnsGroupings}
            experimentalFeatures={{ columnGrouping: true }}
            sx={tableIsDisabled.plusHalf ? { backgroundColor: 'grey' } : {}}
            density="comfortable"
            disableColumnMenu
            disableColumnSelector
            slots={{ footer: () => ExpansionToolbar('plusHalf') }}
          />

          <DataGrid
            key={'plusOne'}
            columns={generateColumns('plusOne')}
            rows={plusOneRows}
            columnGroupingModel={plusOneColumnsGroupings}
            experimentalFeatures={{ columnGrouping: true }}
            sx={tableIsDisabled.plusOne ? { backgroundColor: 'grey' } : {}}
            density="comfortable"
            disableColumnMenu
            disableColumnSelector
            slots={{ footer: () => ExpansionToolbar('plusOne') }}
          />

          <Button onClick={setVolumetricParams}>Confirmar</Button>
        </Box>
      )}
    </>
  );
};

export default Marshall_Step6;
