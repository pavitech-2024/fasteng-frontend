import { SandIncrease_Step2TableData } from "@/stores/concrete/sandIncrease/sandIncrease.store";
import { DataGrid, GridColDef } from "@mui/x-data-grid";


interface step2SandIncreaseProps {
  rows: SandIncrease_Step2TableData[];
  columns: GridColDef[];
}

const SandIncrease_step2Table = ({ rows, columns }: step2SandIncreaseProps) => {
  return (
    <DataGrid
      sx={{ mt: '1rem', borderRadius: '10px' }}
      density="compact"
      hideFooter
      showCellVerticalBorder
      showColumnVerticalBorder
      columns={columns.map((column) => ({
        ...column,
        disableColumnMenu: true,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
        minWidth: 100,
        flex: 1,
      }))}
      rows={rows ? rows.map((row, index) => ({ ...row, id: index })) : []}
    />
  );
};

export default SandIncrease_step2Table;
