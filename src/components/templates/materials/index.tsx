import { useRouter } from 'next/router';
import { Sample } from '@/interfaces/soils';
import Header from '@/components/organisms/header';
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import DropDown, { DropDownOption } from '@/components/atoms/inputs/dropDown';
import Search from '@/components/atoms/inputs/search';
import { AddIcon, DeleteIcon } from '@/assets';
import { formatDate } from '@/utils/format';

interface MaterialsTemplateProps {
  materials: Sample[];
  types: DropDownOption[];
}

interface MaterialsColumn {
  id: 'name' | 'type' | 'registrationDate' | 'actions';
  label: string;
  width: string;
}

const MaterialsTemplate = ({ materials, types }: MaterialsTemplateProps) => {
  const app = useRouter().pathname.split('/')[1];

  const [page, setPage] = useState<number>(0);
  const rowsPerPage = 10;

  const [searchBy, setSearchBy] = useState<string>('name');
  const [searchValue, setSearchValue] = useState<string>('');

  const columns: MaterialsColumn[] = [
    { id: 'name', label: 'Nome', width: '25%' },
    { id: 'type', label: 'Tipo', width: '25%' },
    { id: 'registrationDate', label: 'Data de cadastro', width: '25%' },
    { id: 'actions', label: 'Ações', width: '25%' },
  ];

  const translateType = (type: string) => {
    switch (type) {
      case 'inorganicSoil':
        return 'Solo Inorgânico';
      case 'organicSoil':
        return 'Solo Orgânico';
      case 'pavementLayer':
        return 'Camada de Pavimento';
    }
  };

  useEffect(() => {
    setSearchValue('');
  }, [searchBy]);

  const filteredData =
    searchValue.length > 0
      ? materials.filter((material) => {
          return searchBy === 'name'
            ? material[searchBy].toLowerCase().includes(searchValue.toLowerCase())
            : material[searchBy] === searchValue;
        })
      : materials;

  return (
    <>
      <Header title="Amostras Cadastradas" />
      <Box sx={{ padding: { mobile: '0 .5rem', notebook: '0 2rem' } }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: { mobile: 'end', notebook: 'space-between' },
            width: '100%',
            gap: '10px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: '10px',
              flexDirection: { mobile: 'column', notebook: 'row' },
              width: '60%',
            }}
          >
            <DropDown
              label="Pesquisar por:"
              options={[
                { label: 'Nome', value: 'name' },
                { label: 'Tipo', value: 'type' },
              ]}
              callback={setSearchBy}
              size="small"
              sx={{ width: { mobile: '50%', notebook: '35%' }, minWidth: '120px', maxWidth: '150px', bgcolor: 'white' }}
              defaultValue={{ label: 'Nome', value: 'name' }}
            />
            {searchBy === 'name' && (
              <Search
                sx={{
                  width: { mobile: '100%', notebook: '75%' },
                  maxWidth: '450px',
                  height: '39px',
                }}
                value={searchValue}
                setValue={setSearchValue}
              />
            )}
            {searchBy === 'type' && (
              <DropDown
                sx={{ width: '50%', maxWidth: '350px', minWidth: '120px', bgcolor: 'white' }}
                label={`Tipo de ${app === 'soils' ? 'amostra' : 'material'}`}
                size="small"
                callback={setSearchValue}
                options={types}
              />
            )}
          </Box>
          <Button
            variant="contained"
            color="primary"
            sx={{
              height: '40px',
              width: { mobile: '50%', notebook: '25%' },
              maxWidth: '220px',
              gap: '5px',
            }}
          >
            <AddIcon sx={{ color: '#fff', fontSize: '1.2rem' }} />
            <Typography sx={{ fontSize: '.8rem', fontWeight: '700' }} color="white">
              {`${app === 'soils' ? ' Nova amostra' : ' Novo material'}`}
            </Typography>
          </Button>
        </Box>
        <Paper
          sx={{
            width: '100%',
            borderRadius: '12px',
            border: '1px solid rgba(0,0,0,0.17)',
            marginTop: '1rem',
            background: 'white',
          }}
        >
          <TableContainer sx={{ borderRadius: '12px' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.id} align="center" style={{ width: column.width, fontWeight: '700' }}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                    {columns.map((column) => (
                      <TableCell key={column.id} align="center">
                        {column.id === 'name' && row.name}
                        {column.id === 'type' && translateType(row.type)}
                        {column.id === 'registrationDate' && formatDate(row.registrationDate)}
                        {column.id === 'actions' && (
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Button variant="contained" color="info">
                              <Typography variant="body2" color="white" sx={{ fontSize: '12px' }}>
                                Visualizar
                              </Typography>
                            </Button>
                            <Button variant="text" color="warning">
                              <DeleteIcon color="error" sx={{ fontSize: '1.2rem' }} />
                            </Button>
                          </Box>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50px' }}>
            <Pagination
              count={Math.ceil(filteredData.length / rowsPerPage)}
              size="small"
              disabled={filteredData.length < rowsPerPage}
              onChange={(event, value) => setPage(value - 1)}
            />
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default MaterialsTemplate;
