import { useRouter } from 'next/router';
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
} from '@mui/material';
import Search from '@/components/atoms/inputs/search';
import { AddIcon, DeleteIcon, NextIcon } from '@/assets';
import { toast } from 'react-toastify';
import { t } from 'i18next';
import { PromedinaDataFilter } from '@/interfaces/promedina';
import DropDown from '@/components/atoms/inputs/dropDown';
import StepDescription from '@/components/atoms/titles/step-description';

interface PromedinaMaterialsTemplateProps {
  materials: PromedinaDataFilter[];
  //Modal
  handleOpenModal: () => void;
  handleDeleteMaterial: (id: string) => void;
  modal: JSX.Element;
}

interface MaterialsColumn {
  id: 'name' | 'state' | 'layer' | 'city' | 'actions';
  label: string;
  width: string;
}

interface DataToFilter {
  _id: string;
  name: string;
  state: string;
  layer: string;
  city: string;
}

const PromedinaMaterialsTemplate = ({
  materials,
  handleOpenModal,
  handleDeleteMaterial,
  modal,
}: PromedinaMaterialsTemplateProps) => {
  console.log("🚀 ~ file: filter-table.tsx:57 ~ materials:", materials)
  const app = useRouter().pathname.split('/')[1];

  const [page, setPage] = useState<number>(0);
  const rowsPerPage = 10;

  const [searchBy, setSearchBy] = useState<string>('name');
  const [searchValue, setSearchValue] = useState<string>('');

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [RowToDelete, setRowToDelete] = useState<DataToFilter>();

  const columns: MaterialsColumn[] = [
    { id: 'name', label: t('materials.template.name'), width: '25%' },
    { id: 'city', label: t('materials.template.city'), width: '25%' },
    { id: 'state', label: t('materials.template.state'), width: '25%' },
    { id: 'layer', label: t('materials.template.layer'), width: '25%' },
    { id: 'actions', label: t('materials.template.actions'), width: '25%' },
  ];

  useEffect(() => {
    setSearchValue('');
  }, [searchBy]);

  const filteredData = materials
    .map(({ _id, name, city, state, layer }) => ({
      _id,
      name,
      city,
      state,
      layer,
    }))
    .filter((material) => {
      return searchValue.length > 0
        ? searchBy === 'name'
          ? material[searchBy].toLowerCase().includes(searchValue.toLowerCase())
          : material[searchBy] === searchValue
        : true;
    });

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
      {/*Create new  Modal */}
      {modal}

      {/*Page */}
      <StepDescription
        text={
          'Todas as vezes em que você selecionar uma categoria e digitar em "Pesquisar", a tabela será atualizada com os dados filtrados.'
        }
      />
      <Box sx={{ p: { mobile: '0 4vw', notebook: '0 2vw' }, mb: '4vw', width: '100%', maxWidth: '1800px' }}>
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
                { label: t('materials.template.city'), value: 'city' },
                { label: t('materials.template.state'), value: 'state' },
                { label: t('materials.template.layer'), value: 'layer' },
              ]}
              callback={setSearchBy}
              size="small"
              sx={{ width: { mobile: '50%', notebook: '35%' }, minWidth: '120px', maxWidth: '150px', bgcolor: 'white' }}
              defaultValue={{ label: t('materials.template.name'), value: 'name' }}
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

            {searchBy === 'layer' && (
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
            {searchBy === 'city' && (
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
            {searchBy === 'state' && (
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
          </Box>
          <Box
            onClick={handleOpenModal}
            sx={{
              color: 'primaryTons.white',
              bgcolor: '#1DD010',
              height: { mobile: '36px', notebook: '28px' },
              width: { mobile: '36px', notebook: 'fit-content' },
              borderRadius: '20px',
              p: { mobile: 0, notebook: '0 12px' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              ml: '2px',
              cursor: 'pointer',

              '&:hover': {
                bgcolor: '#7ff877',
              },

              '&:active': {
                bgcolor: 'primary.dark',
              },
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
                {`${
                  app === 'soils' ? ` ${t('materials.template.newSample')}` : ` ${t('materials.template.newMaterial')}`
                }`}
              </Typography>
            </Tooltip>
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
                        {column.id === 'city' && row.city}
                        {column.id === 'state' && row.state}
                        {column.id === 'layer' && row.layer}
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
