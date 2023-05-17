import { useRouter } from 'next/router';
import { Sample } from '@/interfaces/soils';
import Header from '@/components/organisms/header';
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
} from '@mui/material';
import DropDown, { DropDownOption } from '@/components/atoms/inputs/dropDown';
import Search from '@/components/atoms/inputs/search';
import { AddIcon, DeleteIcon, VisualizeIcon } from '@/assets';
import { formatDate } from '@/utils/format';
import { toast } from 'react-toastify';
import { t } from 'i18next';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import { PageGenericContainer as Container } from '@/components/organisms/pageContainer';

interface MaterialsTemplateProps {
  materials: Sample[] | AsphaltMaterial[];
  types: DropDownOption[];
  title: 'Amostras Cadastradas' | 'Materiais Cadastrados';
  //Modal
  handleOpenModal: () => void;
  handleDeleteMaterial: (id: string) => void;
  modal: JSX.Element;
}

interface MaterialsColumn {
  id: 'name' | 'type' | 'createdAt' | 'actions';
  label: string;
  width: string;
}

interface DataToFilter {
  _id: string;
  name: string;
  type: string;
  createdAt: Date;
}

const MaterialsTemplate = ({
  materials,
  types,
  title,
  handleOpenModal,
  handleDeleteMaterial,
  modal,
}: MaterialsTemplateProps) => {
  const app = useRouter().pathname.split('/')[1];

  const [page, setPage] = useState<number>(0);
  const rowsPerPage = 10;

  const [searchBy, setSearchBy] = useState<string>('name');
  const [searchValue, setSearchValue] = useState<string>('');

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [RowToDelete, setRowToDelete] = useState<DataToFilter>();

  const columns: MaterialsColumn[] = [
    { id: 'name', label: t('materials.template.name'), width: '25%' },
    { id: 'type', label: t('materials.template.type'), width: '25%' },
    { id: 'createdAt', label: t('materials.template.createdAt'), width: '25%' },
    { id: 'actions', label: t('materials.template.actions'), width: '25%' },
  ];

  const translateType = (type: string) => {
    switch (type) {
      case 'inorganicSoil':
        return t('samples.inorganicSoil');
      case 'organicSoil':
        return t('samples.organicSoil');
      case 'pavementLayer':
        return t('samples.pavementLayer');
      case 'coarseAggregate':
        return t('asphalt.materials.coarseAggregate');
      case 'fineAggregate':
        return t('asphalt.materials.fineAggregate');
      case 'asphaltBinder':
        return t('asphalt.materials.asphaltBinder');
      case 'CAP':
        return t('asphalt.materials.cap');
      case 'filler':
        return t('asphalt.materials.filler');
      case 'other':
        return t('asphalt.materials.other');
    }
  };

  useEffect(() => {
    setSearchValue('');
  }, [searchBy]);

  const filteredData = materials
    .map(({ _id, name, type, createdAt }) => ({
      _id,
      name,
      type,
      createdAt,
    }))
    .filter((material) => {
      return searchValue.length > 0
        ? searchBy === 'name'
          ? material[searchBy].toLowerCase().includes(searchValue.toLowerCase())
          : material[searchBy] === searchValue
        : true;
    });

  return (
    <Container>
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
      <Header title={`${title}`} />
      <Box sx={{ padding: { mobile: '0 2vw', notebook: '0 6vw' } }}>
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
              width: '60%',
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
                label={
                  t('materials.template.dropDown.label') +
                  ` ${app === 'soils' ? t('materials.template.sample') : t('materials.template.material')}.`
                }
                size="small"
                callback={setSearchValue}
                options={types}
              />
            )}
          </Box>
          <Button
            onClick={handleOpenModal}
            variant="contained"
            color="primary"
            sx={{
              color: 'primaryTons.white',
              bgcolor: 'primary.main',
              height: '33px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '20px',
              boxShadow: 'unset',
              padding: '0 12px',

              '&:hover': {
                bgcolor: '#F2A255',
                boxShadow: 'unset',
              }
            }}
          >
            <AddIcon sx={{ color: 'primaryTons.white', fontSize: '1.2rem' }} />
            <Typography
              sx={{
                fontSize: { mobile: '.8rem', notebook:'.95rem' },
                fontWeight: '700',
                ml: '2px'
              }}
            >
              {`${
                app === 'soils' ? ` ${t('materials.template.newSample')}` : ` ${t('materials.template.newMaterial')}`
              }`}
            </Typography>
          </Button>
        </Box>
        <Paper
          sx={{
            width: '100%',
            borderRadius: '20px',
            border: '1px solid rgba(0,0,0,0.17)',
            marginTop: '1rem',
            background: 'primaryTons.white'
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
                        fontSize: '1rem'
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <>
                    <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                      {columns.map((column) => (
                        <TableCell key={column.id} align="center">
                          {column.id === 'name' && row.name}
                          {column.id === 'type' && translateType(row.type)}
                          {column.id === 'createdAt' && formatDate(row.createdAt)}
                          {column.id === 'actions' && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <Button
                                variant="contained"
                                sx={{
                                  height: '25px',
                                  borderRadius: '20px',
                                  boxShadow: 'unset',
                                  padding: { mobile: '6px 6px', notebook: '6px 12px' },
                                  minWidth: '20px',
                                  bgcolor: 'secondaryTons.blue',
                                  fontSize: '1rem',
                                  lineHeight: '1rem',
                                  color: 'primaryTons.white',

                                  ':hover': {
                                    bgcolor: '#45BCFF',
                                    boxShadow: 'unset'
                                  }
                                }}
                                onClick={(e) => console.log(e)}
                              >
                                <Typography sx={{ display: { mobile: 'none', notebook: 'flex' } }}>
                                  {t('materials.template.edit')}
                                </Typography>
                                <VisualizeIcon
                                  sx={{ display: { mobile: 'flex', notebook: 'none' }, fontSize: '1.25rem' }} />
                                
                              </Button>
                              <Button
                                variant="text"
                                color="error"
                                sx={{ padding: 0, width: 'auto' }}
                                onClick={() => {
                                  setRowToDelete(row);
                                  setOpenDeleteModal(true);
                                }}
                              >
                                <DeleteIcon color="error" sx={{ fontSize: '1.25rem' }} />
                              </Button>
                            </Box>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </>
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
    </Container>
  );
};

export default MaterialsTemplate;
