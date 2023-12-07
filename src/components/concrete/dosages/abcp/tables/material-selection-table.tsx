import { NoDataFound } from '@/components/util/tables';
import useABCPStore from '@/stores/concrete/abcp/abcp.store';
import { Box, Stack } from '@mui/material';
import { DataGrid, GridColDef, GridEventListener, GridRowParams, GridRowSelectionModel } from '@mui/x-data-grid';
import { MutableRefObject, useEffect, useState } from 'react';

interface MaterialSelectionProps {
  header?: string;
  rows: { _id: string; name: string; type: string; resistance?: string }[];
  columns: GridColDef[];
}

const MaterialSelectionTable = ({ rows, columns, header }: MaterialSelectionProps) => {
  console.log("🚀 ~ file: material-selection-table.tsx:14 ~ MaterialSelectionTable ~ rows:", rows)
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const [cement, setCement] = useState<number | null>(null);
  // const [coarseAggregate, setCoarseAggregate] = useState<string>('');
  // const [fineAggregate, setFineAggregate] = useState<string>('');
  const { materialSelectionData, setData } = useABCPStore();

  const handleRowClick: GridEventListener<'rowClick'> = (
    params, // GridRowParams
    event, // MuiEvent<React.MouseEvent<HTMLElement>>
    details // GridCallbackDetails
  ) => {
    // console.log(params.row.name);
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
            const selectedRowType = rows[params.id]?.type;
            if (selectedRowType === 'cement') {
              return rowSelectionModel.length === 0 || rowSelectionModel[0] === params.id
            }
            return true
          }}
          onRowSelectionModelChange={(rowSelection) => {
            setRowSelectionModel(rowSelection);
        
            let updatedStates: {
              fineAggregate: string | null;
              coarseAggregate: string | null;
              cement: number | null;
            } = {
              fineAggregate: null,
              coarseAggregate: null,
              cement: null,
            };
        
            // Salva os valores atuais de fineAggregate e coarseAggregate
            const currentFineAggregate = materialSelectionData.fineAggregate;
            const currentCoarseAggregate = materialSelectionData.coarseAggregate;
        
            rowSelection.forEach((selectedRow, index) => {
              const { _id, type } = rows[selectedRow];
        
              if (type === 'cement') {
                const rowIndex = rows.findIndex((row) => row._id === _id);
                updatedStates.cement = rowIndex;
              } else if (type === 'coarseAggregate') {
                updatedStates.coarseAggregate = _id;
              } else if (type === 'fineAggregate') {
                updatedStates.fineAggregate = _id;
              }
            });
        
            // Atualiza os dados armazenados
            setData({
              step: 1,
              key: 'fineAggregate',
              value: updatedStates.fineAggregate ?? currentFineAggregate,
            });
        
            setData({
              step: 1,
              key: 'coarseAggregate',
              value: updatedStates.coarseAggregate ?? currentCoarseAggregate,
            });
        
            setData({
              step: 1,
              key: 'cement',
              value: updatedStates.cement !== null ? rows[updatedStates.cement]._id : null,
            });
          }}
          
          // onRowSelectionModelChange={(rowSelection) => {
          //   setRowSelectionModel(rowSelection);
          
          //   let updatedStates = {
          //     fineAggregate: null,
          //     coarseAggregate: null,
          //     cement: null,
          //   };
          
          //   rowSelection.forEach((selectedRow, index) => {
          //     const { _id, type } = rows[selectedRow];
          
          //     if (type === 'cement') {
          //       const rowIndex = rows.findIndex((row) => row._id === _id);
          //       updatedStates = { ...updatedStates, cement: rowIndex };
          //     } else if (type === 'coarseAggregate') {
          //       updatedStates = { ...updatedStates, coarseAggregate: _id };
          //     } else if (type === 'fineAggregate') {
          //       updatedStates = { ...updatedStates, fineAggregate: _id };
          //     }
          //   });
          
          //   // Atualiza os dados armazenados
          //   setData({
          //     step: 1,
          //     key: 'fineAggregate',
          //     value: updatedStates.fineAggregate,
          //   });
          
          //   setData({
          //     step: 1,
          //     key: 'coarseAggregate',
          //     value: updatedStates.coarseAggregate,
          //   });
          
          //   setData({
          //     step: 1,
          //     key: 'cement',
          //     value: updatedStates.cement !== null ? rows[updatedStates.cement]._id : null,
          //   });
          // }}          
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
          rows={
            rows !== null
              ? rows.map((row, index) => ({
                  ...row,
                  id: index,
                }))
              : []
          }
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
