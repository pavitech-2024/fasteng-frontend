import { EssayPageProps } from '@/components/templates/essay';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import useMarshallStore from '@/stores/asphalt/marshall/marshall.store';
import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import Step3Table from './tables/step-3-table';
import Step3InputTable from './tables/step-3-input-table';
import Graph from '@/services/asphalt/dosages/marshall/graph/graph';

const Marshall_Step3 = ({
  nextDisabled,
  setNextDisabled,
  marshall,
}: EssayPageProps & { marshall: Marshall_SERVICE }) => {
  const { calculateGranulometryComposition } = new Marshall_SERVICE();
  const { granulometryCompositionData: data, materialSelectionData, setData, generalData } = useMarshallStore();

  useEffect(() => {
    if (generalData.dnitBand) {
      const insertingDnitBand = {
        ...data,
        dnitBands: generalData.dnitBand,
      };
      setData({ step: 2, value: insertingDnitBand });
    }
  }, [generalData]);

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

    table_data?.push({ ...aggregates_percentages });

    setData({ step: 2, key: 'percentageInputs', value: table_data });
  }

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

  // Tabela de dados
  // Definindo as rows para a tabela de dados
  const rows = data?.table_data?.table_rows;

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
          field: 'band_1',
          headerName: '',
          valueFormatter: ({ value }) => `${value}`,
        },
        {
          field: 'band_2',
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
              groupId: `Banda ${data?.dnitBands}`,
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
          band_1: data.dnitBand.lowerBand[i] !== null ? data.dnitBand.lowerBand[i] : '',
          band_2: data.dnitBand.higherBand[i] !== null ? data.dnitBand.higherBand[i] : '',
        });
      }

      setSpecificationRows([...newArray]);
    }
  }, [data.sumOfPercents, data.dnitBand]);

  const handleCalculateGranulometricComp = async () => {
    if (!Object.values(data.percentageInputs).some((input) => input === null)) {
      const results = await calculateGranulometryComposition(data);

      const newPointsOfCurve = [...results?.pointsOfCurve];

      newPointsOfCurve.unshift([
        t('asphalt.dosages.marshall.sieve_mm'),
        t('asphalt.dosages.marshall.dnit-track'),
        'Faixa de trabalho',
        'Mistura de projeto',
        'Faixa de trabalho',
        'Faixa do DNIT',
      ]);

      const newResults = {
        ...results,
        graphData: newPointsOfCurve,
      };

      setData({ step: 2, value: newResults });
    }
  };

  // Definindo as colunas para tabela de dados
  const columnGrouping = [];
  const columns: GridColDef[] = [];

  data?.table_data?.table_column_headers.forEach((header) => {
    if (header === 'sieve_label') {
      columns.push({
        field: 'sieve_label',
        headerName: t('granulometry-asphalt.sieves'),
        valueFormatter: ({ value }) => `${value}`,
      });
    } else {
      if (header.startsWith('total_passant')) {
        columns.push({
          field: header,
          headerName: t('granulometry-asphalt.total_passant'),
          valueFormatter: ({ value }) => `${Number(value).toFixed(2)}%`,
        });
      } else {
        const _id = header.replace('passant_', '');
        const name = materialSelectionData.aggregates.find((aggregate) => aggregate._id === _id)?.name;
        columns.push({
          field: header,
          headerName: t('granulometry-asphalt.passant'),
          valueFormatter: ({ value }) => (value ? `${Number(value).toFixed(2)}%` : ''),
        });
        columnGrouping.push({
          groupId: name,
          children: [{ field: 'total_passant_'.concat(_id) }, { field: 'passant_'.concat(_id) }],
          headerAlign: 'center',
        });
      }
    }
  });

  nextDisabled && setNextDisabled(false);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <Step3InputTable rows={inputRows} columns={inputColumns} marshall={marshall} />
        <Step3Table rows={rows} columns={columns} columnGrouping={columnGrouping} marshall={marshall} />
        <Button
          sx={{ color: 'secondaryTons.orange', border: '1px solid rgba(224, 224, 224, 1)' }}
          onClick={handleCalculateGranulometricComp}
        >
          {t('asphalt.dosages.marshall.calculate')}
        </Button>
        {data?.projections?.length > 0 && (
          <Step3Table
            rows={specificationRows}
            columns={specificationColumns}
            columnGrouping={specificationColumnsGroupings}
            marshall={marshall}
          />
        )}
        {data?.graphData?.length > 1 && <Graph data={data?.graphData} />}
      </Box>
    </>
  );
};

export default Marshall_Step3;
