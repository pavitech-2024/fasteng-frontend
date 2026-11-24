import { EssayPageProps } from '@/components/templates/essay';
import { AllSievesSuperpaveUpdatedAstm } from '@/interfaces/common';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Alert, Box, Button, Tab, Tabs, Typography } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import GranulometricCurvesGraph, { CurveKey } from './graphs/granulometricCurvesGraph';
import CurvesTable from './tables/curvesTable';

const CURVES: CurveKey[] = ['lower', 'average', 'higher'];

const CURVE_META: Record<CurveKey, { index: number; composition: string; tab: string; label: string }> = {
  lower: { index: 0, composition: 'lowerComposition', tab: 'Inferior', label: 'inferior' },
  average: { index: 1, composition: 'averageComposition', tab: 'Intermediária', label: 'intermediária' },
  higher: { index: 2, composition: 'higherComposition', tab: 'Superior', label: 'superior' },
};

const COMPARISON_TAB = 'comparison';

const Superpave_Step4_GranulometryComposition = ({
  setNextDisabled,
  superpave,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const { granulometryCompositionData: data, granulometryEssayData, generalData, setData } = useSuperpaveStore();

  const [activeTab, setActiveTab] = useState<string>('lower');

  const selectedMaterials = granulometryEssayData?.materials
    ?.filter((material) => material.type !== 'asphaltBinder' && material.type !== 'CAP')
    .map((material) => ({ name: material.name, _id: material._id }));

  /* --------------------------- percentageInputs --------------------------- */

  /** Nunca indexar direto: a resposta do backend pode vir sem esse array. */
  const getPercentageInputs = (index: number): Record<string, number | null> => data?.percentageInputs?.[index] ?? {};

  // Garante os três slots (inferior, intermediária, superior) em qualquer cenário.
  useEffect(() => {
    const current = data?.percentageInputs;
    if (!Array.isArray(current) || current.length < 3) {
      const base = Array.isArray(current) ? current : [];
      setData({ step: 3, key: 'percentageInputs', value: [0, 1, 2].map((i) => base[i] ?? {}) });
    }
  }, [data?.percentageInputs]);

  /* ------------------------------ estado das curvas ----------------------- */

  /**
   * chosenCurves é o contrato com o step 5, que itera essa lista esperando
   * encontrar `<curva>Composition` calculada. Só entra curva que realmente tem
   * percentsOfMaterials — curva aberta na aba mas nunca calculada (ou limpa)
   * derrubava o step 5 lendo composição inexistente.
   */
  const hasComposition = (source: any, curve: CurveKey) => {
    const composition = source?.[CURVE_META[curve].composition];
    return Array.isArray(composition?.percentsOfMaterials) && composition.percentsOfMaterials.length > 0;
  };

  const buildChosenCurves = (source: any): CurveKey[] => CURVES.filter((curve) => hasComposition(source, curve));

  const calculatedCurves = useMemo(() => buildChosenCurves(data), [data]);

  const inputsAreValid = (curve: CurveKey) => {
    const values = Object.values(getPercentageInputs(CURVE_META[curve].index));
    if (values.length === 0) return false;
    if (values.every((v) => v === null || v === undefined || Number(v) === 0)) return false;
    const total = values.reduce((acc, v) => acc + (Number(v) || 0), 0);
    return Math.abs(total - 100) <= 0.01;
  };

  // A aba comparativa só existe com duas curvas ou mais.
  const showComparison = calculatedCurves.length >= 2;

  useEffect(() => {
    if (activeTab === COMPARISON_TAB && !showComparison) setActiveTab('lower');
  }, [activeTab, showComparison]);

  /* -------------------------------- tabelas ------------------------------- */

  const peneiras = AllSievesSuperpaveUpdatedAstm.map((peneira) => ({ peneira: peneira.label }));

  const convertNumber = (value) => {
    let aux = value;
    if (typeof aux !== 'number' && aux !== null && aux !== undefined && aux.includes(','))
      aux = aux.replace('.', '').replace(',', '.');
    return parseFloat(aux);
  };

  const numberRepresentation = (value, digits = 2) => {
    const aux: any = convertNumber(value);
    if (isNaN(aux)) return '';
    return aux.toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  };

  const tableData = useMemo(() => {
    const percentsToList = data?.percentsToList;
    const bandsHigher = data?.bands?.higher ?? [];
    const bandsLower = data?.bands?.lower ?? [];

    const perMaterial = Array.from({ length: percentsToList?.length ?? 0 }, () => [] as any[]);

    percentsToList?.forEach((item, i) => {
      item.forEach((value, j) => {
        if (value === null) return;
        perMaterial[i][j] = {
          ...peneiras[j],
          ...(i > 0 ? perMaterial[i][j] : {}),
          ['keyTotal' + i]: numberRepresentation(value[1]),
        };
      });
    });

    const size = perMaterial[0]?.length ?? 0;
    const merged = Array(size).fill({});

    perMaterial.forEach((element) => {
      element.forEach((item, index) => {
        const noBand = bandsLower?.[index] == null && bandsHigher?.[index] == null;
        merged[index] = {
          ...merged[index],
          ...item,
          bandsCol1: noBand ? '' : numberRepresentation(bandsHigher?.[index]),
          bandsCol2: noBand ? '' : numberRepresentation(bandsLower?.[index]),
        };
      });
    });

    return merged;
  }, [data?.percentsToList, data?.bands]);

  /* ------------------------------- ações ---------------------------------- */

  const clearTable = (curve: CurveKey) => {
    const { index, composition } = CURVE_META[curve];
    const currentInputs = getPercentageInputs(index);

    const newInputs: Record<string, number | null> = {};
    Object.keys(currentInputs).forEach((key) => {
      newInputs[key] = null;
    });

    const currentList = Array.isArray(data?.percentageInputs) ? data.percentageInputs : [];
    const percentageInputs = [0, 1, 2].map((i) => (i === index ? newInputs : currentList[i] ?? {}));

    const clearedData = {
      ...data,
      graphData: [],
      pointsOfCurve: [],
      percentageInputs,
      [composition]: { percentsOfMaterials: null, sumOfPercents: [] },
    };

    setData({ step: 3, value: { ...clearedData, chosenCurves: buildChosenCurves(clearedData) } });
  };

  const calculate = (curve: CurveKey) => {
    const values = Object.values(getPercentageInputs(CURVE_META[curve].index));
    const label = CURVE_META[curve].label;

    if (values.length === 0 || values.every((v) => v === null || v === undefined || Number(v) === 0)) {
      toast.error(`Curva ${label}: preencha as porcentagens dos materiais.`);
      return;
    }

    const total = values.reduce((acc, v) => acc + (Number(v) || 0), 0);
    if (Math.abs(total - 100) > 0.01) {
      toast.error(`Curva ${label}: a soma está em ${total.toFixed(2)}% e precisa fechar 100%.`);
      return;
    }

    // O backend remonta o pointsOfCurve inteiro e preenche com null toda curva
    // fora do chosenCurves da requisição. As já calculadas vão junto, senão
    // sumiriam do gráfico ao calcular esta.
    const curvesToSend = Array.from(new Set([curve, ...calculatedCurves.filter(inputsAreValid)]));

    toast.promise(
      async () => {
        const response = await superpave.calculateGranulometryComposition(
          data,
          granulometryEssayData,
          generalData,
          curvesToSend
        );

        // O merge preserva o que o usuário digitou: a resposta não traz
        // percentageInputs completo e apagava as outras curvas.
        const mergedData = {
          ...data,
          ...response,
          percentageInputs: response?.percentageInputs ?? data.percentageInputs,
        };

        setData({ step: 3, value: { ...mergedData, chosenCurves: buildChosenCurves(mergedData) } });
      },
      {
        pending: t('loading.materials.pending'),
        success: t('loading.materials.success'),
        error: t('loading.materials.error'),
      }
    );
  };

  useEffect(() => {
    setNextDisabled(!(data?.pointsOfCurve?.length > 0 && calculatedCurves.length > 0));
  }, [data?.pointsOfCurve, calculatedCurves, setNextDisabled]);

  /* ------------------------------- render --------------------------------- */

  const renderCurvePanel = (curve: CurveKey) => {
    const { composition, label } = CURVE_META[curve];
    const isCalculated = calculatedCurves.includes(curve);

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', mt: '1.5rem' }}>
        <CurvesTable
          materials={selectedMaterials}
          dnitBandsLetter={data?.bands?.letter}
          tableName={composition}
          tableData={tableData}
        />

        <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button onClick={() => calculate(curve)} variant="contained" sx={{ flex: 1, minWidth: '220px' }}>
            {`Calcular curva ${label}`}
          </Button>

          <Button onClick={() => clearTable(curve)} variant="outlined">
            {t('asphalt.dosages.superpave.clear-table')}
          </Button>
        </Box>

        {isCalculated ? (
          <GranulometricCurvesGraph
            points={data.pointsOfCurve}
            curves={[curve]}
            title={`Curva granulométrica ${label}`}
          />
        ) : (
          <Alert severity="info">
            Preencha as porcentagens acima, fechando 100%, e calcule para ver o gráfico desta curva.
          </Alert>
        )}
      </Box>
    );
  };

  const renderComparisonPanel = () => (
    <Box sx={{ mt: '1.5rem' }}>
      <GranulometricCurvesGraph
        points={data.pointsOfCurve}
        curves={calculatedCurves}
        title="Comparativo das curvas granulométricas"
        height="500px"
      />

      <Typography variant="body2" sx={{ mt: '0.5rem' }}>
        {calculatedCurves.map((curve) => CURVE_META[curve].tab).join(', ')} — calculadas.
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Tabs
        value={activeTab}
        onChange={(_, value) => setActiveTab(value)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        {CURVES.map((curve) => (
          <Tab
            key={curve}
            value={curve}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {CURVE_META[curve].tab}
                {calculatedCurves.includes(curve) && (
                  <Box
                    component="span"
                    sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'secondaryTons.green' }}
                  />
                )}
              </Box>
            }
          />
        ))}

        {showComparison && <Tab value={COMPARISON_TAB} label="Comparativo" />}
      </Tabs>

      {/* Só o painel ativo é montado: três DataGrids e três gráficos ao mesmo
          tempo deixavam o step pesado. */}
      {activeTab === COMPARISON_TAB ? renderComparisonPanel() : renderCurvePanel(activeTab as CurveKey)}
    </Box>
  );
};

export default Superpave_Step4_GranulometryComposition;