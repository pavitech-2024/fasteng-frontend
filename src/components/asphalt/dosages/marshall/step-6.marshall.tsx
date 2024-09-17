import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import useMarshallStore, { MarshallData } from '@/stores/asphalt/marshall/marshall.store';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
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
  const { volumetricParametersData: data, binderTrialData, maximumMixtureDensityData, setData } = useMarshallStore();

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
      headerName: t('asphalt.dosages.marshall.diammeter') + '(cm)',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      width: 115,
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data[tenor]?.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            value={data[tenor][index]?.diammeter}
            type='number'
            onChange={(e) => {
              const value = e.target.value;
              const newState = [...data[tenor]];
              newState[index] = { ...newState[index], diammeter: Number(value) };
              debouncedSetData(newState, tenor);
            }}
          />
        );
      },
    },
    {
      field: 'height',
      headerName: t('asphalt.dosages.marshall.height') +  '(cm)',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      width: 115,
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data[tenor]?.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type='number'
            value={data[tenor][index]?.height}
            onChange={(e) => {
              const value = e.target.value;
              const newState = [...data[tenor]];
              newState[index] = { ...newState[index], height: Number(value) };
              debouncedSetData(newState, tenor);
            }}
          />
        );
      },
    },
    {
      field: 'dryMass',
      headerName: t('asphalt.dosages.marshall.dry-mass') +  '(g)',
      width: 120,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data[tenor]?.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type='number'
            value={data[tenor][index]?.dryMass}
            onChange={(e) => {
              const value = e.target.value;
              const newState = [...data[tenor]];
              newState[index] = { ...newState[index], dryMass: Number(value) };
              debouncedSetData(newState, tenor);
            }}
          />
        );
      },
    },
    {
      field: 'submergedMass',
      headerName: t('asphalt.dosages.marshall.submerged-mass') +  '(g)',
      width: 150,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data[tenor].findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type='number'
            value={data[tenor][index]?.submergedMass}
            onChange={(e) => {
              const value = e.target.value;
              const newState = [...data[tenor]];
              newState[index] = { ...newState[index], submergedMass: Number(value) };
              debouncedSetData(newState, tenor);
            }}
          />
        );
      },
    },
    {
      field: 'drySurfaceSaturatedMass',
      headerName: t('asphalt.dosages.marshall.dry-surface-saturated-mass') + '(g)',
      width: 150,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data[tenor]?.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type='number'
            value={data[tenor][index]?.drySurfaceSaturatedMass}
            onChange={(e) => {
              const value = e.target.value;
              const newState = [...data[tenor]];
              newState[index] = { ...newState[index], drySurfaceSaturatedMass: Number(value) };
              debouncedSetData(newState, tenor);
            }}
          />
        );
      },
    },
    {
      field: 'stability',
      headerName: t('asphalt.dosages.marshall.stability') + '(N)',
      width: 125,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data[tenor].findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type='number'
            value={data[tenor][index]?.stability}
            onChange={(e) => {
              const value = e.target.value;
              const newState = [...data[tenor]];
              newState[index] = { ...newState[index], stability: Number(value) };
              debouncedSetData(newState, tenor);
            }}
          />
        );
      },
    },
    {
      field: 'fluency',
      headerName: t('asphalt.dosages.marshall.fluency') +  '(mm)',
      width: 150,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data[tenor].findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type='number'
            value={data[tenor][index]?.fluency}
            onChange={(e) => {
              const value = e.target.value;
              const newState = [...data[tenor]];
              newState[index] = { ...newState[index], fluency: Number(value) };
              debouncedSetData(newState, tenor);
            }}
          />
        );
      },
    },
    {
      field: 'diametricalCompressionStrength',
      headerName: t('asphalt.dosages.indirect-tensile-strength') + '(MPa)',
      width: 150,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data[tenor]?.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type='number'
            value={data[tenor][index]?.diametricalCompressionStrength}
            onChange={(e) => {
              const value = e.target.value;
              const newState = [...data[tenor]];
              newState[index] = { ...newState[index], diametricalCompressionStrength: Number(value) };
              debouncedSetData(newState, tenor);
            }}
          />
        );
      },
    },
  ];

  const lessOneColumnsGroupings: GridColumnGroupingModel = [
    {
      groupId: `${binderTrialData.percentsOfDosage[binderTrialData.percentsOfDosage.length - 1][0].value},00 %`,
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
          <Box sx={{ display: 'flex', gap: '2rem' }}>
            <Typography sx={{ marginY: 'auto', color: '#777777' }}>{params.headerName}</Typography>

            <Button
              startIcon={<LockOpenIcon />}
              onClick={() => setTableIsDisabled({ ...tableIsDisabled, lessOne: !tableIsDisabled.lessOne })}
              variant="contained"
              sx={{ marginY: '1rem' }}
            >
              {tableIsDisabled.lessOne ? t('asphalt.dosages.enable') : t('asphalt.dosages.disable')}
            </Button>
          </Box>
        );
      },
    },
  ];

  const lessHalfColumnsGroupings: GridColumnGroupingModel = [
    {
      groupId: `${binderTrialData.percentsOfDosage[binderTrialData.percentsOfDosage.length - 1][1].value},00 %`,
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
          <Box sx={{ display: 'flex', gap: '2rem' }}>
            <Typography sx={{ marginY: 'auto', color: '#777777' }}>{params.headerName}</Typography>

            <Button
              startIcon={<LockOpenIcon />}
              onClick={() => setTableIsDisabled({ ...tableIsDisabled, lessHalf: !tableIsDisabled.lessHalf })}
              variant="contained"
              sx={{ marginY: '1rem' }}
            >
              {tableIsDisabled.lessHalf ? t('asphalt.dosages.enable') : t('asphalt.dosages.disable')}
            </Button>
          </Box>
        );
      },
    },
  ];

  const normalColumnsGroupings: GridColumnGroupingModel = [
    {
      groupId: `${binderTrialData.percentsOfDosage[binderTrialData.percentsOfDosage.length - 1][2].value},00 %`,
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
          <Box sx={{ display: 'flex', gap: '2rem' }}>
            <Typography sx={{ marginY: 'auto', color: '#777777' }}>{params.headerName}</Typography>

            <Button
              startIcon={<LockOpenIcon />}
              onClick={() => setTableIsDisabled({ ...tableIsDisabled, normal: !tableIsDisabled.normal })}
              variant="contained"
              sx={{ marginY: '1rem' }}
            >
              {tableIsDisabled.normal ? t('asphalt.dosages.enable') : t('asphalt.dosages.disable')}
            </Button>
          </Box>
        );
      },
    },
  ];

  const plusHalfColumnsGroupings: GridColumnGroupingModel = [
    {
      groupId: `${binderTrialData.percentsOfDosage[binderTrialData.percentsOfDosage.length - 1][3].value},00 %`,
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
          <Box sx={{ display: 'flex', gap: '2rem' }}>
            <Typography sx={{ marginY: 'auto', color: '#777777' }}>{params.headerName}</Typography>

            <Button
              startIcon={<LockOpenIcon />}
              onClick={() => setTableIsDisabled({ ...tableIsDisabled, plusHalf: !tableIsDisabled.plusHalf })}
              variant="contained"
              sx={{ marginY: '1rem' }}
            >
              {tableIsDisabled.plusHalf ? t('asphalt.dosages.enable') : t('asphalt.dosages.disable')}
            </Button>
          </Box>
        );
      },
    },
  ];

  const plusOneColumnsGroupings: GridColumnGroupingModel = [
    {
      groupId: `${binderTrialData.percentsOfDosage[binderTrialData.percentsOfDosage.length - 1][4].value},00 %`,
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
          <Box sx={{ display: 'flex', gap: '2rem' }}>
            <Typography sx={{ marginY: 'auto', color: '#777777' }}>{params.headerName}</Typography>

            <Button
              startIcon={<LockOpenIcon />}
              onClick={() => setTableIsDisabled({ ...tableIsDisabled, plusOne: !tableIsDisabled.plusOne })}
              variant="contained"
              sx={{ marginY: '1rem' }}
            >
              {tableIsDisabled.plusOne ? t('asphalt.dosages.enable') : t('asphalt.dosages.disable')}
            </Button>
          </Box>
        );
      },
    },
  ];
  

  const setVolumetricParams = () => {
    toast.promise(
      async () => {
        try {
          const volumetricParams = await marshall.setVolumetricParametersData(
            data,
            binderTrialData,
            maximumMixtureDensityData
          );

          const newData = {
            ...data,
            ...volumetricParams,
          };

          setData({ step: 5, value: newData });
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
        <Button sx={{ color: 'secondaryTons.red' }} disabled={tableIsDisabled[type]} onClick={() => handleErase(type)}>
          {t('erase')}
        </Button>
        <Button sx={{ color: 'secondaryTons.green' }} disabled={tableIsDisabled[type]} onClick={() => handleAdd(type)}>
          {t('add')}
        </Button>
      </Box>
    );
  };

  useEffect(() => {
    const hasEmptyArrays = Object.values(data.volumetricParameters).some((arr) => arr.length < 1);

    if (hasEmptyArrays) {
      setNextDisabled(true)
    } else {
      setNextDisabled(false)
    }
  },[data])

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
          {/* DataGrid para lessOne */}
          <DataGrid
            key={'lessOne'}
            columns={generateColumns('lessOne')}
            rows={lessOneRows}
            columnGroupingModel={lessOneColumnsGroupings}
            experimentalFeatures={{ columnGrouping: true }}
            sx={tableIsDisabled.lessOne ? { backgroundColor: '#999999' } : {}}
            density="comfortable"
            disableColumnMenu
            disableColumnSelector
            disableRowSelectionOnClick={tableIsDisabled.lessOne}
            slotProps={{
              cell: {
                style: tableIsDisabled.lessOne ? { pointerEvents: 'none', opacity: 0.3 } : {},
              },
            }}
            slots={{ footer: () => ExpansionToolbar('lessOne') }}
          />
  
          {/* DataGrid para lessHalf */}
          <DataGrid
            key={'lessHalf'}
            columns={generateColumns('lessHalf')}
            rows={lessHalfRows}
            columnGroupingModel={lessHalfColumnsGroupings}
            experimentalFeatures={{ columnGrouping: true }}
            sx={tableIsDisabled.lessHalf ? { backgroundColor: '#999999' } : {}}
            density="comfortable"
            disableColumnMenu
            disableColumnSelector
            disableRowSelectionOnClick={tableIsDisabled.lessHalf}
            slotProps={{
              cell: {
                style: tableIsDisabled.lessHalf ? { pointerEvents: 'none', opacity: 0.3 } : {},
              },
            }}
            slots={{ footer: () => ExpansionToolbar('lessHalf') }}
          />
  
          {/* DataGrid para normal */}
          <DataGrid
            key={'normal'}
            columns={generateColumns('normal')}
            rows={normalRows}
            columnGroupingModel={normalColumnsGroupings}
            experimentalFeatures={{ columnGrouping: true }}
            sx={tableIsDisabled.normal ? { backgroundColor: '#999999' } : {}}
            density="comfortable"
            disableColumnMenu
            disableColumnSelector
            disableRowSelectionOnClick={tableIsDisabled.normal}
            slotProps={{
              cell: {
                style: tableIsDisabled.normal ? { pointerEvents: 'none', opacity: 0.3 } : {},
              },
            }}
            slots={{ footer: () => ExpansionToolbar('normal') }}
          />
  
          {/* DataGrid para plusHalf */}
          <DataGrid
            key={'plusHalf'}
            columns={generateColumns('plusHalf')}
            rows={plusHalfRows}
            columnGroupingModel={plusHalfColumnsGroupings}
            experimentalFeatures={{ columnGrouping: true }}
            sx={tableIsDisabled.plusHalf ? { backgroundColor: '#999999' } : {}}
            density="comfortable"
            disableColumnMenu
            disableColumnSelector
            disableRowSelectionOnClick={tableIsDisabled.plusHalf}
            slotProps={{
              cell: {
                style: tableIsDisabled.plusHalf ? { pointerEvents: 'none', opacity: 0.3 } : {},
              },
            }}
            slots={{ footer: () => ExpansionToolbar('plusHalf') }}
          />
  
          {/* DataGrid para plusOne */}
          <DataGrid
            key={'plusOne'}
            columns={generateColumns('plusOne')}
            rows={plusOneRows}
            columnGroupingModel={plusOneColumnsGroupings}
            experimentalFeatures={{ columnGrouping: true }}
            sx={tableIsDisabled.plusOne ? { backgroundColor: '#999999' } : {}}
            density="comfortable"
            disableColumnMenu
            disableColumnSelector
            disableRowSelectionOnClick={tableIsDisabled.plusOne}
            slotProps={{
              cell: {
                style: tableIsDisabled.plusOne ? { pointerEvents: 'none', opacity: 0.3 } : {},
              },
            }}
            slots={{ footer: () => ExpansionToolbar('plusOne') }}
          />
  
          {/* Botões de ação */}
          <Button onClick={setVolumetricParams} variant="outlined">
            {t('asphalt.dosages.marshall.confirm')}
          </Button>
        </Box>
      )}
    </>
  );
  
};

export default Marshall_Step6;
