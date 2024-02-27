import { NoDataFound } from '@/components/util/tables';
import useABCPStore from '@/stores/concrete/abcp/abcp.store';
import { Box } from '@mui/material';
import { DataGrid, GridCellParams, GridColDef, GridRowId, GridRowParams, GridRowSelectionModel } from '@mui/x-data-grid';
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

const BinderSelectionTable = ({ rows, columns, header }: MaterialSelectionProps) => {
  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);
  const { materialSelectionData, setData } = useABCPStore();

  const renderCell = (params: GridCellParams) => {
    const row = rows[params.id];

    if ('inputComponent' in row) {
      return row.inputComponent;
    }

    return params.value;
  };

  // const handleSelectionChange = (selection: GridRowSelectionModel) => {
  //   if (selection.length > 0) {
  //     const selectedId = selection[0];
  //     setSelectedRowIndex(typeof selectedId === 'string' ? parseInt(selectedId) : selectedId);
  //   } else {
  //     setSelectedRowIndex(null);
  //   }
  // };

  const handleSelectionChange = (selection: GridRowSelectionModel) => {
    if (selection.length > 1) {
      const selectionSet = new Set(selectionModel);
      const result = selection.filter((s) => !selectionSet.has(s));
      console.log("🚀 ~ handleSelectionChange ~ result:", result)
      setSelectionModel(result);
    } else {
      setSelectionModel(selection);
    }
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
          onRowSelectionModelChange={(selection) => {
            console.log("🚀 ~ BinderSelectionTable ~ selection.length > 1:", selection.length > 1)

            if (selection.length > 0) {
              const selectionSet = new Set(selectionModel);
              const result = selection.filter((s) => !selectionSet.has(s));
              console.log("🚀 ~ BinderSelectionTable ~ result:", result)
    
              setSelectionModel(result);
            } else {
              setSelectionModel(selection);
            }
          }}
          disableColumnSelector
          // onRowSelectionModelChange={(selectionModel: GridRowSelectionModel) => {
          //   const selectedId = selectionModel.length > 0 ? selectionModel[0] : null;
          //   setSelectedRowId(selectedId as string);
          //   const selectedRow = rows[Number(selectedId)];
          //   if (selectedRow && '_id' in selectedRow) {
          //     let materialWithCement;
          //     if (materialSelectionData.cement && materialSelectionData.cement.id === selectedRow._id) {
          //       materialWithCement = { ...materialSelectionData, cement: { id: null, type: null } }
          //     } else {
          //       materialWithCement = { ...materialSelectionData, cement: { id: selectedRow._id, type: 'cement' }}
          //     }
          //     setData({
          //       step: 1,
          //       value: materialWithCement
          //     });
          //   }
          // }}
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

export default BinderSelectionTable;
