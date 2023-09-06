import Api from '@/api';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useSandIncreaseStore from '@/stores/concrete/sandIncrease/sandIncrease.store';
import { Box, Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useState } from 'react';

const SandIncrease_Step3 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const {
    setData,
    humidityFoundData: humidityFound,
  } = useSandIncreaseStore();

  const [calcBtnDisable, setCalcBtnDisable] = useState(true);

  const rows = humidityFound.tableData;

  const columns: GridColDef[] = [
    {
      field: 'sample',
      headerName: t('sandIncrease.samples'),
      valueFormatter: ({ value }) => `Amostra ${value}`,
    },
    {
      field: 'capsuleWeight',
      headerName: t('sandIncrease.capsuleWeight'),
      renderCell: ({ row }) => {
        const { sample } = row;
        const capsule_weight_index = rows.findIndex((r) => r.sample === sample);

        return (
          <InputEndAdornment
            fullWidth
            adornment="g"
            type="number"
            inputProps={{ min: 0, max: 100 }}
            value={rows[capsule_weight_index].capsuleWeight}
            onChange={(e) => {
              const newRows = [...rows];
              newRows[capsule_weight_index].capsuleWeight = Number(e.target.value);
              setData({ step: 2, key: 'capsuleWeight', value: newRows });
            }}
          />
        );
      },
    },
    {
      field: 'wetGrossWeight',
      headerName: t('sandIncrease.wetGrossWeight'),
      renderCell: ({ row }) => {
        const { sample } = row;
        const wet_gross_weight_index = rows.findIndex((r) => r.sample === sample);

        return (
          <InputEndAdornment
            fullWidth
            adornment="g"
            type="number"
            inputProps={{ min: 0, max: 100 }}
            value={rows[wet_gross_weight_index].wetGrossWeight}
            onChange={(e) => {
              const newRows = [...rows];
              newRows[wet_gross_weight_index].wetGrossWeight = Number(e.target.value);
              setData({ step: 2, key: 'wetGrossWeight', value: newRows });
            }}
          />
        );
      },
    },
    {
      field: 'dryGrossWeight',
      headerName: t('sandIncrease.dryGrossWeight'),
      renderCell: ({ row }) => {
        const { sample } = row;
        const dry_gross_weight_index = rows.findIndex((r) => r.sample === sample);

        return (
          <InputEndAdornment
            fullWidth
            adornment="g"
            type="number"
            inputProps={{ min: 0, max: 100 }}
            value={rows[dry_gross_weight_index].dryGrossWeight}
            onChange={(e) => {
              const newRows = [...rows];
              newRows[dry_gross_weight_index].dryGrossWeight = Number(e.target.value);
              setData({ step: 2, key: 'dryGrossWeight', value: newRows });
            }}
          />
        );
      },
    },
    ...(humidityFound.tableData.every((row) => row.moistureContent !== null)
      ? [
          {
            field: 'moistureContent',
            headerName: t('sandIncrease.moistureContent'),
            renderCell: ({ row }) => {
              const { moistureContent } = row;
              return moistureContent !== null ? `${moistureContent.toFixed(2)}` : '';
            },
          },
        ]
      : []),
  ];

  const calculateMoistureContent = async (calculateMoistureContent) => {
    const moistureContentData = {
      tableData: calculateMoistureContent.tableData
    };
    try {
      if (!calculateMoistureContent) throw t('errors.empty-table-data');

      const response = await Api.post(`concrete/essays/sand-increase/calculate-moisture-content`, moistureContentData);

      const { success, error, result } = response.data;

      if (success === false) throw error.name;

      const updatedTableData = humidityFound.tableData.map((row, index) => ({
        ...row,
        moistureContent: result[index],
      }));

      setData({
        step: 2,
        key: 'tableData',
        value: updatedTableData,
      });
    } catch (error) {
      throw error;
    }
  };

  if (nextDisabled) {
    const capsule_weight_completed = rows.every((value) => value.capsuleWeight !== null);
    const wet_gross_weight_completed = rows.every((value) => value.wetGrossWeight !== null);
    const dry_gross_weight_completed = rows.every((value) => value.dryGrossWeight !== null);
    const moisture_content_completed = rows.every((value) => value.moistureContent !== null);
    if (
      capsule_weight_completed &&
      wet_gross_weight_completed &&
      dry_gross_weight_completed &&
      moisture_content_completed
    )
      setNextDisabled(false);
  }

  if (calcBtnDisable) {
    const capsule_weight_completed = rows.every((value) => value.capsuleWeight !== null);
    const wet_gross_weight_completed = rows.every((value) => value.wetGrossWeight !== null);
    const dry_gross_weight_completed = rows.every((value) => value.dryGrossWeight !== null);
    if (capsule_weight_completed && wet_gross_weight_completed && dry_gross_weight_completed) setCalcBtnDisable(false);
  }

  return (
    <Box>
      <DataGrid
        sx={{ mt: '1rem', borderRadius: '10px' }}
        density="compact"
        hideFooter
        showCellVerticalBorder
        showColumnVerticalBorder
        columns={columns.map((column) => ({
          ...column,
          disableColumnMenu: true,
          sortable: false,
          align: 'center',
          headerAlign: 'center',
          minWidth: column.field === 'containerWeightSample' ? 250 : 100,
          flex: 1,
        }))}
        rows={rows.map((row, index) => ({ ...row, id: index }))}
      />
      <Box textAlign="center" marginTop="10px">
        <Button
          variant="contained"
          color="primary"
          disabled={calcBtnDisable}
          onClick={() => calculateMoistureContent(humidityFound)}
        >
          Calcular
        </Button>
      </Box>
    </Box>
  );
};

export default SandIncrease_Step3;
