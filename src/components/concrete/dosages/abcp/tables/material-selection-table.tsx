import DropDown from '@/components/atoms/inputs/dropDown';
import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';

interface MaterialSelectionProps {
  header?: string;
  rows: { name?: string; type?: string; resistance?: number }[];
  columns: GridColDef[];
}

const MaterialSelectionTable = ({ rows, columns, header }: MaterialSelectionProps) => {
  const [searchBy, setSearchBy] = useState<string>('name');
  const [searchValue, setSearchValue] = useState<string>('');

  useEffect(() => {
    setSearchValue('');
  }, [searchBy]);

  const filteredData = rows
    ? rows
        .map(({ name, type }) => ({
          name,
          type,
        }))
        .filter((material) => {
          return searchValue.length > 0
            ? searchBy === 'name'
              ? material[searchBy].toLowerCase().includes(searchValue.toLowerCase())
              : material[searchBy] === searchValue
            : true;
        })
    : null;

  return (
    <Box
      sx={{
        p: '1rem',
        textAlign: 'center',
        border: '1px solid lightgray',
        borderRadius: '10px',
      }}
    >
      <h3>{header}</h3>
      <Box
        sx={{
          display: 'flex',
          msFlex: 'none',
          gap: '1rem',
          m: 'auto',
        }}
      >
        <DropDown
          label={t('materials.template.searchBy')}
          options={[
            { label: t('materials.template.name'), value: 'name' },
            { label: t('materials.template.type'), value: 'type' },
          ]}
          callback={setSearchBy}
          size="small"
          sx={{ width: { mobile: '50%', notebook: '35%' }, minWidth: '120px', maxWidth: '150px', bgcolor: 'white' }}
          defaultValue={{ label: t('materials.template.name'), value: 'name' }}
        />
        {/* <Search
                    sx={{
                        width: '100%',
                        height: '39px',
                    }}
                    value={searchValue}
                    setValue={setSearchValue}
                /> */}
      </Box>
      <Box
        sx={{
          mt: '1rem',
        }}
      >
        <DataGrid
          sx={{
            borderRadius: '10px',
          }}
          checkboxSelection
          disableRowSelectionOnClick
          disableColumnSelector
          columns={columns.map((column) => ({
            ...column,
            disableColumnMenu: true,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
            minWidth: 100,
            maxWidth: 250,
            flex: 1,
          }))}
          rows={
            filteredData !== null
              ? filteredData.map((row, index) => ({ ...row, id: index }))
              : [{ name: 'teste', type: 'teste' }]
          }
        />
      </Box>
    </Box>
  );
};

export default MaterialSelectionTable;
