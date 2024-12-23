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
  const [materialNames, setMaterialNames] = useState([]);
  const [activateSecondFetch, setActivateSecondFetch] = useState(false);
  const [shouldRenderTable1, setShouldRenderTable1] = useState(false);

  useEffect(() => {
    if (!activateSecondFetch) {
      toast.promise(
        async () => {
          try {
            const newMaterials = [];

            const aggregatesIds = materialSelectionData.aggregates.map((e) => e._id);
            const binderId = materialSelectionData.binder;
            const ids = [...aggregatesIds, binderId];

            const response = await materialsService.getMaterials(ids);

            const names = response.data.materials.map((e) => e.name);

            setMaterialNames(names);
            setBinderData(response.data.material);

            const binderIndex = response.data.essays.findIndex((e) =>
              e.some((f) => f.data.generalData.material.type === 'asphaltBinder')
            );

            const responseData = { ...response.data };

            for (let i = 0; i < responseData.materials.length; i++) {
              const aggregateMaterial = {
                name: responseData.materials[i].name,
                type: i === binderIndex ? 'binder' : 'aggregate',
                realSpecificMass: null,
                apparentSpecificMass: null,
                absorption: null,
              };

              newMaterials.push(aggregateMaterial);
            }

            let prevData = { ...data };
            prevData = {
              ...prevData,
              materials: newMaterials,
            };

            setData({
              step: 3,
              value: prevData,
            });

            setActivateSecondFetch(true);
          } catch (error) {
            throw error;
          }
        },
        {
          pending: t('loading.materials.pending'),
          success: t('loading.materials.success'),
          error: t('erro no 1'),
        }
      );
    }
  }, []);

  useEffect(() => {
    const hasSomeNullValue = Object.values(rows).some((e) => e === null);
    if (activateSecondFetch && hasSomeNullValue) {
      toast.promise(
        async () => {
          try {
            const newMaterials = [];
            const { data: resData, success, error } = await superpave.getStep4SpecificMasses(materialSelectionData);

            if (success && resData.specificMasses.length > 0) {
              resData.specificMasses.forEach((e) => {
                const obj = {
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
              setActivateSecondFetch(false);
            } else {
              let count = 0;
              data.materials.forEach((e) => {
                const obj = {
                  name: e.name,
                  realSpecificMass: e.realSpecificMass,
                  apparentSpecificMass: e.apparentSpecificMass,
                  absorption: e.absorption,
                };
                newMaterials[count].push(obj);
                count++;
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
              setActivateSecondFetch(false);
            }
          } catch (error) {
            throw error;
          }
        },
        {
          pending: t('loading.materials.pending'),
          success: t('loading.materials.success'),
          error: t('erro no 2'),
        }
      );
    }
  }, [activateSecondFetch, rows]);

  const generateMaterialInputs = (materials) => {
    return materials.map((material, index) => [
      {
        key: 'realSpecificMass',
        label: t('asphalt.dosages.superpave.real-specific-mass'),
        placeHolder: 'Massa específica real',
        adornment: 'g/cm²',
        value: material.realSpecificMass,
        materialIndex: index + 1,
        name: material.name,
      },
      {
        key: 'apparentSpecificMass',
        label: t('asphalt.dosages.superpave.apparent-specific-mass'),
        placeHolder: 'Massa específica aparente',
        adornment: 'g/cm²',
        value: material.apparentSpecificMass,
        materialIndex: index + 1,
        name: material.name,
      },
      {
        key: 'absorption',
        label: t('asphalt.dosages.superpave.absorption'),
        placeHolder: 'Absorção',
        adornment: '%',
        value: material.absorption,
        materialIndex: index + 1,
        name: material.name,
      },
    ]);
  };

  const modalMaterialInputs = generateMaterialInputs(data.materials);

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

          const updatedRows = response.granulometryComposition.map((e, i) => ({
            id: i,
            granulometricComposition: compositions[i],
            combinedGsb: e.combinedGsb ? e.combinedGsb.toFixed(2) : '',
            combinedGsa: e.combinedGsa ? e.combinedGsa.toFixed(2) : '',
            gse: e.gse ? e.gse.toFixed(2) : '',
          }));

          setRows(updatedRows);

          let prevData = { ...data };
          prevData = {
            ...prevData,
            granulometryComposition: response.granulometryComposition,
            turnNumber: response.turnNumber,
          };

          const updatedPercentageRows = response.granulometryComposition.map((e, i) => {
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

          setEstimatedPercentageRows(updatedPercentageRows);

          setData({ step: 3, value: prevData });
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

  const columns: GridColDef[] = [
    {
      field: 'granulometricComposition',
      headerName: t('asphalt.dosages.superpave.granulometric-composition'),
      valueFormatter: ({ value }) => `${value}`,
      width: 200,
    },
    {
      field: 'combinedGsb',
      headerName: t('asphalt.dosages.superpave.combined-gsb'),
      valueFormatter: ({ value }) => `${value}`,
      width: 200,
    },
    {
      field: 'combinedGsa',
      headerName: t('asphalt.dosages.superpave.combined-gsa'),
      valueFormatter: ({ value }) => `${value}`,
      width: 200,
    },
    {
      field: 'gse',
      headerName: t('asphalt.dosages.superpave.gse'),
      valueFormatter: ({ value }) => `${value}`,
      width: 200,
    },
  ];

  const createEstimatedPercentageCols = () => {
    const baseCols: GridColDef[] = [
      {
        field: 'granulometricComposition',
        headerName: t('asphalt.dosages.superpave.granulometric-composition'),
        valueFormatter: ({ value }) => `${value}`,
        width: 200,
      },
      {
        field: 'initialBinder',
        headerName: t('asphalt.dosages.superpave.initial-binder'),
        valueFormatter: ({ value }) => `${value}`,
        width: 200,
      },
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
    const baseChildren = [{ field: 'granulometricComposition' }, { field: 'initialBinder' }];

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
      headerName: t('asphalt.dosages.superpave.initial-n'),
      valueFormatter: ({ value }) => `${value}`,
      width: 200,
    },
    {
      field: 'projectN',
      headerName: t('asphalt.dosages.superpave.project-n'),
      valueFormatter: ({ value }) => `${value}`,
      width: 200,
    },
    {
      field: 'maxN',
      headerName: t('asphalt.dosages.superpave.max-n'),
      valueFormatter: ({ value }) => `${value}`,
      width: 200,
    },
    {
      field: 'tex',
      headerName: t('asphalt.dosages.superpave.traffic'),
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
      headerName: t('asphalt.dosages.superpave.compression-params'),
      children: [{ field: 'initialN' }, { field: 'maxN' }, { field: 'projectN' }, { field: 'tex' }],
      headerAlign: 'center',
    },
  ];

  const handleClose = (reason) => {
    if (reason !== 'backdropClick') {
      setSpecificMassModalIsOpen(false);
    }
  };

  useEffect(() => {
    if (Object.values(data.materials).every((e) => e !== null)) {
      setShouldRenderTable1(true);
    }
  }, [data.materials]);

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
          {shouldRenderTable1 && (
            <DataGrid
              hideFooter
              disableColumnMenu
              disableColumnFilter
              experimentalFeatures={{ columnGrouping: true }}
              columns={columns}
              rows={rows}
            />
          )}

          {estimatedPercentageRows.length > 0 && !Object.values(data.materials[0]).some((item) => item === null) && (
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
          )}

          <Button
            variant="outlined"
            sx={{ width: 'fit-content', marginTop: '2rem' }}
            onClick={() => setNewInitialBinderModalIsOpen(true)}
          >
            {t('asphalt.dosages.superpave.change-initial-binder')}
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
          title={t('asphalt.dosages.superpave.specific-mass-modal-title')}
          leftButtonTitle={''}
          rightButtonTitle={''}
          onCancel={() => {
            handleClose('backdropClick');
            setLoading(false);
          }}
          open={specificMassModalIsOpen}
          size={'medium'}
          onSubmit={handleModalSubmit}
          oneButton={true}
          singleButtonTitle="Confirmar"
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1rem', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: '1rem', flexDirection: 'column', marginBottom: '2rem' }}>
              {modalMaterialInputs.map((materialInputs, idx) => (
                <>
                  <Typography component={'h3'} sx={{ marginTop: '2rem' }}>
                    {data.materials[idx].name}
                  </Typography>

                  <Box key={idx} sx={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {materialInputs.map((input) => (
                      <InputEndAdornment
                        key={`${input.materialIndex}_${input.key}`}
                        adornment={input.adornment}
                        value={input.value}
                        label={input.label}
                        placeholder={input.placeHolder}
                        fullWidth
                        onChange={(e) => {
                          const materialIndex = data.materials.findIndex((i) => i.name === input.name);
                          const newData = [...data.materials];
                          newData[materialIndex][input.key] = e.target.value.replace(',', '.');

                          setData({
                            step: 3,
                            key: `materials`,
                            value: newData,
                          });
                        }}
                      />
                    ))}
                  </Box>
                </>
              ))}
            </Box>
          </Box>
        </ModalBase>
      )}

      <ModalBase
        title={t('asphalt.dosages.superpave.insert-initial-binder')}
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
          placeholder={t('asphalt.dosages.superpave.initial_binder')}
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
