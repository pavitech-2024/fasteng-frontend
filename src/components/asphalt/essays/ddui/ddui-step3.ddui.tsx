import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useDduiStore from '@/stores/asphalt/ddui.store';
import { Box, Switch } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const Ddui_Step3 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  console.log("🚀 ~ file: ddui-step3.ddui.tsx:8 ~ setNextDisabled:", setNextDisabled)
  const { dduiStep3: data, setData } = useDduiStore();

  if (nextDisabled) {
    // const hasEmptyValues = data.dnitRange && data.pressConstant && data.pressSpecification && data.sampleOrigin && data.sampleVoidVolume !== null;
    // if (hasEmptyValues) setNextDisabled(false);
  }

  const rows = data.data;

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    {
      field: 'sampleName',
      headerName: 'Nome do corpo de prova',
      width: 110,
      renderCell: ({ row }) => {
        const { sampleName } = row;
        const index = rows.findIndex((r) => r.sampleName === sampleName);
        return (
          <InputEndAdornment 
            adornment={''} 
            type='text'
            value={rows[index].sampleName} 
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...rows];
              newRows[index].sampleName = e.target.value;
              setData({ step: 2, key: 'data', value: newRows })
            }}
          />
        )
      },
    },
    {
      field: 'condicionamento',
      headerName: 'Condicionamento',
      width: 110,
      renderCell: ({ row }) => {
        const { h1 } = row;
        const index = rows.findIndex((r) => r.h1 === h1);
        return (
          <Switch
            onChange={() => {
              const newRows = [...rows];
              rows[index].condicionamento = !rows[index].condicionamento;
              setData({ step: 2, key: 'data', value: newRows });
            }}
          />
        )
      },
    },
    {
      field: 'h1',
      headerName: 'h1',
      type: 'number',
      width: 80,
      renderCell: ({ row }) => {
        const { h1 } = row;
        const index = rows.findIndex((r) => r.h1 === h1);
        return (
          <InputEndAdornment 
            adornment={''} 
            type='number'
            value={rows[index].h1} 
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...rows];
              newRows[index].h1 = Number(e.target.value);
              setData({ step: 2, key: 'data', value: newRows })
            }}
          />
        )
      },
    },
    {
      field: 'h2',
      headerName: 'h2',
      type: 'number',
      width: 80,
      renderCell: ({ row }) => {
        const { h2 } = row;
        const index = rows.findIndex((r) => r.h2 === h2);
        return (
          <InputEndAdornment 
            adornment={''} 
            type='number'
            value={rows[index].h2} 
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...rows];
              newRows[index].h2 = Number(e.target.value);
              setData({ step: 2, key: 'data', value: newRows })
            }}
          />
        )
      },
    },
    {
      field: 'h3',
      headerName: 'h3',
      type: 'number',
      width: 80,
      renderCell: ({ row }) => {
        const { h3 } = row;
        const index = rows.findIndex((r) => r.h3 === h3);
        return (
          <InputEndAdornment 
            adornment={''} 
            type='number'
            value={rows[index].h3} 
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...rows];
              newRows[index].h3 = Number(e.target.value);
              setData({ step: 2, key: 'data', value: newRows })
            }}
          />
        )
      },
    },
    {
      field: 'd1',
      headerName: 'd1',
      type: 'number',
      width: 80,
      renderCell: ({ row }) => {
        const { d1 } = row;
        const index = rows.findIndex((r) => r.d1 === d1);
        return (
          <InputEndAdornment 
            adornment={''} 
            type='number'
            value={rows[index].d1} 
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...rows];
              newRows[index].d1 = Number(e.target.value);
              setData({ step: 2, key: 'data', value: newRows })
            }}
          />
        )
      },
    },
    {
      field: 'd2',
      headerName: 'd2',
      type: 'number',
      width: 80,
      renderCell: ({ row }) => {
        const { d2 } = row;
        const index = rows.findIndex((r) => r.d2 === d2);
        return (
          <InputEndAdornment 
            adornment={''} 
            type='number'
            value={rows[index].d2} 
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...rows];
              newRows[index].d2 = Number(e.target.value);
              setData({ step: 2, key: 'data', value: newRows })
            }}
          />
        )
      },
    },
    {
      field: 'd3',
      headerName: 'd3',
      type: 'number',
      width: 80,
      renderCell: ({ row }) => {
        const { d3 } = row;
        const index = rows.findIndex((r) => r.d3 === d3);
        return (
          <InputEndAdornment 
            adornment={''} 
            type='number'
            value={rows[index].d3} 
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...rows];
              newRows[index].d3 = Number(e.target.value);
              setData({ step: 2, key: 'data', value: newRows })
            }}
          />
        )
      },
    },
    {
      field: 'pressReading',
      headerName: 'Leitura da prensa',
      type: 'number',
      width: 110,
      renderCell: ({ row }) => {
        const { pressReading } = row;
        const index = rows.findIndex((r) => r.pressReading === pressReading);
        return (
          <InputEndAdornment 
            adornment={''} 
            type='number'
            value={rows[index].pressReading} 
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...rows];
              newRows[index].pressReading = Number(e.target.value);
              setData({ step: 2, key: 'data', value: newRows })
            }}
          />
        )
      },
    },
    {
      field: 'RT1',
      headerName: 'RT 1',
      type: 'number',
      width: 110,
      renderCell: ({ row }) => {
        const { RT1 } = row;
        const index = rows.findIndex((r) => r.RT1 === RT1);
        return (
          <InputEndAdornment 
            adornment={''} 
            type='number'
            value={rows[index].RT1} 
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...rows];
              newRows[index].RT1 = Number(e.target.value);
              setData({ step: 2, key: 'data', value: newRows })
            }}
          />
        )
      },
    },
    {
      field: 'RT2',
      headerName: 'RT 2',
      type: 'number',
      width: 110,
      renderCell: ({ row }) => {
        const { RT2 } = row;
        const index = rows.findIndex((r) => r.RT2 === RT2);
        return (
          <InputEndAdornment 
            adornment={''} 
            type='number'
            value={rows[index].RT2} 
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...rows];
              newRows[index].RT2 = Number(e.target.value);
              setData({ step: 2, key: 'data', value: newRows })
            }}
          />
        )
      },
    },
    
  ];

  return (
    <>
      <Box sx={{ width: '100%', marginX: 'auto' }}>
        <DataGrid
          experimentalFeatures={{ columnGrouping: true }}
          hideFooter
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
              children: [{ field: 'pressReading'}, { field: 'RT1'}, { field: 'RT2'}],
            },
          ]} 
          columns={columns} 
          rows={rows}
        />
      </Box>
    </>
  ) 
};

export default Ddui_Step3;
