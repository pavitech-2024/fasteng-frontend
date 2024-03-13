import { NoDataFound } from "@/components/util/tables";
import Marshall_SERVICE from "@/services/asphalt/dosages/marshall/marshall.service";
import { Box } from "@mui/material";
import { DataGrid, GridColDef, GridColumnGroupingModel } from "@mui/x-data-grid";

interface Step3Props {
  rows: any[];
  columns: GridColDef[];
  columnGrouping: GridColumnGroupingModel;
}

const Step3Table = ({ rows, columns, columnGrouping }: Step3Props & { marshall: Marshall_SERVICE }) => {
console.log("🚀 ~ Step3Table ~ rows:", rows)

  // const formattedRows = rows.reduce((accumulator, currentRow) => {
  //   const formattedValues = {};

  //   Object.keys(currentRow).forEach(key => {
  //     const value = currentRow[key];
  
  //     if (typeof value === 'number') {
  //       formattedValues[key] = value.toFixed(0);
  //     } else {
  //       formattedValues[key] = value;
  //     }
  //   });

  //   accumulator.push(formattedValues);
  // return accumulator;
  // },[])

  // const rowww = rows.length > 0 ? rows.map((r, idx) => ({
  //   ...r,
  //   id: idx
  // })) : null;

  return (
    <Box>
      <DataGrid
        sx={{
          borderRadius: '10px',
          height: 300,
        }}
        density="compact"
        hideFooter
        experimentalFeatures={{ columnGrouping: true }}
        columnGroupingModel={columnGrouping}
        columns={
          columns !== null
            ? columns.map((column) => ({
              ...column,
              disableColumnMenu: true,
              sortable: false,
              align: 'center',
              headerAlign: 'center',
              minWidth: 100,
              flex: 1,
            }))
            : []
        }
        rows={
          rows !== null
            ? rows?.map((row, index) => ({
              ...row,
              id: index,
            }))
            : []
        }
        slots={{
          noRowsOverlay: () => <NoDataFound message="Nenhum dado encontrado" />,
          noResultsOverlay: () => <NoDataFound message="Nenhum dado encontrado" />,
        }}
      />
    </Box>
  )
}

export default Step3Table;