import { NoDataFound } from '@/components/util/tables';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import useMarshallStore from '@/stores/asphalt/marshall/marshall.store';
import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { t } from 'i18next';

interface Step2Props {
  header?: string;
  rows: { _id: string; name: string; type: string }[];
  columns: GridColDef[];
}

const Step2Table = ({ rows, columns, header }: Step2Props & { marshall: Marshall_SERVICE }) => {
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const [currentToastId, setCurrentToastId] = useState<number | string | null>(null);
  const { materialSelectionData, setData } = useMarshallStore();

  // Função para mostrar aviso quando seleciona material
  const showTestWarning = (materialType: string, materialName: string) => {
    // Fecha o toast anterior se existir
    if (currentToastId) {
      toast.dismiss(currentToastId);
    }
    
    let missingTests = '';
    
    if (['coarseAggregate', 'fineAggregate', 'filler'].includes(materialType)) {
      missingTests = '• Ensaio de granulometria\n• Ensaio de massa específica';
    } else if (['CAP', 'asphaltBinder'].includes(materialType)) {
      missingTests = '• Ensaio do ligante asfáltico';
    }
    
    if (missingTests) {
      const toastId = toast.warning(
        `⚠️ ${materialName}\n` +
        `Verifique se possui:\n${missingTests}\n` +
        'Sem esses ensaios, serão usados valores padrão.',
        {
          autoClose: 7000,
          position: 'top-right',
          style: { 
            whiteSpace: 'pre-line',
            minWidth: '300px',
            maxWidth: '400px'
          },
          toastId: `material-${materialName}`,
        }
      );
      
      setCurrentToastId(toastId);
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
            // Verifica se são materiais NOVAMENTE selecionados
            const newlySelected = rowSelection.filter(id => 
              !rowSelectionModel.includes(id)
            );
            
            // Para cada material novo selecionado, mostra aviso
            newlySelected.forEach(index => {
              const row = rows.find((_, i) => i === index);
              if (row) {
                showTestWarning(row.type, row.name);
              }
            });
            
            if (rows.some((element) => element.type === 'CAP' || element.type === 'asphaltBinder')) {
              if (rowSelection.length > 2) {
                rowSelection = [];
              } else if (rowSelection.length > 1) {
                rowSelection.shift();
              }

              const binder =
                rowSelection.length > 0 ? { name: rows[rowSelection[0]].name, _id: rows[rowSelection[0]]._id } : null;

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
          hideFooter
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