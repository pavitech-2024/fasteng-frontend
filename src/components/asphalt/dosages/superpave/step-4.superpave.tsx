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
import { DataGrid, GridAlignment, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Superpave_Step4 = ({
  nextDisabled,
  setNextDisabled,
  superpave,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const {
    materialSelectionData,
    initialBinderData: data,
    granulometryCompositionData,
    generalData,
    setData,
  } = useSuperpaveStore();

  const [specificMassModalIsOpen, setSpecificMassModalIsOpen] = useState(true);
  const [newInitialBinderModalIsOpen, setNewInitialBinderModalIsOpen] = useState(false);
  const [binderInput, setBinderInput] = useState();

  const { user } = useAuth();

  const [binderData, setBinderData] = useState<AsphaltMaterialData>();
  const [rows, setRows] = useState([]);
  const [estimatedPercentageRows, setEstimatedPercentageRows] = useState([]);
  const compositions = ['inferior', 'intermediaria', 'superior'];

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          let newMaterials = [];

          const response = await materialsService.getMaterial(materialSelectionData.binder);

          setBinderData(response.data.material);

          const { data: resData, success, error } = await superpave.getStep4SpecificMasses(materialSelectionData);

          if (success && resData.specificMasses.length > 0) {
            resData.specificMasses.forEach((e) => {
              let obj = {
                name: e.generalData.material.name,
                realSpecificMass: e.results.bulk_specify_mass,
                apparentSpecificMass: e.results.apparent_specify_mass,
                absorption: e.results.absorption,
              };
              newMaterials.push(obj);
            });

            let prevData = { ...data };
            prevData = {
              ...prevData,
              materials: newMaterials,
            };

            setData({
              step: 3,
              value: prevData,
            });
          } else {
            console.error(`${error}`);
          }
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
  }, []);

  const generateMaterialInputs = (materials) => {
    return materials.map((material, index) => [
      {
        key: 'realSpecificMass',
        label: 'Massa específica real',
        placeHolder: 'Massa específica real',
        adornment: 'g/cm²',
        value: material.realSpecificMass,
        materialIndex: index + 1,
        name: material.name,
      },
      {
        key: 'apparentSpecificMass',
        label: 'Massa específica aparente',
        placeHolder: 'Massa específica aparente',
        adornment: 'g/cm²',
        value: material.apparentSpecificMass,
        materialIndex: index + 1,
        name: material.name,
      },
      {
        key: 'absorption',
        label: 'Absorção',
        placeHolder: 'Absorção',
        adornment: '%',
        value: material.absorption,
        materialIndex: index + 1,
        name: material.name,
      },
    ]);
  };

  const modalMaterialInputs = generateMaterialInputs(data.materials);

  const updateRows = () => {
    if (data.granulometryComposition) {
      const updatedRows = data.granulometryComposition.map((e, i) => ({
        id: i,
        granulometricComposition: compositions[i],
        combinedGsb: e.combinedGsb ? e.combinedGsb.toFixed(2) : '',
        combinedGsa: e.combinedGsa ? e.combinedGsa.toFixed(2) : '',
        gse: e.gse ? e.gse.toFixed(2) : '',
      }));
      return updatedRows;
    } else {
      return [];
    }
  };

  const updatePercentageRows = () => {
    if (data.granulometryComposition) {
      const updatedPercentageRows = data.granulometryComposition.map((e, i) => {
        const row = {
          id: i,
          granulometricComposition: compositions[i],
          initialBinder: e.pli?.toFixed(2),
        };
  
        e.percentsOfDosageWithBinder.forEach((percent, index) => {
          row[`material_${index + 1}`] = percent?.toFixed(2);
        });
  
        return row;
      });
  
      return updatedPercentageRows;
    } else {
      return [];
    }
  };
  

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

          const updatedRows = await updateRows();
          setRows(updatedRows);

          const updatedPercentageRows = await updatePercentageRows();
          setEstimatedPercentageRows(updatedPercentageRows);
          setLoading(false);
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

  useEffect(() => {
    const updatedRows = updateRows();
    setRows(updatedRows);

    const updatedEstimatedPercentageRows = updatePercentageRows();
    setEstimatedPercentageRows(updatedEstimatedPercentageRows);
  }, [data.granulometryComposition]);

  const columns: GridColDef[] = [
    {
      field: 'granulometricComposition',
      headerName: 'Composição Granulométrica',
      valueFormatter: ({ value }) => `${value}`,
      width: 200,
    },
    {
      field: 'combinedGsb',
      headerName: 'Gsb combinado (g/cm³)',
      valueFormatter: ({ value }) => `${value}`,
      width: 200,
    },
    {
      field: 'combinedGsa',
      headerName: 'Gsa combinado (g/cm³)',
      valueFormatter: ({ value }) => `${value}`,
      width: 200,
    },
    {
      field: 'gse',
      headerName: 'Gse (g/cm³)',
      valueFormatter: ({ value }) => `${value}`,
      width: 200,
    },
  ];

  const createEstimatedPercentageCols = () => {
    const baseCols: GridColDef[] = [
      {
        field: 'granulometricComposition',
        headerName: 'Composição Granulométrica',
        valueFormatter: ({ value }) => `${value}`,
        width: 200,
      },
      {
        field: 'initialBinder',
        headerName: 'Teor de ligante inicial',
        valueFormatter: ({ value }) => `${value}`,
        width: 200,
      }
    ];
  
    const materialCols = materialSelectionData.aggregates.map((aggregate, index) => ({
      field: `material_${index + 1}`,
      headerName: aggregate.name,
      valueFormatter: ({ value }) => `${value}`,
      width: 100,
    }));
  
    return [...baseCols, ...materialCols];
  };
  
  const estimatedPercentageCols = createEstimatedPercentageCols();

  const createEstimatedPercentageGroupings = (): GridColumnGroupingModel => {
    const baseChildren = [
      { field: 'granulometricComposition' },
      { field: 'initialBinder' },
    ];
  
    const materialChildren = materialSelectionData.aggregates.map((_, index) => ({
      field: `material_${index + 1}`,
    }));
  
    return [
      {
        groupId: 'estimatedPercentage',
        headerName: 'Porcentagem estimada de materiais',
        children: [...baseChildren, ...materialChildren],
        headerAlign: 'center' as GridAlignment,
      },
    ];
  };
  
  const estimatedPercentageGroupings = createEstimatedPercentageGroupings();

  const compressionParamsCols: GridColDef[] = [
    {
      field: 'initialN',
      headerName: 'Ninicial',
      valueFormatter: ({ value }) => `${value}`,
      width: 200,
    },
    {
      field: 'projectN',
      headerName: 'Nprojeto',
      valueFormatter: ({ value }) => `${value}`,
      width: 200,
    },
    {
      field: 'maxN',
      headerName: 'Nmáximo',
      valueFormatter: ({ value }) => `${value}`,
      width: 200,
    },
    {
      field: 'tex',
      headerName: 'Tráfego',
      valueFormatter: ({ value }) => `${value}`,
      width: 200,
    },
  ];

  const compressionParamsRows = [
    {
      id: 0,
      initialN: data.turnNumber.initialN ? data.turnNumber.initialN : '',
      maxN: data.turnNumber.maxN,
      projectN: data.turnNumber.projectN,
      tex: data.turnNumber.tex !== '' ? data.turnNumber.tex : generalData.trafficVolume,
    },
  ];

  const compressionParamsGroupings: GridColumnGroupingModel = [
    {
      groupId: 'compressionParams',
      headerName: 'Parametros de comparação',
      children: [{ field: 'initialN' }, { field: 'maxN' }, { field: 'projectN' }, { field: 'tex' }],
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
          {rows.length > 0 && (
            <DataGrid
              hideFooter
              disableColumnMenu
              disableColumnFilter
              experimentalFeatures={{ columnGrouping: true }}
              columns={columns}
              rows={rows}
            />
          )}

          <DataGrid
            hideFooter
            disableColumnMenu
            disableColumnFilter
            experimentalFeatures={{ columnGrouping: true }}
            columnGroupingModel={estimatedPercentageGroupings}
            columns={estimatedPercentageCols}
            rows={estimatedPercentageRows}
            sx={{ marginTop: '2rem' }}
          />

          <Button variant='outlined' sx={{ width: 'fit-content', marginTop: '2rem' }} onClick={() => setNewInitialBinderModalIsOpen(true)}>
            Alterar teor de ligante inicial
          </Button>

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
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1rem', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: '1rem', flexDirection: 'column', marginBottom: '2rem' }}>
              {modalMaterialInputs.map((materialInputs, idx) => (
                <>
                  <Typography>{materialInputs[0].name}</Typography>

                  <Box key={idx} sx={{ display: 'flex', gap: '1rem' }}>
                    {materialInputs.map((input) => (
                      <InputEndAdornment
                        key={`${input.materialIndex}_${input.key}`}
                        adornment={input.adornment}
                        value={input.value}
                        label={input.label}
                        placeholder={input.placeHolder}
                        fullWidth
                        onChange={(e) => {
                          const updatedMaterials = data.materials.map((material, index) => {
                            if (index === input.materialIndex - 1) {
                              return {
                                ...material,
                                [input.key]: e.target.value.replace(',', '.'),
                              };
                            }
                            return material;
                          });

                          setData({
                            step: 3,
                            key: `materials`,
                            value: updatedMaterials,
                          });
                        }}
                      />
                    ))}
                  </Box>
                </>
              ))}
            </Box>
          </Box>

          <Typography>{binderData?.name}</Typography>

          <Box>
            <InputEndAdornment
              adornment={'g/cm²'}
              placeholder="Massa especifica real"
              value={data.binderSpecificMass}
              type="number"
              onChange={(e) => {
                setData({ step: 3, key: 'binderSpecificMass', value: Number(e.target.value) });
              }}
            />
          </Box>
        </ModalBase>
      )}

      <ModalBase
        title={'Insira o teor de ligante inicial'}
        leftButtonTitle={'Cancelar'}
        rightButtonTitle={'Confirmar'}
        onCancel={() => {
          setNewInitialBinderModalIsOpen(false);
          setLoading(false);
        }}
        open={newInitialBinderModalIsOpen}
        size={'medium'}
        onSubmit={handleModalSubmit}
        oneButton={false}
      >
        <InputEndAdornment
          adornment="%"
          value={binderInput}
          placeholder="Curva inferior"
          fullWidth
          onChange={(e) => {
            setData({
              step: 3,
              key: `binderInput`,
              value: Number(e.target.value),
            });
          }}
        />
      </ModalBase>
    </>
  );
};

export default Superpave_Step4;
