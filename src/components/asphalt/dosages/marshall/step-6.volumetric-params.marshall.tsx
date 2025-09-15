import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { toast } from 'react-toastify';
import { t } from 'i18next';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import Loading from '@/components/molecules/loading';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import useMarshallStore from '@/stores/asphalt/marshall/marshall.store';
import { EssayPageProps } from '@/components/templates/essay';

/**
 * Componente para a etapa 6 do ensaio Marshall.
 * Renderiza tabelas editáveis com parâmetros volumétricos para diferentes dosagens de ligante.
 *
 * @param nextDisabled - Estado que indica se o botão "Próximo" está desabilitado.
 * @param setNextDisabled - Função para definir o estado do botão "Próximo".
 * @param marshall - Serviço Marshall para manipulação dos parâmetros volumétricos.
 */
const Marshall_Step6_VolumetricParams = ({ setNextDisabled, marshall }: EssayPageProps & { marshall: Marshall_SERVICE }) => {
  // Estados locais
  const { volumetricParametersData: data, binderTrialData, maximumMixtureDensityData, setData } = useMarshallStore();
  const [tableIsDisabled, setTableIsDisabled] = useState({
    lessOne: true,
    lessHalf: true,
    normal: true,
    plusHalf: true,
    plusOne: true,
  });

  /**
   * Efeito para verificar se há arrays vazios nos dados volumétricos,
   * e definir o estado do botão "Próximo" com base nisso.
   */
  useEffect(() => {
    const hasEmptyArrays = Object.values(data.volumetricParameters).some((arr) => arr.length < 1);
    setNextDisabled(hasEmptyArrays);
  }, [data]);

  /**
   * Handles input changes for volumetric parameter fields and updates the state.
   *
   * @param tenor - The type of dosage, used as a key to access the correct data array.
   * @param index - The index of the item in the data array to update.
   * @param field - The specific field of the item to update.
   * @returns A function that handles the change event of an input element.
   */
  const handleInputChange =
    (tenor: string, index: number, field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const newState = [...data[tenor]];
      newState[index] = { ...newState[index], [field]: value };
      setData({ step: 5, value: { ...data, [tenor]: newState } });
    };

  /**
   * Gera as colunas para o DataGrid com base no tipo de dosagem.
   *
   * @param tenor - Tipo de dosagem.
   * @returns Array de definições de colunas.
   */
  const generateColumns = (tenor: string): GridColDef[] => [
    {
      field: 'diammeter',
      headerName: t('asphalt.dosages.marshall.diammeter', 'Diametro'),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      width: 115,
      type: 'number',
      renderCell: ({ row }) => renderInputCell(tenor, row, 'diammeter'),
    },
    {
      field: 'height',
      headerName: t('asphalt.dosages.marshall.height', 'Altura'),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      width: 115,
      type: 'number',
      renderCell: ({ row }) => renderInputCell(tenor, row, 'height'),
    },
    {
      field: 'dryMass',
      headerName: t('asphalt.dosages.marshall.dry-mass', 'Massa seca'),
      width: 120,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      type: 'number',
      renderCell: ({ row }) => renderInputCell(tenor, row, 'dryMass'),
    },
    {
      field: 'submergedMass',
      headerName: t('asphalt.dosages.marshall.submerged-mass', 'Massa submersa'),
      width: 150,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      type: 'number',
      renderCell: ({ row }) => renderInputCell(tenor, row, 'submergedMass'),
    },
    {
      field: 'drySurfaceSaturatedMass',
      headerName: t('asphalt.dosages.marshall.dry-surface-saturated-mass', 'Massa saturada com superfície seca'),
      width: 150,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      type: 'number',
      renderCell: ({ row }) => renderInputCell(tenor, row, 'drySurfaceSaturatedMass'),
    },
    {
      field: 'stability',
      headerName: t('asphalt.dosages.marshall.stability', 'Estabilidade Marshall'),
      width: 125,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      type: 'number',
      renderCell: ({ row }) => renderInputCell(tenor, row, 'stability'),
    },
    {
      field: 'fluency',
      headerName: t('asphalt.dosages.marshall.fluency', 'Fluência'),
      width: 150,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      type: 'number',
      renderCell: ({ row }) => renderInputCell(tenor, row, 'fluency'),
    },
    {
      field: 'diametricalCompressionStrength',
      headerName: t('asphalt.dosages.indirect-tensile-strength', 'Resistência à tração por compressão diametral'),
      width: 150,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      type: 'number',
      renderCell: ({ row }) => renderInputCell(tenor, row, 'diametricalCompressionStrength'),
    },
  ];

  /**
   * Renderiza uma célula de entrada de dados no DataGrid.
   *
   * @param tenor - Tipo de dosagem.
   * @param row - Linha de dados.
   * @param field - Campo a ser renderizado.
   * @returns Componente de entrada de dados.
   */
  const renderInputCell = (tenor: string, row: any, field: string) => {
    const { id } = row;
    const index = data[tenor]?.findIndex((r) => r.id === id);
    return (
      <InputEndAdornment
        adornment=""
        type="number"
        value={data[tenor][index]?.[field]}
        onChange={handleInputChange(tenor, index, field)}
      />
    );
  };

  /**
   * Gera o modelo de agrupamento de colunas para o DataGrid.
   *
   * @param tenor - Tipo de dosagem.
   * @param index - Índice da dosagem no array de percentuais.
   * @returns Modelo de agrupamento de colunas.
   */
  const generateColumnGroupingModel = (tenor: string, index: number): GridColumnGroupingModel => [
    {
      groupId: `${binderTrialData.percentsOfDosage[binderTrialData.percentsOfDosage.length - 1][index].value} %`,
      children: [
        'diammeter',
        'height',
        'dryMass',
        'submergedMass',
        'drySurfaceSaturatedMass',
        'stability',
        'fluency',
        'diametricalCompressionStrength',
      ].map((field) => ({ field })),
      headerAlign: 'center',
      renderHeaderGroup: (params) => (
        <Box sx={{ display: 'flex', gap: '2rem' }}>
          <Typography sx={{ marginY: 'auto', color: '#777777' }}>{params.headerName}</Typography>
          <Button
            startIcon={<LockOpenIcon />}
            onClick={() => setTableIsDisabled({ ...tableIsDisabled, [tenor]: !tableIsDisabled[tenor] })}
            variant="contained"
            sx={{ marginY: '1rem' }}
          >
            {tableIsDisabled[tenor] ? t('asphalt.dosages.enable') : t('asphalt.dosages.disable')}
          </Button>
        </Box>
      ),
    },
  ];

  /**
   * Handle para remover a última linha de dados de um tipo específico.
   *
   * @param type - Tipo de dosagem.
   */
  const handleErase = (type: string) => {
    const newRows = [...data[type]];
    if (newRows.length > 1) {
      newRows.pop();
      setData({ step: 5, value: { ...data, [type]: newRows } });
    } else {
      toast.error(t('ddui.error.minReads'));
    }
  };

  /**
   * Handle para adicionar uma nova linha de dados a um tipo específico.
   *
   * @param type - Tipo de dosagem.
   */
  const handleAdd = (type: string) => {
    const newRows = [
      ...data[type],
      {
        id: data[type].length,
        diammeter: null,
        height: null,
        dryMass: null,
        submergedMass: null,
        drySurfaceSaturatedMass: null,
        stability: null,
        fluency: null,
        diametricalCompressionStrength: null,
      },
    ];
    setData({ step: 5, value: { ...data, [type]: newRows } });
  };

  /**
   * Componente de barra de ferramentas para expansão do DataGrid.
   *
   * @param type - Tipo de dosagem.
   * @returns Componente de barra de ferramentas.
   */
  const ExpansionToolbar = (type: string) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem', flexWrap: 'wrap' }}>
      <Button sx={{ color: 'secondaryTons.red' }} disabled={tableIsDisabled[type]} onClick={() => handleErase(type)}>
        {t('erase')}
      </Button>
      <Button sx={{ color: 'secondaryTons.green' }} disabled={tableIsDisabled[type]} onClick={() => handleAdd(type)}>
        {t('add')}
      </Button>
    </Box>
  );
  

  /**
   * Função para definir os parâmetros volumétricos.
   */
  const setVolumetricParams = () => {
    toast.promise(
      async () => {
        try {
          const volumetricParams = await marshall.setVolumetricParametersData(
            data,
            binderTrialData,
            maximumMixtureDensityData
          );
          setData({ step: 5, value: { ...data, ...volumetricParams } });
        } catch (error) {
          throw error;
        }
      },
      {
        pending: t('loading.data.pending'),
        success: t('loading.data.success'),
        error: t('loading.data.error'),
      }
    );
  };

  /**
   * Renderiza o componente DataGrid para um tipo específico de dosagem.
   *
   * @param tenor - Tipo de dosagem.
   * @param rows - Linhas de dados.
   * @param index - Índice da dosagem no array de percentuais.
   * @returns Componente DataGrid.
   */
  const renderDataGrid = (tenor: string, rows: any[], index: number) => (
    <DataGrid
      key={tenor}
      columns={generateColumns(tenor)}
      rows={rows}
      columnGroupingModel={generateColumnGroupingModel(tenor, index)}
      experimentalFeatures={{ columnGrouping: true }}
      density="comfortable"
      disableColumnMenu
      disableColumnSelector
      disableRowSelectionOnClick={tableIsDisabled[tenor]}
      sx={tableIsDisabled[tenor] ? { backgroundColor: '#999999' } : {}}
      slotProps={{
        cell: {
          style: tableIsDisabled[tenor] ? { pointerEvents: 'none', opacity: 0.3 } : {},
        },
      }}
      slots={{ footer: () => ExpansionToolbar(tenor) }}
    />
  );

  // Renderização do componente principal
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
      {renderDataGrid('lessOne', data.lessOne, 0)}
      {renderDataGrid('lessHalf', data.lessHalf, 1)}
      {renderDataGrid('normal', data.normal, 2)}
      {renderDataGrid('plusHalf', data.plusHalf, 3)}
      {renderDataGrid('plusOne', data.plusOne, 4)}
      <Button onClick={setVolumetricParams} variant="outlined">
        {t('asphalt.dosages.marshall.confirm')}
      </Button>
    </Box>
  );
};

export default Marshall_Step6_VolumetricParams;
