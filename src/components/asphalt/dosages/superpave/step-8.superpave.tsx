import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, Button } from '@mui/material';
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
  const { materialSelectionData, secondCompressionData: data, setData } = useSuperpaveStore();

  const [nProjectPercentsRows, setNProjectPercentsRows] = useState([]);

  const { user } = useAuth();

  useEffect(() => {
    setNProjectPercentsRows(data.tableData);
  }, [data.tableData]);

  const generateColumns = (): GridColDef[] => [
    {
      field: 'averageDiammeter',
      headerName: 'Diâmetro médio (cm)',
      width: 160,
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data.tableData.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type="text"
            value={data.tableData[index].averageDiammeter}
            onChange={(e) => {
              let prevData = [...data.tableData];
              prevData[index].averageDiammeter = parseFloat(e.target.value);
              setData({ step: 7, value: { ...data, tableDatatableData: prevData } });
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
        const index = data.tableData.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type="number"
            value={data.tableData[index].dryMass}
            onChange={(e) => {
              let prevData = [...data.tableData];
              prevData[index].dryMass = parseFloat(e.target.value);
              setData({ step: 7, value: { ...data, tableData: prevData } });
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
        const index = data.tableData.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type="number"
            value={data.tableData[index].submergedMass}
            onChange={(e) => {
              let prevData = [...data.tableData];
              prevData[index].submergedMass = parseFloat(e.target.value);
              setData({ step: 7, value: { ...data, tableData: prevData } });
            }}
          />
        );
      },
    },
    {
      field: 'drySurfaceSaturatedMass',
      headerName: 'Massa saturada com superfície seca (g)',
      width: 250,
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data.tableData.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type="number"
            value={data.tableData[index].drySurfaceSaturatedMass}
            onChange={(e) => {
              let prevData = [...data.tableData];
              prevData[index].drySurfaceSaturatedMass = parseFloat(e.target.value);
              setData({ step: 7, value: { ...data, tableData: prevData } });
            }}
          />
        );
      },
    },
    {
      field: 'waterTemperatureCorrection',
      headerName: 'Fator de correção da temperatura da água (N)',
      width: 250,
      renderCell: ({ row }) => {
        const { id } = row;
        const index = data.tableData.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            adornment={'cm'}
            type="number"
            value={data.tableData[index].waterTemperatureCorrection}
            onChange={(e) => {
              let prevData = [...data.tableData];
              prevData[index].waterTemperatureCorrection = parseFloat(e.target.value);
              setData({ step: 7, value: { ...data, tableData: prevData } });
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

  const handleErase = () => {
    try {
      if (data.tableData.length > 1) {
        const newRows = [...data.tableData];
        newRows.pop();
        console.log("🚀 ~ handleErase ~ newRows:", newRows)
        setData({ step: 7, value: { ...data, newRows } });
        setNProjectPercentsRows(newRows);
      } else throw t('superpave.error.minReads');
    } catch (error) {
      toast.error(error);
    }
  };

  const handleAdd = () => {
    const newRows = [...data.tableData];
    newRows.push({
      id: data.tableData.length,
      averageDiammeter: null,
      averageHeight: null,
      dryMass: null,
      submergedMass: null,
      drySurfaceSaturatedMass: null,
      waterTemperatureCorrection: null,
      diametralTractionResistance: null
    });
    setData({ step: 7, value: { ...data, tableData: newRows } });
  };

  const ExpansionToolbar = () => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem', flexWrap: 'wrap' }}>
        <Button sx={{ color: 'secondaryTons.red' }} onClick={handleErase}>
          {t('erase')}
        </Button>
        <Button sx={{ color: 'secondaryTons.green' }} onClick={handleAdd}>
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
          <DataGrid
            disableColumnMenu
            disableColumnFilter
            experimentalFeatures={{ columnGrouping: true }}
            columnGroupingModel={nProjectPercentsGroupings}
            columns={generateColumns()}
            rows={nProjectPercentsRows}
            slots={{ footer: ExpansionToolbar }}
          />
        </Box>
      )}
    </>
  );
};

export default Superpave_Step8;
