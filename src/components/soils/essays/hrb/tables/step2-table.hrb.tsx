import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';
import { HRB_Step2TableData } from '../../../../../stores/soils/hrb/hrb.store';

interface step2HrbProps {
  rows: HRB_Step2TableData[];
  columns: GridColDef[];
}

const Hrb_step2Table = ({ rows, columns }: step2HrbProps) => {
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
      rows={rows.map((row, index) => ({ ...row, id: index }))}
    />
  );
};

export default Hrb_step2Table;
