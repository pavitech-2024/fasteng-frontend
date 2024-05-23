import React, { useState, useEffect, ChangeEvent } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

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
  materials: { name: string }[];
  dnitBandsLetter: string;
  tableInputs: Record<string, string>;
  tableName: string;
  tableData: any[];
  onChangeInputsTables: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, tableName: string, index: number) => void;
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

  const [table, setTable] = useState<TableModel>({
    columnsHeaderTop: [{ header: 'Peneira', type: 'rowSpan' }],
    columnsHeader: [],
    columnsKeys: [],
  });

  console.log("🚀 ~ table:", table)

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

  const getColumn = (header: string, type: string) => {
    return (
      <TableCell key={header} sx={styleColumn} colSpan={type === 'colsSpan' ? 2 : 1}>
        {header}
      </TableCell>
    );
  };

  const columnsValues = (columnsKeys: string[]) => {
    return (
      <TableRow>
        {columnsKeys.map(col => (
          <TableCell key={col} sx={styleColumn}>
            {col}
          </TableCell>
        ))}
      </TableRow>
    );
  };

  const headerGroup = ({ columnsHeaderTop, columnsHeader }: TableModel) => {
    return (
      <TableHead>
        <TableRow>
          {columnsHeaderTop.map((item, i) => getColumn(item.header, item.type))}
        </TableRow>
        <TableRow>
          {columnsHeader.map((col, i) => {
            if (col === '%') {
              return (
                <TableCell key={col} sx={styleColumn}>
                  <TableInputContainer>
                    <TextField
                      variant="standard"
                      inputProps={{
                        style: {
                          width: '100%',
                          padding: '1px',
                          textAlign: 'center',
                        },
                      }}
                      value={tableInputs['input' + i]}
                      onChange={(e) => onChangeInputsTables(e, tableName, i)}
                    />
                    <label>%</label>
                  </TableInputContainer>
                </TableCell>
              );
            } else if (col === 'Faixa A' || col === 'Faixa B' || col === 'Faixa C') {
              return (
                <TableCell key={col} sx={styleColumn} colSpan={2}>
                  {col}
                </TableCell>
              );
            } else {
              return (
                <TableCell key={col} sx={styleColumn}>
                  {col}
                </TableCell>
              );
            }
          })}
        </TableRow>
      </TableHead>
    );
  };

  const renderRows = (tableData: any[], columnsKeys: string[]) => {
    return tableData.map((row, rowIndex) => (
      <TableRow key={rowIndex}>
        {columnsKeys.map((key) => (
          <TableCell key={key} sx={styleColumn}>
            {row[key]}
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return table.columnsKeys.length > 0 ? (
    <TableContainer>
      <Table>
        {headerGroup(table)}
        <TableBody>{renderRows(tableData, table.columnsKeys)}</TableBody>
      </Table>
    </TableContainer>
  ) : null;
};

export default CurvesTable;
