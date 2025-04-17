import { NoDataFound } from '@/components/util/tables';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { useState } from 'react';

interface Step2Props {
  header?: string;
  rows: { _id: string; name: string; type: string }[];
  columns: GridColDef[];
}


/**
 * Component responsible for rendering the material selection table of step 2 of the asphalt superpave dosage calculation.
 * 
 * @param {Step2Props} props
 * @param {Superpave_SERVICE} props.superpave
 * 
 * @returns {JSX.Element} The Step2Table component.
 */
const Step2Table = ({ rows, columns, header }: Step2Props & { superpave: Superpave_SERVICE }) => {
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const { materialSelectionData, setData } = useSuperpaveStore();

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
          onRowSelectionModelChange={(rowSelection) => {
            if (rows.some((element) => element.type === 'CAP' || element.type === 'asphaltBinder')) {
              if (rowSelection.length > 2) {
                rowSelection = [];
              } else if (rowSelection.length > 1) {
                rowSelection.shift();
              }

              const binder = rowSelection.length > 0 ? rows[rowSelection[0]]._id : null;

              setData({ step: 1, key: 'binder', value: binder });
            } else {
              const aggregates = [];

              rowSelection.forEach((row, index) => {
                aggregates.push({
                  _id: rows[rowSelection[index]]._id,
                  name: rows[rowSelection[index]].name,
                });
              });

              setData({ step: 1, key: 'aggregates', value: aggregates });
            }
            setRowSelectionModel(rowSelection);
          }}
          rowSelectionModel={rowSelectionModel}
          disableColumnSelector
          hideFooter
          columns={columns.map((column) => ({
            ...column,
            disableColumnMenu: true,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
            minWidth: 100,
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

export default Step2Table;
