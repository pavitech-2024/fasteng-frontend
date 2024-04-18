import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface ResultsTableProps {
  rows: {
    id: number;
    point: number;
    di: number;
    dm: number;
    deltaLi: number;
    sumDeltaLi: number;
    areaBetweenCurves: number;
    cumulativeAreas: number;
    cumulativeDifference: number;
  }[];
}

const columns: GridColDef[] = [
  {
    field: 'point',
    headerName: 'Ponto (KM)',
  },
  {
    field: 'di',
    headerName: 'Di (0,01mm)',
  },
  {
    field: 'dm',
    headerName: 'Dm',
  },
  {
    field: 'deltaLi',
    headerName: 'Δli (m)',
  },
  {
    field: 'sumDeltaLi',
    headerName: 'Σ Δli (m)',
  },
  {
    field: 'areaBetweenCurves',
    headerName: 'Ai',
  },
  {
    field: 'cumulativeAreas',
    headerName: 'Σ Ai',
  },
  {
    field: 'cumulativeDifference',
    headerName: 'Zi',
  },
];

const ResultsTable = ({ rows }: ResultsTableProps) => {
  const getRowId = (row: any) => row.id;

  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns.map((column) => ({
          ...column,
          sortable: false,
          disableColumnMenu: true,
          width: 175,
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

export default ResultsTable;
