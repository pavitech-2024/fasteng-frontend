import { useRouter } from 'next/router';
import { JSX, useEffect, useState } from 'react';
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
import { AddIcon, DeleteIcon, NextIcon } from '@/assets';
import { formatDate } from '@/utils/format';
import { toast } from 'react-toastify';
import { t } from 'i18next';
import Link from 'next/link';
import { Edit } from '@mui/icons-material';
import { FwdData } from '@/stores/asphalt/fwd/fwd.store';
import { IggData } from '@/stores/asphalt/igg/igg.store';
import { RtcdData } from '@/stores/asphalt/rtcd/rtcd.store';
import { DduiData } from '@/stores/asphalt/ddui/ddui.store';

interface MaterialsTemplateProps {
  materials: any[] | undefined;
  fwdEssays?: FwdData[] | undefined;
  iggEssays?: IggData[] | undefined;
  rtcdEssays?: RtcdData[] | undefined;
  dduiEssays?: DduiData[] | undefined;
  types: DropDownOption[];
  title: 'Amostras Cadastradas' | 'Materiais Cadastrados';
  path?: string;
  //Modal
  handleOpenModal: () => void;
  deleteMaterial: (id: string) => void;
  editMaterial: (materiaId: string) => void;
  modal: JSX.Element;
}

interface MaterialsColumn {
  id: 'name' | 'type' | 'createdAt' | 'actions';
  label: string;
  width: string;
}

export interface DataToFilter {
  _id: string;
  name: string;
  type: string;
  createdAt: Date;
}

const MaterialsTemplate = ({
  materials,
  fwdEssays,
  iggEssays,
  rtcdEssays,
  dduiEssays,
  types,
  title,
  path,
  handleOpenModal,
  deleteMaterial,
  editMaterial,
  modal,
}: MaterialsTemplateProps) => {
  const app = useRouter().pathname.split('/')[1];
  let samplesOrMaterials: string;

  const [page, setPage] = useState<number>(0);
  const rowsPerPage = 10;
  const [searchBy, setSearchBy] = useState<string>('name');
  const [searchValue, setSearchValue] = useState<string>('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [RowToDelete, setRowToDelete] = useState<DataToFilter>();
  const [tableData, setTableData] = useState<any[]>([]);

  if (path === 'soils') {
    samplesOrMaterials = 'sample';
  } else {
    samplesOrMaterials = 'material';
  }

  const columns: MaterialsColumn[] = [
    { id: 'name', label: t('materials.template.name'), width: '25%' },
    { id: 'type', label: t('materials.template.essay'), width: '25%' },
    { id: 'createdAt', label: t('materials.template.createdAt'), width: '25%' },
    { id: 'actions', label: t('materials.template.actions'), width: '25%' },
  ];

  const options = [
    { label: t('materials.template.name'), value: 'name' },
    { label: t('materials.template.type'), value: 'type' },
  ];

  if (path.includes('asphalt')) {
    options.push(
      { label: t('materials.template.mix'), value: 'mix' },
      { label: t('materials.template.stretch'), value: 'stretch' }
    );
  }

  const translateType = (type: string) => {
    switch (type) {
      case 'inorganicSoil':
        return t('samples.inorganicSoil');
      case 'organicSoil':
        return t('samples.organicSoil');
      case 'cement':
        return t('concrete.materials.cement');
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

  const filteredData = (Array.isArray(materials[0].materials) ? materials[0].materials : [])
    .map(({ _id, name, type, createdAt }) => ({
      _id,
      name,
      type,
      createdAt: createdAt instanceof Date ? createdAt : new Date(createdAt),
    }))
    .filter((material) => {
      if (!searchValue) return true;

      switch (searchBy) {
        case 'name':
          return material.name.toLowerCase().includes(searchValue.toLowerCase());
        case 'type':
          return material.type === searchValue;
        default:
          return true;
      }
    });

  const essaysData = [
    ...(fwdEssays?.map(({ _id, generalData }) => ({
      _id,
      name: generalData.name,
      type: 'FWD',
      createdAt: generalData.createdAt,
    })) ?? []),
    ...(rtcdEssays?.map(({ _id, generalData }) => ({
      _id,
      name: generalData.name,
      type: 'RTCD',
      createdAt: generalData.createdAt,
    })) ?? []),
    ...(dduiEssays?.map(({ _id, generalData }) => ({
      _id,
      name: generalData.name,
      type: 'DDUI',
      createdAt: generalData.createdAt,
    })) ?? []),
    ...(Array.isArray(iggEssays) ? iggEssays : []).map(({ _id, generalData }) => ({
      _id,
      name: generalData.name,
      type: 'IGG',
      createdAt: generalData.createdAt,
    })),
  ];

  useEffect(() => {
    let newData;

    switch (searchBy) {
      case 'stretch':
        newData = essaysData.filter((essay) => essay.type === 'FWD' || essay.type === 'IGG');
        break;
      case 'mix':
        newData = essaysData.filter((essay) => essay.type === 'RTCD' || essay.type === 'DDUI');
        break;
      case 'name':
        newData = [...filteredData, ...essaysData];
        break;
      default:
        newData = filteredData;
    }
    setTableData(newData);
  }, [searchBy]);

  const handleEditMaterial = (rowId: string) => {
    editMaterial(rowId);
  };

  return (
    <>
      {/*Delete Modal */}
      <Dialog open={isDeleteModalOpen}>
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
              onClick={() => setIsDeleteModalOpen(false)}
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
                  toast.promise(async () => await deleteMaterial(RowToDelete?._id), {
                    pending: t('materials.template.toast.delete.pending') + RowToDelete?.name + '...',
                    success: RowToDelete?.name + t('materials.template.toast.delete.sucess'),
                    error: t('materials.template.toast.delete.error') + RowToDelete?.name + '.',
                  });
                  setIsDeleteModalOpen(false);
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
      <Box
        sx={{
          p: { mobile: '2rem 4vw 0', notebook: '2rem 6vw 0' },
          mb: '4vw',
          width: '100%',
          maxWidth: '1800px',
        }}
      >
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
              options={options}
              callback={setSearchBy}
              size="small"
              sx={{ width: { mobile: '50%', notebook: '35%' }, minWidth: '120px', maxWidth: '150px', bgcolor: 'white' }}
              value={options.find((option) => option.value === searchBy) || options[0]} // Dinâmico baseado em searchBy
            />
            {searchBy === 'name' && (
              <Search
                sx={{
                  width: { mobile: '100%', notebook: '75%' },
                  maxWidth: '450px',
                  height: '39px',
                  '& .MuiSvgIcon-root': {
                    fontSize: '45px',
                  },
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
          <Box
            onClick={handleOpenModal}
            sx={{
              color: 'primaryTons.white',
              bgcolor: 'primary.main',
              height: { mobile: '36px', notebook: '28px' },
              width: { mobile: 'fit-content', notebook: 'fit-content' },
              borderRadius: '20px',
              p: { mobile: '0 10px', notebook: '0 12px' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              ml: '2px',
              cursor: 'pointer',
              gap: '4px',

              '&:hover': {
                bgcolor: 'primary.light',
              },

              '&:active': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            <AddIcon sx={{ fontSize: '1.15rem', fontWeight: 700 }} />
            <Typography
              sx={{
                display: { mobile: 'flex', notebook: 'flex' },
                fontSize: '0.8rem',
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
          </Box>
        </Box>
        <Paper
          sx={{
            width: '100%',
            borderRadius: '20px',
            border: '1px solid rgba(0,0,0,0.17)',
            mt: '1rem',
            background: 'primaryTons.white',
            overflowX: 'hidden',
          }}
        >
          <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'hidden' }}>
            <Table sx={{ width: '100%', tableLayout: 'fixed' }} aria-label="materials table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align="center"
                      sx={{
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        width: column.width,
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                    {columns.map((column) => (
                      <TableCell key={column.id} align="center">
                        {column.id === 'name' && row.name}
                        {column.id === 'type' && (
                          <>
                            {row.type === 'FWD' && 'FWD'}
                            {row.type === 'IGG' && 'IGG'}
                            {row.type === 'RTCD' && 'RTCD'}
                            {row.type === 'DDUI' && 'DDUI'}
                            {!['FWD', 'IGG', 'RTCD', 'DDUI'].includes(row.type) && translateType(row.type)}
                          </>
                        )}

                        {column.id === 'createdAt' && formatDate(row.createdAt)}
                        {column.id === 'actions' && (
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Link href={`/${path}/${row._id}`}>
                              <Button
                                variant="contained"
                                sx={{
                                  height: { mobile: '18px', notebook: '25px' },
                                  borderRadius: { mobile: '50%', notebook: '20px' },
                                  p: { mobile: 0, notebook: '6px 12px' },
                                  minWidth: { mobile: '18px', notebook: '25px' },
                                  bgcolor: 'secondaryTons.blue',
                                  color: 'primaryTons.white',

                                  ':hover': {
                                    bgcolor: 'secondaryTons.blueDisabled',
                                  },

                                  ':active': {
                                    bgcolor: 'secondaryTons.blueClick',
                                  },
                                }}
                              >
                                <Typography sx={{ display: { mobile: 'none', notebook: 'flex' }, fontSize: '.95rem' }}>
                                  {t('materials.template.visualize')}
                                </Typography>
                                <Edit sx={{ display: { mobile: 'none', notebook: 'none' }, fontSize: '1rem' }} />
                                <NextIcon sx={{ display: { mobile: 'flex', notebook: 'none' }, fontSize: '1rem' }} />
                              </Button>
                            </Link>
                            <Button
                              variant="text"
                              color="error"
                              sx={{ p: 0, width: '30px', minWidth: '35px' }}
                              onClick={() => {
                                setRowToDelete(row);
                                setIsDeleteModalOpen(true);
                              }}
                            >
                              <DeleteIcon color="error" sx={{ fontSize: '1.25rem' }} />
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
              count={Math.ceil(tableData.length / rowsPerPage)} // Usa tableData em vez de filteredData
              size="small"
              disabled={tableData.length <= rowsPerPage} // Desabilita se houver apenas 1 página
              onChange={(event, value) => setPage(value - 1)}
              showFirstButton
              showLastButton
            />
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default MaterialsTemplate;
