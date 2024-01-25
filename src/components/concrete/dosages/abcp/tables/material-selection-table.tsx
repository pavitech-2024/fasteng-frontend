import { NoDataFound } from '@/components/util/tables';
import useABCPStore from '@/stores/concrete/abcp/abcp.store';
import { Box } from '@mui/material';
import { DataGrid, GridCellParams, GridColDef, GridRowParams, GridRowSelectionModel } from '@mui/x-data-grid';
import { useState } from 'react';
import { t } from 'i18next';

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
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const { materialSelectionData, setData } = useABCPStore();

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
          checkboxSelection
          disableRowSelectionOnClick
          hideFooter
          isRowSelectable={(params: GridRowParams) => {
            const selectedRowType = rows[params.id]?.type;
            if (selectedRowType === 'cement') {
              return rowSelectionModel.length === 0 || rowSelectionModel[0] === params.id;
            }
            return true;
          }}
          onRowSelectionModelChange={(rowSelection) => {
            setRowSelectionModel(rowSelection);

            type AggregateObject = {
              id: string,
              type: string
            }

            const updatedStates: {
              fineAggregate: AggregateObject | null;
              coarseAggregate: AggregateObject | null;
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
              const row = rows[selectedRow];
            
              if ('_id' in row) {
                const { _id, type } = row;
    
                if (type === 'cement') {
                    const rowIndex = rows.findIndex((r) => '_id' in r && r._id === _id);
                    updatedStates.cement = updatedStates.cement === rowIndex ? null : rowIndex;
                } else if (type === t("abcp.step-3.coarse-aggregate")) {
                    updatedStates.coarseAggregate = { id: _id, type: 'coarseAggregate' };
                } else if (type === t("abcp.step-3.fine-aggregate")) {
                    updatedStates.fineAggregate = { id: _id, type: 'fineAggregate' };
                }
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
              value: updatedStates.cement !== null && '_id' in rows[updatedStates.cement] 
                ? (rows[updatedStates.cement] as MaterialRow)._id 
                : null,
            });
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
