import React, { useState, useEffect, ChangeEvent } from 'react';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { t } from 'i18next';
import { StyledDataGrid } from '@/components/molecules/tables/styledDataGrid';

interface Props {
  materials: { name: string; _id: string }[];
  dnitBandsLetter: string;
  tableInputs: Record<string, string | number>; // ⚠️ CORREÇÃO: Aceita string OU number
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

// ⚠️ CORREÇÃO: Interface para percentageInputs
interface PercentageInputs {
  [key: string]: string | number;
}

// ⚠️ VALIDAÇÃO: Funções auxiliares para validação
const validateData = {
  // Validar se materials é um array válido
  materials: (materials: any): materials is { name: string; _id: string }[] => {
    return Array.isArray(materials) && materials.length > 0 && 
           materials.every(m => m && typeof m.name === 'string' && typeof m._id === 'string');
  },

  // Validar tableData
  tableData: (tableData: any): boolean => {
    return Array.isArray(tableData) && tableData.length > 0;
  },

  // ⚠️ CORREÇÃO: Validar percentageInputs com tipagem correta
  percentageInputs: (inputs: any, materialIndex: number): inputs is PercentageInputs[] => {
    return inputs && 
           Array.isArray(inputs) && 
           inputs[materialIndex] !== undefined && 
           inputs[materialIndex] !== null &&
           typeof inputs[materialIndex] === 'object';
  },

  // ⚠️ CORREÇÃO: Validar fieldMaterial com tipagem correta
  fieldMaterial: (inputs: any, materialIndex: number, fieldMaterial: string): boolean => {
    return validateData.percentageInputs(inputs, materialIndex) && 
           fieldMaterial in inputs[materialIndex];
  }
};

const CurvesTable: React.FC<Props> = ({ 
  materials, 
  dnitBandsLetter, 
  tableName, 
  tableData,
  tableInputs,
  onChangeInputsTables 
}) => {
  const { granulometryCompositionData: data, setData } = useSuperpaveStore();

  // ⚠️ VALIDAÇÃO: Estado para controlar dados válidos
  const [isValid, setIsValid] = useState(false);

  const getMaterialIndex = (): number => {
    switch (tableName) {
      case 'lowerComposition': return 0;
      case 'averageComposition': return 1;
      case 'higherComposition': return 2;
      default: return 0; // Fallback seguro
    }
  };

  const materialIndex = getMaterialIndex();

  const [table, setTable] = useState<TableModel>({
    columnsHeaderTop: [{ header: 'Peneira', type: 'rowSpan' }],
    columnsHeader: [],
    columnsKeys: [],
  });

  // ⚠️ VALIDAÇÃO: Efeito para validar dados iniciais
  useEffect(() => {
    const hasValidData = validateData.materials(materials) && validateData.tableData(tableData);
    setIsValid(hasValidData);
    
    if (hasValidData) {
      const newTable = createObjectTableModel(materials, dnitBandsLetter);
      setTable(newTable);
    } else {
      console.warn('❌ CurvesTable: Dados inválidos', {
        materials: validateData.materials(materials),
        tableData: validateData.tableData(tableData),
        materialsCount: materials?.length,
        tableDataCount: tableData?.length
      });
    }
  }, [materials, dnitBandsLetter, tableData]);

  const createObjectTableModel = (selectedMaterials: { name: string }[], dnitBandsLetter: string): TableModel => {
    // ⚠️ VALIDAÇÃO: Garantir que selectedMaterials existe
    if (!validateData.materials(selectedMaterials)) {
      return {
        columnsHeaderTop: [{ header: 'Peneira', type: 'rowSpan' }],
        columnsHeader: ['Dados indisponíveis'],
        columnsKeys: ['peneira'],
      };
    }

    const newTable: TableModel = {
      columnsHeaderTop: [{ header: 'Peneira', type: 'rowSpan' }],
      columnsHeader: [],
      columnsKeys: ['peneira'],
    };

    selectedMaterials.forEach((item, i) => {
      // ⚠️ VALIDAÇÃO: Garantir que item existe
      if (item && item.name) {
        newTable.columnsHeaderTop.push({ header: item.name, type: 'colsSpan' });
        newTable.columnsHeader.push('Total passante (%)');
        newTable.columnsHeader.push('%');
        newTable.columnsKeys.push(`keyTotal${i}`);
        newTable.columnsKeys.push(`key%${i}`);
      }
    });

    // ⚠️ VALIDAÇÃO: Adicionar headers apenas se temos materiais
    if (selectedMaterials.length > 0) {
      newTable.columnsHeaderTop.push({ header: t('asphalt.dosages.superpave.project'), type: 'rowSpan' });
      newTable.columnsKeys.push('Projeto');
      newTable.columnsHeaderTop.push({ header: t('asphalt.dosages.superpave.specification'), type: 'colsSpan' });
      newTable.columnsHeader.push(`Faixa ${dnitBandsLetter || 'N/A'}`);
      newTable.columnsKeys.push('bandsCol1');
      newTable.columnsKeys.push('bandsCol2');
    }

    return newTable;
  };

  // ⚠️ CORREÇÃO: Função segura para obter valor do input (sempre retorna string)
  const getSafeInputValue = (fieldMaterial: string): string => {
    try {
      // Primeiro tenta usar tableInputs (mais confiável)
      if (tableInputs && typeof tableInputs === 'object' && fieldMaterial in tableInputs) {
        const value = tableInputs[fieldMaterial];
        // ⚠️ CORREÇÃO: Converte number para string
        return value !== undefined && value !== null ? String(value) : '';
      }
      
      // Fallback para data.percentageInputs (com validação)
      if (validateData.fieldMaterial(data?.percentageInputs, materialIndex, fieldMaterial)) {
        const value = data.percentageInputs[materialIndex][fieldMaterial];
        // ⚠️ CORREÇÃO: Converte number para string
        return value !== undefined && value !== null ? String(value) : '';
      }
      
      return '';
    } catch (error) {
      console.warn('❌ Erro ao obter valor do input:', error);
      return '';
    }
  };

  // ⚠️ CORREÇÃO: Função segura para atualizar dados
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldMaterial: string) => {
    try {
      const value = e.target.value;
      
      // ⚠️ CORREÇÃO: Garantir que percentageInputs existe com tipagem correta
      const currentInputs: PercentageInputs[] = Array.isArray(data?.percentageInputs) 
        ? [...data.percentageInputs] 
        : [];
      
      // ⚠️ CORREÇÃO: Garantir que temos arrays suficientes
      while (currentInputs.length <= materialIndex) {
        currentInputs.push({});
      }
      
      // ⚠️ CORREÇÃO: Atualizar o valor específico (sempre como string)
      const updatedInputs: PercentageInputs[] = [...currentInputs];
      updatedInputs[materialIndex] = {
        ...updatedInputs[materialIndex],
        [fieldMaterial]: value, // ⚠️ Já é string do event
      };

      setData({ 
        step: 4, 
        key: 'percentageInputs', 
        value: updatedInputs 
      });

      // Também chama a função do parent se existir
      if (onChangeInputsTables) {
        onChangeInputsTables(e, tableName, materialIndex);
      }

    } catch (error) {
      console.error('❌ Erro ao atualizar input:', error);
    }
  };

  const generateMaterialColumns = () => {
    // ⚠️ VALIDAÇÃO: Verificar se temos materiais válidos
    if (!validateData.materials(materials)) {
      return [];
    }

    const columns = materials.map((material, index) => {
      // ⚠️ VALIDAÇÃO: Garantir que material é válido
      if (!material || !material._id) {
        return null;
      }

      const fieldTotalPassant = `totalPassant_${material._id}_${index + 1}`;
      const fieldMaterialKey = `material_${material._id}_${index + 1}`;

      return [
        {
          field: fieldTotalPassant,
          headerName: t('asphalt.dosages.superpave.total-passant'),
          width: 125,
          valueFormatter: ({ value }: { value: any }) => value !== undefined && value !== null ? `${value}` : '---',
        },
        {
          field: fieldMaterialKey,
          headerName: '',
          width: 100,
          valueFormatter: ({ value }: { value: any }) => value !== undefined && value !== null ? `${value}` : '---',
          renderHeader: () => (
            <InputEndAdornment
              adornment="%"
              value={getSafeInputValue(fieldMaterialKey)}
              onChange={(e) => handleInputChange(e, fieldMaterialKey)}
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
    }).filter(Boolean).flat(); // ⚠️ Remove entradas null

    return Array.isArray(columns) ? columns : [];
  };

  const columns = [
    {
      field: 'peneira',
      headerName: t('asphalt.dosages.superpave.sieve'),
      width: 140,
      valueFormatter: ({ value }: { value: any }) => value !== undefined && value !== null ? `${value}` : '---',
    },
    ...generateMaterialColumns(),
    {
      field: 'project',
      headerName: t('asphalt.dosages.superpave.project'),
      valueFormatter: ({ value }: { value: any }) => {
        if (value === undefined || value === null || value === '') return '---';
        return typeof value === 'number' ? value.toFixed(2) : `${value}`;
      },
      width: 70,
    },
    {
      field: 'band1',
      headerName: '',
      valueFormatter: ({ value }: { value: any }) => value !== undefined && value !== null ? `${value}` : '---',
      width: 70,
    },
    {
      field: 'band2',
      headerName: '',
      valueFormatter: ({ value }: { value: any }) => value !== undefined && value !== null ? `${value}` : '---',
      width: 70,
    },
  ].filter(column => column !== null); // ⚠️ Remove colunas null

  // ⚠️ VALIDAÇÃO: Função segura para gerar linhas
  const generateMaterialRows = (idx: number, row: any) => {
    if (!validateData.materials(materials)) {
      return {};
    }

    const rowsData = materials.reduce((acc, material, index) => {
      // ⚠️ VALIDAÇÃO: Pular materiais inválidos
      if (!material || !material._id) return acc;

      const fieldTotalPassant = `totalPassant_${material._id}_${index + 1}`;
      const fieldMaterial = `material_${material._id}_${index + 1}`;

      // ⚠️ VALIDAÇÃO: Obter valores com fallbacks
      const totalPassantValue = row[`keyTotal${index}`] !== undefined ? row[`keyTotal${index}`] : '---';
      
      let materialValue = '---';
      if (data && data[tableName] && Array.isArray(data[tableName]?.percentsOfMaterials)) {
        const materialArray = data[tableName].percentsOfMaterials[index];
        if (Array.isArray(materialArray) && materialArray[idx] !== undefined) {
          materialValue = typeof materialArray[idx] === 'number' ? materialArray[idx].toFixed(2) : '---';
        }
      }

      return {
        ...acc,
        [fieldTotalPassant]: totalPassantValue,
        [fieldMaterial]: materialValue,
      };
    }, {});

    return rowsData;
  };

  const rows = validateData.tableData(tableData) 
    ? tableData.map((row, idx) => {
        const rowsData = generateMaterialRows(idx, row);
        
        // ⚠️ VALIDAÇÃO: Obter projeto com fallback
        let projectValue = '---';
        if (data && data[tableName] && Array.isArray(data[tableName]?.sumOfPercents)) {
          projectValue = data[tableName].sumOfPercents[idx] !== undefined 
            ? (typeof data[tableName].sumOfPercents[idx] === 'number' 
                ? data[tableName].sumOfPercents[idx].toFixed(2) 
                : '---')
            : '---';
        }

        return {
          id: idx,
          peneira: row.peneira !== undefined ? row.peneira : '---',
          ...rowsData,
          project: projectValue,
          band1: row.bandsCol1 !== undefined ? row.bandsCol1 : '---',
          band2: row.bandsCol2 !== undefined ? row.bandsCol2 : '---',
        };
      })
    : []; // ⚠️ Retorna array vazio se tableData for inválido

  const createMaterialGroupings = () => {
    if (!validateData.materials(materials)) {
      return [];
    }

    const materialGroupings = materials
      .filter(material => material && material._id) // ⚠️ Filtra materiais válidos
      .map((material, index) => ({
        groupId: `material_${material._id}_${index + 1}`,
        headerName: material.name || 'Material',
        children: [
          { field: `totalPassant_${material._id}_${index + 1}` },
          { field: `material_${material._id}_${index + 1}` },
        ],
        headerAlign: 'center' as const,
      }));

    return materialGroupings;
  };

  const groupings = [
    ...createMaterialGroupings(),
    {
      groupId: 'specification',
      headerName: 'Especificação',
      children: [
        {
          groupId: `Banda ${data?.bands?.letter || dnitBandsLetter || 'N/A'}`,
          headerAlign: 'center' as const,
          children: [{ field: 'band1' }, { field: 'band2' }],
        },
      ],
      headerAlign: 'center' as const,
    },
  ].filter(group => group !== null); // ⚠️ Remove groupings null

  // ⚠️ VALIDAÇÃO: Renderização condicional robusta
  if (!isValid) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        border: '1px solid #ff6b6b',
        borderRadius: '4px',
        backgroundColor: '#fff5f5'
      }}>
        <p style={{ color: '#ff6b6b', margin: 0 }}>
          ⚠️ Dados insuficientes para exibir a tabela
        </p>
        <p style={{ fontSize: '0.8rem', color: '#666', margin: '5px 0 0 0' }}>
          Verifique se os materiais e dados granulométricos estão carregados
        </p>
      </div>
    );
  }

  return table.columnsKeys.length > 0 && rows.length > 0 ? (
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
          fontSize: '0.800rem',
        },
        '& .MuiDataGrid-cell': {
          fontSize: '0.75rem',
        },
        '& .MuiDataGrid-cell[data-field*="material_"]': {
          backgroundColor: '#f8f9fa', // Destaque visual para inputs
        },
      }}
    />
  ) : (
    <div style={{ 
      padding: '15px', 
      textAlign: 'center',
      border: '1px solid #ddd',
      borderRadius: '4px'
    }}>
      <p style={{ margin: 0, color: '#666' }}>Carregando tabela...</p>
    </div>
  );
};

export default CurvesTable;