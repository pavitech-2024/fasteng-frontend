import { NoDataFound } from '@/components/util/tables';
import useABCPStore from '@/stores/concrete/abcp/abcp.store';
import { Box, Stack } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { useState } from 'react';

interface MaterialSelectionProps {
  header?: string;
  rows: { _id: string, name: string; type: string; resistance?: string }[];
  columns: GridColDef[];
}

const MaterialSelectionTable = ({ rows, columns, header }: MaterialSelectionProps) => {
  const [ rowSelectionModel, setRowSelectionModel ] = useState<GridRowSelectionModel>([]);
  const { materialSelectionData, setData } = useABCPStore();

  // setRowSelectionModel(rows.map((element, index) => {
  //   const { _id, type } = element;
  //   if (type === 'cement' && materialSelectionData.cements.includes(_id)) {
  //     return index
  //   }
  //   if (type !== 'cement' && (materialSelectionData.coarseAggregates.includes(_id) || materialSelectionData.fineAggregates.includes(_id))) {
  //     return index
  //   }
  // }))

  return (
    <Box
      sx={{
        p: '1rem',
        textAlign: 'center',
        border: '1px solid lightgray',
        borderRadius: '10px',
      }}
    >
      <h3>{header}</h3>
      <Box
        sx={{
          display: 'flex',
          msFlex: 'none',
          gap: '1rem',
          m: 'auto',
        }}
      ></Box>
      <Box
        sx={{
          mt: '1rem',
        }}
      >
        <DataGrid
          sx={{
            borderRadius: '10px',
            height: 300,
          }}
          checkboxSelection
          onRowSelectionModelChange={(rowSelection) => {
            setRowSelectionModel(rowSelection)
            if (rows.some((element) => element.type === 'cement')) {
              const cements = []

              rowSelection.map((row, index) => {
                const type = rows[index].type
                if (type === 'cement') {
                  cements.push(rows[index]._id)
                }
              });

              setData({ step: 1, key: 'cements', value: cements });

            } else {
              const coarseAggregates = []
              const fineAggregates = []

              rowSelection.map((row, index) => {
                const type = rows[index].type
                if (type === 'coarseAggregate') {
                  coarseAggregates.push(rows[index]._id)
                }
                if (type === 'fineAggregate') {
                  fineAggregates.push(rows[index]._id)
                }
              });

              setData({ step: 1, key: 'fineAggregates', value: fineAggregates });
              setData({ step: 1, key: 'coarseAggregates', value: coarseAggregates });

            }
          }}
          rowSelectionModel={rowSelectionModel}
          disableColumnSelector
          columns={columns.map((column) => ({
            ...column,
            disableColumnMenu: true,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
            minWidth: 100,
            maxWidth: 250,
            flex: 1,
          }))}
          rows={rows !== null ? rows.map((row, index) => ({ ...row, id: index })) : []}
          slots={{
            noRowsOverlay: () => <NoDataFound message="Nenhum material encontrado" />,
            noResultsOverlay: () => <NoDataFound message="Nenhum material encontrado" />,
          }}
        />
      </Box>
    </Box>
  );
};

export default MaterialSelectionTable;
