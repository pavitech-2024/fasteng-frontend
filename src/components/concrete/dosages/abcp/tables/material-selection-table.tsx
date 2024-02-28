import { NoDataFound } from '@/components/util/tables';
import ABCP_SERVICE from '@/services/concrete/dosages/abcp/abcp.service';
import useABCPStore from '@/stores/concrete/abcp/abcp.store';
import { Box } from '@mui/material';
import { DataGrid, GridCellParams, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect, useState } from 'react';

interface Step2Props {
  header?: string;
  rows: any;
  columns: GridColDef[];
  handleError: (error: boolean) => void;
}

const ABCP_MaterialSelectionTable = ({ rows, columns, header, handleError }: Step2Props & { abcp: ABCP_SERVICE }) => {
  console.log("🚀 ~ rows:", rows)
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const { materialSelectionData, setData } = useABCPStore();
  //to do: fazer carregar os dados já selecionados nos inputs ao abrir a página.

  useEffect(() => {
    console.log("🚀 ~ rowSelectionModel:", rowSelectionModel)
  }, [rowSelectionModel])


  useEffect(() => {
    if (materialSelectionData.cement.id !== null) {
      const cementIndex = rows.findIndex((element) => element._id === materialSelectionData.cement.id) + 1;
      console.log("🚀 ~ useEffect ~ cementIndex:", cementIndex)
      if (rowSelectionModel.includes(cementIndex)) {
        rowSelectionModel.filter(item => item !== cementIndex)
      } else {
        rowSelectionModel.push(cementIndex)
      }
    }
  })

  useEffect(() => {
    if (rowSelectionModel.length > 2) {
      handleError(true)
    } else {
      handleError(false)
    }
  }, [rowSelectionModel])

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

      <Box>
        <DataGrid
          sx={{
            borderRadius: '10px',
            height: 300,
          }}
          onStateChange={() => {
            // to do -> selecionar na tabela os materiais já selecionados que estão no store
            // após a página ser recarregada
          }}
          checkboxSelection
          disableRowSelectionOnClick={true}
          onRowSelectionModelChange={(rowSelection) => {
            let cementObject = {
              ...materialSelectionData,
              cement: {
                id: null,
                type: null
              }
            }
            if (rows.some((element) => element.type === 'cement')) {
              if (rowSelection.length > 2) {
                rowSelection = []
              } else if (rowSelection.length > 1) {
                rowSelection.shift();
              }

              if (rowSelection.length > 0) {
                cementObject = { 
                  ...materialSelectionData, 
                  cement: { 
                    id: rows[rowSelection[0]]._id, 
                    type: 'cement' 
                  }
                }
              } else {
                cementObject = {
                  ...materialSelectionData,
                  cement: {
                    id: null,
                    type: null
                  }
                }
              }

              setData({ step: 1, value: cementObject });
            } else {

              const aggregates = [];
              let coarseAggregate = materialSelectionData.coarseAggregate;
              let fineAggregate = materialSelectionData.fineAggregate;
              let aggregatesObject = {
                ...materialSelectionData,
                coarseAggregate: {
                  id: null,
                  type: null
                },
                fineAggregate: {
                  id: null,
                  type: null
                }
              }

              rowSelection.forEach((row, index) => {
                aggregates.push({
                  _id: rows[rowSelection[index]]._id,
                  name: rows[rowSelection[index]].name,
                })

                if (rows[rowSelection[index]].type === t("abcp.step-3.coarse-aggregate")) {
                  coarseAggregate = {
                    id: rows[rowSelection[index]]._id,
                    type: rows[rowSelection[index]].type
                  }
                }

                if (rows[rowSelection[index]].type === t("abcp.step-3.fine-aggregate")) {
                  fineAggregate = {
                    id: rows[rowSelection[index]]._id,
                    type: rows[rowSelection[index]].type
                  }
                }

                aggregatesObject = {
                  ...materialSelectionData,
                  coarseAggregate,
                  fineAggregate
                }
              })

              setData({ step: 1, value: aggregatesObject });
            }
            setRowSelectionModel(rowSelection);
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

export default ABCP_MaterialSelectionTable;