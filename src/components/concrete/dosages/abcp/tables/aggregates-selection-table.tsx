import { NoDataFound } from '@/components/util/tables';
import useABCPStore from '@/stores/concrete/abcp/abcp.store';
import { Box } from '@mui/material';
import { DataGrid, GridCellParams, GridColDef, GridRowId, GridRowParams, GridRowSelectionModel } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { t } from 'i18next';

export type AggregateErrors = {
  type: string,
  error: string
}

interface AggregatesSelectionProps {
  header?: string;
  rows: any;
  columns: GridColDef[];
  handleErrors: (error: AggregateErrors) => void;
}

const AggregatesSelectionTable = ({ rows, columns, header, handleErrors }: AggregatesSelectionProps) => {
  const [selectionModel, setSelectionModel] = useState<any[]>([]);
  const { materialSelectionData, setData } = useABCPStore();

  useEffect(() => {
    const selectedRows = rows.filter((index) => selectionModel.includes(index));
    const fineAggregateCount = selectedRows.filter(row => row.type === "fineAggregate").length;
    console.log("🚀 ~ useEffect ~ fineAggregateCount:", fineAggregateCount)
    const coarseAggregateCount = selectedRows.filter(row => row.type === "coarseAggregate").length;

    if (fineAggregateCount > 1) {
      handleErrors({
        type: 'fine-aggregate',
        error: "Mais de um objeto com type igual a 'fineAggregate' foi selecionado!"
      })
    }

    if (coarseAggregateCount > 1) {
      handleErrors({
        type: 'coarse-aggregate',
        error: "Mais de um objeto com type igual a 'coarseAggregate' foi selecionado!"
      })
    }
  }, [selectionModel, rows]);


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
          onRowSelectionModelChange={(rowSelection: any) => {
            let newSelectionModel: any = [...selectionModel];
            let updatedStates: any = { ...materialSelectionData };

            rowSelection.forEach((selectedRow) => {
              const row = rows[selectedRow];

              if ('_id' in row) {
                const { _id, type } = row;

                if (!newSelectionModel.includes(selectedRow)) {
                  // Se a linha não está presente, adicione-a a newSelectionModel e atualize updatedStates
                  newSelectionModel = [...newSelectionModel, selectedRow];
                  if (type === t("abcp.step-3.coarse-aggregate")) {
                    updatedStates.coarseAggregate = { id: _id, type };
                  } else if (type === t("abcp.step-3.fine-aggregate")) {
                    updatedStates.fineAggregate = { id: _id, type };
                  }
                } else {
                  // Se a linha já está presente, remova-a de newSelectionModel e atualize updatedStates
                  newSelectionModel = newSelectionModel.filter((rowIndex: number) => rowIndex !== selectedRow);
                  if (type === t("abcp.step-3.coarse-aggregate")) {
                    updatedStates.coarseAggregate = { id: null, type: null };
                  } else if (type === t("abcp.step-3.fine-aggregate")) {
                    updatedStates.fineAggregate = { id: null, type: null };
                  }
                }
              }
            });

            // Atualiza os dados armazenados
            setData({
              step: 1,
              value: updatedStates.fineAggregate?.id !== null ? updatedStates : null,
            });

            setData({
              step: 1,
              value: updatedStates.coarseAggregate?.id !== null ? updatedStates : null,
            });

            // Atualiza newSelectionModel com a nova seleção
            setSelectionModel(newSelectionModel);
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
            renderCell: renderCell as (params: GridCellParams) => React.ReactNode,
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

export default AggregatesSelectionTable;
