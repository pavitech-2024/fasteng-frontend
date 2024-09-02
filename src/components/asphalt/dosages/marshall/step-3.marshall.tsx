import { EssayPageProps } from '@/components/templates/essay';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import useMarshallStore from '@/stores/asphalt/marshall/marshall.store';
import { Box, Button } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import Step3Table from './tables/step-3-table';
import Step3InputTable from './tables/step-3-input-table';
import Graph from '@/services/asphalt/dosages/marshall/graph/graph';
import useAuth from '@/contexts/auth';
import { toast } from 'react-toastify';
import Loading from '@/components/molecules/loading';

const Marshall_Step3 = ({
  nextDisabled,
  setNextDisabled,
  marshall,
}: EssayPageProps & { marshall: Marshall_SERVICE }) => {
  const { calculateGranulometryComposition } = new Marshall_SERVICE();
  const { granulometryCompositionData: data, materialSelectionData, setData, generalData } = useMarshallStore();

  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Tabela de dados
  // Definindo as rows para a tabela de dados
  const [rows, setRows] = useState([]);
  console.log("🚀 ~ rows:", rows)

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          const { table_data, dnitBands } = await marshall.getStep3Data(
            generalData,
            materialSelectionData,
            user._id,
            null
          );

          let prevData = { ...data };

          prevData.table_data = table_data;
          prevData.dnitBands = dnitBands;

          setData({
            step: 2,
            value: prevData,
          });
        } catch (error) {
          throw error;
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

  if (data?.percentageInputs && data?.percentageInputs?.length === 0) {
    const table_data = [];

    const aggregates_percentages = {};

    materialSelectionData.aggregates.forEach((aggregate) => {
      const { _id } = aggregate;
      aggregates_percentages['percentage_'.concat(_id)] = null;
    });

    // const projectCols =

    table_data?.push({ ...aggregates_percentages });

    setData({ step: 2, key: 'percentageInputs', value: table_data });
  }

  useEffect(() => {
    if (data?.dnitBands?.higher?.length > 0) {
      let newHigherSpec = [];

      data?.dnitBands?.higher.forEach((element) => {
        if (data?.table_data?.table_rows) {
          for (let i = 0; i < data?.table_data?.table_rows.length; i++) {
            if (element[0] === data?.table_data?.table_rows[i]?.sieve_label) {
              let newRow = {
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
      setLoading(false);
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
        if (!inputRows) {
          return;
        }

        return (
          <InputEndAdornment
            adornment={'%'}
            type="number"
            value={inputRows[0] ? inputRows[0]['percentage_'.concat(_id)] : ''}
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...inputRows];
              newRows[0]['percentage_'.concat(_id)] = Number(e.target.value);
              setData({ step: 2, key: 'percentageInputs', value: newRows });
            }}
          />
        );
      },
    });
  });

  const [specificationRows, setSpecificationRows] = useState([]);
  const [specificationColumns, setSpecificationColumns] = useState<GridColDef[]>([]);
  const [specificationColumnsGroupings, setSpecificationColumnsGroupings] = useState([]);

  useEffect(() => {
    if (data?.sumOfPercents?.length > 0) {
      setSpecificationColumns([
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
      ]);

      setSpecificationColumnsGroupings([
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
      ]);
    }

    setSpecificationRows([]);

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

      setSpecificationRows([...newArray]);
    }
  }, [data.sumOfPercents, data.bands]);

  const handleCalculateGranulometricComp = async () => {
    if (!Object.values(data.percentageInputs).some((input) => input === null)) {
      toast.promise(
        async () => {
          try {
            const results = await calculateGranulometryComposition(data, generalData);

            const newPointsOfCurve = [...results?.pointsOfCurve];

            newPointsOfCurve.unshift([
              t('asphalt.dosages.marshall.sieve_mm'),
              t('asphalt.dosages.marshall.dnit-track'),
              'Faixa de trabalho',
              'Mistura de projeto',
              'Faixa de trabalho',
              'Faixa do DNIT',
            ]);

            const { projections } = results;

            let newTable = results?.table_data?.table_rows.map((e) => ({
              ...e,
              projections: projections.find((proj) => proj.label === e.sieve_label).value,
              band1: results.dnitBands.higher.find((band) => band[0] === e.sieve_label)?.[1],
              band2: results.dnitBands.lower.find((band) => band[0] === e.sieve_label)?.[1],
            }));

            const newResults = {
              ...results,
              table_data: {
                ...results.table_data,
                table_rows: [...results.table_data.table_rows, newTable],
              },
              graphData: newPointsOfCurve,
            };

            setRows(newTable);
            setData({ step: 2, value: newResults });
          } catch (error) {
            throw error;
          }
        },
        {
          pending: t('loading.calculating.pending'),
          success: t('loading.calculating.success'),
          error: t('asphalt.dosages.inputs-sum-invalid'),
        }
      );
    }
  };

  // Definindo as colunas para tabela de dados
  const [columnGrouping, setColumnGroupings] = useState([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);

  useEffect(() => {
    let newCols: GridColDef[] = [];
    let newColsGrouping = [];
    data?.table_data?.table_column_headers?.forEach((header, idx) => {
      if (header === 'sieve_label') {
        newCols.push({
          field: 'sieve_label',
          headerName: t('granulometry-asphalt.sieves'),
          valueFormatter: ({ value }) => `${value}`,
        });
      } else {
        if (header.startsWith('total_passant')) {
          newCols.push({
            field: header,
            headerName: t('granulometry-asphalt.total_passant'),
            valueFormatter: ({ value }) => `${Number(value).toFixed(2)}%`,
          });
        } else {
          const _id = header.replace('passant_', '');
          const name = materialSelectionData.aggregates.find((aggregate) => aggregate._id === _id)?.name;
          newCols.push({
            field: header,
            headerName: t('granulometry-asphalt.passant'),
            valueFormatter: ({ value }) => (value ? `${Number(value).toFixed(2)}%` : ''),
            renderHeader: () => (
              <InputEndAdornment
                adornment="%"
                value={data?.percentageInputs[0][`percentage_${_id}`] || ''}
                onChange={(e) => {
                  let prevData = [...data?.percentageInputs];
                  prevData[0][`percentage_${_id}`] = Number(e.target.value);
                  setData({ step: 2, value: { ...data, percentageInputs: prevData } });
                }}
              />
            ),
          });
          newColsGrouping.push({
            groupId: name,
            children: [{ field: 'total_passant_'.concat(_id) }, { field: 'passant_'.concat(_id) }],
            headerAlign: 'center',
          });
        }
      }
    });

    newCols.push({
      field: 'projections',
      headerName: 'Projeções',
      valueFormatter: ({ value }) => (value ? `${Number(value).toFixed(2)}` : ''),
    });

    newCols.push(
      {
        field: 'band1',
        headerName: 'teste',
        valueFormatter: ({ value }) => (value ? `${Number(value).toFixed(2)}%` : ''),
      },
      {
        field: 'band2',
        headerName: 'teste2',
        valueFormatter: ({ value }) => (value ? `${Number(value).toFixed(2)}%` : ''),
      }
    );

    newColsGrouping.push({
      groupId: 'Specification',
      children: [
        {
          groupId: `Banda ${generalData.dnitBand}`,
          headerAlign: 'center',
          children: [{ field: 'band1' }, { field: 'band2' }],
        },
      ],
    });
    setColumns(newCols);
    setColumnGroupings(newColsGrouping);
  }, [data.table_data]);

  useEffect(() => {
    const shouldDisableNext =
      !data.percentageInputs.some((e) => Object.values(e).some((value) => value === null || value === 0)) &&
      data.graphData.length > 0;

    setNextDisabled(!shouldDisableNext);
  }, [data.percentageInputs, data.graphData]);

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
          {rows?.length > 0 && (
            <>
              <Step3Table rows={rows} columns={columns} columnGrouping={columnGrouping} marshall={marshall} />

              <Button
                sx={{ color: 'secondaryTons.orange', border: '1px solid rgba(224, 224, 224, 1)' }}
                onClick={handleCalculateGranulometricComp}
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

export default Marshall_Step3;
