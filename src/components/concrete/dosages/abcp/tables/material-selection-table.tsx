import { NoDataFound } from '@/components/util/tables';
import useABCPStore from '@/stores/concrete/abcp/abcp.store';
import { Box } from '@mui/material';
import { DataGrid, GridCellParams, GridColDef, GridRowId, GridRowParams, GridRowSelectionModel } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import CoarseAggregate from '@/pages/concrete/essays/coarseAggregate';

interface MaterialRow {
  _id: string;
  name: string;
  type: string;
  resistance?: string;
}

interface MaterialWithInput {
  inputComponent?: React.ReactNode;
}

type RowsWithInput = (MaterialRow | MaterialWithInput)[];

interface MaterialSelectionProps {
  header?: string;
  rows: RowsWithInput;
  columns: GridColDef[];
}

const MaterialSelectionTable = ({ rows, columns, header }: MaterialSelectionProps) => {
  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);
  const { materialSelectionData, setData } = useABCPStore();

  useEffect(() => {
    console.log("🚀 ~ MaterialSelectionTable ~ selectionModel:", selectionModel)
  }, [selectionModel])

  const renderCell = (params: GridCellParams) => {
    const row = rows[params.id];

    if ('inputComponent' in row) {
      return row.inputComponent;
    }

    return params.value;
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
          rowSelectionModel={selectionModel}
          checkboxSelection
          disableRowSelectionOnClick
          hideFooter
          // isRowSelectable={(params: GridRowParams) => {
          //   const selectedRowType = rows[params.id]?.type;
          //   if (selectedRowType) {
          //     return rowSelectionModel.length === 0 || rowSelectionModel[0] === params.id;
          //   }
          //   return true;
          // }}
          onRowSelectionModelChange={(rowSelection) => {
            setSelectionModel(rowSelection)

            type AggregateObject = {
              id: string | null,
              type: string | null
            }

            const updatedStates: {
              fineAggregate: AggregateObject;
              coarseAggregate: AggregateObject | null;
            } = {
              fineAggregate: {
                id: null,
                type: null
              },
              coarseAggregate: null,
            };

            rowSelection.forEach((selectedRow) => {
              const row = rows[selectedRow];
              console.log("🚀 ~ rowSelection.forEach ~ rows:", rows)

              if ('_id' in row) {
                const { _id, type } = row;

                if (
                  type === t("abcp.step-3.coarse-aggregate")
                  && updatedStates.coarseAggregate !== null 
                  && updatedStates.coarseAggregate.id !== _id
                ) {
                  if (selectionModel.includes(selectedRow) || row.type === updatedStates.coarseAggregate.type) {
                    selectionModel.filter(id => rows[id] === row)
                    updatedStates.coarseAggregate = { id: null, type: null };
                  } else {
                    selectionModel.push(selectedRow);
                    updatedStates.coarseAggregate = { id: _id, type }
                  }
                } else if (
                  type === t("abcp.step-3.fine-aggregate")
                  // && updatedStates.fineAggregate !== null 
                  // && updatedStates.fineAggregate.id !== _id
                ) {
                  if (selectionModel.includes(selectedRow)) {
                    selectionModel.filter(id => rows[id] === row)
                    updatedStates.fineAggregate = { id: null, type: null };
                  } else {
                    updatedStates.fineAggregate = { id: _id, type }
                    console.log("🚀 ~ rowSelection.forEach ~ updatedStates.fineAggregate.type !== null:", updatedStates.fineAggregate.type !== null)
                    console.log("🚀 ~ rowSelection.forEach ~ updatedStates.fineAggregate:", updatedStates.fineAggregate)

                    if (updatedStates.fineAggregate.type !== null) {

                      console.log("🚀 ~ rowSelection.forEach ~ selectionModel:", selectionModel)

                      console.log("🚀 ~ rowSelection.forEach ~ selectionModel.filter(id => Number(id) - 1 === rows[Number(id)]):", selectionModel.find((id: number) => id - 1 === rows[id]))


                      selectionModel.filter(id => Number(id) - 1 === rows[Number(id)]);
                    }
                    
                    selectionModel.push(selectedRow);
                  }
                  // updatedStates.fineAggregate = updatedStates.fineAggregate?.id === row._id ? null : { id: _id, type: 'fineAggregate' };
                }
              }
            });
            
            // Atualiza os dados armazenados
            setData({
              step: 1,
              key: 'fineAggregate',
              value: updatedStates.fineAggregate !== null
                ? { ...(materialSelectionData.fineAggregate || {}), ...updatedStates.fineAggregate }
                : null,
            });

            setData({
              step: 1,
              key: 'coarseAggregate',
              value: updatedStates.coarseAggregate !== null
                ? { ...(materialSelectionData.coarseAggregate || {}), ...updatedStates.coarseAggregate }
                : null,
            });
          }}
          disableColumnSelector
          columns={columns.map((column) => ({
            ...column,
            disableColumnMenu: true,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
            minWidth: 50,
            flex: 1,
            renderCell: renderCell as (params: GridCellParams) => React.ReactNode, // Ajuste o tipo aqui
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
