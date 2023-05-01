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
import { AddIcon, DeleteIcon } from '@/assets';
import { formatDate } from '@/utils/format';
import { toast } from 'react-toastify';
import { t } from 'i18next';

interface MaterialsTemplateProps {
  materials: Sample[];
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

  const [searchBy, setSearchBy] = useState<string>(t('materials.template.name').toLowerCase());
  const [searchValue, setSearchValue] = useState<string>('');

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [RowToDelete, setRowToDelete] = useState<Sample>();

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
    }
  };

  useEffect(() => {
    setSearchValue('');
  }, [searchBy]);

  const filteredData =
    searchValue.length > 0
      ? materials.filter((material) => {
          return searchBy === t('materials.template.name').toLowerCase()
            ? material[searchBy].toLowerCase().includes(searchValue.toLowerCase())
            : material[searchBy] === searchValue;
        })
      : materials;

  return (
    <>
      {/*Delete Modal */}
      <Dialog open={openDeleteModal}>
        <DialogTitle sx={{ fontSize: '1rem', textTransform: 'uppercase' }}>
          {t('materials.template.deleteTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textTransform: 'uppercase', fontSize: '14px' }}>
            {t('materials.template.deleteText')} <span style={{ fontWeight: 700 }}>{RowToDelete?.name}</span>?
          </DialogContentText>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: '1rem' }}>
            <Button
              color="secondary"
              sx={{ fontWeight: 700, fontSize: '12px' }}
              onClick={() => setOpenDeleteModal(false)}
            >
              {t('materials.template.cancel')}
            </Button>
            <Button
              sx={{ fontWeight: 700, fontSize: '12px' }}
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
              height: '40px',
              width: { mobile: '50%', notebook: '25%' },
              maxWidth: '220px',
              gap: '5px',
            }}
          >
            <AddIcon sx={{ color: '#fff', fontSize: '1.2rem' }} />
            <Typography sx={{ fontSize: '.8rem', fontWeight: '700' }} color="white">
              {`${
                app === 'soils' ? ` ${t('materials.template.newSample')}` : ` ${t('materials.template.newMaterial')}}`
              }`}
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
                  <>
                    <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                      {columns.map((column) => (
                        <TableCell key={column.id} align="center">
                          {column.id === 'name' && row.name}
                          {column.id === 'type' && translateType(row.type)}
                          {column.id === 'createdAt' && formatDate(row.createdAt)}
                          {column.id === 'actions' && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <Button variant="contained" color="info" onClick={(e) => console.log(e)}>
                                <Typography variant="body2" color="white" sx={{ fontSize: '12px' }}>
                                  {t('materials.template.edit')}
                                </Typography>
                              </Button>
                              <Button
                                variant="text"
                                color="warning"
                                onClick={() => {
                                  setRowToDelete(row);
                                  setOpenDeleteModal(true);
                                }}
                              >
                                <DeleteIcon color="error" sx={{ fontSize: '1.5rem' }} />
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
    </>
  );
};

export default MaterialsTemplate;
