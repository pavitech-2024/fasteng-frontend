import { useRouter } from 'next/router';
import { JSX, useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonProps,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import DropDown, { DropDownOption } from '@/components/atoms/inputs/dropDown';
import Search from '@/components/atoms/inputs/search';
import { AddIcon, DeleteIcon, NextIcon } from '@/assets';
import { formatDate } from '@/utils/format';
import { t } from 'i18next';
import Link from 'next/link';
import { Edit, ModeEdit, Visibility } from '@mui/icons-material';
import { FwdData } from '@/stores/asphalt/fwd/fwd.store';
import { IggData } from '@/stores/asphalt/igg/igg.store';
import { RtcdData } from '@/stores/asphalt/rtcd/rtcd.store';
import { DduiData } from '@/stores/asphalt/ddui/ddui.store';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import DeleteMaterialModal from '../modals/deleteMaterialModal';

export type FilterTypes = 'name' | 'type' | 'mix' | 'stretch';
export type essayTypes = 'rtcd' | 'ddui' | 'fwd' | 'igg';

interface MaterialsTemplateProps {
  materials: any[] | undefined;
  fwdEssays?: FwdData[] | undefined;
  iggEssays?: IggData[] | undefined;
  dduiEssays?: DduiData[] | undefined;
  rtcdEssays?: RtcdData[] | undefined;
  types: DropDownOption[];
  title: 'Amostras Cadastradas' | 'Materiais Cadastrados';
  path?: string;
  //Modal
  handleOpenModal: (row?: any) => void;
  deleteMaterial: (id: string, filter: FilterTypes, essayTypes?: essayTypes) => void;
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

interface ConditionalTooltipButtonProps extends ButtonProps {
  tooltip: string;
  showTooltip?: boolean;
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

  const [filteredData, setFilteredData] = useState<DataToFilter[]>([]);
  const [page, setPage] = useState<number>(0);
  const rowsPerPage = 10;
  const [searchBy, setSearchBy] = useState<FilterTypes>('name');
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchString, setSearchString] = useState<string>('');
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

  // Adiciona apenas uma vez, se o path tiver "asphalt"
  const isAsphaltPath = path?.includes('asphalt');
  if (isAsphaltPath) {
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

  /**
   * Effect hook to filter materials based on search criteria.
   * It transforms and filters the materials list according to the
   * search value and search criteria (either by name or type).
   *
   * Dependencies:
   * - `searchValue`: The value to search for within the materials.
   * - `searchBy`: The criteria to filter by, either 'name' or 'type'.
   */
  useEffect(() => {
    const data = (Array.isArray(materials) ? materials : []).map(({ _id, name, type, createdAt }) => ({
      _id,
      name,
      type,
      createdAt: createdAt instanceof Date ? createdAt : new Date(createdAt),
    }));

    const filteredData = data.filter((material) =>
      searchValue
        ? searchBy === 'name'
          ? material.name.toLowerCase().includes(searchValue.toLowerCase())
          : material.type === searchValue
        : true
    );

    setFilteredData(filteredData);
  }, [searchValue, searchBy, materials]);

  const fwdEssaysData = fwdEssays?.map(({ _id, generalData }) => ({
    name: generalData.name,
    type: 'FWD',
    createdAt: generalData.createdAt instanceof Date ? generalData.createdAt : new Date(generalData.createdAt),
    _id: _id,
  }));

  const iggEssaysData = (Array.isArray(iggEssays) ? iggEssays : []).map(({ _id, generalData }) => ({
    name: generalData.name,
    type: 'IGG',
    createdAt: generalData.createdAt,
    _id: _id,
  }));

  const rtcdEssaysData = rtcdEssays?.map((essay) => ({
    _id: essay._id,
    name: essay.generalData.name,
    type: 'RTCD',
    createdAt: essay.createdAt,
  }));

  const dduiEssaysData = dduiEssays?.map((essay) => ({
    name: essay.generalData.name,
    type: 'DDUI',
    createdAt: essay.createdAt,
    _id: essay._id,
  }));

  useEffect(() => {
    let newData: any[] = [];

    if (searchBy === 'stretch') {
      newData = [...fwdEssaysData, ...iggEssaysData];
    } else if (searchBy === 'mix') {
      newData = [...rtcdEssaysData, ...dduiEssaysData];
    } else if (searchBy === 'name') {
      const allData = [];
      if (rtcdEssaysData) allData.push(...rtcdEssaysData);
      if (dduiEssaysData) allData.push(...dduiEssaysData);
      if (fwdEssaysData) allData.push(...fwdEssaysData);
      if (iggEssaysData) allData.push(...iggEssaysData);
      if (filteredData) allData.push(...filteredData);

      // Ordenar filteredData por ordem de createdAt
      allData.sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });

      newData = allData;
    } else {
      newData = filteredData;
    }

    setTableData(newData);
  }, [searchBy, rtcdEssays, dduiEssays, fwdEssays, iggEssays, filteredData]);

  const handleEditMaterial = (rowId: string) => {
    editMaterial(rowId);
  };

  /**
   * Filtra a tabela de materiais pelo nome, considerando a string inserida pelo usuário.
   * A filtragem é case-insensitive.
   */
  const filterByString = () => {
    const newData = filteredData.filter((material: AsphaltMaterial) =>
      material.name?.toLowerCase().includes(searchString.toLowerCase())
    );
    setTableData(newData);
  };

  const ConditionalTooltipButton: React.FC<ConditionalTooltipButtonProps> = ({
    tooltip,
    showTooltip = false,
    children,
    ...buttonProps
  }) => {
    const button = <Button {...buttonProps}>{children}</Button>;

    return showTooltip ? (
      <Tooltip title={tooltip} placement="top" arrow>
        <span>{button}</span>
      </Tooltip>
    ) : (
      button
    );
  };

  return (
    <>
      <DeleteMaterialModal
        isOpen={isDeleteModalOpen}
        deleteMaterial={deleteMaterial}
        setIsOpen={setIsDeleteModalOpen}
        rowToDelete={RowToDelete}
        tableData={tableData}
        searchBy={searchBy}
      />

      {/*Create and Edit Material Modal */}
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
              value={options.find((option) => option.value === searchBy) || options[0]}
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
                value={searchString}
                setValue={setSearchString}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (searchBy === 'name') {
                      filterByString();
                    }
                  }
                }}
                handleSubmit={filterByString}
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
                value={{ label: searchValue, value: searchValue }}
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
            <Table
              sx={{ width: '100%', tableLayout: 'fixed' }}
              aria-label="materials table"
              data-testid="materials-table"
            >
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
                  <TableRow hover role="checkbox" tabIndex={-1} key={row._id} data-row-id={row._id}>
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
                                data-testid={`view-${row._id}`}
                                sx={{
                                  height: { mobile: '18px', notebook: '25px' },
                                  borderRadius: { mobile: '50%', notebook: '20px' },
                                  p: { mobile: 0, notebook: '6px 6px' },
                                  minWidth: { mobile: '18px', notebook: '30px' },
                                  bgcolor: 'transparent',
                                  color: 'secondaryTons.blue',
                                }}
                              >
                                <Visibility sx={{ fontSize: '1.30rem' }} />
                              </Button>
                            </Link>
                            <ConditionalTooltipButton
                              tooltip="Este ensaio não pode ser editado."
                              showTooltip={['FWD', 'IGG', 'RTCD', 'DDUI'].includes(row.type)}
                              data-testid={`edit-${row._id}`}
                              aria-label="Editar"
                              disabled={['FWD', 'IGG', 'RTCD', 'DDUI'].includes(row.type)}
                              onClick={() => handleEditMaterial(row._id)}
                              sx={{
                                height: { mobile: '18px', notebook: '25px' },
                                borderRadius: { mobile: '50%', notebook: '20px' },
                                p: { mobile: 0, notebook: '6px 6px' },
                                minWidth: { mobile: '18px', notebook: '25px' },
                                bgcolor: 'transparent',
                                color: 'secondaryTons.primary',
                              }}
                            >
                              <ModeEdit />
                            </ConditionalTooltipButton>

                            <Button
                              variant="text"
                              aria-label="Excluir"
                              name="delete"
                              data-testid={`delete-${row._id}`}
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
              disabled={tableData.length <= rowsPerPage} // Desabilita se houver apenas 1 pág
              onChange={(event, value) => setPage(value - 1)}
            />
          </Box>
        </Paper>
      </Box>
    </>
  );
};

//};
export default MaterialsTemplate;
