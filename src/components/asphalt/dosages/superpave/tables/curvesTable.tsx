import React, { useState, useEffect, ChangeEvent } from 'react';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { t } from 'i18next';
import { StyledDataGrid } from '@/components/molecules/tables/styledDataGrid';

interface Props {
  materials: { name: string; _id: string }[];
  dnitBandsLetter: string;
  tableInputs: Record<string, string | number>;
  tableName: string;
  tableData: any[];
  onChangeInputsTables: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    tableName: string,
    index: number
  ) => void;
}

const CurvesTable: React.FC<Props> = ({ 
  materials, 
  dnitBandsLetter, 
  tableName, 
  tableData,
  tableInputs,
  onChangeInputsTables 
}) => {
  const { granulometryCompositionData: data } = useSuperpaveStore();
  const [isValid, setIsValid] = useState(false);

  const getMaterialIndex = (): number => {
    switch (tableName) {
      case 'lowerComposition': return 0;
      case 'averageComposition': return 1;
      case 'higherComposition': return 2;
      default: return 0;
    }
  };

  const materialIndex = getMaterialIndex();

  const createInputHandler = (fieldMaterialKey: string) => {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      const inputElement = e.target as HTMLInputElement;
      inputElement.dataset.fieldMaterial = fieldMaterialKey;
      
      if (onChangeInputsTables) {
        onChangeInputsTables(e, tableName, materialIndex);
      }
    };
  };

  // ✅ GET VALUE SIMPLES
  const getSafeInputValue = (fieldMaterial: string): string => {
    if (tableInputs && fieldMaterial in tableInputs) {
      return String(tableInputs[fieldMaterial]);
    }
    return '';
  };

  const generateMaterialColumns = () => {
    if (!Array.isArray(materials) || materials.length === 0) return [];

    return materials.map((material, index) => {
      const fieldTotalPassant = `totalPassant_${material._id}_${index + 1}`;
      const fieldMaterialKey = `material_${material._id}_${index + 1}`;

      return [
        {
          field: fieldTotalPassant,
          headerName: t('asphalt.dosages.superpave.total-passant'),
          width: 125,
          valueFormatter: ({ value }: { value: any }) => value !== undefined && value !== null && value !== '' ? String(value) : '---',
        },
        {
          field: fieldMaterialKey,
          headerName: '',
          width: 100,
          valueFormatter: ({ value }: { value: any }) => value !== undefined && value !== null && value !== '' ? String(value) : '---',
          renderHeader: () => (
            <InputEndAdornment
              adornment="%"
              value={getSafeInputValue(fieldMaterialKey)}
              onChange={createInputHandler(fieldMaterialKey)}
              sx={{ 
                minWidth: '80px',
                '& input': { 
                  textAlign: 'center',
                  fontSize: '0.75rem'
                }
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
      headerName: t('asphalt.dosages.superpave.sieve'),
      width: 140,
      valueFormatter: ({ value }: { value: any }) => value !== undefined && value !== null && value !== '' ? String(value) : '---',
    },
    ...generateMaterialColumns(),
    {
      field: 'project',
      headerName: t('asphalt.dosages.superpave.project'),
      valueFormatter: ({ value }: { value: any }) => value !== undefined && value !== null && value !== '' ? String(value) : '---',
      width: 70,
    },
    {
      field: 'band1',
      headerName: '',
      valueFormatter: ({ value }: { value: any }) => value !== undefined && value !== null && value !== '' ? String(value) : '---',
      width: 70,
    },
    {
      field: 'band2',
      headerName: '',
      valueFormatter: ({ value }: { value: any }) => value !== undefined && value !== null && value !== '' ? String(value) : '---',
      width: 70,
    },
  ];

  // ✅ GERAR ROWS COM "---" PARA VALORES VAZIOS
  const generateMaterialRows = (idx: number, row: any) => {
    if (!Array.isArray(materials)) return {};

    return materials.reduce((acc, material, index) => {
      const fieldTotalPassant = `totalPassant_${material._id}_${index + 1}`;
      const fieldMaterial = `material_${material._id}_${index + 1}`;

      // ✅ VALORES COM "---" PARA VAZIOS
      const totalPassantValue = row[`keyTotal${index}`] !== undefined && row[`keyTotal${index}`] !== null && row[`keyTotal${index}`] !== '' 
        ? String(row[`keyTotal${index}`]) 
        : '---';
      
      // ✅ Dados de composição
      let materialValue = '---';
      if (data && data[tableName] && data[tableName].percentsOfMaterials) {
        const materialData = data[tableName].percentsOfMaterials[index];
        if (Array.isArray(materialData) && materialData[idx] !== undefined && materialData[idx] !== null && materialData[idx] !== '') {
          materialValue = String(materialData[idx]);
        }
      }

      return {
        ...acc,
        [fieldTotalPassant]: totalPassantValue,
        [fieldMaterial]: materialValue,
      };
    }, {});
  };

  // ✅ ROWS COM "---"
  const rows = Array.isArray(tableData) ? tableData.map((row, idx) => {
    // ✅ Projeto
    let projectValue = '---';
    if (data && data[tableName] && data[tableName].sumOfPercents) {
      if (data[tableName].sumOfPercents[idx] !== undefined && data[tableName].sumOfPercents[idx] !== null && data[tableName].sumOfPercents[idx] !== '') {
        projectValue = String(data[tableName].sumOfPercents[idx]);
      }
    }

    return {
      id: idx,
      peneira: row.peneira !== undefined && row.peneira !== null && row.peneira !== '' ? String(row.peneira) : '---',
      ...generateMaterialRows(idx, row),
      project: projectValue,
      band1: row.bandsCol1 !== undefined && row.bandsCol1 !== null && row.bandsCol1 !== '' ? String(row.bandsCol1) : '---',
      band2: row.bandsCol2 !== undefined && row.bandsCol2 !== null && row.bandsCol2 !== '' ? String(row.bandsCol2) : '---',
    };
  }) : [];

  const createMaterialGroupings = () => {
    if (!Array.isArray(materials)) return [];

    return materials.map((material, index) => ({
      groupId: `material_${material._id}_${index + 1}`,
      headerName: material.name,
      children: [
        { field: `totalPassant_${material._id}_${index + 1}` },
        { field: `material_${material._id}_${index + 1}` },
      ],
      headerAlign: 'center' as const,
    }));
  };

  const groupings = [
    ...createMaterialGroupings(),
    {
      groupId: 'specification',
      headerName: 'Especificação',
      children: [
        {
          groupId: `Banda ${dnitBandsLetter}`,
          headerAlign: 'center' as const,
          children: [{ field: 'band1' }, { field: 'band2' }],
        },
      ],
      headerAlign: 'center' as const,
    },
  ];

  // ✅ VALIDAÇÃO SIMPLES
  useEffect(() => {
    const hasValidData = Array.isArray(materials) && materials.length > 0 && 
                         Array.isArray(tableData) && tableData.length > 0;
    setIsValid(hasValidData);
  }, [materials, tableData]);

  if (!isValid) {
    return <div>Dados insuficientes</div>;
  }

  return (
    <StyledDataGrid
      rows={rows}
      columns={columns}
      hideFooter
      disableColumnMenu
      disableColumnFilter
      experimentalFeatures={{ columnGrouping: true }}
      columnGroupingModel={groupings}
      sx={{
        '& .MuiDataGrid-columnHeaders': { fontSize: '0.800rem' },
        '& .MuiDataGrid-cell': { fontSize: '0.75rem' },
        '& .MuiDataGrid-cell[data-field*="material_"]': { backgroundColor: '#f8f9fa' },
      }}
    />
  );
};

export default CurvesTable;