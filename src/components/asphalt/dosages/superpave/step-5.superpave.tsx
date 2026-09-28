import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import ModalBase from '@/components/molecules/modals/modal';
import { EssayPageProps } from '@/components/templates/essay';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Alert, Box, Button, Divider, FormControlLabel, Paper, Radio, RadioGroup, Typography } from '@mui/material';
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

const DEFAULT_BINDER_SPECIFIC_MASS = 1.03;

/** Nenhuma célula mostra "undefined": ou tem valor, ou diz o que falta fazer. */
const PENDING_INPUT = 'Preencher';
const PENDING_CALC = 'Calcular';

const showValue = (value: unknown, pending = PENDING_CALC) => {
  if (value === null || value === undefined || value === '') return pending;
  if (typeof value === 'number' && Number.isNaN(value)) return pending;
  return `${value}`;
};

type BinderMode = 'auto' | 'manual';

const isAggregate = (material) =>
  Boolean(material?.type?.includes('Aggregate')) || Boolean(material?.type?.includes('filler'));

const isBinder = (material) => material?.type === 'asphaltBinder' || material?.type === 'CAP';

const Superpave_Step5_InitialBinder = ({
  setNextDisabled,
  superpave,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
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

  /* --------------------------------- estado -------------------------------- */

  const hasResults = Array.isArray(data.granulometryComposition) && data.granulometryComposition.length > 0;

  const [binderChoiceModalIsOpen, setBinderChoiceModalIsOpen] = useState(false);
  const [specificMassModalIsOpen, setSpecificMassModalIsOpen] = useState(false);
  const [newInitialBinderModalIsOpen, setNewInitialBinderModalIsOpen] = useState(false);

  const [binderMode, setBinderMode] = useState<BinderMode>('auto');
  const [binderInput, setBinderInput] = useState<{ curve: CurveKey; value: number | null }[]>(() =>
    validCurves.map((curve) => ({ curve, value: null }))
  );

  const [rows, setRows] = useState([]);
  const [estimatedPercentageRows, setEstimatedPercentageRows] = useState([]);
  const [materialsReady, setMaterialsReady] = useState(false);

  // Mantém os slots de binderInput alinhados às curvas válidas.
  useEffect(() => {
    setBinderInput((prev) =>
      validCurves.map((curve) => prev.find((item) => item.curve === curve) ?? { curve, value: null })
    );
  }, [validCurves]);

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

  // Ao abrir o modal de teor, parte dos valores que já estão na tabela.
  useEffect(() => {
    if (!newInitialBinderModalIsOpen) return;

    setBinderInput(
      validCurves.map((curve) => {
        const existingRow = estimatedPercentageRows.find((row) => row.granulometricComposition === CURVE_LABEL[curve]);
        const current = Number(existingRow?.initialBinder);

        return { curve, value: Number.isFinite(current) ? current : null };
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
        binderSpecificMass: data.binderSpecificMass ?? binderMaterial?.realSpecificMass ?? DEFAULT_BINDER_SPECIFIC_MASS,
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

  /* ------------------------------ inputs modal ---------------------------- */

  const generateMaterialInputs = (materials) =>
    materials?.map((material, index) => [
      {
        key: 'realSpecificMass',
        label: t('asphalt.dosages.superpave.real-specific-mass'),
        placeHolder: 'Insira a massa específica real',
        adornment: 'g/cm³',
        value: material.realSpecificMass ?? '',
        materialIndex: index + 1,
        name: material.name,
      },
      {
        key: 'apparentSpecificMass',
        label: t('asphalt.dosages.superpave.apparent-specific-mass'),
        placeHolder: 'Insira a massa específica aparente',
        adornment: 'g/cm³',
        value: material.apparentSpecificMass ?? '',
        materialIndex: index + 1,
        name: material.name,
      },
      {
        key: 'absorption',
        label: t('asphalt.dosages.superpave.absorption'),
        placeHolder: 'Insira a absorção',
        adornment: '%',
        value: material.absorption ?? '',
        materialIndex: index + 1,
        name: material.name,
      },
    ]);

  const aggregateMaterialsData = data.materials?.filter((material) => isAggregate(material) && !isBinder(material));
  const modalMaterialInputs = generateMaterialInputs(aggregateMaterialsData);
  const binderMaterial = data.materials?.find(isBinder);

  const missingSpecificMasses = (data.materials ?? [])
    .filter(isAggregate)
    .filter((material) =>
      [material.realSpecificMass, material.apparentSpecificMass, material.absorption].some(
        (value) => value === null || value === undefined || isNaN(Number(value))
      )
    );

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

  const recalculatePercentagesWithNewBinder = (percentsWithBinder: number[], newBinderPercent: number): number[] => {
    if (!Array.isArray(percentsWithBinder) || percentsWithBinder.length === 0) return [];

    const currentAggregatesSum = percentsWithBinder.reduce((sum, percent) => sum + (Number(percent) || 0), 0);
    if (currentAggregatesSum <= 0) return percentsWithBinder;

    const newAggregatesSum = 100 - newBinderPercent;

    return percentsWithBinder.map((percentage) =>
      Number((((Number(percentage) || 0) / currentAggregatesSum) * newAggregatesSum).toFixed(2))
    );
  };

  const curveOf = (composition, index: number): CurveKey =>
    (composition?.curve as CurveKey) ?? validCurves[index] ?? CURVE_KEYS[index];

  /** Aplica os teores informados pelo usuário sobre o que o backend calculou. */
  const applyManualBinder = (compositionList, values: { curve: CurveKey; value: number | null }[]) =>
    (compositionList ?? []).map((composition, index) => {
      const curve = curveOf(composition, index);
      const newBinderValue = values.find((item) => item.curve === curve)?.value;

      if (newBinderValue === null || newBinderValue === undefined || isNaN(newBinderValue)) return composition;

      return {
        ...composition,
        curve,
        pli: newBinderValue,
        percentsOfDosageWithBinder: recalculatePercentagesWithNewBinder(
          composition?.percentsOfDosageWithBinder,
          newBinderValue
        ),
      };
    });

  const buildSummaryRows = (compositionList) => {
    if (!Array.isArray(compositionList) || compositionList.length === 0) {
      // Linhas-fantasma: a tabela aparece com as curvas e o que falta fazer,
      // em vez de sumir da tela até existir cálculo.
      return validCurves.map((curve, index) => ({
        id: index,
        granulometricComposition: CURVE_LABEL[curve],
        combinedGsb: null,
        combinedGsa: null,
        gse: null,
      }));
    }

    return compositionList.map((composition, index) => {
      const curve = curveOf(composition, index);

      return {
        id: index,
        granulometricComposition: CURVE_LABEL[curve] ?? CURVE_LABEL[CURVE_KEYS[index]],
        combinedGsb: typeof composition?.combinedGsb === 'number' ? composition.combinedGsb.toFixed(3) : null,
        combinedGsa: typeof composition?.combinedGsa === 'number' ? composition.combinedGsa.toFixed(3) : null,
        gse: typeof composition?.gse === 'number' ? composition.gse.toFixed(3) : null,
      };
    });
  };

  const buildRowsFromCompositions = (compositionList) => {
    if (!Array.isArray(compositionList) || compositionList.length === 0) {
      return validCurves.map((curve, index) => ({
        id: index,
        granulometricComposition: CURVE_LABEL[curve],
        initialBinder: null,
      }));
    }

    return compositionList.map((composition, index) => {
      const curve = curveOf(composition, index);

      const row: Record<string, string | number | null> = {
        id: index,
        granulometricComposition: CURVE_LABEL[curve] ?? CURVE_LABEL[CURVE_KEYS[index]],
        initialBinder: typeof composition?.pli === 'number' ? composition.pli.toFixed(2) : null,
      };

      (composition?.percentsOfDosageWithBinder ?? []).forEach((percent, materialIndex) => {
        row[`material_${materialIndex + 1}`] = typeof percent === 'number' ? percent.toFixed(2) : null;
      });

      return row;
    });
  };

  // Restaura as tabelas ao voltar para o step com cálculo já salvo, e monta as
  // linhas-fantasma quando ainda não há nada calculado.
  useEffect(() => {
    setRows(buildSummaryRows(data.granulometryComposition));
    setEstimatedPercentageRows(buildRowsFromCompositions(data.granulometryComposition));
  }, [data.granulometryComposition, validCurves]);

  const validateManualBinder = (): string | null => {
    const problems = binderInput.filter(
      (item) =>
        item.value === null || item.value === undefined || isNaN(item.value) || item.value <= 0 || item.value >= 100
    );

    if (problems.length > 0) {
      return `Informe um teor entre 0 e 100 para a curva ${problems
        .map((item) => CURVE_LABEL_UI[item.curve])
        .join(', ')}.`;
    }

    return null;
  };

  const validateBeforeCalculate = (): string | null => {
    if (validCurves.length === 0) {
      return 'Nenhuma curva granulométrica foi calculada. Volte ao passo anterior e calcule ao menos uma curva.';
    }

    if (missingSpecificMasses.length > 0) {
      return `Preencha todos os campos de: ${missingSpecificMasses.map((material) => material.name).join(', ')}.`;
    }

    const binderMass = Number(binderMaterial?.realSpecificMass ?? data.binderSpecificMass);
    if (!binderMass || isNaN(binderMass)) {
      return 'Informe a massa específica do ligante.';
    }

    return null;
  };

  /**
   * Chamada única ao backend. Usada tanto no fluxo inicial quanto no modal de
   * teor quando o usuário pede para estimar de novo.
   */
  const runCalculation = async (mode: BinderMode, values: { curve: CurveKey; value: number | null }[]) => {
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

    const calculated = response?.granulometryComposition;

    if (!Array.isArray(calculated) || calculated.length === 0) {
      throw new Error('O cálculo não retornou composições granulométricas.');
    }

    // O backend sempre estima o teor; se o usuário escolheu informar,
    // sobrescrevemos aqui e redistribuímos as porcentagens.
    const compositionList = mode === 'manual' ? applyManualBinder(calculated, values) : calculated;

    setData({
      step: 4,
      value: {
        ...data,
        granulometryComposition: compositionList,
        turnNumber: response?.turnNumber,
      },
    });

    return compositionList;
  };

  const handleBinderChoiceSubmit = (e?: any) => {
    e?.preventDefault?.();

    if (validCurves.length === 0) {
      toast.error('Nenhuma curva granulométrica foi calculada. Volte ao passo anterior e calcule ao menos uma curva.');
      return;
    }

    if (binderMode === 'manual') {
      const problem = validateManualBinder();
      if (problem) {
        toast.error(problem);
        return;
      }
    }

    setBinderChoiceModalIsOpen(false);
    setSpecificMassModalIsOpen(true);
  };

  const handleSubmitSpecificMasses = (e?: any) => {
    e?.preventDefault?.();

    const problem = validateBeforeCalculate();
    if (problem) {
      toast.error(problem);
      return;
    }

    toast.promise(
      async () => {
        try {
          await runCalculation(binderMode, binderInput);
          setSpecificMassModalIsOpen(false);
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

  /** Modal de teor: aplica valores informados OU manda estimar de novo. */
  const handleInitialBinderSubmit = (e?: any) => {
    e?.preventDefault?.();

    if (binderMode === 'auto') {
      const problem = validateBeforeCalculate();
      if (problem) {
        toast.error(problem);
        return;
      }

      toast.promise(
        async () => {
          await runCalculation('auto', binderInput);
          setNewInitialBinderModalIsOpen(false);
        },
        {
          pending: t('loading.materials.pending'),
          success: t('loading.materials.success'),
          error: t('loading.materials.error'),
        }
      );
      return;
    }

    const compositionList = data.granulometryComposition;
    if (!Array.isArray(compositionList) || compositionList.length === 0) {
      toast.error('Calcule as composições antes de informar o teor manualmente.');
      return;
    }

    const problem = validateManualBinder();
    if (problem) {
      toast.error(problem);
      return;
    }

    const updated = applyManualBinder(compositionList, binderInput);
    setData({ step: 4, key: 'granulometryComposition', value: updated });
    setNewInitialBinderModalIsOpen(false);
  };

  /* -------------------------------- colunas -------------------------------- */

  const columns: GridColDef[] = [
    {
      field: 'granulometricComposition',
      headerName: t('asphalt.dosages.superpave.granulometric-composition'),
      valueFormatter: ({ value }) => showValue(value, '—'),
      width: 200,
    },
    {
      field: 'combinedGsb',
      headerName: t('asphalt.dosages.superpave.combined-gsb'),
      valueFormatter: ({ value }) => showValue(value),
      width: 200,
    },
    {
      field: 'combinedGsa',
      headerName: t('asphalt.dosages.superpave.combined-gsa'),
      valueFormatter: ({ value }) => showValue(value),
      width: 200,
    },
    {
      field: 'gse',
      headerName: t('asphalt.dosages.superpave.gse'),
      valueFormatter: ({ value }) => showValue(value),
      width: 200,
    },
  ];

  const essayAggregateMaterials = granulometryEssayData?.materials?.filter(isAggregate) ?? [];

  const estimatedPercentageCols: GridColDef[] = [
    {
      field: 'granulometricComposition',
      headerName: t('asphalt.dosages.superpave.granulometric-composition'),
      valueFormatter: ({ value }) => showValue(value, '—'),
      width: 200,
    },
    {
      field: 'initialBinder',
      headerName: t('asphalt.dosages.superpave.initial-binder'),
      valueFormatter: ({ value }) => showValue(value),
      width: 200,
    },
    ...essayAggregateMaterials.map((material, index) => ({
      field: `material_${index + 1}`,
      headerName: material.name,
      valueFormatter: ({ value }) => showValue(value),
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
      valueFormatter: ({ value }) => showValue(value),
      width: 200,
    },
    {
      field: 'projectN',
      headerName: t('asphalt.dosages.superpave.project-n'),
      valueFormatter: ({ value }) => showValue(value),
      width: 200,
    },
    {
      field: 'maxN',
      headerName: t('asphalt.dosages.superpave.max-n'),
      valueFormatter: ({ value }) => showValue(value),
      width: 200,
    },
    {
      field: 'tex',
      headerName: t('asphalt.dosages.superpave.traffic'),
      valueFormatter: ({ value }) => showValue(value, '—'),
      width: 200,
    },
  ];

  const compressionParamsRows = [
    {
      id: 0,
      initialN: data.turnNumber?.initialN ?? null,
      maxN: data.turnNumber?.maxN ?? null,
      projectN: data.turnNumber?.projectN ?? null,
      tex: data.turnNumber?.tex ?? generalData?.trafficVolume ?? null,
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

  const estimatedBinderOf = (curve: CurveKey) => {
    const composition = (data.granulometryComposition ?? []).find(
      (item, index) => curveOf(item, index) === curve
    );
    return typeof composition?.pli === 'number' ? composition.pli.toFixed(2) : null;
  };

  /* -------------------------------- render --------------------------------- */

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
        {validCurves.length === 0 && (
          <Alert severity="warning">
            Nenhuma curva granulométrica foi calculada. Volte ao passo de composição granulométrica e calcule ao menos
            uma curva antes de seguir.
          </Alert>
        )}

        {validCurves.length > 0 && !hasResults && (
          <Paper variant="outlined" sx={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Typography variant="h6">Teor de ligante inicial</Typography>
            <Typography variant="body2">
              As tabelas abaixo ficam com os campos marcados como &quot;{PENDING_CALC}&quot; até que as massas
              específicas sejam informadas e o cálculo rode.
            </Typography>

            {missingSpecificMasses.length > 0 && (
              <Alert severity="info">
                Faltam massas específicas de: {missingSpecificMasses.map((material) => material.name).join(', ')}.
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Button variant="contained" onClick={() => setBinderChoiceModalIsOpen(true)}>
                Definir teor de ligante
              </Button>
              <Button variant="outlined" onClick={() => setSpecificMassModalIsOpen(true)}>
                Informar massas específicas
              </Button>
            </Box>
          </Paper>
        )}

        {rows.length > 0 && (
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
            sx={{ width: '100%' }}
          />
        )}

        <Box sx={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="outlined" onClick={() => setNewInitialBinderModalIsOpen(true)}>
            {t('asphalt.dosages.superpave.change-initial-binder')}
          </Button>
          <Button variant="outlined" onClick={() => setSpecificMassModalIsOpen(true)}>
            {hasResults ? 'Revisar massas específicas' : 'Informar massas específicas'}
          </Button>
        </Box>

        <DataGrid
          hideFooter
          disableColumnMenu
          disableColumnFilter
          experimentalFeatures={{ columnGrouping: true }}
          columnGroupingModel={compressionParamsGroupings}
          columns={compressionParamsCols.map((col) => ({
            ...col,
            flex: 1,
            headerAlign: 'center',
            align: 'center',
          }))}
          rows={compressionParamsRows}
          sx={{ width: '100%' }}
        />
      </Box>

      {/* ------------------- 1) escolha do teor de ligante ------------------- */}
      <ModalBase
        title="Teor de ligante inicial"
        leftButtonTitle={'Cancelar'}
        rightButtonTitle={'Continuar'}
        onCancel={() => setBinderChoiceModalIsOpen(false)}
        open={binderChoiceModalIsOpen}
        size={'small'}
        onSubmit={handleBinderChoiceSubmit}
        oneButton={false}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Typography variant="body2">Como o teor de ligante inicial de cada curva deve ser definido?</Typography>

          <RadioGroup value={binderMode} onChange={(e) => setBinderMode(e.target.value as BinderMode)}>
            <FormControlLabel value="auto" control={<Radio />} label="Estimar pelo método Superpave (recomendado)" />
            <FormControlLabel value="manual" control={<Radio />} label="Informar o teor manualmente" />
          </RadioGroup>

          {binderMode === 'manual' && (
            <>
              <Divider />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {validCurves.map((curve) => (
                  <Box key={curve}>
                    <Typography variant="body2">{`Curva ${CURVE_LABEL_UI[curve]}`}</Typography>
                    <InputEndAdornment
                      adornment="%"
                      type="number"
                      fullWidth
                      value={binderInput.find((item) => item.curve === curve)?.value ?? ''}
                      placeholder="Insira o teor, ex.: 4,50"
                      onChange={(e) => {
                        const raw = e.target.value.replace(',', '.');
                        const parsed = raw === '' ? null : Number(raw);
                        setBinderInput((prev) =>
                          prev.map((item) => (item.curve === curve ? { ...item, value: parsed } : item))
                        );
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </>
          )}

          <Alert severity="info">
            {binderMode === 'auto'
              ? 'O teor será calculado a partir das massas específicas informadas no próximo passo.'
              : 'As porcentagens dos agregados serão redistribuídas para fechar 100% com o teor informado.'}
          </Alert>
        </Box>
      </ModalBase>

      {/* ------------------ 2) massas específicas dos materiais -------------- */}
      <ModalBase
        title={t('asphalt.dosages.superpave.specific-mass-modal-title')}
        leftButtonTitle={'Voltar'}
        rightButtonTitle={'Confirmar'}
        onCancel={() => {
          setSpecificMassModalIsOpen(false);
          if (!hasResults) setBinderChoiceModalIsOpen(true);
        }}
        open={specificMassModalIsOpen}
        size={'medium'}
        onSubmit={handleSubmitSpecificMasses}
        oneButton={false}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {modalMaterialInputs?.map((materialInputs, idx) => (
            <Box key={aggregateMaterialsData?.[idx]?.name ?? idx}>
              <Typography component={'h3'} sx={{ marginBottom: '0.5rem', fontWeight: 600 }}>
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

          <Divider />

          <Box>
            <Typography component={'h3'} sx={{ marginBottom: '0.5rem', fontWeight: 600 }}>
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
      </ModalBase>

      {/* --------------- 3) teor de ligante: estimar ou informar ------------- */}
      <ModalBase
        title={t('asphalt.dosages.superpave.insert-initial-binder')}
        leftButtonTitle={'Cancelar'}
        rightButtonTitle={binderMode === 'auto' ? 'Calcular teor' : 'Confirmar'}
        onCancel={() => setNewInitialBinderModalIsOpen(false)}
        open={newInitialBinderModalIsOpen}
        size={'small'}
        onSubmit={handleInitialBinderSubmit}
        oneButton={false}
      >
        <Box style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <RadioGroup value={binderMode} onChange={(e) => setBinderMode(e.target.value as BinderMode)}>
            <FormControlLabel value="auto" control={<Radio />} label="Calcular o teor pelo método Superpave" />
            <FormControlLabel value="manual" control={<Radio />} label="Informar o teor manualmente" />
          </RadioGroup>

          <Divider />

          {binderMode === 'auto' ? (
            <Alert severity="info">
              O teor de cada curva será estimado a partir das massas específicas informadas. Os valores atuais serão
              substituídos.
            </Alert>
          ) : (
            validCurves.map((curve) => {
              const estimated = estimatedBinderOf(curve);

              return (
                <Box key={curve}>
                  <Typography>{`Curva ${CURVE_LABEL_UI[curve]}`}</Typography>
                  <InputEndAdornment
                    adornment="%"
                    value={binderInput?.find((item) => item.curve === curve)?.value ?? ''}
                    placeholder={estimated ? `Estimado: ${estimated}%` : 'Insira o teor de ligante'}
                    type="number"
                    fullWidth
                    onChange={(e) => {
                      const raw = e.target.value.replace(',', '.');
                      const parsed = raw === '' ? null : Number(raw);
                      setBinderInput((prev) =>
                        prev.map((item) => (item.curve === curve ? { ...item, value: parsed } : item))
                      );
                    }}
                  />
                </Box>
              );
            })
          )}
        </Box>
      </ModalBase>
    </>
  );
};

export default Superpave_Step5_InitialBinder;