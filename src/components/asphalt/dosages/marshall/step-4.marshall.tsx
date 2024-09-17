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

const Marshall_Step4 = ({ setNextDisabled, marshall }: EssayPageProps & { marshall: Marshall_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const { binderTrialData, granulometryCompositionData, materialSelectionData, setData } = useMarshallStore();

  const { calculateBinderTrialData } = marshall;

  const handleCalculate = async () => {
    if (binderTrialData.trial !== null) {
      const response = await calculateBinderTrialData(
        binderTrialData,
        granulometryCompositionData,
        materialSelectionData
      );

      const newResult = {
        ...response,
        trial: binderTrialData.trial,
      };

      setData({ step: 3, value: newResult });
    }
  };

  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [rows, setRows] = useState([]);

  const [machiningColumns, setMachiningColumns] = useState<GridColDef[]>([]);
  const [machiningRows, setMachiningRows] = useState([]);
  const [machiningColumnGroupings, setMachiningColumnGroupings] = useState([]);

  const [compressionColumns, setCompressionColumns] = useState<GridColDef[]>([]);
  const [compressionRows, setCompressionRows] = useState([]);
  const [compressionColumnGroupings, setCompressionColumnGroupings] = useState([]);

  useEffect(() => {
    if (binderTrialData?.percentsOfDosage?.length > 0) {
      const columns = [];

      materialSelectionData.aggregates.forEach((material) => {
        const col = {
          field: material._id,
          headerName: material.name,
          width: 300,
          valueFormatter: ({ value }) => `${value}`,
        };
        columns.push(col);
      });

      const binderObj = {
        field: 'binder',
        headerName: t('asphalt.dosages.marshall.binder-trial'),
        valueFormatter: ({ value }) => `${value}`,
      };

      columns.unshift(binderObj);

      const trials = ['oneLess', 'halfLess', 'normal', 'halPlus', 'onePlus'];

      // Função para formatar o array de materiais em objetos conforme o formato esperado pela tabela
      const formattedArray = trials.map((trial, index) => {
        const row = { id: index };

        binderTrialData.percentsOfDosage.forEach((materialArray) => {
          const materialEntry = materialArray.find((item) => item.trial === trial);

          if (materialEntry) {
            const key = materialEntry.material ? materialEntry.material : 'binder';
            row[key] = materialEntry.value;
          }
        });

        return row;
      });

      setColumns(columns);
      setRows(formattedArray);

      const machiningTemperatureColumns = [
        {
          field: 'lower',
          headerName: t('asphalt.dosages.marshall.lower'),
          valueFormatter: ({ value }) => `${value}`,
        },
        {
          field: 'average',
          headerName: t('asphalt.dosages.marshall.average'),
          valueFormatter: ({ value }) => `${value}`,
        },
        {
          field: 'higher',
          headerName: t('asphalt.dosages.marshall.higher'),
          valueFormatter: ({ value }) => `${value}`,
        },
      ];

      const machiningColumnGroup = [
        {
          groupId: 'Temperatura de usinagem',
          children: [{ field: 'lower' }, { field: 'average' }, { field: 'higher' }],
          headerAlign: 'center',
        },
      ];
      setMachiningColumnGroupings(machiningColumnGroup);

      if (
        binderTrialData.bandsOfTemperatures &&
        binderTrialData.bandsOfTemperatures.machiningTemperatureRange.average !== null
      ) {
        const machiningTemperatureRows = [
          {
            id: 1,
            lower: binderTrialData.bandsOfTemperatures.machiningTemperatureRange.lower.toFixed(2),
            average: binderTrialData.bandsOfTemperatures.machiningTemperatureRange.average.toFixed(2),
            higher: binderTrialData.bandsOfTemperatures.machiningTemperatureRange.higher.toFixed(2),
          },
        ];
        setMachiningRows(machiningTemperatureRows);
      }

      setMachiningColumns(machiningTemperatureColumns);

      const compressionTemperatureColumns = [
        {
          field: 'lower',
          headerName: t('asphalt.dosages.marshall.lower'),
          valueFormatter: ({ value }) => `${value}`,
          width: 150,
        },
        {
          field: 'average',
          headerName: t('asphalt.dosages.marshall.average'),
          valueFormatter: ({ value }) => `${value}`,
          width: 150,
        },
        {
          field: 'higher',
          headerName: t('asphalt.dosages.marshall.higher'),
          valueFormatter: ({ value }) => `${value}`,
          width: 150,
        },
      ];

      const compressionColumnGroup = [
        {
          groupId: 'Temperatura de compressão',
          children: [{ field: 'lower' }, { field: 'average' }, { field: 'higher' }],
          headerAlign: 'center',
        },
      ];
      setCompressionColumnGroupings(compressionColumnGroup);

      if (binderTrialData.bandsOfTemperatures && binderTrialData.bandsOfTemperatures.compressionTemperatureRange) {
        const compressionTemperatureRows = [
          {
            id: 1,
            lower: binderTrialData.bandsOfTemperatures.compressionTemperatureRange.lower.toFixed(2),
            average: binderTrialData.bandsOfTemperatures.compressionTemperatureRange.average.toFixed(2),
            higher: binderTrialData.bandsOfTemperatures.compressionTemperatureRange.higher.toFixed(2),
          },
        ];
        setCompressionRows(compressionTemperatureRows);
      }

      setCompressionColumns(compressionTemperatureColumns);
    }
  }, [binderTrialData, materialSelectionData]);

  setNextDisabled(false);

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
          <Box key={'initial_binder'} sx={{ display: 'flex', justifyContent: 'center' }}>
            <InputEndAdornment
              label={t('asphalt.dosages.marshall.initial-binder')}
              value={binderTrialData.trial}
              onChange={(e) => setData({ step: 3, key: 'trial', value: Number(e.target.value) })}
              adornment={'g'}
              type="number"
              inputProps={{ min: 0 }}
              required
            />
          </Box>
          <Button
            onClick={handleCalculate}
            sx={{ color: 'secondaryTons.orange', border: '1px solid rgba(224, 224, 224, 1)' }}
          >
            {t('asphalt.dosages.marshall.calculate')}
          </Button>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {columns?.length > 0 && (
              <DataGrid
                columns={columns.map((col) => ({
                  ...col,
                  flex: 1,
                  width: 200,
                  headerAlign: 'center',
                  align: 'center'
                }))}
                rows={rows}
                hideFooter
                disableColumnMenu
              />
            )}

            {machiningColumns.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <DataGrid
                  columns={machiningColumns.map((col) => ({
                    ...col,
                    flex: 1,
                    width: 200,
                    headerAlign: 'center',
                    align: 'center'
                  }))}
                  rows={machiningRows}
                  experimentalFeatures={{ columnGrouping: true }}
                  columnGroupingModel={machiningColumnGroupings}
                  disableColumnMenu
                  hideFooter
                />
                <DataGrid
                  columns={compressionColumns.map((col) => ({
                    ...col,
                    flex: 1,
                    width: 200,
                    headerAlign: 'center',
                    align: 'center'
                  }))}
                  rows={compressionRows}
                  experimentalFeatures={{ columnGrouping: true }}
                  columnGroupingModel={compressionColumnGroupings}
                  disableColumnMenu
                  hideFooter
                />
              </Box>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default Marshall_Step4;
