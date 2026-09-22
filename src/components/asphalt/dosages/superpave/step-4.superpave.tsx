import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import { AllSievesSuperpaveUpdatedAstm } from '@/interfaces/common';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, Button, Checkbox, FormControlLabel, TableContainer, Typography } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import GranulometricCurvesGraph from './graphs/granulometricCurvesGraph';
import CurvesTable from './tables/curvesTable';

const CURVE_INDEX = { lower: 0, average: 1, higher: 2 } as const;
const CURVE_LABEL = { lower: 'inferior', average: 'média', higher: 'superior' } as const;

type CurveKey = keyof typeof CURVE_INDEX;

const Superpave_Step4_GranulometryComposition = ({
  setNextDisabled,
  superpave,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const [loading] = useState<boolean>(false);
  const { granulometryCompositionData: data, granulometryEssayData, generalData, setData } = useSuperpaveStore();

  const [lower, setLower] = useState(false);
  const [average, setAverage] = useState(false);
  const [higher, setHigher] = useState(false);

  const peneiras = AllSievesSuperpaveUpdatedAstm.map((peneira) => ({ peneira: peneira.label }));

  const arrayResponse = data?.percentsToList;
  const bandsHigher = data?.bands?.higher ?? [];
  const bandsLower = data?.bands?.lower ?? [];

  const selectedMaterials = granulometryEssayData?.materials
    ?.filter((material) => material.type !== 'asphaltBinder' && material.type !== 'CAP')
    .map((material) => ({ name: material.name, _id: material._id }));

  const checkBoxes = [
    { key: 'lower' as CurveKey, label: t('asphalt.dosages.superpave.step-3.lower'), value: lower },
    { key: 'average' as CurveKey, label: t('asphalt.dosages.superpave.step-3.average'), value: average },
    { key: 'higher' as CurveKey, label: t('asphalt.dosages.superpave.step-3.higher'), value: higher },
  ];

  const toggleSelectedCurve = (key: CurveKey) => {
    if (key === 'lower') setLower((prev) => !prev);
    if (key === 'average') setAverage((prev) => !prev);
    if (key === 'higher') setHigher((prev) => !prev);
  };

  /* --------------------------- percentageInputs --------------------------- */

  /** Nunca indexar direto: a resposta do backend pode vir sem esse array. */
  const getPercentageInputs = (index: number): Record<string, number | null> => data?.percentageInputs?.[index] ?? {};

  // Garante os três slots (inferior, média, superior) em qualquer cenário.
  useEffect(() => {
    const current = data?.percentageInputs;
    if (!Array.isArray(current) || current.length < 3) {
      const base = Array.isArray(current) ? current : [];
      setData({ step: 3, key: 'percentageInputs', value: [0, 1, 2].map((i) => base[i] ?? {}) });
    }
  }, [data?.percentageInputs]);

  /* ------------------------------ chosenCurves ---------------------------- */

  /**
   * chosenCurves é o contrato com o step 5: ele itera essa lista esperando
   * encontrar `<curva>Composition` calculada. Só entra aqui curva que realmente
   * tem percentsOfMaterials — curva marcada no checkbox mas nunca calculada
   * (ou limpa pelo "limpar tabela") derrubava o step 5 com
   * "Cannot read properties of undefined (reading 'percentsOfDosageWithBinder')".
   */
  const hasComposition = (source, curve: CurveKey) => {
    const composition = source?.[`${curve}Composition`];
    return Array.isArray(composition?.percentsOfMaterials) && composition.percentsOfMaterials.length > 0;
  };

  const buildChosenCurves = (source): CurveKey[] =>
    (Object.keys(CURVE_INDEX) as CurveKey[]).filter((curve) => hasComposition(source, curve));

  /* -------------------------------- gráfico ------------------------------- */

  const convertNumber = (value) => {
    let aux = value;
    if (typeof aux !== 'number' && aux !== null && aux !== undefined && aux.includes(','))
      aux = aux.replace('.', '').replace(',', '.');
    return parseFloat(aux);
  };

  const addProperHeaders = (points) => {
    if (!points || points.length === 0) return points;

    const labels = [
      'Peneira',
      'Pontos Inferior',
      'Pontos Superior',
      'Zona Inf',
      'Zona Sup',
      'Densidade',
      'Faixa Superior',
      'Faixa Inferior',
      'Curva Lower',
      'Curva Average',
      'Curva Higher',
    ];

    // Tipo declarado coluna a coluna. Sem isso o Charts infere o tipo pela
    // primeira linha de dados e quebra ("All series on a given axis must be of
    // the same data type") quando uma curva ainda não calculada vem toda nula.
    const headers = labels.map((label) => ({ label, type: 'number' }));

    // null (e não NaN) porque o Charts trata null como lacuna: mantém os pontos
    // de controle isolados em vez de tentar ligá-los.
    const convertValue = (val) => {
      if (val === null || val === undefined || val === '') return null;
      const num = typeof val === 'number' ? val : Number(String(val).replace(',', '.'));
      return Number.isFinite(num) ? num : null;
    };

    // O array cru já vem com as 11 colunas nesta ordem. Só ordenamos pelo
    // diâmetro: sem isso o Charts liga os pontos na ordem do array e a curva
    // sai serrilhada, com laços, diferente a cada recálculo.
    const formattedData = [...points]
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map((point) => labels.map((_, col) => convertValue(point[col])));

    return [headers, ...formattedData];
  };

  // Restaura o gráfico ao voltar para o step, se já houver cálculo salvo.
  useEffect(() => {
    if (!(data?.pointsOfCurve?.length > 0 && data?.nominalSize && data?.bands)) return;

    const curvesToRestore = buildChosenCurves(data);
    if (curvesToRestore.length === 0) return;

    superpave
      .calculateGranulometryComposition(data, granulometryEssayData, generalData, curvesToRestore)
      .then((response) => {
        if (response?.pointsOfCurve) {
          setData({ step: 3, key: 'pointsOfCurve', value: addProperHeaders(response.pointsOfCurve) });
        }
      })
      .catch(() => {
        // silencia: só não atualiza o gráfico
      });
  }, []);

  const isRawData = data?.pointsOfCurve?.length > 0 && typeof data.pointsOfCurve[0][0] === 'number';
  const graphData = isRawData ? addProperHeaders(data.pointsOfCurve) : data?.pointsOfCurve;

  /* -------------------------------- tabelas ------------------------------- */

  const validateNumber = (value) => {
    const auxValue = convertNumber(value);
    return !isNaN(auxValue) && typeof auxValue === 'number';
  };

  const numberRepresentation = (value, digits = 2) => {
    const aux: any = convertNumber(value);
    if (!validateNumber(aux)) return '';
    return aux.toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  };

  const setPercentsToListTotal = (peneiras: { peneira: string }[], percentsToList) => {
    const tableData = Array.from({ length: percentsToList?.length ?? 0 }, () => []);

    percentsToList?.forEach((item, i) => {
      item.forEach((value, j) => {
        if (value === null) return;
        tableData[i][j] = {
          ...peneiras[j],
          ...(i > 0 ? tableData[i][j] : {}),
          ['keyTotal' + i]: numberRepresentation(value[1]),
        };
      });
    });

    return tableData;
  };

  const setBandsHigherLower = (tableData, bandsHigher, bandsLower) => {
    const arraySize = tableData[0]?.length ?? 0;
    const arrayAux = Array(arraySize).fill({});

    tableData.forEach((element) => {
      element.forEach((item, index) => {
        const noBand = bandsLower?.[index] == null && bandsHigher?.[index] == null;
        arrayAux[index] = {
          ...arrayAux[index],
          ...item,
          bandsCol1: noBand ? '' : numberRepresentation(bandsHigher?.[index]),
          bandsCol2: noBand ? '' : numberRepresentation(bandsLower?.[index]),
        };
      });
    });

    return arrayAux;
  };

  const tableData = setBandsHigherLower(setPercentsToListTotal(peneiras, arrayResponse), bandsHigher, bandsLower);

  const tables = [
    {
      key: 'lower' as CurveKey,
      name: 'lowerComposition',
      isActive: lower,
      title: t('asphalt.dosages.superpave.lower-curve'),
    },
    {
      key: 'average' as CurveKey,
      name: 'averageComposition',
      isActive: average,
      title: t('asphalt.dosages.superpave.average-curve'),
    },
    {
      key: 'higher' as CurveKey,
      name: 'higherComposition',
      isActive: higher,
      title: t('asphalt.dosages.superpave.higher-curve'),
    },
  ];

  const clearTable = (curve: CurveKey) => {
    const index = CURVE_INDEX[curve];
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
      [`${curve}Composition`]: { percentsOfMaterials: null, sumOfPercents: [] },
    };

    // A curva limpa tem que sair do chosenCurves junto, senão o step 5
    // continua tentando ler uma composição que não existe mais.
    setData({
      step: 3,
      value: {
        ...clearedData,
        chosenCurves: buildChosenCurves(clearedData),
      },
    });
  };

  /* ------------------------------- cálculo -------------------------------- */

  const calculate = (curves: CurveKey[]) => {
    const problems: string[] = [];

    curves.forEach((curve) => {
      const values = Object.values(getPercentageInputs(CURVE_INDEX[curve]));

      if (values.length === 0 || values.every((v) => v === null || v === undefined || Number(v) === 0)) {
        problems.push(`Curva ${CURVE_LABEL[curve]}: preencha as porcentagens dos materiais.`);
        return;
      }

      const total = values.reduce((acc, v) => acc + (Number(v) || 0), 0);
      if (Math.abs(total - 100) > 0.01) {
        problems.push(`Curva ${CURVE_LABEL[curve]}: a soma está em ${total.toFixed(2)}% e precisa fechar 100%.`);
      }
    });

    if (problems.length > 0) {
      toast.error(problems.join(' '));
      return;
    }

    toast.promise(
      async () => {
        const response = await superpave.calculateGranulometryComposition(
          data,
          granulometryEssayData,
          generalData,
          curves
        );

        // O merge preserva o que o usuário digitou: a resposta não traz
        // percentageInputs completo e apagava as outras curvas.
        const mergedData = {
          ...data,
          ...response,
          percentageInputs: response?.percentageInputs ?? data.percentageInputs,
          pointsOfCurve: addProperHeaders(response.pointsOfCurve),
        };

        // chosenCurves é derivado do que de fato existe calculado, e não
        // sobrescrito pela resposta: calcular só a curva superior não pode
        // apagar as curvas inferior/média já calculadas antes.
        setData({
          step: 3,
          value: {
            ...mergedData,
            chosenCurves: buildChosenCurves(mergedData),
          },
        });
      },
      {
        pending: t('loading.materials.pending'),
        success: t('loading.materials.success'),
        error: t('loading.materials.error'),
      }
    );
  };

  useEffect(() => {
    setNextDisabled(!(data?.pointsOfCurve?.length > 0 && buildChosenCurves(data).length > 0));
  }, [data?.pointsOfCurve, data?.lowerComposition, data?.averageComposition, data?.higherComposition, setNextDisabled]);

  if (loading) return <Loading />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Box sx={{ display: 'flex', gap: '5rem', justifyContent: 'center' }}>
        {checkBoxes.map((box) => (
          <FormControlLabel
            key={box.key}
            control={<Checkbox checked={box.value} />}
            onChange={() => toggleSelectedCurve(box.key)}
            label={box.label}
            sx={{ display: 'flex', width: 'fit-content' }}
          />
        ))}
      </Box>

      {tables.map((table) => {
        if (!table.isActive) return null;

        // Cada tabela calcula só a própria curva. Se o backend exigir as três
        // juntas, troque por: tables.filter((x) => x.isActive).map((x) => x.key)
        const curvesToCalculate: CurveKey[] = [table.key];

        return (
          <TableContainer key={table.key}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '10px',
                marginTop: '2rem',
              }}
            >
              <Typography sx={{ textAlign: 'center', fontSize: '1.5rem' }}>{table.title}</Typography>

              <Button onClick={() => clearTable(table.key)} variant="outlined">
                {t('asphalt.dosages.superpave.clear-table')}
              </Button>
            </Box>

            <CurvesTable
              materials={selectedMaterials}
              dnitBandsLetter={data?.bands?.letter}
              tableName={table.name}
              tableData={tableData}
            />

            <Button
              onClick={() => calculate(curvesToCalculate)}
              variant="outlined"
              sx={{ width: '100%', marginTop: '2%' }}
            >
              {t(`asphalt.dosages.superpave.calculate-${table.key}-curve`)}
            </Button>
          </TableContainer>
        );
      })}

      {data?.pointsOfCurve?.length > 0 && <GranulometricCurvesGraph data={graphData} />}
    </Box>
  );
};

export default Superpave_Step4_GranulometryComposition;