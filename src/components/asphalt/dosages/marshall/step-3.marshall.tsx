import Loading from "@/components/molecules/loading";
import { EssayPageProps } from "@/components/templates/essay";
import useAuth from "@/contexts/auth";
import Marshall_SERVICE from "@/services/asphalt/dosages/marshall/marshall.service";
import useMarshallStore from "@/stores/asphalt/marshall/marshall.store";
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { t } from "i18next";
import InputEndAdornment from "@/components/atoms/inputs/input-endAdornment";
import Step3Table from "./tables/step-3-table";
import Step3InputTable from "./tables/step-3-input-table";

const Marshall_Step3 = ({ nextDisabled, setNextDisabled, marshall }: EssayPageProps & { marshall: Marshall_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { calculateGranulometryComposition } = new Marshall_SERVICE();
  const {
    granulometryCompositionData: data,
    materialSelectionData,
    setData,
    generalData
  } = useMarshallStore();
    console.log("🚀 ~ data:", data)


  useEffect(() => {
    if (generalData.dnitBand) {
      const insertingDnitBand = {
        ...data,
        dnitBands: generalData.dnitBand
      }
      setData({ step: 2, value: insertingDnitBand })
    }
  }, [generalData])

  // Tabela de inputs
  // Definindo a row e as colunas para a tabela de inputs
  const inputRows: { [key: string]: number }[] = data.percentageInputs;

  if (data.percentageInputs && data.percentageInputs.length === 0) {
    const table_data = [];

    const aggregates_percentages = {}

    materialSelectionData.aggregates.forEach(aggregate => {
      const { _id, name } = aggregate
      aggregates_percentages['percentage_'.concat(_id)] = null
    })

    table_data.push({ ...aggregates_percentages })

    setData({ step: 2, key: 'percentageInputs', value: table_data });
  }

  const inputColumns: GridColDef[] = []

  materialSelectionData.aggregates.forEach(aggregate => {
    const { _id, name } = aggregate

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
            value={inputRows[0]['percentage_'.concat(_id)]}
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...inputRows];
              newRows[0]['percentage_'.concat(_id)] = Number(e.target.value);
              setData({ step: 2, key: 'percentageInputs', value: newRows });
            }}
          />
        );
      }
    })
  });

  const handleCalculateGranulometricComp = async () => {
    const results = await calculateGranulometryComposition(data);
    console.log("🚀 ~ handleCalculateGranulometricComp ~ results:", results)

    const resultsData = {
      ...data,
      granulometricCompositionData: results
    };

    console.log("🚀 ~ handleCalculateGranulometricComp ~ resultsData:", resultsData)

    setData({ step: 2, key: 'granulometryCompositionData', value: results});
  }

  // Tabela de dados  
  // Definindo as rows para a tabela de dados
  const rows = data.table_data.table_rows;

  // Definindo as colunas para tabela de dados
  const columnGrouping = [];
  const columns: GridColDef[] = [];

  data.table_data.table_column_headers.forEach(header => {
    if (header === 'sieve_label') {
      columns.push({
        field: 'sieve_label',
        headerName: t('granulometry-asphalt.sieves'),
        valueFormatter: ({ value }) => `${value}`,
      })
    } else {
      if (header.startsWith('total_passant')) {
        columns.push({
          field: header,
          headerName: t('granulometry-asphalt.total_passant'),
          valueFormatter: ({ value }) => `${value}%`,
        })
      } else {
        const _id = header.replace("passant_", "")
        const name = materialSelectionData.aggregates.find(aggregate => (aggregate._id === _id)).name
        columns.push({
          field: header,
          headerName: t('granulometry-asphalt.passant'),
          valueFormatter: ({ value }) => value ? `${value}%` : '',
        })
        columnGrouping.push({
          groupId: name,
          children: [{ field: 'total_passant_'.concat(_id) }, { field: 'passant_'.concat(_id) }],
          headerAlign: 'center',

        })
      }
    }
  })

  const { user } = useAuth();

  nextDisabled &&
    setNextDisabled(false);

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
          <Step3InputTable rows={inputRows} columns={inputColumns} marshall={marshall} />
          <Step3Table rows={rows} columns={columns} columnGrouping={columnGrouping} marshall={marshall} />
          <Button
            sx={{ color: 'secondaryTons.orange', border: '1px solid rgba(224, 224, 224, 1)' }}
            onClick={handleCalculateGranulometricComp}
          >
            {t('calculate')}
          </Button>
        </Box>
      // {loading ? (
      //   <Loading />
      // ) : (
      //   <Box
      //     sx={{
      //       display: 'flex',
      //       flexDirection: 'column',
      //       gap: '10px',
      //     }}
      //   >
      //     <p>Teste</p>
      //   </Box>
      )}
    </>
  );
};

export default Marshall_Step3;