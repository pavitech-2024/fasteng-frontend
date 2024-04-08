import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface PreviewFwdTableProps {
  rows: {
    hodometro: number;
    d1: number;
    d2: number;
    d3: number;
    d4: number;
    d5: number;
    d6: number;
    d7: number;
    d8: number;
    d9: number;
    d10: number;
    d11: number;
    d12: number;
    d13: number;
    force: number;
  }[];
}

const columns: GridColDef[] = [
  {
    field: 'hodometro',
    headerName: 'Hodometro',
    width: 120,
  },
  {
    field: 'd1',
    headerName: 'D1',
    width: 85,
  },
  {
    field: 'd2',
    headerName: 'D2',
    width: 85,
  },
  {
    field: 'd3',
    headerName: 'D3',
    width: 85,
  },
  {
    field: 'd4',
    headerName: 'D4',
    width: 85,
  },
  {
    field: 'd5',
    headerName: 'D5',
    width: 85,
  },
  {
    field: 'd6',
    headerName: 'D6',
    width: 85,
  },
  {
    field: 'd7',
    headerName: 'D7',
    width: 85,
  },
  {
    field: 'd8',
    headerName: 'D8',
    width: 85,
  },
  {
    field: 'd9',
    headerName: 'D9',
    width: 85,
  },
  {
    field: 'd10',
    headerName: 'D10',
    width: 85,
  },
  {
    field: 'd11',
    headerName: 'D11',
    width: 85,
  },
  {
    field: 'd12',
    headerName: 'D12',
    width: 85,
  },
  {
    field: 'd13',
    headerName: 'D13',
    width: 85,
  },
  {
    field: 'force',
    headerName: 'Força de Impacto (KN)',
    width: 170,
  },
];
const PreviewFwdTable = ({ rows }: PreviewFwdTableProps) => {
  const getRowId = (row: any) => row.id;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>Deflexão FWD(µm)</div>
      <DataGrid
        rows={rows}
        columns={columns.map((column) => ({
          ...column,
          sortable: false,
          disableColumnMenu: true,
          align: 'center',
          headerAlign: 'center',
        }))}
        getRowId={getRowId}
        rowHeight={40}
        hideFooter
      />
    </div>
  );
};

export default PreviewFwdTable;
