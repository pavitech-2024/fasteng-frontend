import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import Loading from '@/components/molecules/loading';
import ModalBase from '@/components/molecules/modals/modal';
import { EssayPageProps } from '@/components/templates/essay';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridAlignment, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

const CURVE_KEYS = ['lower', 'average', 'higher'] as const;
type CurveKey = (typeof CURVE_KEYS)[number];

/** Rótulo persistido nas linhas da tabela. Sempre sem acento — o mismatch
 *  entre 'intermediaria' e 'intermediária' fazia os find() voltarem undefined. */
const CURVE_LABEL: Record<CurveKey, string> = {
  lower: 'inferior',
  average: 'intermediaria',
  higher: 'superior',
};

/** Rótulo exibido ao usuário (com acento). */
const CURVE_LABEL_UI: Record<CurveKey, string> = {
  lower: 'inferior',
  average: 'intermediária',
  higher: 'superior',
};

const LABEL_TO_CURVE: Record<string, CurveKey> = {
  inferior: 'lower',
  intermediaria: 'average',
  superior: 'higher',
};

const DEFAULT_BINDER_SPECIFIC_MASS = 1.03;

const isAggregate = (material) =>
  Boolean(material?.type?.includes('Aggregate')) || Boolean(material?.type?.includes('filler'));

const isBinder = (material) => material?.type === 'asphaltBinder' || material?.type === 'CAP';

const Superpave_Step5_InitialBinder = ({
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

  /**
   * Curvas realmente calculadas no step 4. Não confiar no chosenCurves salvo:
   * se ele listar uma curva sem composição, o backend estoura com
   * "Cannot read properties of undefined (reading 'percentsOfDosageWithBinder')".
   */
  const validCurves = useMemo<CurveKey[]>(
    () =>
      CURVE_KEYS.filter((curve) => {
        const composition = granulometryCompositionData?.[`${curve}Composition`];
        return Array.isArray(composition?.percentsOfMaterials) && composition.percentsOfMaterials.length > 0;
      }),
    [
      granulometryCompositionData?.lowerComposition,
      granulometryCompositionData?.averageComposition,
      granulometryCompositionData?.higherComposition,
    ]
  );

  const [specificMassModalIsOpen, setSpecificMassModalIsOpen] = useState(true);
  const [newInitialBinderModalIsOpen, setNewInitialBinderModalIsOpen] = useState(false);
  const [binderInput, setBinderInput] = useState<{ curve: CurveKey; value: number }[]>(() =>
    validCurves.map((curve) => ({ curve, value: 0 }))
  );

  const [rows, setRows] = useState([]);
  const [estimatedPercentageRows, setEstimatedPercentageRows] = useState([]);
  const [materialsReady, setMaterialsReady] = useState(false);
  const [shouldRenderTable1, setShouldRenderTable1] = useState(false);

  const areAllEstimatedPercentagesFilled = () => {
    if (estimatedPercentageRows.length === 0) return false;

    return estimatedPercentageRows.every((row) =>
      Object.entries(row).every(([key, value]) => {
        if (key === 'id' || key === 'granulometricComposition') return true;

        const numericValue = Number(value);
        return !isNaN(numericValue) && numericValue > 0;
      })
    );
  };

  useEffect(() => {
    setNextDisabled(!areAllEstimatedPercentagesFilled());
  }, [estimatedPercentageRows, setNextDisabled]);

  useEffect(() => {
    if (!newInitialBinderModalIsOpen || estimatedPercentageRows.length === 0) return;

    setBinderInput(
      validCurves.map((curve) => {
        const existingRow = estimatedPercentageRows.find(
          (row) => row.granulometricComposition === CURVE_LABEL[curve]
        );

        return {
          curve,
          value: existingRow?.initialBinder ? Number(existingRow.initialBinder) : 0,
        };
      })
    );
  }, [newInitialBinderModalIsOpen, estimatedPercentageRows, validCurves]);

  /* ------------------------- materiais (montagem) ------------------------- */

  /**
   * Monta a lista de materiais preservando _id e casando por nome — indexar por
   * posição desalinhava quando data.materials já vinha filtrado, e o ligante
   * acabava recebendo a massa de um agregado.
   */
  useEffect(() => {
    const essayMaterials = granulometryEssayData?.materials ?? [];
    if (essayMaterials.length === 0) return;

    const mergedMaterials = essayMaterials.map(({ _id, name, type }) => {
      const saved = data.materials?.find((material) => material.name === name);
      const binder = type === 'asphaltBinder' || type === 'CAP';

      return {
        _id,
        name,
        type,
        realSpecificMass: saved?.realSpecificMass ?? (binder ? DEFAULT_BINDER_SPECIFIC_MASS : null),
        apparentSpecificMass: saved?.apparentSpecificMass ?? null,
        absorption: saved?.absorption ?? null,
      };
    });

    const binderMaterial = mergedMaterials.find(isBinder);

    setData({
      step: 4,
      value: {
        ...data,
        materials: mergedMaterials,
        binderSpecificMass:
          data.binderSpecificMass ?? binderMaterial?.realSpecificMass ?? DEFAULT_BINDER_SPECIFIC_MASS,
      },
    });

    setMaterialsReady(true);
  }, []);

  /**
   * Busca as massas específicas já ensaiadas e preenche só os campos vazios —
   * nunca sobrescreve o que o usuário digitou.
   */
  useEffect(() => {
    if (!materialsReady) return;

    const needsFetch = (data.materials ?? []).some(
      (material) =>
        isAggregate(material) &&
        [material.realSpecificMass, material.apparentSpecificMass, material.absorption].some(
          (value) => value === null || value === undefined
        )
    );

    if (!needsFetch) return;

    (async () => {
      try {
        const response = await superpave.getFirstCompressionSpecificMasses(granulometryEssayData);
        const specificMasses = response?.data?.specificMasses;

        if (!response?.success || !Array.isArray(specificMasses) || specificMasses.length === 0) return;

        const fetched = specificMasses.map((item) => ({
          name: item?.generalData?.material?.name,
          realSpecificMass: item?.results?.bulk_specify_mass ?? null,
          apparentSpecificMass: item?.results?.apparent_specify_mass ?? null,
          absorption: item?.results?.absorption ?? null,
        }));

        const filledMaterials = (data.materials ?? []).map((material) => {
          const match = fetched.find((item) => item.name === material.name);
          if (!match) return material;

          return {
            ...material,
            realSpecificMass: material.realSpecificMass ?? match.realSpecificMass,
            apparentSpecificMass: material.apparentSpecificMass ?? match.apparentSpecificMass,
            absorption: material.absorption ?? match.absorption,
          };
        });

        setData({ step: 4, value: { ...data, materials: filledMaterials } });
      } catch (error) {
        console.error('[Superpave Step 5] Falha ao buscar massas específicas:', error);
        // silencia: o usuário preenche à mão no modal
      }
    })();
  }, [materialsReady]);

  useEffect(() => {
    const materials = data.materials;
    if (Array.isArray(materials) && materials.length > 0) {
      setShouldRenderTable1(true);
    }
  }, [data.materials]);

  /* ------------------------------ inputs modal ---------------------------- */

  const generateMaterialInputs = (materials) =>
    materials?.map((material, index) => [
      {
        key: 'realSpecificMass',
        label: t('asphalt.dosages.superpave.real-specific-mass'),
        placeHolder: 'Massa específica real',
        adornment: 'g/cm³',
        value: material.realSpecificMass ?? '',
        materialIndex: index + 1,
        name: material.name,
      },
      {
        key: 'apparentSpecificMass',
        label: t('asphalt.dosages.superpave.apparent-specific-mass'),
        placeHolder: 'Massa específica aparente',
        adornment: 'g/cm³',
        value: material.apparentSpecificMass ?? '',
        materialIndex: index + 1,
        name: material.name,
      },
      {
        key: 'absorption',
        label: t('asphalt.dosages.superpave.absorption'),
        placeHolder: 'Absorção',
        adornment: '%',
        value: material.absorption ?? '',
        materialIndex: index + 1,
        name: material.name,
      },
    ]);

  const aggregateMaterialsData = data.materials?.filter((material) => isAggregate(material) && !isBinder(material));
  const modalMaterialInputs = generateMaterialInputs(aggregateMaterialsData);
  const binderMaterial = data.materials?.find(isBinder);

  const updateMaterialField = (name: string, key: string, rawValue: string) => {
    const value = rawValue.replace(',', '.');
    const parsed = value === '' ? null : Number(value);

    // map + spread: mutar o objeto dentro do array não dispara re-render e
    // deixava o campo "travado" enquanto digitava.
    const newMaterials = (data.materials ?? []).map((material) =>
      material.name === name ? { ...material, [key]: parsed } : material
    );

    setData({ step: 4, key: 'materials', value: newMaterials });
  };

  /* -------------------------------- cálculo -------------------------------- */

  const recalculatePercentagesWithNewBinder = (
    percentsWithBinder: number[],
    currentBinderPercent: number,
    newBinderPercent: number
  ): number[] => {
    if (!Array.isArray(percentsWithBinder) || percentsWithBinder.length === 0) return [];

    const currentAggregatesSum = percentsWithBinder.reduce((sum, percent) => sum + (Number(percent) || 0), 0);
    if (currentAggregatesSum <= 0) return percentsWithBinder;

    const newAggregatesSum = 100 - newBinderPercent;

    return percentsWithBinder.map((percentage) =>
      Number((((Number(percentage) || 0) / currentAggregatesSum) * newAggregatesSum).toFixed(2))
    );
  };

  const buildRowsFromCompositions = (compositionList) =>
    (compositionList ?? []).map((composition, index) => {
      const curve: CurveKey = (composition?.curve as CurveKey) ?? validCurves[index] ?? CURVE_KEYS[index];

      const row: Record<string, string | number> = {
        id: index,
        granulometricComposition: CURVE_LABEL[curve] ?? CURVE_LABEL[CURVE_KEYS[index]],
        initialBinder: composition?.pli?.toFixed(2) ?? '',
      };

      (composition?.percentsOfDosageWithBinder ?? []).forEach((percent, materialIndex) => {
        row[`material_${materialIndex + 1}`] = percent?.toFixed(2) ?? '';
      });

      return row;
    });

  const validateBeforeCalculate = (): string | null => {
    if (validCurves.length === 0) {
      return 'Nenhuma curva granulométrica foi calculada. Volte ao passo anterior e calcule ao menos uma curva.';
    }

    const incomplete = (data.materials ?? [])
      .filter(isAggregate)
      .filter((material) =>
        [material.realSpecificMass, material.apparentSpecificMass, material.absorption].some(
          (value) => value === null || value === undefined || isNaN(Number(value))
        )
      );

    if (incomplete.length > 0) {
      return `Preencha todos os campos de: ${incomplete.map((material) => material.name).join(', ')}.`;
    }

    const binderMass = Number(binderMaterial?.realSpecificMass ?? data.binderSpecificMass);
    if (!binderMass || isNaN(binderMass)) {
      return 'Informe a massa específica do ligante.';
    }

    return null;
  };

  const handleSubmitSpecificMasses = () => {
    const problem = validateBeforeCalculate();
    if (problem) {
      toast.error(problem);
      return;
    }

    toast.promise(
      async () => {
        try {
          const response = await superpave.calculateStep5Data(
            generalData,
            granulometryEssayData,
            // chosenCurves saneado: só o que existe calculado chega no backend.
            { ...granulometryCompositionData, chosenCurves: validCurves },
            {
              ...data,
              binderSpecificMass: Number(binderMaterial?.realSpecificMass ?? data.binderSpecificMass),
            }
          );

          const compositionList = response?.granulometryComposition;

          if (!Array.isArray(compositionList) || compositionList.length === 0) {
            throw new Error('O cálculo não retornou composições granulométricas.');
          }

          const updatedRows = compositionList.map((composition, index) => {
            const curve: CurveKey = (composition?.curve as CurveKey) ?? validCurves[index] ?? CURVE_KEYS[index];

            return {
              id: index,
              granulometricComposition: CURVE_LABEL[curve] ?? CURVE_LABEL[CURVE_KEYS[index]],
              combinedGsb: typeof composition?.combinedGsb === 'number' ? composition.combinedGsb.toFixed(3) : '',
              combinedGsa: typeof composition?.combinedGsa === 'number' ? composition.combinedGsa.toFixed(3) : '',
              gse: typeof composition?.gse === 'number' ? composition.gse.toFixed(3) : '',
            };
          });

          setRows(updatedRows);

          setData({
            step: 4,
            value: {
              ...data,
              granulometryComposition: compositionList,
              turnNumber: response?.turnNumber,
            },
          });

          setEstimatedPercentageRows(buildRowsFromCompositions(compositionList));
          setLoading(false);
          setSpecificMassModalIsOpen(false);
          setNewInitialBinderModalIsOpen(false);
        } catch (error) {
          console.error('[Superpave Step 5] Falha ao calcular:', error, {
            chosenCurves: validCurves,
            materials: data.materials,
            binderSpecificMass: data.binderSpecificMass,
          });
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

  const handleInitialBinderSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const compositionList = data.granulometryComposition;
    if (!Array.isArray(compositionList) || compositionList.length === 0) {
      toast.error('Calcule as composições antes de alterar o teor de ligante.');
      return;
    }

    const updatedGranulometryComposition = compositionList.map((composition, index) => {
      const curve: CurveKey = (composition?.curve as CurveKey) ?? validCurves[index] ?? CURVE_KEYS[index];
      const newBinderValue = binderInput.find((item) => item.curve === curve)?.value;

      if (newBinderValue === undefined || newBinderValue === null || isNaN(newBinderValue)) return composition;

      return {
        ...composition,
        curve,
        pli: newBinderValue,
        percentsOfDosageWithBinder: recalculatePercentagesWithNewBinder(
          composition?.percentsOfDosageWithBinder,
          composition?.pli,
          newBinderValue
        ),
      };
    });

    setData({ step: 4, key: 'granulometryComposition', value: updatedGranulometryComposition });
    setEstimatedPercentageRows(buildRowsFromCompositions(updatedGranulometryComposition));
    setNewInitialBinderModalIsOpen(false);
  };

  /* -------------------------------- colunas -------------------------------- */

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

  const essayAggregateMaterials = granulometryEssayData?.materials?.filter(isAggregate) ?? [];

  const estimatedPercentageCols: GridColDef[] = [
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
    ...essayAggregateMaterials.map((material, index) => ({
      field: `material_${index + 1}`,
      headerName: material.name,
      valueFormatter: ({ value }) => `${value}`,
      width: 100,
    })),
  ];

  const estimatedPercentageGroupings: GridColumnGroupingModel =
    essayAggregateMaterials.length > 0
      ? [
          {
            groupId: 'estimatedPercentage',
            headerName: t('asphalt.dosages.superpave.materials-estimated-percentage'),
            children: [
              { field: 'granulometricComposition' },
              { field: 'initialBinder' },
              ...essayAggregateMaterials.map((_, index) => ({ field: `material_${index + 1}` })),
            ],
            headerAlign: 'center' as GridAlignment,
          },
        ]
      : [];

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
      initialN: data.turnNumber?.initialN ?? '',
      maxN: data.turnNumber?.maxN ?? '',
      projectN: data.turnNumber?.projectN ?? '',
      tex: data.turnNumber?.tex ? data.turnNumber.tex : generalData?.trafficVolume,
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
          {shouldRenderTable1 && rows.length > 0 && (
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

          {estimatedPercentageRows.length > 0 && (
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
            disabled={estimatedPercentageRows.length === 0}
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
              {modalMaterialInputs?.map((materialInputs, idx) => (
                <Box key={aggregateMaterialsData?.[idx]?.name ?? idx}>
                  <Typography component={'h3'} sx={{ marginTop: '2rem' }}>
                    {aggregateMaterialsData?.[idx]?.name}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {materialInputs?.map((input) => (
                      <InputEndAdornment
                        key={`${input.name}_${input.key}`}
                        adornment={input.adornment}
                        type="number"
                        value={input.value}
                        label={input.label}
                        placeholder={input.placeHolder}
                        fullWidth
                        onChange={(e) => updateMaterialField(input.name, input.key, e.target.value)}
                      />
                    ))}
                  </Box>
                </Box>
              ))}

              <Box>
                <Typography component={'h3'} sx={{ marginTop: '2rem' }}>
                  {binderMaterial?.name}
                </Typography>
                <InputEndAdornment
                  type="number"
                  adornment="g/cm³"
                  value={binderMaterial?.realSpecificMass ?? DEFAULT_BINDER_SPECIFIC_MASS}
                  label="Massa específica do ligante"
                  placeholder="Insira a massa específica do ligante"
                  fullWidth
                  onChange={(e) => {
                    const value = e.target.value.replace(',', '.');
                    const parsed = value === '' ? null : Number(value);

                    const newMaterials = (data.materials ?? []).map((material) =>
                      isBinder(material) ? { ...material, realSpecificMass: parsed } : material
                    );

                    setData({
                      step: 4,
                      value: { ...data, materials: newMaterials, binderSpecificMass: parsed },
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
        onCancel={() => setNewInitialBinderModalIsOpen(false)}
        open={newInitialBinderModalIsOpen}
        size={'small'}
        onSubmit={handleInitialBinderSubmit}
        oneButton={false}
      >
        <Box style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {validCurves.map((curve) => (
            <Box key={curve}>
              <Typography>{`Curva ${CURVE_LABEL_UI[curve]}`}</Typography>
              <InputEndAdornment
                adornment="%"
                value={binderInput?.find((item) => item.curve === curve)?.value ?? ''}
                placeholder={t('asphalt.dosages.superpave.initial_binder')}
                type="number"
                fullWidth
                onChange={(e) => {
                  const parsed = Number(e.target.value.replace(',', '.'));
                  setBinderInput((prev) =>
                    prev.map((item) => (item.curve === curve ? { ...item, value: parsed } : item))
                  );
                }}
              />
            </Box>
          ))}
        </Box>
      </ModalBase>
    </>
  );
};

export default Superpave_Step5_InitialBinder;