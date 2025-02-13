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
import { AddIcon, CloseIcon, DeleteIcon, NextIcon } from '@/assets';
import { toast } from 'react-toastify';
import { t } from 'i18next';
import { PromedinaDataFilter } from '@/interfaces/promedina';
import DropDown from '@/components/atoms/inputs/dropDown';
import StepDescription from '@/components/atoms/titles/step-description';
import Link from 'next/link';
import { useRouter } from 'next/router';

type Area = 'stabilized-layers' | 'binder-asphalt-concrete' | 'granular-layers';

interface PromedinaMaterialsTemplateProps {
  materials: PromedinaDataFilter[];
  handleDeleteMaterial: (id: string) => void;
  getFilter: (e: any) => void;
  area: Area;
  pages: number;
  count: number;
  onSearchParamsChange: (params: any) => void;
  onPageChange: (page: number) => void;
  setData: any;
}

interface MaterialsColumn {
  id: 'name' | 'layer' | 'cityState' | 'zone' | 'actions' | 'highway';
  label: string;
  width: string;
}

interface DataToFilter {
  _id: string;
  name: string;
  layer: string;
  zone: string;
  highway: string;
  cityState: string;
}

const PromedinaMaterialsTemplate = ({
  materials,
  handleDeleteMaterial,
  area,
  pages,
  onSearchParamsChange,
  onPageChange,
  setData,
}: PromedinaMaterialsTemplateProps) => {
  const [materialsData, setMaterialsData] = useState(materials);
  const [page, setPage] = useState<number>(1);
  const [searchBy, setSearchBy] = useState<string>('name');
  const [searchValue, setSearchValue] = useState<string>('');
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [RowToDelete, setRowToDelete] = useState<DataToFilter>();
  const { push } = useRouter();

  useEffect(() => {
    setMaterialsData(materials);
  }, [materials]);

  const [filteredData, setFilteredData] = useState([
    {
      _id: '',
      name: '',
      cityState: '',
      layer: '',
      zone: '',
      highway: '',
    },
  ]);

  const [searchParams, setSearchParams] = useState({
    name: '',
    cityState: '',
    layer: '',
    zone: '',
    highway: '',
  });

  useEffect(() => {
    onSearchParamsChange(searchParams);
  }, [searchParams]);

  const columns: MaterialsColumn[] = [
    { id: 'name', label: t('materials.template.name'), width: '25%' },
    { id: 'cityState', label: t('materials.template.cityState'), width: '25%' },
    { id: 'highway', label: t('materials.template.highway'), width: '15%' },
    { id: 'layer', label: t('materials.template.layer'), width: '25%' },
    { id: 'zone', label: t('materials.template.zone'), width: '30%' },
    { id: 'actions', label: t('materials.template.actions'), width: '25%' },
  ];

  const actions = [
    {
      id: 'visualize',
      tooltipText: 'Visualizar dados desta amostra',
      text: t('promedina.granular-layers.visualize'),
      btnColor: 'blue',
    },
    {
      id: 'edit',
      tooltipText: 'Editar dados desta amostra',
      text: t('promedina.granular-layers.edit'),
      btnColor: 'orange',
    },
  ];

  useEffect(() => {
    setSearchValue('');
  }, [searchBy]);

  useEffect(() => {
    onPageChange(page);
  }, [page]);

  useEffect(() => {
    setFilteredData(
      materialsData
        .map(({ _id, generalData }) => {
          const { name, cityState, zone, layer, highway } = generalData;
          return {
            _id,
            name,
            cityState,
            zone,
            layer,
            highway,
          };
        })
        .filter((materialsData) => {
          return searchValue?.length > 0
            ? searchBy === 'name'
              ? materialsData[searchBy].toLowerCase().includes(searchValue.toLowerCase())
              : materialsData[searchBy] === searchValue
            : true;
        })
    );
  }, [materialsData]);

  const handleVisualize = (id: string) => {
    push(`/promedina/${area}/view/data/${id}`);
  };

  const handleEdit = (id: string) => {
    const sample: any = materialsData.find((sample) => {
      return sample._id === id;
    });

    if (sample) {
      setData({
        step: 3,
        value: sample,
      });
      sessionStorage.setItem(`${area}-step`, '0');

      push(`/promedina/${area}/register`);
    }
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
                    success: `${RowToDelete?.name} ` + t('materials.template.toast.delete.sucess').toLowerCase(),
                    error: t('materials.template.toast.delete.error') + RowToDelete?.name + '.',
                  });
                  setOpenDeleteModal(false);
                  setMaterialsData(materialsData.filter((sample) => sample._id !== RowToDelete?._id));
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
      <StepDescription text={t('pm.filter-table-description')} />
      <Box sx={{ p: { mobile: '0 1vw', notebook: '0 2vw' }, mb: '4vw', width: '100%', maxWidth: '1800px' }}>
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
                width: { mobile: 'fit-content', notebook: '55%' },
              }}
            >
              <DropDown
                label={t('materials.template.searchBy')}
                options={[
                  { label: t('materials.template.name'), value: 'name' },
                  { label: t('materials.template.cityState'), value: 'cityState' },
                  { label: t('materials.template.highway'), value: 'highway' },
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
                    placeholder={t('pm.filter-table-search-by-name')}
                    value={searchParams[searchBy]}
                    onChange={(e) =>
                      setSearchParams((prevState) => ({
                        ...prevState,
                        [searchBy]: e.target.value,
                      }))
                    }
                  />
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
                    value={searchParams[searchBy]}
                    onChange={(e) =>
                      setSearchParams((prevState) => ({
                        ...prevState,
                        [searchBy]: e.target.value,
                      }))
                    }
                  />
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
                    value={searchParams[searchBy]}
                    onChange={(e) =>
                      setSearchParams((prevState) => ({
                        ...prevState,
                        [searchBy]: e.target.value,
                      }))
                    }
                    fullWidth
                  />
                </Paper>
              )}
              {searchBy === 'highway' && (
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
                    placeholder={t('pm.filter-table-search-by-highway')}
                    value={searchParams[searchBy]}
                    onChange={(e) =>
                      setSearchParams((prevState) => ({
                        ...prevState,
                        [searchBy]: e.target.value,
                      }))
                    }
                  />
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
                    value={searchParams[searchBy]}
                    onChange={(e) =>
                      setSearchParams((prevState) => ({
                        ...prevState,
                        [searchBy]: e.target.value,
                      }))
                    }
                  />
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
                padding: '0 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                marginLeft: '2px',
                cursor: 'pointer',
              }}
            >
              <Tooltip title={t('pm.tooltip-register-new-sample')}>
                <AddIcon sx={{ fontSize: '1.15rem', fontWeight: 700 }} />
              </Tooltip>

              <Tooltip title={t('pm.tooltip-register-new-sample')}>
                <Typography
                  sx={{
                    display: 'flex',
                    fontSize: { mobile: '10px', notebook: '1rem' },
                    fontWeight: { mobile: 500, notebook: 700 },
                    lineHeight: { mobile: 'none', notebook: '1.1rem' },
                    ml: '4px',
                    textTransform: 'uppercase',
                  }}
                >
                  {t('pm-button-new-sample')}
                </Typography>
              </Tooltip>
            </Link>
          </Box>

          {/** TAGS */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              flexDirection: { mobile: 'column', notebook: 'row' },
              alignItems: 'start',
              width: '100%',
              gap: '0.5rem',
              marginTop: '1rem',
            }}
          >
            {searchParams.zone !== '' && (
              <button
                onClick={() =>
                  setSearchParams({
                    ...searchParams,
                    zone: '',
                  })
                }
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
                  <Tooltip title={t('pm-tooltip-filter-zone')}>
                    <Typography variant="body1" sx={{ textAlign: 'start', color: '#FCFCFC' }}>
                      {t('materials.template.zone')}
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
                  <Tooltip title={t('pm-tooltip-del-filter')}>
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
            {searchParams.name !== '' && (
              <button
                onClick={() =>
                  setSearchParams({
                    ...searchParams,
                    name: '',
                  })
                }
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
                  <Tooltip title={t('pm-tooltip-filter-name')}>
                    <Typography variant="body1" sx={{ textAlign: 'start', color: '#FCFCFC' }}>
                      {t('pm.binderAsphaltConcrete.name')}
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
                  <Tooltip title={t('pm-tooltip-del-filter')}>
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
            {searchParams.cityState !== '' && (
              <button
                onClick={() =>
                  setSearchParams({
                    ...searchParams,
                    cityState: '',
                  })
                }
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
                  <Tooltip title={t('pm-tooltip-filter-cityState')}>
                    <Typography variant="body1" sx={{ textAlign: 'start', color: '#FCFCFC' }}>
                      {t('materials.template.cityState')}
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
                  <Tooltip title={t('pm-tooltip-del-filter')}>
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
            {searchParams.layer !== '' && (
              <button
                onClick={() =>
                  setSearchParams({
                    ...searchParams,
                    layer: '',
                  })
                }
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
                  <Tooltip title={t('pm-tooltip-filter-layer')}>
                    <Typography variant="body1" sx={{ textAlign: 'start', color: '#FCFCFC' }}>
                      {t('materials.template.layer')}
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
                  <Tooltip title={t('pm-tooltip-del-filter')}>
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

            {searchParams.highway !== '' && (
              <button
                onClick={() =>
                  setSearchParams({
                    ...searchParams,
                    highway: '',
                  })
                }
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
                  <Tooltip title={t('pm-tooltip-filter-highway')}>
                    <Typography variant="body1" sx={{ textAlign: 'start', color: '#FCFCFC' }}>
                      {t('materials.template.highway')}
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
                  <Tooltip title={t('pm-tooltip-del-filter')}>
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
          </Box>
        </Box>

        <Paper
          sx={{
            width: '100%',
            maxWidth: '100%',
            borderRadius: '20px',
            border: '1px solid rgba(0,0,0,0.17)',
            mt: '1rem',
            background: 'primaryTons.white',
            overflowX: 'hidden'
          }}
        >
          <TableContainer sx={{ borderRadius: '20px', width: '100%', maxWidth: '100%'}}>
            <Table stickyHeader aria-label="sticky table" sx={{ width: '100%' }}>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align="center"
                      style={{
                        maxWidth: column.width,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
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
                {filteredData.map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                    {columns.map((column) => (
                      <TableCell key={row._id} align="center">
                        {column.id === 'name' && row.name}
                        {column.id === 'cityState' && row.cityState}
                        {column.id === 'highway' && row.highway}
                        {column.id === 'layer' && row.layer}
                        {column.id === 'zone' && row.zone}
                        {column.id === 'actions' && (
                          <Box sx={{ display: 'flex', gap: '0.5rem' }} id={row._id}>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              {actions.map((item, index) => (
                                <Button
                                  key={index}
                                  variant="contained"
                                  onClick={
                                    item.id == 'visualize' ? () => handleVisualize(row._id) : () => handleEdit(row._id)
                                  }
                                  sx={{
                                    height: '25px',
                                    width: '100px',
                                    borderRadius: { mobile: '50%', notebook: '20px' },
                                    p: { mobile: 0, notebook: '6px 12px' },
                                    minWidth: '25px',
                                    bgcolor: `secondaryTons.${item.btnColor}`,
                                    color: 'primaryTons.white',

                                    ':hover': {
                                      bgcolor: `secondaryTons.${item.btnColor}Disabled`,
                                    },

                                    ':active': {
                                      bgcolor: `secondaryTons.${item.btnColor}Click`,
                                    },
                                  }}
                                >
                                  <Tooltip
                                    placement={item.id == 'visualize' ? 'top' : 'bottom'}
                                    title={item.tooltipText}
                                  >
                                    <Typography
                                      sx={{ display: { mobile: 'none', notebook: 'flex' }, fontSize: '.95rem' }}
                                    >
                                      {item.text}
                                    </Typography>
                                  </Tooltip>
                                  <NextIcon sx={{ display: { mobile: 'flex', notebook: 'none' }, fontSize: '1rem' }} />
                                </Button>
                              ))}
                            </Box>
                            <Button
                              variant="text"
                              color="error"
                              sx={{ p: 0, width: '30px', minWidth: '35px' }}
                              onClick={() => {
                                setRowToDelete(row);
                                setOpenDeleteModal(true);
                              }}
                            >
                              <Tooltip title={t('pm-tooltip-del-sample')}>
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
            <Pagination count={pages} size="small" onChange={(event, value) => setPage(value)} />
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default PromedinaMaterialsTemplate;
