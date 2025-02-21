import { styled } from '@mui/material';
import { DataGrid, GridColDef, gridClasses } from '@mui/x-data-grid';
import { t } from 'i18next';

const HRB_StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.selected-by-hrb-classification`]: {
    backgroundColor: theme.palette.secondary,
    fontWeight: 'bold',
    opacity: 0.8,
  },
}));

interface HRB_ReferenceTableProps {
  classification: string;
  sx?: { [key: string]: unknown };
}

export const HRB_ReferenceTableCBR = ({ classification, sx }: HRB_ReferenceTableProps) => {
  const columns: GridColDef[] = [
    {
      field: 'soil',
      headerName: t('topbar.soils'),
    },
    {
      field: 'cbr',
      headerName: 'CBR',
    },
  ];

  const rows = [
    { soil: 'A-1-a', cbr: t('hrb.cbr-A-1-a'), codes: ['A-1-a'] },
    { soil: 'A-1-b', cbr: t('hrb.cbr-A-1-b'), codes: ['A-1-b'] },
    { soil: 'A-2-4 e A-2-5', cbr: t('hrb.cbr-A-2-4/5'), codes: ['A-2-4', 'A-2-5'] },
    { soil: 'A-2-6 e A-2-6', cbr: t('hrb.cbr-A-2-6/7'), codes: ['A-2-6', 'A-2-7'] },
    { soil: 'A-3', cbr: t('hrb.cbr-A-3'), codes: ['A-3'] },
    { soil: 'A-4', cbr: t('hrb.cbr-A-4'), codes: ['A-4'] },
    { soil: 'A-5', cbr: t('hrb.cbr-A-5'), codes: ['A-5'] },
    { soil: 'A-6 e A-7', cbr: t('hrb.cbr-A-6/7'), codes: ['A-6', 'A-7'] },
  ];

  const selectedRowIndex = rows.findIndex((row) => row.codes.includes(classification));

  return (
    <HRB_StyledDataGrid
      sx={{ borderRadius: '10px', ...sx }}
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
        minWidth: column.field === 'extended_read' ? 250 : 100,
        flex: 1,
      }))}
      rows={rows.map((row, index) => ({ ...row, id: index }))}
      getRowClassName={(params) => {
        return params.row.id === selectedRowIndex && 'selected-by-hrb-classification';
      }}
    />
  );
};

export const HRB_ReferenceTableTRB = ({ classification, sx }: HRB_ReferenceTableProps) => {
  const columns: GridColDef[] = [
    {
      field: 'hrb',
      headerName: t('soils.essays.hrb'),
    },
    {
      field: 'more_possible',
      headerName: t('hrb.more_possible'),
    },
    {
      field: 'possible',
      headerName: t('hrb.possible'),
    },
    {
      field: 'less_possible',
      headerName: t('hrb.less_possible'),
    },
  ];

  const rows = [
    { hrb: 'A-1-a', more_possible: 'GW - GP', possible: 'SW - SP	', less_possible: 'GM - SM' },
    { hrb: 'A-1-b', more_possible: 'SW - SP - GM - SM', possible: 'GP', less_possible: '-' },
    { hrb: 'A-3', more_possible: 'SP', possible: '-', less_possible: 'SW - GP' },
    { hrb: 'A-2-4', more_possible: 'GM - SM', possible: 'GC - SC', less_possible: 'GW - GP - SW - SP' },
    { hrb: 'A-2-5', more_possible: 'GM - SM', possible: '-', less_possible: 'GW - GP - SW - SP' },
    { hrb: 'A-2-6', more_possible: '-', possible: 'GM - SM', less_possible: 'GW - GP - SW - SP' },
    { hrb: 'A-2-7', more_possible: 'GM - GC - SM - SC', possible: '-', less_possible: 'GW - GP - SW - SP' },
    { hrb: 'A-4', more_possible: 'ML - OL', possible: 'CL - SM - SC', less_possible: 'GM - GC' },
    { hrb: 'A-5', more_possible: 'OH - MH - ML - OL	', possible: '-', less_possible: 'SM - GM' },
    { hrb: 'A-6', more_possible: '-', possible: 'ML - OL - SC', less_possible: 'GC - SM - GC - SC' },
    { hrb: 'A-7-5', more_possible: 'OH - MH', possible: 'ML - OL - CH', less_possible: 'GM - SM - GC - SC' },
    { hrb: 'A-7-6', more_possible: 'CH - CL', possible: 'ML - OL - SC', less_possible: 'OH - MH - GC - GM - SM' },
  ];

  const selectedRowIndex = rows.findIndex((row) => row.hrb.includes(classification));

  return (
    <HRB_StyledDataGrid
      sx={{ borderRadius: '10px', ...sx }}
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
        minWidth: column.field === 'extended_read' ? 250 : 100,
        flex: 1,
      }))}
      experimentalFeatures={{ columnGrouping: true }}
      columnGroupingModel={[
        {
          groupId: 'TRB',
          children: [{ field: 'more_possible' }, { field: 'possible' }, { field: 'less_possible' }],
          headerAlign: 'center',
        },
      ]}
      rows={rows.map((row, index) => ({ ...row, id: index }))}
      getRowClassName={(params) => params.row.id === selectedRowIndex && 'selected-by-hrb-classification'}
    />
  );
};
