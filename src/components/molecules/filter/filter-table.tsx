import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Tooltip,
  InputBase,
} from '@mui/material';
import { AddIcon, CloseIcon, DeleteIcon, NextIcon, SearchIcon } from '@/assets';
import { toast } from 'react-toastify';
import { t } from 'i18next';
import { PromedinaDataFilter } from '@/interfaces/promedina';
import DropDown from '@/components/atoms/inputs/dropDown';
import StepDescription from '@/components/atoms/titles/step-description';
import Link from 'next/link';

interface PromedinaMaterialsTemplateProps {
  materials: PromedinaDataFilter[];
  handleDeleteMaterial: (id: string) => void;
  area: string;
}

interface MaterialsColumn {
  id: 'name' | 'layer' | 'cityState' | 'zone' | 'actions';
  label: string;
  width: string;
}

interface DataToFilter {
  _id: string;
  name: string;
  layer: string;
  zone: string;
  cityState: string;
}

const PromedinaMaterialsTemplate = ({ materials, handleDeleteMaterial, area }: PromedinaMaterialsTemplateProps) => {
  const [nameFilter, setNameFilter] = useState('');
  const [layerFilter, setLayerFilter] = useState('');
  const [cityStateFilter, setCityStateFilter] = useState('');
  const [zoneFilter, setZoneFilter] = useState('');

  const [page, setPage] = useState<number>(0);
  const rowsPerPage = 10;

  const [searchBy, setSearchBy] = useState<string>('name');
  const [searchValue, setSearchValue] = useState<string>('');

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [RowToDelete, setRowToDelete] = useState<DataToFilter>();

  const columns: MaterialsColumn[] = [
    { id: 'name', label: t('materials.template.name'), width: '25%' },
    { id: 'cityState', label: t('materials.template.cityState'), width: '25%' },
    { id: 'layer', label: t('materials.template.layer'), width: '25%' },
    { id: 'zone', label: t('materials.template.zone'), width: '25%' },
    { id: 'actions', label: t('materials.template.actions'), width: '25%' },
  ];

  useEffect(() => {
    setSearchValue('');
  }, [searchBy]);

  // const filteredData = materials
  //   .map(({ _id, name, cityState, layer, zone }) => ({
  //     _id,
  //     name,
  //     cityState,
  //     zone,
  //     layer,
  //   }))
  //   .filter((material) => {
  //     return searchValue.length > 0
  //       ? searchBy === 'name'
  //         ? material[searchBy].toLowerCase().includes(searchValue.toLowerCase())
  //         : material[searchBy] === searchValue
  //       : true;
  //   });

  const filteredData = materials
    .map(({ _id, generalData }) => {
      const { name, cityState, zone, layer } = generalData;
      return {
        _id,
        name,
        cityState,
        zone,
        layer,
      };
    })
    .filter((material) => {
      return searchValue.length > 0
        ? searchBy === 'name'
          ? material[searchBy].toLowerCase().includes(searchValue.toLowerCase())
          : material[searchBy] === searchValue
        : true;
    });
  
  useEffect(() => {
    console.log("🚀 ~ file: filter-table.tsx:83 ~ PromedinaMaterialsTemplate ~ filteredData:", filteredData)
  }, [filteredData])

  const getFilter = async (e: string) => {
    const filter = [];

    if (e == nameFilter) {
      filter.push({ name: nameFilter });
    }
    if (e == layerFilter) {
      filter.push({ layer: layerFilter });
    }
    if (e == cityStateFilter) {
      filter.push({ cityState: cityStateFilter });
    }
    if (e == zoneFilter) {
      filter.push({ zone: zoneFilter });
    }

    const encodedFilter = decodeURIComponent(JSON.stringify(filter));
    const filteredSpecificData = await fetch(
      `promedina/samples/filter/?page=${page}&limit=${rowsPerPage}&filter=${encodedFilter}`
    )
      .then((res) => res.json())
      .catch(() => ({}));

    return {
      filteredSpecificData,
    };
  };

  return (
    <>
      {/*Delete Modal */}
      <Dialog open={openDeleteModal}>
        <DialogTitle sx={{ fontSize: '1rem', textTransform: 'uppercase', fontWeight: 700 }} color="secondary">
          {t('materials.template.deleteTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textTransform: 'uppercase', fontSize: '14px' }}>
            {t('materials.template.deleteText')} <span style={{ fontWeight: 700 }}>{RowToDelete?.name}</span>?
          </DialogContentText>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: '1.3rem' }}>
            <Button
              variant="contained"
              color="secondary"
              sx={{
                fontWeight: 700,
                fontSize: { mobile: '11px', notebook: '13px' },
                width: '40%',
              }}
              onClick={() => setOpenDeleteModal(false)}
            >
              {t('materials.template.cancel')}
            </Button>
            <Button
              variant="contained"
              sx={{
                fontWeight: 700,
                fontSize: { mobile: '11px', notebook: '13px' },
                color: 'primaryTons.white',
                width: '40%',
              }}
              onClick={() => {
                try {
                  toast.promise(async () => await handleDeleteMaterial(RowToDelete?._id), {
                    pending: t('materials.template.toast.delete.pending') + RowToDelete?.name + '...',
                    success: RowToDelete?.name + t('materials.template.toast.delete.sucess'),
                    error: t('materials.template.toast.delete.error') + RowToDelete?.name + '.',
                  });
                  setOpenDeleteModal(false);
                } catch (error) {
                  throw error;
                }
              }}
            >
              {t('materials.template.delete')}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/*Page */}
      <StepDescription
        text={'Após selecionar os filtros, clique no botão com a lupa para atualizar a tabela com os dados filtrados.'}
      />
      <Box sx={{ p: { mobile: '0 4vw', notebook: '0 2vw' }, mb: '4vw', width: '100%', maxWidth: '1800px' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: { mobile: 'end', notebook: 'space-between' },
              width: '100%',
              gap: '8px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: '10px',
                flexDirection: { mobile: 'column', notebook: 'row' },
                width: '55%',
              }}
            >
              <DropDown
                label={t('materials.template.searchBy')}
                options={[
                  { label: t('materials.template.name'), value: 'name' },
                  { label: t('materials.template.cityState'), value: 'cityState' },
                  { label: t('materials.template.layer'), value: 'layer' },
                  { label: t('materials.template.zone'), value: 'zone' },
                ]}
                callback={setSearchBy}
                size="small"
                sx={{
                  width: { mobile: '50%', notebook: '35%' },
                  minWidth: '120px',
                  maxWidth: '150px',
                  bgcolor: 'white',
                }}
                defaultValue={{ label: t('materials.template.name'), value: 'name' }}
              />
              {searchBy === 'name' && (
                <Paper
                  component="div"
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: 'none',
                    border: '1px solid rgba(0, 0, 0, 0.28)',
                  }}
                  color="primary"
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder={'Pesquisar por nome'}
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                  />
                  <Box
                    sx={{
                      backgroundColor: 'secondaryTons.blue',
                      borderColor: 'secondaryTons.blue',
                      borderTopRightRadius: '3px',
                      borderBottomRightRadius: '3px',
                      paddingTop: '0.2rem',
                      paddingBottom: '0.1rem',
                      paddingLeft: '0.5rem',
                      alignItems: 'center',
                    }}
                  >
                    <SearchIcon
                      sx={{ marginRight: '0.2rem', cursor: 'pointer', marginTop: '0.1rem', color: '#FFFFFF' }}
                      onClick={() => getFilter(nameFilter)}
                    />
                  </Box>
                </Paper>
              )}

              {searchBy === 'layer' && (
                <Paper
                  component="div"
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: 'none',
                    border: '1px solid rgba(0, 0, 0, 0.28)',
                  }}
                  color="primary"
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder={'Ex. Base'}
                    value={layerFilter}
                    onChange={(e) => setLayerFilter(e.target.value)}
                  />
                  <Box
                    sx={{
                      backgroundColor: 'secondaryTons.blue',
                      borderColor: 'secondaryTons.blue',
                      borderTopRightRadius: '3px',
                      borderBottomRightRadius: '3px',
                      paddingTop: '0.2rem',
                      paddingBottom: '0.2rem',
                      paddingLeft: '0.5rem',
                      alignItems: 'center',
                    }}
                  >
                    <SearchIcon
                      sx={{ marginRight: '0.3rem', cursor: 'pointer', color: '#FFFFFF' }}
                      onClick={() => getFilter(layerFilter)}
                    />
                  </Box>
                </Paper>
              )}
              {searchBy === 'cityState' && (
                <Paper
                  component="div"
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: 'none',
                    border: '1px solid rgba(0, 0, 0, 0.28)',
                  }}
                  color="primary"
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1, minWidth: 'fit-content' }}
                    placeholder={'Ex. Campina Grande/PB'}
                    value={cityStateFilter}
                    onChange={(e) => setCityStateFilter(e.target.value)}
                    fullWidth
                  />
                  <Box
                    sx={{
                      backgroundColor: 'secondaryTons.blue',
                      borderColor: 'secondaryTons.blue',
                      borderTopRightRadius: '3px',
                      borderBottomRightRadius: '3px',
                      paddingTop: '0.2rem',
                      paddingBottom: '0.2rem',
                      paddingLeft: '0.5rem',
                      alignItems: 'center',
                    }}
                  >
                    <SearchIcon
                      sx={{ marginRight: '0.3rem', cursor: 'pointer', color: '#FFFFFF' }}
                      onClick={() => getFilter(cityStateFilter)}
                    />
                  </Box>
                </Paper>
              )}
              {searchBy === 'zone' && (
                <Paper
                  component="div"
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: 'none',
                    border: '1px solid rgba(0, 0, 0, 0.28)',
                  }}
                  color="primary"
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder={'Ex. BR-230'}
                    value={zoneFilter}
                    onChange={(e) => setZoneFilter(e.target.value)}
                  />
                  <Box
                    sx={{
                      backgroundColor: 'secondaryTons.blue',
                      borderColor: 'secondaryTons.blue',
                      borderTopRightRadius: '3px',
                      borderBottomRightRadius: '3px',
                      paddingTop: '0.2rem',
                      paddingBottom: '0.1rem',
                      paddingLeft: '0.5rem',
                      alignItems: 'center',
                    }}
                  >
                    <SearchIcon
                      sx={{ marginRight: '0.2rem', cursor: 'pointer', marginTop: '0.1rem', color: '#FFFFFF' }}
                      onClick={() => getFilter(zoneFilter)}
                    />
                  </Box>
                </Paper>
              )}
            </Box>

            <Link
              href={`/promedina/${area}/register`}
              style={{
                color: '#FFFFFF',
                backgroundColor: '#1DD010',
                height: '28px',
                width: 'fit-content',
                borderRadius: '20px',
                padding: '0 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                marginLeft: '2px',
                cursor: 'pointer',
              }}
            >
              <Tooltip title="Cadastrar nova amostra em camadas granulares">
                <AddIcon sx={{ fontSize: '1.15rem', fontWeight: 700 }} />
              </Tooltip>

              <Tooltip title="Cadastrar nova amostra em camadas granulares">
                <Typography
                  sx={{
                    display: { mobile: 'none', notebook: 'flex' },
                    fontSize: '1rem',
                    fontWeight: 700,
                    lineHeight: '1.1rem',
                    ml: '4px',
                    textTransform: 'uppercase',
                  }}
                >
                  Nova amostra
                </Typography>
              </Tooltip>
            </Link>
          </Box>

          {/** TAGS */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              flexDirection: 'row',
              alignItems: { mobile: 'end', notebook: 'start' },
              width: '100%',
              gap: '0.5rem',
              marginTop: '1rem',
            }}
          >
            {zoneFilter !== '' && (
              <button
                onClick={() => setZoneFilter('')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid',
                  borderColor: '#00A3FF',
                  borderRadius: '15px',
                  padding: '.1rem 1rem',
                  backgroundColor: '#00A3FF',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderRight: '1.5px solid',
                    borderColor: 'primaryTons.white',
                    pr: '1rem',
                    width: '100%',
                  }}
                >
                  <Typography variant="body1" sx={{ textAlign: 'start', color: '#FCFCFC' }}>
                    Local
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    height: '100%',
                    alignItems: {
                      mobile: 'start',
                      notebook: 'center',
                    },
                    justifyContent: {
                      mobile: 'end',
                      notebook: 'center',
                    },
                  }}
                >
                  <CloseIcon
                    sx={{
                      fontSize: '2rem',
                      color: 'primaryTons.white',
                      cursor: 'pointer',
                      pl: '1rem',
                    }}
                  />
                </Box>
              </button>
            )}
            {nameFilter !== '' && (
              <button
                onClick={() => setNameFilter('')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid',
                  borderColor: '#00A3FF',
                  borderRadius: '15px',
                  padding: '.1rem 1rem',
                  backgroundColor: '#00A3FF',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderRight: '1.5px solid',
                    borderColor: 'primaryTons.white',
                    pr: '1rem',
                    width: '100%',
                  }}
                >
                  <Tooltip title="Você digitou um filtro por nome.">
                    <Typography variant="body1" sx={{ textAlign: 'start', color: '#FCFCFC' }}>
                      Nome
                    </Typography>
                  </Tooltip>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    height: '100%',
                    alignItems: {
                      mobile: 'start',
                      notebook: 'center',
                    },
                    justifyContent: {
                      mobile: 'end',
                      notebook: 'center',
                    },
                  }}
                >
                  <Tooltip title="Deletar filtro por nome.">
                    <CloseIcon
                      sx={{
                        fontSize: '2rem',
                        color: 'primaryTons.white',
                        cursor: 'pointer',
                        pl: '1rem',
                      }}
                    />
                  </Tooltip>
                </Box>
              </button>
            )}
            {cityStateFilter !== '' && (
              <button
                onClick={() => setCityStateFilter('')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid',
                  borderColor: '#00A3FF',
                  borderRadius: '15px',
                  padding: '.1rem 1rem',
                  backgroundColor: '#00A3FF',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderRight: '1.5px solid',
                    borderColor: 'primaryTons.white',
                    pr: '1rem',
                    width: '100%',
                  }}
                >
                  <Typography variant="body1" sx={{ textAlign: 'start', color: '#FCFCFC' }}>
                    Município/Estado
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    height: '100%',
                    alignItems: {
                      mobile: 'start',
                      notebook: 'center',
                    },
                    justifyContent: {
                      mobile: 'end',
                      notebook: 'center',
                    },
                  }}
                >
                  <CloseIcon
                    sx={{
                      fontSize: '2rem',
                      color: 'primaryTons.white',
                      cursor: 'pointer',
                      pl: '1rem',
                    }}
                  />
                </Box>
              </button>
            )}
            {layerFilter !== '' && (
              <button
                onClick={() => setLayerFilter('')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid',
                  borderColor: '#00A3FF',
                  borderRadius: '15px',
                  padding: '.1rem 1rem',
                  backgroundColor: '#00A3FF',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderRight: '1.5px solid',
                    borderColor: 'primaryTons.white',
                    pr: '1rem',
                    width: '100%',
                  }}
                >
                  <Typography variant="body1" sx={{ textAlign: 'start', color: '#FCFCFC' }}>
                    Camada
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    height: '100%',
                    alignItems: {
                      mobile: 'start',
                      notebook: 'center',
                    },
                    justifyContent: {
                      mobile: 'end',
                      notebook: 'center',
                    },
                  }}
                >
                  <CloseIcon
                    sx={{
                      fontSize: '2rem',
                      color: 'primaryTons.white',
                      cursor: 'pointer',
                      pl: '1rem',
                    }}
                  />
                </Box>
              </button>
            )}
          </Box>
        </Box>

        <Paper
          sx={{
            width: '100%',
            borderRadius: '20px',
            border: '1px solid rgba(0,0,0,0.17)',
            mt: '1rem',
            background: 'primaryTons.white',
          }}
        >
          <TableContainer sx={{ borderRadius: '20px' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align="center"
                      style={{
                        width: column.width,
                        fontWeight: '700',
                        fontSize: '1rem',
                      }}
                    >
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
                        {column.id === 'cityState' && row.cityState}
                        {column.id === 'layer' && row.layer}
                        {column.id === 'zone' && row.zone}
                        {column.id === 'actions' && (
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Button
                              variant="contained"
                              sx={{
                                height: '25px',
                                borderRadius: { mobile: '50%', notebook: '20px' },
                                p: { mobile: 0, notebook: '6px 12px' },
                                minWidth: '25px',
                                bgcolor: 'secondaryTons.blue',
                                color: 'primaryTons.white',

                                ':hover': {
                                  bgcolor: 'secondaryTons.blueDisabled',
                                },

                                ':active': {
                                  bgcolor: 'secondaryTons.blueClick',
                                },
                              }}
                              onClick={(e) => console.log(e)}
                            >
                              <Tooltip title="Visualizar dados desta amostra">
                                <Typography sx={{ display: { mobile: 'none', notebook: 'flex' }, fontSize: '.95rem' }}>
                                  {t('materials.template.edit')}
                                </Typography>
                              </Tooltip>
                              <NextIcon sx={{ display: { mobile: 'flex', notebook: 'none' }, fontSize: '1rem' }} />
                            </Button>
                            <Button
                              variant="text"
                              color="error"
                              sx={{ p: 0, width: '30px', minWidth: '35px' }}
                              onClick={() => {
                                setRowToDelete(row);
                                setOpenDeleteModal(true);
                              }}
                            >
                              <Tooltip title="Deletar amostra">
                                <DeleteIcon color="error" sx={{ fontSize: '1.25rem' }} />
                              </Tooltip>
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

export default PromedinaMaterialsTemplate;
