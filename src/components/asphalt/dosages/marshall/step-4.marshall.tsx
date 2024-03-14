import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import useMarshallStore from '@/stores/asphalt/marshall/marshall.store';
import { Box, Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect, useState } from 'react';

const Marshall_Step4 = ({
  nextDisabled,
  setNextDisabled,
  marshall,
}: EssayPageProps & { marshall: Marshall_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const { binderTrialData, granulometryCompositionData, materialSelectionData, setData } = useMarshallStore();

  const { calculateBinderTrialData } = marshall;

  const { user } = useAuth();

  const handleCalculate = async () => {
    if (binderTrialData.trial !== null) {
      const response = await calculateBinderTrialData(
        binderTrialData, 
        granulometryCompositionData, 
        materialSelectionData
      );

      console.log('🚀 ~ handleCalculate ~ response:', response);

      const newResult = {
        ...response,
        trial: binderTrialData.trial,
      };

      setData({ step: 3, value: newResult });
    }
  };

  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (binderTrialData?.percentsOfDosage?.length > 0) {
      const columns = [
        {
          field: 'binder',
          headerName: 'Teor de ligante asfaltico',
          valueFormatter: ({ value }) => `${value}`,
        },
        {
          field: 'material_1',
          headerName: `${materialSelectionData?.aggregates[0]?.name}`,
          valueFormatter: ({ value }) => `${value}`,
        },
        {
          field: 'material_2',
          headerName: `${materialSelectionData.aggregates[1].name}`,
          valueFormatter: ({ value }) => `${value}`,
        },
      ];

      const rows = binderTrialData.percentsOfDosage[0].map((_, index) => ({
        id: index,
        binder: binderTrialData.percentsOfDosage[0][index],
        material_1: binderTrialData.percentsOfDosage[1][index],
        material_2: binderTrialData.percentsOfDosage[2][index],
      }));

      setColumns(columns);
      setRows(rows);
    }
  }, [binderTrialData, materialSelectionData]);

  nextDisabled && setNextDisabled(false);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <Box 
            key={'initial_binder'}
          >
            <InputEndAdornment
              label={t('marshall.initial-binder')}
              value={binderTrialData.trial}
              onChange={(e) => setData({ step: 3, key: 'trial', value: Number(e.target.value) })}
              adornment={'g'}
              type="number"
              inputProps={{ min: 0 }}
              required
            />
          </Box>
          <Button onClick={handleCalculate}>Calcular</Button>
          <DataGrid columns={columns} rows={rows} />
        </Box>
      )}
    </>
  );
};

export default Marshall_Step4;
