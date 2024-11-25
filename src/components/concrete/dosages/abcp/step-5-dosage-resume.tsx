import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { t } from 'i18next';
import { EssayPageProps } from '@/components/templates/essay';
import ABCP_SERVICE from '@/services/concrete/dosages/abcp/abcp.service';
import useABCPStore from '@/stores/concrete/abcp/abcp.store';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import { Box } from '@mui/material';
import Result_Card from '@/components/atoms/containers/result-card';
import AbramsCurvGraph from './graph/abramsCurveGrapg';
import { useEffect, useState } from 'react';
import abcpDosageService from '@/services/concrete/dosages/abcp/abcp-consult.service';
import GenerateAbcpDosagePDF from '@/components/generatePDF/dosages/concrete/abcp/generatePDFAbcpDosage';


const ABCP_Results = ({ nextDisabled, setNextDisabled }: EssayPageProps & { abcp: ABCP_SERVICE }) => {
  nextDisabled && setNextDisabled(false);
  const { results: abcp_results, insertParamsData, setData } = useABCPStore();
  const { calculateResults } = new ABCP_SERVICE();
  const store = JSON.parse(sessionStorage.getItem('abcp-store'));
  const dosageId = store.state._id;
  const [dosage, setDosage] = useState(null);

  useEffect(() => {
    const resultData = async () => {
      try {
        const foundDosage = await abcpDosageService.getAbcpDosage(dosageId);
        setDosage(foundDosage.data);

        const calculateDosage = await calculateResults(foundDosage.data);
        const dosageData = { ...foundDosage.data, results: calculateDosage };
        setData({ step: 5, value: dosageData });
      } catch (error) {
        console.error('Failed to load dosage:', error);
      }
    };
    resultData();
  }, []);

  const conditionValue = insertParamsData.condition;
  const tolerance = 0.0001;

  const conditionLabel =
    Math.abs(conditionValue - 4) < tolerance
      ? 'Condição A - Sd = 4,0'
      : Math.abs(conditionValue - 5.5) < tolerance
      ? 'Condição B - Sd = 5,5'
      : 'Condição C - Sd = 7,0';

  const generalDataResults = [
    {
      key: 'resistanceCurve',
      label: t('abcp.results.resistance-curve'),
      value: abcp_results.resistanceCurve,
      unity: 'MPa',
    },
    {
      key: 'condition',
      label: t('abcp.results.condition'),
      value: conditionLabel,
      unity: 'MPa',
    },
    {
      key: 'wantedFck',
      label: t('abcp.results.fck'),
      value: String(insertParamsData.fck),
      unity: 'MPa',
    },
    {
      key: 'reduction',
      label: t('abcp.results.reduction'),
      value: String(insertParamsData.reduction),
      unity: 'mm',
    },
  ];

  const results = [
    {
      key: 'fcj',
      label: t('abcp.results.fcj'),
      value: abcp_results.fcj,
      unity: 'MPa',
    },
    {
      key: 'waterCementRelation',
      label: t('abcp.results.water-cement'),
      value: abcp_results.ac,
      unity: '',
    },
    {
      key: 'waterConsume',
      label: t('abcp.results.water-consume'),
      value: abcp_results.ca,
      unity: 'Lm³',
    },
    {
      key: 'cementConsume',
      label: t('abcp.results.cement-consume'),
      value: abcp_results.cc,
      unity: 'Kg/m³',
    },
    {
      key: 'coarseAggregateConsume',
      label: t('abcp.results.coarse-aggregate-consume'),
      value: abcp_results.cb,
      unity: 'kg/m³',
    },
    {
      key: 'fineAggregateConsume',
      label: t('abcp.results.fine-aggregate-consume'),
      value: abcp_results.careia,
      unity: 'kg/m³',
    },
  ];

  const cc = abcp_results.cc > 1 ? abcp_results.cc : 1;
  const ca = abcp_results.ca > 1 ? abcp_results.ca : 1;
  const coefficients = `${cc / cc} : ${(abcp_results.careia / cc).toFixed(3)} : ${(abcp_results.cb / cc).toFixed(
    3
  )} : ${(ca / cc).toFixed(3)}`;

  return (
    <>
      <FlexColumnBorder title={t('results')} open={true}>
        <GenerateAbcpDosagePDF dosage={dosage} />

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            // gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' },
            gap: '10px',
            marginY: '20px',
            flexWrap: 'wrap',
          }}
        >
          <ResultSubTitle title={t('abcp.general-results')} sx={{ margin: '.65rem' }} />
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              // gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' },
              gap: '10px',
              mt: '20px',
              flexWrap: 'wrap',
            }}
          >
            {generalDataResults.map((item) => (
              <Result_Card key={item.key} label={item.label} value={item.value} unity={item.unity} />
            ))}
          </Box>

          <ResultSubTitle title={t('results')} sx={{ margin: '.65rem' }} />
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              // gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' },
              gap: '10px',
              mt: '20px',
              flexWrap: 'wrap',
            }}
          >
            {results.map((item) => (
              <Result_Card
                key={item.key}
                label={item.label}
                value={typeof item.value === 'number' ? item.value.toString() : item.value}
                unity={item.unity}
              />
            ))}
          </Box>

          <ResultSubTitle title={t('abcp.results.coefficients')} sx={{ margin: '.65rem' }} />
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              // gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' },
              gap: '10px',
              mt: '20px',
              flexWrap: 'wrap',
            }}
          >
            <Result_Card label={t('abcp.result.coefficients')} value={coefficients} unity={''} />
          </Box>
        </Box>

        <ResultSubTitle title={t('abcp.result.graph')} sx={{ margin: '.65rem' }} />
        <AbramsCurvGraph
          Xvalues={abcp_results.Xvalues}
          Yvalues={abcp_results.Yvalues}
          ac={abcp_results.ac}
          formula={abcp_results.formula}
          fcj={abcp_results.fcj}
        />
      </FlexColumnBorder>
    </>
  );
};

export default ABCP_Results;
