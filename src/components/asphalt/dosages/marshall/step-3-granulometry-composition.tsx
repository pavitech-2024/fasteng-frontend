import Loading from "@/components/molecules/loading";
import { EssayPageProps } from "@/components/templates/essay";
import useAuth from "@/contexts/auth";
import Marshall_SERVICE from "@/services/asphalt/dosages/marshall/marshall.service";
import useMarshallStore from "@/stores/asphalt/marshall/marshall.store";
import { Box } from "@mui/material";
import { useState } from "react";
import GranulometryCompositionTable from "./tables/granulometry-composition-table";
import { GridColDef } from "@mui/x-data-grid";
import { AllSieves } from "@/interfaces/common";
import { t } from "i18next";

const Marshall_GranulometryComposition = ({ nextDisabled, setNextDisabled, marshall }: EssayPageProps & { marshall: Marshall_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { granulometryCompositionData: data, setData } = useMarshallStore();

  const columnGroupingModel = [];
  const columns: GridColDef[] = []
  
  if (data.table_rows && data.table_columns && data.table_rows.length == 0 && data.table_columns.length == 0) {
    const table_rows = [];

    columns.push({
      field: 'sieve_label',
      headerName: t('granulometry-asphalt.sieves'),
      valueFormatter: ({ value }) => `${value}`,
    })
    
    AllSieves.forEach((sieve) => {
      
      const contains = data.granulometry_data.some(aggregate => (sieve.label in aggregate.passants))
      
      if (contains) {
        const aggregates_data = {}
        data.granulometry_data.forEach(aggregate => {
          const { _id, passants } = aggregate
          
          aggregates_data['total_passant_' + _id] = passants[sieve.label]
          aggregates_data['passant_' + _id] = null

          // adicionando as colunas à tabela
          columns.push({
            field: 'total_passant_' + _id,
            headerName: t('granulometry-asphalt.total_passant'),
            valueFormatter: ({ value }) => `${value}`,
          })
          columns.push({
            field: 'passant_' + _id,
            headerName: t('granulometry-asphalt.passant'),
            valueFormatter: ({ value }) => `${value}`,
          })

          // adicionando os agrupamentos das colunas na tabela pelo _id do material
          columnGroupingModel.push({
            groupId: _id,
            children: [{ field: 'total_passant_' + _id }, { field: 'passant_' + _id }],
            headerAlign: 'center',
          })
        })
        table_rows.push({sieve_label: sieve.label, ...aggregates_data})
      }
    })
    setData({ step: 2, key: 'table_rows', value: table_rows });
  }
  
  const rows = data.table_rows;


  const { user } = useAuth();
  
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
          <GranulometryCompositionTable rows={rows} columns={columns} columnGrouping={columnGroupingModel} marshall={marshall} />
        </Box>
      )}
    </>
  );
};

export default Marshall_GranulometryComposition;