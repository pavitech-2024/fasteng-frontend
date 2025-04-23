import React, { useState, useEffect, ChangeEvent } from 'react';
import { DataGrid, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import useSuperpaveStore, { SuperpaveData } from '@/stores/asphalt/superpave/superpave.store';
import useMarshallStore from '@/stores/asphalt/marshall/marshall.store';
import { t } from 'i18next';
import { styled } from '@mui/material/styles';
import { StyledDataGrid } from '@/components/molecules/tables/styledDataGrid';

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

const CurvesTable: React.FC<Props> = ({ materials, dnitBandsLetter, tableName, tableData }) => {
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
    const newTable: TableModel = {
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

    newTable.columnsHeaderTop.push({ header: t('asphalt.dosages.superpave.project'), type: 'rowSpan' });
    newTable.columnsKeys.push('Projeto');
    newTable.columnsHeaderTop.push({ header: t('asphalt.dosages.superpave.specification'), type: 'colsSpan' });
    newTable.columnsHeader.push(`Faixa ${dnitBandsLetter}`);
    newTable.columnsKeys.push('bandsCol1');
    newTable.columnsKeys.push('bandsCol2');

    return newTable;
  };

  const generateMaterialColumns = (data, materialIndex) => {
    return materials
      .map((material, index) => {
        const fieldTotalPassant = `totalPassant_${index + 1}`;
        const fieldMaterial = `material_${index + 1}`;

        return [
          {
            field: fieldTotalPassant,
            headerName: t('asphalt.dosages.superpave.total-passant'),
            width: 125,
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
                  const updatedData = prevData.map((item, idx) => (idx === materialIndex ? newData : item));
                  setData({ step: 2, value: { ...data, percentageInputs: updatedData } });
                }}
              />
            ),
          },
        ];
      })
      .flat();
  };

  const columns = [
    {
      field: 'peneira',
      headerName: t('asphalt.dosages.superpave.sieve'),
      width: 140,
      valueFormatter: ({ value }) => `${value}`,
    },
    ...generateMaterialColumns(data, materialIndex),
    {
      field: 'project',
      headerName: t('asphalt.dosages.superpave.project'),
      valueFormatter: ({ value }) => `${value}`,
      width: 70,
    },
    {
      field: 'band1',
      headerName: '',
      valueFormatter: ({ value }) => `${value}`,
      width: 70,
    },
    {
      field: 'band2',
      headerName: '',
      valueFormatter: ({ value }) => `${value}`,
      width: 70,
    },
  ];

  /**
   * Generates material row data for a given index and table name.
   *
   * @param data - The data containing material percentage information.
   * @param tableName - The name of the table being processed.
   * @param idx - The index of the current row.
   * @param row - The row data containing key values.
   * @returns An object with formatted field values for each material.
   */
  const generateMaterialRows = (data, tableName, idx, row) => {
    const rowsData = materials.reduce((acc, material, index) => {
      const fieldTotalPassant = `totalPassant_${index + 1}`;
      const fieldMaterial = `material_${index + 1}`;
      return {
        ...acc,
        [fieldTotalPassant]: row[`keyTotal${index}`],
        [fieldMaterial]:
          data[tableName].percentsOfMaterials !== null
            ? data[tableName].percentsOfMaterials[index][idx]?.toFixed(2) ?? '---'
            : '',
      };
    }, {});

    Object.entries(rowsData).forEach(([key, value], idx) => {
      if (value === undefined) {
        rowsData[key] = '---';
      }
    });

    return rowsData;
  };

  const rows = tableData.map((e, idx) => {
    const rowsData = generateMaterialRows(data, tableName, idx, e);
    return {
      id: idx,
      peneira: e.peneira,
      ...rowsData,
      project: data[tableName].sumOfPercents !== null ? data[tableName].sumOfPercents[idx]?.toFixed(2) : '',
      band1: e.bandsCol1,
      band2: e.bandsCol2,
    };
  });
  const generateMaterialGroupings = (materials) => {
    return materials.map((material, index) => {
      const materialId = `material_${index + 1}`;
      const totalPassantField = `totalPassant_${index + 1}`;
      const materialField = `material_${index + 1}`;

      return {
        groupId: materialId,
        headerName: material.name,
        children: [{ field: totalPassantField }, { field: materialField }],
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
    <StyledDataGrid
      rows={rows}
      columns={columns}
      hideFooter
      disableColumnMenu
      disableColumnFilter
      experimentalFeatures={{ columnGrouping: true }}
      columnGroupingModel={groupings}
      sx={{
        '& .MuiDataGrid-columnHeaders': {
          fontSize: '0.800rem', // Tamanho da fonte dos cabeçalhos
        },
        '& .MuiDataGrid-cell': {
          fontSize: '0.75rem', // Tamanho da fonte das células
        },
      }}
    />
  ) : null;
};

export default CurvesTable;
