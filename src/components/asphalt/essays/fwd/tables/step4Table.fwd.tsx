import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface Step4FwdTableProps {
  rows: {
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
  }[];
}

const Step4FwdTable = ({ rows }: Step4FwdTableProps) => {
  const columns: GridColDef[] = Array.from({ length: 13 }, (_, index) => ({
    field: `d${index + 1}`,
    headerName: `D${index + 1}`,
    width: 105,
  }));

  const getRowId = (row: any) => row.id;

  const modifiedRows = rows.map((row, index) => {
    const modifiedRow: any = { id: index };
    for (let i = 1; i <= 13; i++) {
      modifiedRow[`d${i}`] = row[`d${i}`] * 10;
    }
    return modifiedRow;
  });
  const roundedRows = modifiedRows.map((row, index) => ({
    ...row,
    id: index,
    d1: row.d1.toFixed(2),
    d2: row.d2.toFixed(2),
    d3: row.d3.toFixed(2),
    d4: row.d4.toFixed(2),
    d5: row.d5.toFixed(2),
    d6: row.d6.toFixed(2),
    d7: row.d7.toFixed(2),
    d8: row.d8.toFixed(2),
    d9: row.d9.toFixed(2),
    d10: row.d10.toFixed(2),
    d11: row.d11.toFixed(2),
    d12: row.d12.toFixed(2),
    d13: row.d13.toFixed(2),
  }));
  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>Deflexão FWD(µm)</div>
      <DataGrid
        rows={roundedRows}
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

export default Step4FwdTable;
