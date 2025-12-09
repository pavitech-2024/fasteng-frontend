import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import Loading from '@/components/molecules/loading';
import ModalBase from '@/components/molecules/modals/modal';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridAlignment, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Superpave_Step5_InitialBinder = ({
  nextDisabled,
  setNextDisabled,
  superpave,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const {
    granulometryEssayData,
    initialBinderData: data,
    granulometryCompositionData,
    generalData,
    setData,
  } = useSuperpaveStore();

  const [specificMassModalIsOpen, setSpecificMassModalIsOpen] = useState(true);
  const [newInitialBinderModalIsOpen, setNewInitialBinderModalIsOpen] = useState(false);
  const [binderInput, setBinderInput] = useState(
    granulometryCompositionData.chosenCurves.map((curve) => ({
      curve,
      value: 0,
    }))
  );

  const [rows, setRows] = useState([]);
  const [estimatedPercentageRows, setEstimatedPercentageRows] = useState([]);
  const compositions = ['inferior', 'intermediaria', 'superior'];
  const [activateSecondFetch, setActivateSecondFetch] = useState(false);
  const [shouldRenderTable1, setShouldRenderTable1] = useState(false);

  const areAllEstimatedPercentagesFilled = () => {
    if (estimatedPercentageRows.length === 0) return false;

    return estimatedPercentageRows.every((row) => {
      return Object.entries(row).every(([key, value]) => {
        if (key === 'id' || key === 'granulometricComposition') return true;

        const numericValue = Number(value);
        return !isNaN(numericValue) && numericValue > 0;
      });
    });
  };

  useEffect(() => {
    const isReady = areAllEstimatedPercentagesFilled();
    console.log('EstimatedPercentageRows:', estimatedPercentageRows);
    console.log('Is ready?', isReady);
    setNextDisabled(!isReady);
  }, [estimatedPercentageRows, setNextDisabled]);

  useEffect(() => {
    if (newInitialBinderModalIsOpen && estimatedPercentageRows.length > 0) {
      const initialValues = granulometryCompositionData.chosenCurves.map((curve) => {
        const curveName = curve === 'lower' ? 'inferior' : curve === 'average' ? 'intermediaria' : 'superior';
        const existingRow = estimatedPercentageRows.find((row) => row.granulometricComposition === curveName);

        return {
          curve,
          value: existingRow?.initialBinder ? Number(existingRow.initialBinder) : 0,
        };
      });

      setBinderInput(initialValues);
    }
  }, [newInitialBinderModalIsOpen, estimatedPercentageRows, granulometryCompositionData.chosenCurves]);

  useEffect(() => {
    if (!activateSecondFetch) {
      toast.promise(
        async () => {
          try {
            const aggregateMaterials = granulometryEssayData.materials.map(({ _id, name, type }, index) => ({
              name,
              type,
              realSpecificMass: data.materials[index]?.realSpecificMass ?? null,
              apparentSpecificMass: data.materials[index]?.apparentSpecificMass ?? null,
              absorption: data.materials[index]?.absorption ?? null,
            }));

            setData({
              step: 4,
              value: {
                ...data,
                materials: aggregateMaterials,
              },
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
    if (hasSomeNullValue) {
      toast.promise(
        async () => {
          try {
            const newMaterials = [];
            const { data: resData, success } = await superpave.getFirstCompressionSpecificMasses(granulometryEssayData);

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
                step: 4,
                value: prevData,
              });
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
                step: 4,
                value: prevData,
              });
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
  }, [rows]);

  const generateMaterialInputs = (materials) => {
    return materials?.map((material, index) => {
      // Para agregados, manter os 3 campos, so o lignt q n tem
      if (material?.type?.includes('Aggregate') || material?.type?.includes('filler')) {
        return [
          {
            key: 'realSpecificMass',
            label: t('asphalt.dosages.superpave.real-specific-mass'),
            placeHolder: 'Massa específica real',
            adornment: 'g/cm³',
            value: material.realSpecificMass,
            materialIndex: index + 1,
            name: material.name,
          },
          {
            key: 'apparentSpecificMass',
            label: t('asphalt.dosages.superpave.apparent-specific-mass'),
            placeHolder: 'Massa específica aparente',
            adornment: 'g/cm³',
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
        ];
      }
      return [];
    });
  };

  const modalMaterialInputs = generateMaterialInputs(
    data.materials?.filter(
      (material) =>
        (material?.type?.includes('Aggregate') || material?.type?.includes('filler')) &&
        // FILTRAR p fora so o ligant 
        !material?.type?.includes('asphaltBinder') &&
        !material?.type?.includes('CAP')
    )
  );

  const handleSubmitSpecificMasses = () => {
    toast.promise(
      async () => {
        try {
          const response = await superpave.calculateStep5Data(
            generalData,
            granulometryEssayData,
            granulometryCompositionData,
            data
          );

          const updatedRows = response.granulometryComposition.map((composition, index) => ({
            id: index,
            granulometricComposition: compositions[index],
            combinedGsb: composition.combinedGsb ? composition.combinedGsb.toFixed(2) : '',
            combinedGsa: composition.combinedGsa ? composition.combinedGsa.toFixed(2) : '',
            gse: composition.gse || composition.gse === 0 ? composition.gse.toFixed(2) : '',
          }));

          setRows(updatedRows);

          const updatedData = {
            ...data,
            granulometryComposition: response.granulometryComposition,
            turnNumber: response.turnNumber,
          };

          setData({ step: 4, value: updatedData });

          const updatedPercentageRows = response.granulometryComposition.map((composition, index) => {
            const row: Record<string, string | number> = {
              id: index,
              granulometricComposition: compositions[index],
              initialBinder: '',
            };

            composition.percentsOfDosageWithBinder.forEach((percent, materialIndex) => {
              row[`material_${materialIndex + 1}`] = percent?.toFixed(2);
            });

            return row;
          });

          setEstimatedPercentageRows(updatedPercentageRows);
          setLoading(false);
          setSpecificMassModalIsOpen(false);
          setNewInitialBinderModalIsOpen(false);
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

  const createEstimatedPercentageColumns = (): GridColDef[] => {
    const baseColumns: GridColDef[] = [
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

    const aggregateMaterials = granulometryEssayData.materials?.filter(
      ({ type }) => type.includes('Aggregate') || type.includes('filler')
    );

    const materialColumns = aggregateMaterials?.map((material, index) => ({
      field: `material_${index + 1}`,
      headerName: material.name,
      valueFormatter: ({ value }) => `${value}`,
      width: 100,
    }));

    return materialColumns ? [...baseColumns, ...materialColumns] : [];
  };

  const estimatedPercentageCols = createEstimatedPercentageColumns();

  const createEstimatedPercentageGroupingModel = (): GridColumnGroupingModel => {
    const baseColumnChildren = [{ field: 'granulometricComposition' }, { field: 'initialBinder' }];

    const aggregateMaterials = granulometryEssayData.materials?.filter(({ type }) =>
      ['Aggregate', 'Filler'].some((materialType) => type.includes(materialType))
    );

    const materialColumnChildren = aggregateMaterials?.map((_, index) => ({
      field: `material_${index + 1}`,
    }));

    if (Array.isArray(materialColumnChildren) && materialColumnChildren.length > 0) {
      return [
        {
          groupId: 'estimatedPercentage',
          headerName: t('asphalt.dosages.superpave.materials-estimated-percentage'),
          children: [...baseColumnChildren, ...materialColumnChildren],
          headerAlign: 'center' as GridAlignment,
        },
      ];
    } else {
      return [];
    }
  };

  const estimatedPercentageGroupings = createEstimatedPercentageGroupingModel();

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
      initialN: data.turnNumber?.initialN ? data.turnNumber.initialN : '',
      maxN: data.turnNumber?.maxN,
      projectN: data.turnNumber?.projectN,
      tex: data.turnNumber?.tex !== '' ? data.turnNumber?.tex : generalData.trafficVolume,
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
    if (data.materials && Object.values(data.materials).every((e) => e !== null)) {
      setShouldRenderTable1(true);
    }
  }, [data.materials]);

  const updateRowsWithInitialBinderValues = (initialBinderValues: { curve: string; value: number }[]) => {
    console.log('Updating rows with:', initialBinderValues);

    const newRowData = estimatedPercentageRows.map((row) => {
      const curveName =
        row.granulometricComposition === 'inferior'
          ? 'lower'
          : row.granulometricComposition === 'intermediaria'
          ? 'average'
          : 'higher';
      const initialBinderValue = initialBinderValues.find((obj) => obj.curve === curveName)?.value ?? 0;

      return {
        ...row,
        initialBinder: initialBinderValue.toFixed(2),
      };
    });

    console.log('New row data:', newRowData);
    setEstimatedPercentageRows(newRowData);

    setData({
      step: 4,
      key: 'granulometryComposition',
      value: data.granulometryComposition.map((row) => ({
        ...row,
        pli: initialBinderValues.find((obj) => obj.curve === row.curve)?.value,
      })),
    });
  };

  const handleInitialBinderSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const hasEmptyValue = binderInput.some((item) => !item.value || item.value <= 0);
    if (hasEmptyValue) {
      toast.error('Por favor, preencha todos os valores iniciais de ligante com valores maiores que 0.');
      return;
    }
    updateRowsWithInitialBinderValues(binderInput);
    setNewInitialBinderModalIsOpen(false);
  };

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
              columns={columns.map((col) => ({ ...col, flex: 1, headerAlign: 'center', align: 'center' }))}
              rows={rows}
              sx={{ width: '100%' }}
            />
          )}

          {estimatedPercentageRows.length > 0 && !Object.values(data.materials[0]).some((item) => item === null) && (
            <DataGrid
              hideFooter
              disableColumnMenu
              disableColumnFilter
              experimentalFeatures={{ columnGrouping: true }}
              columnGroupingModel={estimatedPercentageGroupings}
              columns={estimatedPercentageCols.map((col) => ({
                ...col,
                flex: 1,
                headerAlign: 'center',
                align: 'center',
              }))}
              rows={estimatedPercentageRows}
              sx={{ marginTop: '2rem', width: '100%' }}
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
            columns={compressionParamsCols.map((col) => ({ ...col, flex: 1, headerAlign: 'center', align: 'center' }))}
            rows={compressionParamsRows}
            sx={{ marginTop: '2rem', width: '100%' }}
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
          onSubmit={handleSubmitSpecificMasses}
          oneButton={true}
          singleButtonTitle="Confirmar"
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1rem', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: '1rem', flexDirection: 'column', marginBottom: '2rem' }}>
              {/* AGREGADOS - 3 CAMPOS CADA */}
              {modalMaterialInputs?.map((materialInputs, idx) => {
               
                const aggregateMaterials = data.materials?.filter(
                  (material) => material?.type?.includes('Aggregate') || material?.type?.includes('filler')
                );

                return (
                  <>
                    <Typography component={'h3'} sx={{ marginTop: '2rem' }}>
                      {aggregateMaterials[idx]?.name} {/* PEGAR APENAS DOS AGREGADOS */}
                    </Typography>

                    <Box key={idx} sx={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      {materialInputs?.map((input) => (
                        <InputEndAdornment
                          key={`${input.materialIndex}_${input.key}`}
                          adornment={input.adornment}
                          type="number"
                          value={input.value}
                          label={input.label}
                          placeholder={input.placeHolder}
                          fullWidth
                          onChange={(e) => {
                            const materialIndex = data.materials.findIndex((i) => i.name === input.name);
                            const newData = [...data.materials];
                            newData[materialIndex][input.key] = e.target.value.replace(',', '.');

                            setData({
                              step: 4,
                              key: `materials`,
                              value: newData,
                            });
                          }}
                        />
                      ))}
                    </Box>
                  </>
                );
              })}

              {/* LIGANTE - APENAS 1 CAMPO */}
              <Box>
                <Typography component={'h3'} sx={{ marginTop: '2rem' }}>
                  {
                    data.materials?.find((material) => material.type === 'asphaltBinder' || material.type === 'CAP')
                      ?.name
                  }
                </Typography>
                <InputEndAdornment
                  type="number"
                  adornment="g/cm³"
                  value={
                    data.materials?.find((material) => material.type === 'asphaltBinder' || material.type === 'CAP')
                      ?.realSpecificMass !== 0 ||
                    data.materials?.find((material) => material.type === 'asphaltBinder' || material.type === 'CAP')
                      ?.realSpecificMass !== null
                      ? data.materials?.find((material) => material.type === 'asphaltBinder' || material.type === 'CAP')
                          ?.realSpecificMass
                      : '1,03'
                  }
                  label="Massa especifica do ligante"
                  placeholder="Insira a massa específica do ligante"
                  fullWidth
                  onChange={(e) => {
                    const materialIndex = data.materials?.findIndex(
                      (i) => i.type === 'asphaltBinder' || i.type === 'CAP'
                    );
                    const newData = { ...data };
                    newData.materials[materialIndex].realSpecificMass = parseFloat(e.target.value.replace(',', '.'));
                    newData.binderSpecificMass = parseFloat(e.target.value.replace(',', '.'));
                    setData({
                      step: 4,
                      value: newData,
                    });
                  }}
                />
              </Box>
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
        size={'small'}
        onSubmit={handleInitialBinderSubmit}
        oneButton={false}
      >
        <Box style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {granulometryCompositionData.chosenCurves.map((curve, idx) => {
            const curveName = curve === 'lower' ? 'inferior' : curve === 'average' ? 'intermediária' : 'superior';
            return (
              <Box key={idx}>
                <Typography>{'Curva' + ' ' + curveName}</Typography>
                <InputEndAdornment
                  adornment="%"
                  value={binderInput?.find((obj) => obj.curve === curve)?.value || ''}
                  placeholder={t('asphalt.dosages.superpave.initial_binder')}
                  type="number"
                  fullWidth
                  onChange={(e) => {
                    const prevData = [...binderInput];
                    const index = prevData.findIndex((obj) => obj.curve === curve);
                    if (index !== -1) {
                      prevData[index].value = Number(e.target.value.replace(',', '.'));
                      setBinderInput(prevData);
                    }
                  }}
                />
              </Box>
            );
          })}
        </Box>
      </ModalBase>
    </>
  );
};

export default Superpave_Step5_InitialBinder;
