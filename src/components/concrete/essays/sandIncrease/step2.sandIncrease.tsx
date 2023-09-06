import Api from '@/api';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useSandIncreaseStore from '@/stores/concrete/sandIncrease/sandIncrease.store';
import { Box, Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useState } from 'react';

const SandIncrease_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const {
    setData,
    unitMassDeterminationData: unitMassDetermination,
    humidityFoundData: humidityFound,
    sandIncreaseGeneralData: generalData,
  } = useSandIncreaseStore();

  const [calcBtnDisable, setCalcBtnDisable] = useState(true);

  const inputs = [
    {
      label: t('sandIncrease.container_volume'),
      value: unitMassDetermination.containerVolume,
      key: 'containerVolume',
      required: true,
      adornment: 'l',
    },
    {
      label: t('sandIncrease.container_weight'),
      value: unitMassDetermination.containerWeight,
      key: 'containerWeight',
      required: true,
      adornment: 'g',
    },
  ];

  const rows = unitMassDetermination.tableData;

  const columns: GridColDef[] = [
    {
      field: 'sample',
      headerName: t('sandIncrease.samples'),
      valueFormatter: ({ value }) => `Amostra ${value}`,
    },
    {
      field: 'moistureContent',
      headerName: t('sandIncrease.moistureContent') + ' (%) ' + 'indicado em norma',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'containerWeightSample',
      headerName: t('sandIncrease.containerWeightSample'),
      renderCell: ({ row }) => {
        const { sample } = row;
        const container_weight_sample_index = rows.findIndex((r) => r.sample === sample);

        return (
          <InputEndAdornment
            fullWidth
            adornment="g"
            type="number"
            inputProps={{ min: 0, max: 100 }}
            value={rows[container_weight_sample_index].containerWeightSample}
            onChange={(e) => {
              const newRows = [...rows];
              newRows[container_weight_sample_index].containerWeightSample = Number(e.target.value);
              setData({ step: 1, key: 'containerWeightSample', value: newRows });
            }}
          />
        );
      },
    },
    ...(unitMassDetermination.tableData.every((row) => row.unitMass !== null)
      ? [
          {
            field: 'unitMass',
            headerName: t('sandIncrease.unitMass'),
            renderCell: ({ row }) => {
              const { unitMass } = row;
              return unitMass !== null ? `${unitMass.toFixed(2)}` : '';
            },
          },
        ]
      : []),
  ];

  const calculateUnitMass = async (calculateUnitMass) => {
    console.log('🚀 ~ file: step2.sandIncrease.tsx:126 ~ calculateUnitMass ~ calculateUnitMass:', calculateUnitMass);

    const tableData = calculateUnitMass.tableData;
    const containerVolume = calculateUnitMass.containerVolume;
    const containerWeight = calculateUnitMass.containerWeight;

    try {
      if (!calculateUnitMass) throw t('errors.empty-table-unitMassDetermination');

      const unitMassDeterminationData = {
        containerVolume,
        containerWeight,
        tableData,
      };

      const response = await Api.post(`concrete/essays/sand-increase/calculate-results`, {
        step: 1,
        unitMassDeterminationData,
        humidityFound,
        generalData,
      });

      const { success, error, result } = response.data;

      if (success === false) throw error.name;

      const updatedTableData = unitMassDetermination.tableData.map((row, index) => ({
        ...row,
        unitMass: result.unitMasses[index],
      }));

      setData({
        step: 1,
        key: 'tableData',
        value: updatedTableData,
      });
    } catch (error) {
      throw error;
    }
  };

  if (nextDisabled) {
    const containerWeightSample_completed = rows.every((value) => value !== null);
    const container_volume_completed = unitMassDetermination.containerVolume !== null;
    const container_weight_completed = unitMassDetermination.containerWeight !== null;
    const unit_mass_completed = rows.every((value) => value.unitMass !== null);
    if (
      containerWeightSample_completed &&
      container_volume_completed &&
      container_weight_completed &&
      unit_mass_completed
    )
      setNextDisabled(false);
  }

  if (calcBtnDisable) {
    const containerWeightSample_completed = rows.every((value) => value.containerWeightSample !== null);
    const container_volume_completed = unitMassDetermination.containerVolume !== null;
    const container_weight_completed = unitMassDetermination.containerWeight !== null;
    if (containerWeightSample_completed && container_volume_completed && container_weight_completed)
      setCalcBtnDisable(false);
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          gap: '15px',
          justifyContent: { mobile: 'center', notebook: 'flex-start' },
          flexWrap: 'wrap',
        }}
      >
        {inputs.map((input) => (
          <Box key={input.key}>
            <InputEndAdornment
              label={input.label}
              adornment={input.adornment}
              value={input.value}
              required={input.required}
              type="number"
              onChange={(e) => setData({ step: 1, key: input.key, value: e.target.value })}
              inputProps={{ min: 0 }}
            />
          </Box>
        ))}
      </Box>

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
          onClick={() => calculateUnitMass(unitMassDetermination)}
        >
          Calcular
        </Button>
      </Box>
    </Box>
  );
};

export default SandIncrease_Step2;
