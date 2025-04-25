import { AsphaltMaterial } from '@/interfaces/asphalt';
import { GridColDef, DataGrid } from '@mui/x-data-grid';

interface step2GranulometryProps {
  rows: { sieve_label: string; sieve_value: number; passant: number; retained: number, material?: AsphaltMaterial }[];
  columns: GridColDef[];
}

const AsphaltGranulometry_step2Table = ({ rows, columns }: step2GranulometryProps) => {
  return (
    <DataGrid
      sx={{ mt: '1rem', borderRadius: '10px' }}
      density="compact"
      hideFooter
      showCellVerticalBorder
      showColumnVerticalBorder
      experimentalFeatures={{ columnGrouping: true }}
      columns={columns.map((column) => ({
        ...column,
        disableColumnMenu: true,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
        minWidth: column.field === 'extended_read' ? 250 : 100,
        flex: 1,
      }))}
      rows={rows !== null ? rows.map((row, index) => ({ ...row, id: index })) : []}
    />
  );
};

export default AsphaltGranulometry_step2Table;
