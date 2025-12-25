import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { toast } from 'react-toastify';
import { t } from 'i18next';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import useMarshallStore from '@/stores/asphalt/marshall/marshall.store';
import { EssayPageProps } from '@/components/templates/essay';
import { VolumetricParametersData } from '@/stores/asphalt/marshall/marshall.store';
//tst
const Marshall_Step6_VolumetricParams = ({
  setNextDisabled,
  marshall,
}: EssayPageProps & { marshall: Marshall_SERVICE }) => {
  const { volumetricParametersData: data, binderTrialData, maximumMixtureDensityData, setData } = useMarshallStore();
  const [tableIsDisabled, setTableIsDisabled] = useState({
    lessOne: true,
    lessHalf: true,
    normal: true,
    plusHalf: true,
    plusOne: true,
  });

  useEffect(() => {
    const hasEmptyArrays = Object.values(data.volumetricParameters).some((arr) => arr.length < 1);
    setNextDisabled(hasEmptyArrays);
  }, [data]);

  const handleInputChange =
    (tenor: string, index: number, field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const processedValue = value === '' ? null : value;

      const newState = [...data[tenor]];
      newState[index] = { ...newState[index], [field]: processedValue };
      setData({ step: 5, value: { ...data, [tenor]: newState } });
    };

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

  

  const renderInputCell = (tenor: string, row: any, field: string) => {
    const { id } = row;
    const index = data[tenor]?.findIndex((r) => r.id === id);
    const value = data[tenor][index]?.[field];

    return (
      <InputEndAdornment
        adornment=""
        type="number"
        value={value === null ? '' : value}
        onChange={handleInputChange(tenor, index, field)}
      />
    );
  };

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

  const handleErase = (type: string) => {
    const newRows = [...data[type]];
    if (newRows.length > 1) {
      newRows.pop();
      setData({ step: 5, value: { ...data, [type]: newRows } });
    } else {
      toast.error(t('ddui.error.minReads'));
    }
  };

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
  

  const enableAllTables = () => {
    setTableIsDisabled({
      lessOne: false,
      lessHalf: false,
      normal: false,
      plusHalf: false,
      plusOne: false,
    });
    toast.info('Todas as tabelas habilitadas! Agora adicione linhas e preencha.');
  };

  const setVolumetricParams = () => {
    toast.promise(
      async () => {
        try {
          // 1. Identifica teores COMPLETAMENTE preenchidos
          const completeTeors: Record<string, any[]> = {};

          ['lessOne', 'lessHalf', 'normal', 'plusHalf', 'plusOne'].forEach((key) => {
            const array = data[key];
            if (!array || array.length === 0) return;

            const isComplete = array.every(
              (item) =>
                item.diammeter !== null &&
                item.diammeter !== '' &&
                item.height !== null &&
                item.height !== '' &&
                item.dryMass !== null &&
                item.dryMass !== '' &&
                item.submergedMass !== null &&
                item.submergedMass !== '' &&
                item.drySurfaceSaturatedMass !== null &&
                item.drySurfaceSaturatedMass !== '' &&
                item.stability !== null &&
                item.stability !== '' &&
                item.fluency !== null &&
                item.fluency !== '' &&
                item.diametricalCompressionStrength !== null &&
                item.diametricalCompressionStrength !== ''
            );

            if (isComplete) {
              completeTeors[key] = array;
            }
          });

          // 2. Verifica se tem pelo menos um teor completo
          if (Object.keys(completeTeors).length === 0) {
            toast.error('Preencha pelo menos UM teor completamente');
            return;
          }

          // 3. Verifica teores com dados parciais
          const partialTeors = ['lessOne', 'lessHalf', 'normal', 'plusHalf', 'plusOne'].filter((key) => {
            const array = data[key];
            if (!array || array.length === 0) return false;

            const hasSomeData = array.some(
              (item) =>
                item.diammeter !== null ||
                item.height !== null ||
                item.dryMass !== null ||
                item.submergedMass !== null ||
                item.drySurfaceSaturatedMass !== null ||
                item.stability !== null ||
                item.fluency !== null ||
                item.diametricalCompressionStrength !== null
            );

            const allFieldsFilled = array.every(
              (item) =>
                item.diammeter !== null &&
                item.height !== null &&
                item.dryMass !== null &&
                item.submergedMass !== null &&
                item.drySurfaceSaturatedMass !== null &&
                item.stability !== null &&
                item.fluency !== null &&
                item.diametricalCompressionStrength !== null
            );

            return hasSomeData && !allFieldsFilled;
          });

          if (partialTeors.length > 0) {
            toast.error(`Complete TODOS os campos ou apague os dados nos teores: ${partialTeors.join(', ')}`);
            return;
          }

          console.log('🚀 Teores completos para enviar:', Object.keys(completeTeors));
          console.log('🚀 Trial:', binderTrialData.trial);

          // 4. Prepara dados APENAS com teores completos
          const step6Data: VolumetricParametersData = {
            lessOne: completeTeors.lessOne || [],
            lessHalf: completeTeors.lessHalf || [],
            normal: completeTeors.normal || [],
            plusHalf: completeTeors.plusHalf || [],
            plusOne: completeTeors.plusOne || [],
            volumetricParameters: data.volumetricParameters || {
              pointsOfCurveDosageRBV: [],
              pointsOfCurveDosageVv: [],
              volumetricParameters: [],
            },
          };

          // 5. Envia APENAS os teores completos
          console.log('📤 Chamando marshall.setVolumetricParametersData...');

          const volumetricParams = await marshall.setVolumetricParametersData(
            step6Data,
            binderTrialData,
            maximumMixtureDensityData,
            false
          );

          console.log('✅ Resposta do serviço:', volumetricParams);

          setData({ step: 5, value: { ...data, ...volumetricParams } });
        } catch (error) {
          console.error('💥 ERRO NO FRONTEND:', error);
          toast.error(error.message || 'Erro ao processar dados');
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

  // Função para limpar teores parciais
  const clearPartialTeors = () => {
    const newData = { ...data };

    ['lessOne', 'lessHalf', 'normal', 'plusHalf', 'plusOne'].forEach((key) => {
      const array = data[key];
      if (array && array.length > 0) {
        const hasSomeData = array.some(
          (item) =>
            item.diammeter !== null ||
            item.height !== null ||
            item.dryMass !== null ||
            item.submergedMass !== null ||
            item.drySurfaceSaturatedMass !== null ||
            item.stability !== null ||
            item.fluency !== null ||
            item.diametricalCompressionStrength !== null
        );

        const allFieldsFilled = array.every(
          (item) =>
            item.diammeter !== null &&
            item.height !== null &&
            item.dryMass !== null &&
            item.submergedMass !== null &&
            item.drySurfaceSaturatedMass !== null &&
            item.stability !== null &&
            item.fluency !== null &&
            item.diametricalCompressionStrength !== null
        );

        // Se tem dados parciais, limpa
        if (hasSomeData && !allFieldsFilled) {
          newData[key] = [];
          console.log(`🧹 Limpando teor ${key} porque tem dados parciais`);
        }
      }
    });

    setData({ step: 5, value: newData });
  };

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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Button
        onClick={enableAllTables}
        variant="contained"
        color="primary"
        startIcon={<LockOpenIcon />}
        sx={{ alignSelf: 'flex-start' }}
      >
        Habilitar Todas as Tabelas
      </Button>

      {renderDataGrid('lessOne', data.lessOne, 0)}
      {renderDataGrid('lessHalf', data.lessHalf, 1)}
      {renderDataGrid('normal', data.normal, 2)}
      {renderDataGrid('plusHalf', data.plusHalf, 3)}
      {renderDataGrid('plusOne', data.plusOne, 4)}

      <Button
        onClick={() => {
          clearPartialTeors();
          setVolumetricParams();
        }}
        variant="contained"
        color="primary"
      >
        {t('asphalt.dosages.marshall.confirm')}
      </Button>
    </Box>
  );
};

export default Marshall_Step6_VolumetricParams;
