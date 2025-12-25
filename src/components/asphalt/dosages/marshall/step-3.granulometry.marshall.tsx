import { EssayPageProps } from '@/components/templates/essay';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import useMarshallStore from '@/stores/asphalt/marshall/marshall.store';
import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import Step3Table from './tables/step-3-table';
import Graph from '@/services/asphalt/dosages/marshall/graph/marshal-granulometry-graph';
import useAuth from '@/contexts/auth';
import { toast } from 'react-toastify';
import Loading from '@/components/molecules/loading';
import { isNumber } from '@mui/x-data-grid/internals';

const Marshall_Step3_Granulometry = ({
  setNextDisabled,
  marshall,
}: EssayPageProps & { marshall: Marshall_SERVICE }) => {
  const { calculateGranulometryComposition } = new Marshall_SERVICE();
  const { granulometryCompositionData: data, materialSelectionData, setData, generalData } = useMarshallStore();

  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [columnGrouping, setColumnGroupings] = useState([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [percentageInputs, setPercentageInputs] = useState<{ [key: string]: number | null }>({});
  
  let setSpecificationRows;
  let setSpecificationColumns: GridColDef[] | undefined;
  let setSpecificationColumnsGroupings;

  // Inicializar percentageInputs
  useEffect(() => {
    if (data?.percentageInputs?.[0]) {
      setPercentageInputs(data.percentageInputs[0]);
    }
  }, [data?.percentageInputs]);

  // Função para atualizar um valor específico
  const updatePercentageInput = (_id: string, value: number | null) => {
    const newInputs = {
      ...percentageInputs,
      [`percentage_${_id}`]: value
    };
    
    setPercentageInputs(newInputs);
    setData({
      step: 2,
      value: {
        ...data,
        percentageInputs: [newInputs]
      }
    });
  };

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          console.log('🔄 Buscando dados de granulometria...');
          console.log('generalData:', generalData);
          console.log('materialSelectionData:', materialSelectionData);
          console.log('user._id:', user._id);

          // Fetch step 3 data using the marshall service with necessary parameters.
          const result = await marshall.getStep3Data(generalData, materialSelectionData, user._id, null);

          console.log('📦 Resultado COMPLETO do getStep3Data:', result);
          console.log('Tipo:', typeof result);

          if (!result) {
            console.error('❌ Resultado é undefined!');
            throw new Error('Nenhum dado retornado do servidor');
          }

          const { table_data, dnitBands } = result;

          console.log('📊 table_data:', table_data);
          console.log('📊 table_rows length:', table_data?.table_rows?.length || 0);
          console.log('📊 dnitBands:', dnitBands);
          console.log('📊 dnitBands.higher:', dnitBands?.higher?.length || 0);
          console.log('📊 dnitBands.lower:', dnitBands?.lower?.length || 0);

          if (!table_data || !dnitBands) {
            console.error('❌ Dados incompletos!');
            throw new Error('Dados incompletos do servidor');
          }

          if (!table_data.table_rows || table_data.table_rows.length === 0) {
            console.warn('⚠️ table_rows está vazio!');
            console.log('table_column_headers:', table_data.table_column_headers);

            // Mostra quais agregados estão sendo buscados
            console.log('🔍 Agregados sendo buscados:', materialSelectionData.aggregates);
          }

          // Inicializar inputs de porcentagem
          const initialPercentageInputs = {};
          if (materialSelectionData.aggregates && materialSelectionData.aggregates.length > 0) {
            materialSelectionData.aggregates.forEach((aggregate) => {
              const { _id } = aggregate;
              initialPercentageInputs[`percentage_${_id}`] = null;
            });
          }

          // Create a copy of the current data state to update with new fetched data.
          const prevData = { ...data };

          // Update the copied data with fetched table data and dnit bands.
          prevData.table_data = table_data;
          prevData.dnitBands = dnitBands;
          prevData.percentageInputs = [initialPercentageInputs];

          // Set the new data state with the updated information.
          setData({
            step: 2,
            value: prevData,
          });

          // Atualizar o estado local dos inputs
          setPercentageInputs(initialPercentageInputs);

          console.log('✅ Dados atualizados no store');
        } catch (error) {
          console.error('💥 Erro no getStep3Data:', error);
          throw error;
        } finally {
          setLoading(false);
        }
      },
      {
        pending: t('loading.materials.pending'),
        success: t('loading.materials.success'),
        error: t('loading.materials.error'),
      }
    );
  }, []);

  // Tabela de inputs
  // Definindo a row e as colunas para a tabela de inputs
  const inputRows: { [key: string]: number }[] = data?.percentageInputs;
  
  useEffect(() => {
    if (data?.percentageInputs && data?.percentageInputs?.length === 0 && materialSelectionData.aggregates) {
      const aggregates_percentages = {};

      materialSelectionData.aggregates.forEach((aggregate) => {
        const { _id } = aggregate;
        aggregates_percentages[`percentage_${_id}`] = null;
      });

      setData({ step: 2, key: 'percentageInputs', value: [aggregates_percentages] });
      setPercentageInputs(aggregates_percentages);
    }
  }, [data?.percentageInputs, materialSelectionData.aggregates]);

  useEffect(() => {
    if (data?.dnitBands?.higher?.length > 0) {
      const newHigherSpec = [];

      data?.dnitBands?.higher.forEach((element) => {
        if (data?.table_data?.table_rows) {
          for (let i = 0; i < data?.table_data?.table_rows.length; i++) {
            if (element[0] === data?.table_data?.table_rows[i]?.sieve_label) {
              const newRow = {
                ...data?.table_data?.table_rows[i],
                band1: element[1],
                band2: data.dnitBands.lower[i][1],
              };
              newHigherSpec.push(newRow);
            }
          }
        }
      });

      setRows(newHigherSpec);
    }
  }, [data?.dnitBands?.higher]);

  const inputColumns: GridColDef[] = [];

  materialSelectionData.aggregates.forEach((aggregate) => {
    const { _id, name } = aggregate;

    inputColumns.push({
      field: 'percentage_'.concat(_id),
      headerName: name,
      valueFormatter: ({ value }) => `${value}`,
      renderCell: ({ row }) => {
        return (
          <InputEndAdornment
            adornment={'%'}
            type="number"
            value={percentageInputs[`percentage_${_id}`] ?? ''}
            onChange={(e) => {
              const value = e.target.value === '' ? null : Number(e.target.value);
              updatePercentageInput(_id, value);
            }}
            inputProps={{
              min: 0,
              max: 100,
              step: 0.1,
            }}
            sx={{
              '& .MuiInputBase-input': {
                textAlign: 'center',
                padding: '8px',
              }
            }}
          />
        );
      },
    });
  });

  useEffect(() => {
    if (data?.sumOfPercents?.length > 0) {
      setSpecificationColumns = [
        {
          field: 'label',
          headerName: t('asphalt.dosages.marshall.sieve'),
          valueFormatter: ({ value }) => `${value}`,
        },
        {
          field: 'value',
          headerName: t('asphalt.dosages.marshall.project'),
          valueFormatter: ({ value }) => `${value}`,
        },
        {
          field: 'band1',
          headerName: '',
          valueFormatter: ({ value }) => `${value}`,
        },
        {
          field: 'band2',
          headerName: '',
          valueFormatter: ({ value }) => `${value}`,
        },
      ];

      setSpecificationColumnsGroupings = [
        {
          groupId: 'projeto',
          children: [{ field: 'projeto' }],
          headerAlign: 'center',
        },
        {
          groupId: 'Especificação',
          children: [
            {
              groupId: `Banda ${generalData.dnitBand}`,
              headerAlign: 'center',
              children: [{ field: 'band_1' }, { field: 'band_2' }],
            },
          ],
          headerAlign: 'center',
        },
      ];
    }

    if (data?.projections.length > 0) {
      const newArray = [];

      for (let i = 0; i < data?.sumOfPercents.length; i++) {
        newArray.push({
          label: data.projections[i]?.label,
          value: data.projections[i]?.value,
          band_1: data.dnitBands?.lower[i] !== null ? data.bands?.lowerBand[i] : '',
          band_2: data.dnitBands?.higher[i] !== null ? data.bands?.higherBand[i] : '',
        });
      }

      setSpecificationRows = [...newArray];
    }
  }, [data.sumOfPercents, data.bands]);

  const calculateGranulometricComposition = async () => {
    let sumOfInputs = 0;

    Object.values(percentageInputs).forEach((input) => {
      if (input !== null && input !== undefined) {
        sumOfInputs += input;
      }
    });

    if (sumOfInputs !== 100) {
      toast.error(`${t('asphalt.dosages.inputs-sum-invalid')} (${sumOfInputs}%)`);
      return;
    }

    toast.promise(
      async () => {
        const results = await calculateGranulometryComposition(data, generalData);

        const newPointsOfCurve = [...results.pointsOfCurve];

        newPointsOfCurve.unshift([
          t('asphalt.dosages.marshall.sieve_mm'),
          t('asphalt.dosages.marshall.dnit-track'),
          'Faixa de trabalho',
          'Mistura de projeto',
          'Faixa de trabalho',
          'Faixa do DNIT',
        ]);

        const { projections } = results;

        const newTableRows = results.table_data.table_rows.map((tableRow) => ({
          ...tableRow,
          projections: projections.find((proj) => proj.label === tableRow.sieve_label)?.value ?? null,
          band1: results.dnitBands.higher.find((band) => band[0] === tableRow.sieve_label)?.[1] ?? null,
          band2: results.dnitBands.lower.find((band) => band[0] === tableRow.sieve_label)?.[1] ?? null,
        }));

        const newResults = {
          ...results,
          table_data: {
            ...results.table_data,
            table_rows: newTableRows, // ✅ ARRAY PLANO
          },
          graphData: newPointsOfCurve,
        };

        setRows(newTableRows);

        setData({
          step: 2,
          value: {
            ...data,
            ...newResults,
          },
        });
      },
      {
        pending: t('loading.calculating.pending'),
        success: t('loading.calculating.success'),
      }
    );
  };

  useEffect(() => {
    const newCols: GridColDef[] = [];
    const newColsGrouping = [];
    
    if (data?.table_data?.table_column_headers) {
      data.table_data.table_column_headers.forEach((header, idx) => {
        if (header === 'sieve_label') {
          newCols.push({
            field: 'sieve_label',
            headerName: t('granulometry-asphalt.sieves'),
            valueFormatter: ({ value }) => `${value}`,
            width: 150,
          });
        } else {
          if (header.startsWith('total_passant')) {
            newCols.push({
              field: header,
              headerName: t('granulometry-asphalt.total_passant'),
              valueFormatter: ({ value }) => (value && isNumber(value) ? `${Number(value).toFixed(2)}%` : '---'),
              width: 120,
            });
          } else {
            const _id = header.replace('passant_', '');
            const name = materialSelectionData.aggregates.find((aggregate) => aggregate._id === _id)?.name;
            newCols.push({
              field: header,
              headerName: t('granulometry-asphalt.passant'),
              valueFormatter: ({ value }) => (value && isNumber(value) ? `${Number(value).toFixed(2)}%` : '---'),
              width: 120,
              renderHeader: () => {
                const aggregate = materialSelectionData.aggregates.find((agg) => agg._id === _id);
                return aggregate ? (
                  <Box sx={{ textAlign: 'center', padding: '4px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{aggregate.name}</div>
                    <InputEndAdornment
                      adornment="%"
                      type="number"
                      value={percentageInputs[`percentage_${_id}`] ?? ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? null : Number(e.target.value);
                        updatePercentageInput(_id, value);
                      }}
                      inputProps={{
                        min: 0,
                        max: 100,
                        step: 0.1,
                      }}
                      sx={{
                        width: '80px',
                        margin: '0 auto',
                        '& .MuiInputBase-input': {
                          padding: '6px 8px',
                          fontSize: '12px',
                          height: '24px',
                        }
                      }}
                    />
                  </Box>
                ) : null;
              },
            });
            
            if (name) {
              newColsGrouping.push({
                groupId: name,
                children: [{ field: `total_passant_${_id}` }, { field: `passant_${_id}` }],
                headerAlign: 'center',
              });
            }
          }
        }
      });

      newCols.push({
        field: 'projections',
        headerName: t('asphalt.dosages.marshall.projections'),
        valueFormatter: ({ value }) => (value ? `${Number(value).toFixed(2)}` : ''),
        width: 120,
      });

      newCols.push(
        {
          field: 'band1',
          headerName: '',
          valueFormatter: ({ value }) => (value ? `${Number(value).toFixed(2)}%` : ''),
          width: 100,
        },
        {
          field: 'band2',
          headerName: '',
          valueFormatter: ({ value }) => (value ? `${Number(value).toFixed(2)}%` : ''),
          width: 100,
        }
      );

      newColsGrouping.push({
        groupId: 'Specification',
        headerName: t('asphalt.dosages.marshall.specification'),
        headerAlign: 'center',
        children: [
          {
            groupId: t('asphalt.dosages.marshall.band') + ` ${generalData.dnitBand}`,
            headerAlign: 'center',
            children: [{ field: 'band1' }, { field: 'band2' }],
          },
        ],
      });
    }
    
    setColumns(newCols);
    setColumnGroupings(newColsGrouping);
  }, [data.table_data?.table_column_headers, percentageInputs, materialSelectionData.aggregates]);

  useEffect(() => {
    if (!percentageInputs || Object.keys(percentageInputs).length === 0) {
      setNextDisabled(true);
      return;
    }

    const hasNull = Object.values(percentageInputs).some((value) => value === null || value === undefined);
    const hasGraph = data?.graphData?.length > 1;

    setNextDisabled(hasNull || !hasGraph);
  }, [percentageInputs, data.graphData]);

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
          {percentageInputs && Object.keys(percentageInputs).length > 0 && (
            <>
              <Step3Table rows={rows} columns={columns} columnGrouping={columnGrouping} marshall={marshall} />

              <Button
                sx={{ 
                  color: 'secondaryTons.orange', 
                  border: '1px solid rgba(224, 224, 224, 1)',
                  marginTop: '20px',
                  alignSelf: 'flex-start'
                }}
                onClick={calculateGranulometricComposition}
                variant="outlined"
              >
                {t('asphalt.dosages.marshall.calculate')}
              </Button>
            </>
          )}

          {data?.graphData?.length > 1 && <Graph data={data?.graphData} />}
        </Box>
      )}
    </>
  );
};

export default Marshall_Step3_Granulometry;