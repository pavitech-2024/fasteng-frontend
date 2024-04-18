import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface IggResultsProps {
  rows: {
    id: number;
    initialStake: string | null;
    finalStake: string | null;
    extension: string | null;
    FC1: string | null;
    FC2: string | null;
    ALP: string | null;
    ATP: string | null;
    OEP: string | null;
    Ex: string | null;
    D: string | null;
    R: string | null;
    arrowsAverage: string | null;
    variancesAverage: string | null;
    igg: string | null;
    concept: string;
  }[];
  columns: GridColDef[];
}

const IggResultsTable = ({ rows, columns }: IggResultsProps) => {
  const columnsWithMinWidth = columns.map((column) => ({
    ...column,
    disableColumnReorder: true,
    disableColumnMenu: true,
    disableSelectionOnClick: true,
    disableColumnFilter: true,
  }));

  return (
    <div style={{ height: '100%', width: '100%', maxWidth: '100%' }}>
      <DataGrid
        autoHeight
        sx={{ lineHeight: '1rem', mt: '1rem', borderRadius: '10px' }}
        density="standard"
        hideFooter
        showCellVerticalBorder
        showColumnVerticalBorder
        columns={columnsWithMinWidth}
        rows={rows}
      />
    </div>
  );
};

export default IggResultsTable;
