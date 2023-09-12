import { NoDataFound } from '@/components/util/tables';
import useABCPStore from '@/stores/concrete/abcp/abcp.store';
import { Box, Stack } from '@mui/material';
import { DataGrid, GridColDef, GridEventListener, GridRowParams, GridRowSelectionModel } from '@mui/x-data-grid';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { MutableRefObject, useState } from 'react';

interface MaterialSelectionProps {
  header?: string;
  rows: { _id: string; name: string; type: string; resistance?: string }[];
  columns: GridColDef[];
}

const MaterialSelectionTable = ({ rows, columns, header }: MaterialSelectionProps) => {
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const [cement, setCement] = useState<number>(null);
  const [coarseAggregate, setCoarseAggregate] = useState<string>("");
  const [fineAggregate, setFineAggregate] = useState<string>("");
  const { materialSelectionData, setData } = useABCPStore();

  const handleRowClick: GridEventListener<'rowClick'> = (
    params, // GridRowParams
    event, // MuiEvent<React.MouseEvent<HTMLElement>>
    details, // GridCallbackDetails
  ) => {
    console.log(params.row.name)
  };

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
          onRowClick={handleRowClick}
          checkboxSelection
          disableRowSelectionOnClick
          isRowSelectable={(params: GridRowParams) => {
            return rows.some((element, index) => {
              if (element.type === 'cement') {
                console.log(`Row[${index}] selecionável: `, cement === null || (cement !== null && cement === index))
                return cement === null || (cement !== null && cement === index)
              } else {
                return true
              }
            })
          }}
          onRowSelectionModelChange={(rowSelection) => {
            setRowSelectionModel(rowSelection);
            console.log(rowSelection)
            if (rows.some((element) => element.type === 'cement')) {
              // setCement(null)
              rowSelection.map((row, index) => {
                const { _id } = rows[index];
                setCement(index);
              });
              console.log(cement)
              setData({ step: 1, key: 'cement', value: cement !== null ? rows[cement]._id : null });
            } 
            // else {
            //   console.log(coarseAggregate)
            //   console.log(fineAggregate)
            //   rowSelection.map((row, index) => {
            //     const { _id, type } = rows[index];
            //     if (type === 'coarseAggregate') {
            //       setCoarseAggregate(_id);
            //     }
            //     if (type === 'fineAggregate') {
            //       setFineAggregate(_id);
            //     }
            //   });

            //   setData({ step: 1, key: 'fineAggregate', value: fineAggregate });
            //   setData({ step: 1, key: 'coarseAggregate', value: coarseAggregate });
            // }
          }}
          rowSelectionModel={rowSelectionModel}
          disableColumnSelector
          columns={columns.map((column) => ({
            ...column,
            disableColumnMenu: true,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
            minWidth: 50,
            flex: 1,
          }))}
          rows={rows !== null ? rows.map((row, index) => ({
            ...row,
            id: index,
          })) : []}
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
