import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import Loading from '@/components/molecules/loading';
import ModalBase from '@/components/molecules/modals/modal';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import { AsphaltMaterialData } from '@/interfaces/asphalt';
import materialsService from '@/services/asphalt/asphalt-materials.service';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';
import { t } from 'i18next';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Superpave_Step4 = ({
  nextDisabled,
  setNextDisabled,
  superpave,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    materialSelectionData,
    initialBinderData: data,
    granulometryCompositionData,
    generalData,
    setData,
  } = useSuperpaveStore();

  const [specificMassModalIsOpen, setSpecificMassModalIsOpen] = useState(true);
  const [newInitialBinderModalIsOpen, setNewInitialBinderModalIsOpen] = useState(false);
  const materials = materialSelectionData.aggregates.map((item) => item.name);
  const [binderInput, setBinderInput] = useState(data.binderInputs?.find((e) => e.curve === 'inferior')?.value ? data.binderInputs.find((e) => e.curve === 'inferior').value : '')

  const { user } = useAuth();

  const [binderData, setBinderData] = useState<AsphaltMaterialData>();

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          const response = await materialsService.getMaterial(materialSelectionData.binder);

          setBinderData(response.data.material);

          const specificMasses = await superpave.getStep4SpecificMasses(materialSelectionData);
          console.log('🚀 ~ specificMasses:', specificMasses);

          // To-do: Fazer a lógica de inserção de dados quando o material já tem ensaio de massa especifica;

          // setLoading(false);
        } catch (error) {
          // setLoading(false);
          throw error;
        }
      },
      {
        pending: t('loading.materials.pending'),
        success: t('loading.materials.success'),
        error: t('loading.materials.error'),
      }
    );
  }, []);

  const modalMaterial_1Inputs = [
    {
      key: 'realSpecificMass',
      placeHolder: 'Massa específica real',
      adornment: 'g/cm²',
      value: data.material_1.realSpecificMass,
    },
    {
      key: 'apparentSpecificMass',
      placeHolder: 'Massa específica aparente',
      adornment: 'g/cm²',
      value: data.material_1.apparentSpecificMass,
    },
    {
      key: 'absorption',
      placeHolder: 'Absorção',
      adornment: '%',
      value: data.material_1.absorption,
    },
  ];

  const modalMaterial_2Inputs = [
    {
      key: 'realSpecificMass',
      placeHolder: 'Massa específica real',
      adornment: 'g/cm²',
      value: data.material_2.realSpecificMass,
    },
    {
      key: 'apparentSpecificMass',
      placeHolder: 'Massa específica aparente',
      adornment: 'g/cm²',
      value: data.material_2.apparentSpecificMass,
    },
    {
      key: 'absorption',
      placeHolder: 'Absorção',
      adornment: '%',
      value: data.material_2.absorption,
    },
  ];

  const handleModalSubmit = () => {
    toast.promise(
      async () => {
        try {
          const response = await superpave.getStep4Data(
            generalData,
            materialSelectionData,
            granulometryCompositionData,
            data
          );
          console.log('🚀 ~ response:', response);
          setSpecificMassModalIsOpen(false);
        } catch (error) {
          throw error;
        }
      },
      {
        pending: t('loading.materials.pending'),
        success: t('loading.materials.success'),
        error: t('loading.materials.error'),
      }
    );
  };

  const columns: GridColDef[] = [
    {
      field: 'granulometricComposition',
      headerName: 'Composição Granulométrica',
      valueFormatter: ({ value }) => `${value}`,
      width: 200
    },
    {
      field: 'combinedGsb',
      headerName: 'Gsb combinado (g/cm³)',
      valueFormatter: ({ value }) => `${value}`,
      width: 200
    },
    {
      field: 'combinedGsa',
      headerName: 'Gsa combinado (g/cm³)',
      valueFormatter: ({ value }) => `${value}`,
      width: 200
    },
    {
      field: 'gse',
      headerName: 'Gse (g/cm³)',
      valueFormatter: ({ value }) => `${value}`,
      width: 200
    },
  ];

  const rows = [
    {
      id: 0,
      granulometricComposition: Object.keys(granulometryCompositionData.chosenCurves).find((e) => e === 'lower')
        ? 'inferior'
        : '',
      combinedGsb: data.combinedGsb?.toFixed(2),
      combinedGsa: data.combinedGsa?.toFixed(2),
      gse: data.gse?.toFixed(2),
    },
  ];

  const estimatedPercentageCols: GridColDef[] = [
    {
      field: 'granulometricComposition',
      headerName: 'Composição Granulométrica',
      valueFormatter: ({ value }) => `${value}`,
      width: 200
    },
    {
      field: 'initialBinder',
      headerName: 'Teor de ligante inicial',
      valueFormatter: ({ value }) => `${value}`,
      width: 200
    },
    {
      field: 'material_1',
      headerName: materialSelectionData.aggregates[0].name,
      valueFormatter: ({ value }) => `${value}`,
      width: 200
    },
    {
      field: 'material_2',
      headerName: materialSelectionData.aggregates[1].name,
      valueFormatter: ({ value }) => `${value}`,
      width: 200
    },
  ];

  const estimatedPercentageRows = [
    {
      id: 0,
      granulometricComposition: Object.keys(granulometryCompositionData.chosenCurves).find((e) => e === 'lower')
        ? 'inferior'
        : '',
      initialBinder: data.pli?.toFixed(2),
      material_1: data.percentsOfDosageWithBinder.length > 0 ? data.percentsOfDosageWithBinder[0]?.toFixed(2) : '',
      material_2: data.percentsOfDosageWithBinder.length > 0 ? data.percentsOfDosageWithBinder[1]?.toFixed(2) : '',
    },
  ];

  const estimatedPercentageGroupings: GridColumnGroupingModel = [
    {
      groupId: 'estimatedPercentage',
      headerName: 'Porcentagem estimada de materiais',
      children: [
        { field: 'granulometricComposition' },
        { field: 'initialBinder' },
        { field: 'material_1' },
        { field: 'material_2' },
      ],
      headerAlign: 'center',
    },
  ];

  const compressionParamsCols: GridColDef[] = [
    {
      field: 'initialN',
      headerName: 'Ninicial',
      valueFormatter: ({ value }) => `${value}`,
      width: 200
    },
    {
      field: 'projectN',
      headerName: 'Nprojeto',
      valueFormatter: ({ value }) => `${value}`,
      width: 200
    },
    {
      field: 'maxN',
      headerName: 'Nmáximo',
      valueFormatter: ({ value }) => `${value}`,
      width: 200
    },
    {
      field: 'tex',
      headerName: 'Tráfego',
      valueFormatter: ({ value }) => `${value}`,
      width: 200
    },
  ];

  const compressionParamsRows = [
    {
      id: 0,
      initialN: data.turnNumber.initialN,
      maxN: data.turnNumber.maxN,
      projectN: data.turnNumber.projectN,
      tex: data.turnNumber.tex !== "" ? data.turnNumber.tex : generalData.trafficVolume,
    },
  ];

  const compressionParamsGroupings: GridColumnGroupingModel = [
    {
      groupId: 'compressionParams',
      headerName: 'Parametros de comparação',
      children: [
        { field: 'initialN' },
        { field: 'maxN' },
        { field: 'projectN' },
        { field: 'tex' },
      ],
      headerAlign: 'center',
    },
  ];

  nextDisabled && setNextDisabled(false);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <DataGrid
            hideFooter
            disableColumnMenu
            disableColumnFilter
            experimentalFeatures={{ columnGrouping: true }}
            columns={columns}
            rows={rows}
          />

          <DataGrid
            hideFooter
            disableColumnMenu
            disableColumnFilter
            experimentalFeatures={{ columnGrouping: true }}
            columnGroupingModel={estimatedPercentageGroupings}
            columns={estimatedPercentageCols}
            rows={estimatedPercentageRows}
          />

          <Button sx={{ width: 'fit-content' }} onClick={() => setNewInitialBinderModalIsOpen(true)}>Alterar teor de ligante inicial</Button>

          <DataGrid
            hideFooter
            disableColumnMenu
            disableColumnFilter
            experimentalFeatures={{ columnGrouping: true }}
            columnGroupingModel={compressionParamsGroupings}
            columns={compressionParamsCols}
            rows={compressionParamsRows}
          />
        </Box>
      )}

      {specificMassModalIsOpen && (
        <ModalBase
          title={'Insira as massas específicas dos materiais'}
          leftButtonTitle={''}
          rightButtonTitle={''}
          onCancel={() => {
            setSpecificMassModalIsOpen(false);
            setLoading(false);
          }}
          open={specificMassModalIsOpen}
          size={'large'}
          onSubmit={handleModalSubmit}
          oneButton={true}
          singleButtonTitle="Confirmar"
        >
          <Typography>{materials[0]}</Typography>

          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1rem', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: '1rem', flexDirection: 'row', marginBottom: '2rem' }}>
              {modalMaterial_1Inputs.map((input) => (
                <InputEndAdornment
                  key={input.key}
                  adornment={input.adornment}
                  value={input.value}
                  placeholder={input.placeHolder}
                  fullWidth
                  onChange={(e) => {
                    setData({
                      step: 3,
                      key: `material_1`,
                      value: { ...data.material_1, [input.key]: Number(e.target.value) },
                    });
                  }}
                />
              ))}
            </Box>
          </Box>

          <Typography>{materials[1]}</Typography>

          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1rem', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: '1rem', flexDirection: 'row', marginBottom: '2rem' }}>
              {modalMaterial_2Inputs.map((input) => (
                <InputEndAdornment
                  key={input.key}
                  adornment={input.adornment}
                  value={input.value}
                  placeholder={input.placeHolder}
                  fullWidth
                  onChange={(e) => {
                    setData({
                      step: 3,
                      key: `material_2`,
                      value: { ...data.material_2, [input.key]: Number(e.target.value) },
                    });
                  }}
                />
              ))}
            </Box>
          </Box>

          <Typography>{binderData?.name}</Typography>

          <Box>
            <InputEndAdornment
              adornment={'g/cm²'}
              placeholder="Massa especifica real"
              value={data.binderSpecificMass}
              onChange={(e) => {
                setData({ step: 3, key: 'binderSpecificMass', value: Number(e.target.value) });
              }}
            />
          </Box>
        </ModalBase>
      )}

      <ModalBase
        title={'Insira o teor de ligante inicial'}
        leftButtonTitle={''}
        rightButtonTitle={''}
        onCancel={() => {
          setSpecificMassModalIsOpen(false);
          setLoading(false);
        }}
        open={newInitialBinderModalIsOpen}
        size={'medium'}
        onSubmit={handleModalSubmit}
        oneButton={true}
        singleButtonTitle="Confirmar"
      >
        {granulometryCompositionData.chosenCurves.lower && (
          <InputEndAdornment
            adornment='%'
            value={binderInput}
            placeholder='Curva inferior'
            fullWidth
            onChange={(e) => {
              let newData = [...data.binderInputs];
              const index = newData.findIndex((e) => e.curve === 'inferior');
              newData[index] = { curve: 'inferior', value: Number(e.target.value)}
              setData({
                step: 3,
                key: `binderInputs`,
                value: {...data, binderInputs: newData},
              });
            }}
          />
        )}
      </ModalBase>
    </>
  );
};

export default Superpave_Step4;
