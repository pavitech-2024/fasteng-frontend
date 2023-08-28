import useSandIncreaseStore from '@/stores/concrete/sandIncrease/sandIncrease.store';
import { EssayPageProps } from '../../../templates/essay';
import { Box } from '@mui/material';
import useAuth from '@/contexts/auth';
import { t } from 'i18next';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect } from 'react';

const Sand_Increase_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  const { 
    results: sand_increase_results, 
    sandIncreaseGeneralData,
    unitMassDeterminationData 
  } = useSandIncreaseStore();

  const { user } = useAuth();

  // pegando a quantidade de casas decimais do usuário
  const {
    preferences: { decimal: user_decimal },
  } = user;
  //const userId = user?._id;

  const data = {
    unitMasses: unitMassDeterminationData.tableData.map((item) => item.unitMass),
    moistureContent: [], 
    swellings: [], 
    curve: {}, 
    retaR: {}, 
    retaS: {}, 
    retaT: {}, 
    retaU: {}, 
    averageCoefficient: 0,
    criticalHumidity: 0,
  };

  if (sand_increase_results) {
    // data.unitMasses.push(
    //   { 
    //     label: t('sandIncrease.unit-mass'), 
    //     value: sand_increase_results.unitMasses,
    //     unity: 'g'
    //   }
    // );
    data.moistureContent.push(
      { 
        label: t('sandIncrease.moisture-content'), 
        value: sand_increase_results.moistureContent,
        unity: '%'
      }
    );
    data.swellings.push(
      { 
        label: t('sandIncrease.swellings'), 
        value: sand_increase_results.swellings,
        unity: ''
      }
    );
    data.averageCoefficient = sand_increase_results.averageCoefficient;
  };

  const rows = unitMassDeterminationData.tableData;

  const columns: GridColDef[] = [
    {
      field: 'sample',
      headerName: t('sandIncrease.samples'),
      valueFormatter: ({ value }) => `Amostra ${value}`,
    },
    {
      field: 'unitMass',
      headerName: t('sandIncrease.unit-mass'),
      valueFormatter: ({ value }) => `${value.toFixed(2)}`,
    },
    {
      field: 'moistureContent',
      headerName: t('sandIncrease.moistureContent') + ' encontrado (%)',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'swellings',
      headerName: t('sandIncrease.swellings'),
      valueFormatter: ({ value }) => `${value}`,
    },
  ];

  useEffect(() => {
    console.log("🚀 ~ file: results.sandIncrease.tsx:86 ~ sand_increase_results:", sand_increase_results)
  }, [sand_increase_results]);

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
          minWidth: 100,
          flex: 1,
        }))}
        rows={rows.map((row, index) => ({ ...row, id: index }))}
      />
    </Box>
  );
};

export default Sand_Increase_Results;
