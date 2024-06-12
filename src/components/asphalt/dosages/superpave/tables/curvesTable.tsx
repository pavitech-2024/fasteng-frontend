import React, { useState, useEffect, ChangeEvent } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DataGrid, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import useSuperpaveStore, { SuperpaveData } from '@/stores/asphalt/superpave/superpave.store';
import useMarshallStore from '@/stores/asphalt/marshall/marshall.store';

const TableInputContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const styleColumn = {
  textAlign: 'center',
  background: '#fff',
  color: '#515151',
  fontWeight: '500',
  padding: '1px',
  fontFamily: "'Roboto', sans-serif",
  fontSize: '12px',
};

interface Props {
  materials: { name: string; _id: string }[];
  dnitBandsLetter: string;
  tableInputs: Record<string, string>;
  tableName: string;
  tableData: any[];
  onChangeInputsTables: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    tableName: string,
    index: number
  ) => void;
}

interface TableModel {
  columnsHeaderTop: { header: string; type: string }[];
  columnsHeader: string[];
  columnsKeys: string[];
}

const CurvesTable: React.FC<Props> = ({
  materials,
  dnitBandsLetter,
  tableInputs,
  tableName,
  tableData,
  onChangeInputsTables,
}) => {

  const { granulometryCompositionData: data, setData } = useSuperpaveStore();

  const getMaterialIndex = () => {
    if (tableName === 'lowerComposition') return 0;
    if (tableName === 'averageComposition') return 1;
    if (tableName === 'higherComposition') return 2;
  };

  const materialIndex = getMaterialIndex();

  const [table, setTable] = useState<TableModel>({
    columnsHeaderTop: [{ header: 'Peneira', type: 'rowSpan' }],
    columnsHeader: [],
    columnsKeys: [],
  });

  useEffect(() => {
    const newTable = createObjectTableModel(materials, dnitBandsLetter);
    setTable(newTable);
  }, [materials, dnitBandsLetter]);

  const createObjectTableModel = (selectedMaterials: { name: string }[], dnitBandsLetter: string): TableModel => {
    let newTable: TableModel = {
      columnsHeaderTop: [{ header: 'Peneira', type: 'rowSpan' }],
      columnsHeader: [],
      columnsKeys: ['peneira'],
    };

    selectedMaterials.forEach((item, i) => {
      newTable.columnsHeaderTop.push({ header: item.name, type: 'colsSpan' });
      newTable.columnsHeader.push('Total passante (%)');
      newTable.columnsHeader.push('%');
      newTable.columnsKeys.push('keyTotal' + i);
      newTable.columnsKeys.push('key%' + i);
    });

    newTable.columnsHeaderTop.push({ header: 'Projeto', type: 'rowSpan' });
    newTable.columnsKeys.push('Projeto');
    newTable.columnsHeaderTop.push({ header: 'Especificação', type: 'colsSpan' });
    newTable.columnsHeader.push(`Faixa ${dnitBandsLetter}`);
    newTable.columnsKeys.push('bandsCol1');
    newTable.columnsKeys.push('bandsCol2');

    return newTable;
  };

  // const columns: GridColDef[] = [
  //   {
  //     field: 'peneira',
  //     headerName: 'Peneira',
  //     width: 150,
  //     valueFormatter: ({ value }) => `${value}`,
  //   },
  //   {
  //     field: 'totalPassant_1',
  //     headerName: 'Total passante (%)',
  //     width: 150,
  //     valueFormatter: ({ value }) => `${value}`,
  //   },
  //   {
  //     field: 'material_1',
  //     headerName: ``,
  //     valueFormatter: ({ value }) => `${value}`,
  //     width: 100,
  //     renderHeader: () => (
  //       <InputEndAdornment
  //         adornment="%"
  //         value={data?.percentageInputs[materialIndex].material_1 || ''}
  //         onChange={(e) => {
  //           const prevData = [...data?.percentageInputs];
  //           const newData = {...prevData[materialIndex], material_1: e.target.value};
  //           const updatedData = prevData.map((item, index) =>
  //             index === materialIndex ? newData : item
  //           );
  //           setData({ step: 2, value: {...data, percentageInputs: updatedData} });
  //         }}
  //       />
  //     )
  //   },
  //   {
  //     field: 'totalPassant_2',
  //     headerName: 'Total passante (%)',
  //     width: 150,
  //     valueFormatter: ({ value }) => `${value}`,
  //   },
  //   {
  //     field: 'material_2',
  //     headerName: ``,
  //     valueFormatter: ({ value }) => `${value}`,
  //     width: 100,
  //     renderHeader: () => (
  //       <InputEndAdornment
  //         adornment="%"
  //         value={data?.percentageInputs[materialIndex].material_2 || ''}
  //         onChange={(e) => {
  //           const prevData = [...data?.percentageInputs];
  //           const newData = {...prevData[materialIndex], material_2: e.target.value};
  //           const updatedData = prevData.map((item, index) =>
  //             index === materialIndex ? newData : item
  //           );
  //           setData({ step: 2, value: {...data, percentageInputs: updatedData} });
  //         }}
  //       />
  //     )
  //   },
  //   {
  //     field: 'project',
  //     headerName: 'Projeto',
  //     valueFormatter: ({ value }) => `${value}`,
  //   },
  //   {
  //     field: 'band1',
  //     headerName: '',
  //     valueFormatter: ({ value }) => `${value}`,
  //   },
  //   {
  //     field: 'band2',
  //     headerName: '',
  //     valueFormatter: ({ value }) => `${value}`,
  //   },
  // ];

  const generateMaterialColumns = (data, materialIndex) => {
    return materials.map((material, index) => {
      const fieldTotalPassant = `totalPassant_${index + 1}`;
      const fieldMaterial = `material_${index + 1}`;
      
      return [
        {
          field: fieldTotalPassant,
          headerName: 'Total passante (%)',
          width: 138,
          valueFormatter: ({ value }) => `${value}`,
        },
        {
          field: fieldMaterial,
          headerName: '',
          width: 100,
          valueFormatter: ({ value }) => `${value}`,
          renderHeader: () => (
            <InputEndAdornment
              adornment="%"
              value={data?.percentageInputs[materialIndex][fieldMaterial] || ''}
              onChange={(e) => {
                const prevData = [...data?.percentageInputs];
                const newData = { ...prevData[materialIndex], [fieldMaterial]: e.target.value };
                const updatedData = prevData.map((item, idx) => 
                  idx === materialIndex ? newData : item
                );
                setData({ step: 2, value: { ...data, percentageInputs: updatedData } });
              }}
            />
          ),
        },
      ];
    }).flat();
  };
  
  const columns = [
    {
      field: 'peneira',
      headerName: 'Peneira',
      width: 140,
      valueFormatter: ({ value }) => `${value}`,
    },
    ...generateMaterialColumns(data, materialIndex),
    {
      field: 'project',
      headerName: 'Projeto',
      valueFormatter: ({ value }) => `${value}`,
      width: 75,
    },
    {
      field: 'band1',
      headerName: '',
      valueFormatter: ({ value }) => `${value}`,
      width: 75,
    },
    {
      field: 'band2',
      headerName: '',
      valueFormatter: ({ value }) => `${value}`,
      width: 75,
    },
  ];
  

  // const rows = tableData.map((e, idx) => ({
  //   id: idx,
  //   peneira: e.peneira,
  //   totalPassant_1: e.keyTotal0,
  //   material_1: data[tableName].percentsOfMaterials !== null ? data[tableName].percentsOfMaterials[0][idx]?.toFixed(2) : '',
  //   totalPassant_2: e.keyTotal1,
  //   material_2: data[tableName].percentsOfMaterials !== null ? data[tableName].percentsOfMaterials[1][idx]?.toFixed(2) : '',
  //   project: data[tableName].sumOfPercents !== null ? data[tableName].sumOfPercents[idx] : '',
  //   band1: e.bandsCol1,
  //   band2: e.bandsCol2,
  // }));
  const generateMaterialRows = (data, tableName, idx, e) => {
    return materials.reduce((acc, material, index) => {
      const fieldTotalPassant = `totalPassant_${index + 1}`;
      const fieldMaterial = `material_${index + 1}`;
      return {
        ...acc,
        [fieldTotalPassant]: e[`keyTotal${index}`],
        [fieldMaterial]: data[tableName].percentsOfMaterials !== null 
          ? data[tableName].percentsOfMaterials[index][idx]?.toFixed(2) 
          : '',
      };
    }, {});
  };
  
  const rows = tableData.map((e, idx) => ({
    id: idx,
    peneira: e.peneira,
    ...generateMaterialRows(data, tableName, idx, e),
    project: data[tableName].sumOfPercents !== null ? data[tableName].sumOfPercents[idx]?.toFixed(2) : '',
    band1: e.bandsCol1,
    band2: e.bandsCol2,
  }));
  

  // const groupings: GridColumnGroupingModel = [
  //   {
  //     groupId: 'material_1',
  //     headerName: materials[0].name,
  //     children: [{ field: 'totalPassant_1' }, { field: 'material_1' }],
  //     headerAlign: 'center',
  //   },
  //   {
  //     groupId: 'material_2',
  //     headerName: materials[1].name,
  //     children: [{ field: 'totalPassant_2' }, { field: 'material_2' }],
  //     headerAlign: 'center',
  //   },
  //   {
  //     groupId: 'specification',
  //     headerName: 'Especificação',
  //     children: [
  //       {
  //         groupId: `Banda ${data?.bands?.letter}`,
  //         headerAlign: 'center',
  //         children: [{ field: 'band1' }, { field: 'band2' }],
  //       },
  //     ],
  //     headerAlign: 'center',
  //   },
  // ];
  const generateMaterialGroupings = (materials) => {
    return materials.map((material, index) => {
      const groupId = `material_${index + 1}`;
      const fieldTotalPassant = `totalPassant_${index + 1}`;
      const fieldMaterial = `material_${index + 1}`;
      
      return {
        groupId: groupId,
        headerName: material.name,
        children: [
          { field: fieldTotalPassant },
          { field: fieldMaterial }
        ],
        headerAlign: 'center',
      };
    });
  };
  
  const groupings = [
    ...generateMaterialGroupings(materials),
    {
      groupId: 'specification',
      headerName: 'Especificação',
      children: [
        {
          groupId: `Banda ${data?.bands?.letter}`,
          headerAlign: 'center',
          children: [{ field: 'band1' }, { field: 'band2' }],
        },
      ],
      headerAlign: 'center',
    },
  ];
  

  return table.columnsKeys.length > 0 ? (
    <DataGrid
      rows={rows}
      columns={columns}
      hideFooter
      disableColumnMenu
      disableColumnFilter
      experimentalFeatures={{ columnGrouping: true }}
      columnGroupingModel={groupings}
    />
  ) : null;
};

export default CurvesTable;
