import Loading from "@/components/molecules/loading";
import { EssayPageProps } from "@/components/templates/essay";
import useAuth from "@/contexts/auth";
import Marshall_SERVICE from "@/services/asphalt/dosages/marshall/marshall.service";
import useMarshallStore from "@/stores/asphalt/marshall/marshall.store";
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import GranulometryCompositionTable from "./tables/step-3-table";
import { GridColDef } from "@mui/x-data-grid";
import { AllSieves } from "@/interfaces/common";
import { t } from "i18next";
import { toast } from "react-toastify";
import InputEndAdornment from "@/components/atoms/inputs/input-endAdornment";

const Marshall_Step3 = ({ nextDisabled, setNextDisabled, marshall }: EssayPageProps & { marshall: Marshall_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { granulometryCompositionData: data, materialSelectionData, setData } = useMarshallStore();

  // useEffect(() => {
  //   toast.promise(
  //     async () => {
  //       if (data.table_rows && data.table_columns && data.table_rows.length == 0 && data.table_columns.length == 0) {
  //         const table_rows = [];
  //         const table_columns: GridColDef[] = []

  //         table_columns.push({
  //           field: 'sieve_label',
  //           headerName: t('granulometry-asphalt.sieves'),
  //           valueFormatter: ({ value }) => `${value}`,
  //         })

  //         AllSieves.forEach((sieve) => {

  //           const contains = data.granulometry_data.some(aggregate => (sieve.label in aggregate.passants))

  //           if (contains) {
  //             const aggregates_data = {}
  //             data.granulometry_data.forEach(aggregate => {
  //               const { _id, passants } = aggregate

  //               aggregates_data['total_passant_' + _id] = passants[sieve.label]
  //               aggregates_data['passant_' + _id] = null

  //               // adicionando as colunas à tabela
  //               table_columns.push({
  //                 field: 'total_passant_' + _id,
  //                 headerName: t('granulometry-asphalt.total_passant'),
  //                 valueFormatter: ({ value }) => `${value}`,
  //               })
  //               table_columns.push({
  //                 field: 'passant_' + _id,
  //                 headerName: t('granulometry-asphalt.passant'),
  //                 valueFormatter: ({ value }) => `${value}`,
  //               })

  //               // adicionando os agrupamentos das colunas na tabela pelo _id do material
  //               // columnGroupingModel.push({
  //               //   groupId: _id,
  //               //   children: [{ field: 'total_passant_' + _id }, { field: 'passant_' + _id }],
  //               //   headerAlign: 'center',
  //               // })
  //             })
  //             table_rows.push({ sieve_label: sieve.label, ...aggregates_data })
  //           }
  //         })
  //         setData({ step: 2, key: 'table_rows', value: table_rows });
  //         setData({ step: 2, key: 'table_columns', value: table_columns });

  //         console.log(table_rows)
  //         console.log(table_columns)
  //       }
  //       setLoading(false);
  //     },
  //     {
  //       pending: t('loading.data.pending'),
  //       success: t('loading.data.success'),
  //       error: t('loading.data.error'),
  //     }
  //   );
  // }, []);

  const rows = data.table_data.table_rows;

  const columnGrouping = [];
  const columns = [];

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
          valueFormatter: ({ value }) => `${value}`,
        })
      } else {
        const _id = header.replace("passant_", "")
        const name = materialSelectionData.aggregates.find(aggregate => (aggregate._id === _id)).name
        columns.push({
          field: header,
          headerName: t('granulometry-asphalt.passant'),
          valueFormatter: ({ value }) => `${value}`,
          renderCell: ({ row }) => {
            if (!rows) {
              return;
            }

            const sieve_index = rows.findIndex((r) => r.sieve_label === row['sieve_label']);

            return (
              <InputEndAdornment
                adornment={'%'}
                type="number"
                value={rows[sieve_index][header]}
                onChange={(e) => {
                  if (e.target.value === null) return;
                  const newRows = [...rows];
                  newRows[sieve_index][header] = e.target.value;
                  setData({ step: 2, key: 'table_rows', value: newRows });
                }}
              />
            );
          }
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
          <GranulometryCompositionTable rows={rows} columns={columns} columnGrouping={columnGrouping} marshall={marshall} />
          <Button
            sx={{ color: 'secondaryTons.orange', border: '1px solid rgba(224, 224, 224, 1)' }}
            onClick={() => {}}
          >
            {t('calculate')}
          </Button>
        </Box>
      )}
    </>
  );
};

export default Marshall_Step3;