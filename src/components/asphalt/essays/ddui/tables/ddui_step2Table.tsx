import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface Step3DduiTableProps {
  rows: {
    id: number;
    sampleName: string;
    condicionamento: boolean;
    d1: number;
    d2: number;
    d3: number;
    h1: number;
    h2: number;
    h3: number;
    pressReading: number;
  }[];
  columns: GridColDef[];
  footer: any
}

const Ddui_Step3Table = ({  rows, columns, footer }: Step3DduiTableProps) => {

  return (
    <DataGrid
      experimentalFeatures={{ columnGrouping: true }}
      sx={{
        maxWidth: 'fit-content',
        marginX: 'auto'
      }}
      showCellVerticalBorder
      showColumnVerticalBorder
      slots={{ footer: footer}}
      columnGroupingModel={[
        {
          groupId: 'Alturas',
          headerName: 'Alturas',
          headerAlign: 'center',
          children: [{ field: 'h1' }, { field: 'h2' }, { field: 'h3' }],
        },
        {
          groupId: 'Diametros',
          headerName: 'Diametros',
          headerAlign: 'center',
          children: [{ field: 'd1' }, { field: 'd2' }, { field: 'd3' }],
        },
        {
          groupId: 'results',
          headerName: 'Resultados',
          headerAlign: 'center',
          children: [{ field: 'pressReading' }],
        },
      ]}
      columns={columns.map((column) => ({
        ...column,
        sortable: false,
        disableColumnMenu: true,
        align: 'center',
        headerAlign: 'center',
      }))}
      rows={rows}
    />
  )
}

export default Ddui_Step3Table;