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

const Superpave_Step5 = ({
  nextDisabled,
  setNextDisabled,
  superpave,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    materialSelectionData,
    granulometryCompositionData,
    firstCompressionData: data,
    setData,
  } = useSuperpaveStore();

  const documentName = {
    inferior: data.inferiorRows[0].document,
    intermediaria: data.intermediariaRows[0].document,
    superior: data.superiorRows[0].document,
  };

  const { user } = useAuth();

  const [inferiorRows, setInferiorRows] = useState([]);
  const [intermediariaRows, setIntermediariaRows] = useState([]);
  const [superiorRows, setSuperiorRows] = useState([]);

  useEffect(() => {
    if (data.inferiorRows.length !== inferiorRows.length) {
      setInferiorRows(data.inferiorRows);
    }
    if (data.intermediariaRows.length !== intermediariaRows.length) {
      setIntermediariaRows(data.intermediariaRows);
    }
    if (data.superiorRows.length !== superiorRows.length) {
      setSuperiorRows(data.superiorRows);
    }
  }, [data]);

  const generateColumns = (curve: string): GridColDef[] => [
    {
      field: 'diammeter',
      headerName: 'Diâmetro (cm)',
      valueFormatter: ({ value }) => (value ? `${value}` : ''),
    },
    {
      field: 'dryMass',
      headerName: 'Massa seca (g)',
      valueFormatter: ({ value }) => (value ? `${value}` : ''),
    },
    {
      field: 'submergedMass',
      headerName: 'Massa submersa (g)',
      valueFormatter: ({ value }) => (value ? `${value}` : ''),
    },
    {
      field: 'drySurfaceSaturatedMass',
      headerName: 'Massa saturada com superfície seca (g)',
      valueFormatter: ({ value }) => (value ? `${value}` : ''),
    },
    {
      field: 'waterTemperatureCorrection',
      headerName: 'Fator de correção da temperatura da água (N)',
      valueFormatter: ({ value }) => (value ? `${value}` : ''),
    },
    {
      field: 'document',
      headerName: 'Planilha (.xlsx)',
      valueFormatter: ({ value }) => (value ? `${value}` : ''),
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data[curve].findIndex((r) => r.id === id);
        return (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Button variant="contained">Upload</Button>
              <Typography sx={{ textAlign: 'center' }}>{data[curve][index]?.document ? data[curve][index]?.document : 'Vazio'}</Typography>
            </Box>
          </>
        );
      },
    },
  ];

  const inferiorGroupings: GridColumnGroupingModel = [
    {
      groupId: `Curva inferior`,
      children: [
        { field: 'diammeter' },
        { field: 'dryMass' },
        { field: 'submergedMass' },
        { field: 'drySurfaceSaturatedMass' },
        { field: 'waterTemperatureCorrection' },
      ],
      headerAlign: 'center',
      headerName: `Curva inferior`,
    },
  ];

  const intermediariaGroupings: GridColumnGroupingModel = [
    {
      groupId: `Curva intermediaria`,
      children: [
        { field: 'diammeter' },
        { field: 'dryMass' },
        { field: 'submergedMass' },
        { field: 'drySurfaceSaturatedMass' },
        { field: 'waterTemperatureCorrection' },
      ],
      headerAlign: 'center',
      headerName: `Curva intermediaria`,
    },
  ];

  const superiorGroupings: GridColumnGroupingModel = [
    {
      groupId: `Curva superior`,
      children: [
        { field: 'diammeter' },
        { field: 'height' },
        { field: 'dryMass' },
        { field: 'submergedMass' },
        { field: 'drySurfaceSaturatedMass' },
        { field: 'waterTemperatureCorrection' },
      ],
      headerAlign: 'center',
      headerName: `Curva superior`,
    },
  ];

  const handleErase = (curve: string) => {
    try {
      if (data[curve].length > 1) {
        const newRows = [...data[curve]];
        newRows.pop();
        setData({ step: 4, value: { ...data, [curve]: newRows } });
      } else throw t('superpave.error.minReads');
    } catch (error) {
      toast.error(error);
    }
  };

  const handleAdd = (curve: string) => {
    const newRows = [...data[curve]];
    newRows.push({
      id: data[curve].length,
      diammeter: null,
      dryMass: null,
      submergedMass: null,
      drySurfaceSaturatedMass: null,
      waterTemperatureCorrection: null,
    });
    setData({ step: 4, value: { ...data, [curve]: newRows } });
  };

  const ExpansionToolbar = (curve: string) => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem', flexWrap: 'wrap' }}>
        <Button sx={{ color: 'secondaryTons.red' }} onClick={() => handleErase(curve)}>
          {t('erase')}
        </Button>
        <Button sx={{ color: 'secondaryTons.green' }} onClick={() => handleAdd(curve)}>
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
            gap: '50px',
          }}
        >
          {granulometryCompositionData.chosenCurves.lower && (
            <DataGrid
              key="inferior"
              columns={generateColumns('inferiorRows')}
              rows={inferiorRows}
              columnGroupingModel={inferiorGroupings}
              experimentalFeatures={{ columnGrouping: true }}
              density="comfortable"
              disableColumnMenu
              disableColumnSelector
              slots={{ footer: () => ExpansionToolbar('inferiorRows') }}
            />
          )}

          {granulometryCompositionData.chosenCurves.average && (
            <DataGrid
              key="intermediaria"
              columns={generateColumns('intermediariaRows')}
              rows={intermediariaRows}
              columnGroupingModel={intermediariaGroupings}
              experimentalFeatures={{ columnGrouping: true }}
              density="comfortable"
              disableColumnMenu
              disableColumnSelector
              slots={{ footer: () => ExpansionToolbar('intermediariaRows') }}
            />
          )}

          {granulometryCompositionData.chosenCurves.higher && (
            <DataGrid
              key="superior"
              columns={generateColumns('superiorRows')}
              rows={superiorRows}
              columnGroupingModel={superiorGroupings}
              experimentalFeatures={{ columnGrouping: true }}
              density="comfortable"
              disableColumnMenu
              disableColumnSelector
              slots={{ footer: () => ExpansionToolbar('superiorRows') }}
            />
          )}

          {/* <Button onClick={setVolumetricParams}>Confirmar</Button> */}
        </Box>
      )}
    </>
  );
};

export default Superpave_Step5;
