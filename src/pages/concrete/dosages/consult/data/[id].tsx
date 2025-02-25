import { AbcpLogo } from '@/assets';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import AbramsCurvGraph from '@/components/concrete/dosages/abcp/graph/abramsCurveGrapg';
import Header from '@/components/organisms/header';
import useAuth from '@/contexts/auth';
import { AbcpDosageData } from '@/interfaces/concrete/abcp';
import abcpDosageService from '@/services/concrete/dosages/abcp/abcp-consult.service';
import { Box, Container } from '@mui/material';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const SpecificAbcpDosage = () => {
  const [dosage, setDosage] = useState<AbcpDosageData>();
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const dosageId = router.query?.id as string;

  const conditionValue = dosage.insertParamsData.condition;
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
      value: dosage.results.resistanceCurve,
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
      value: dosage.insertParamsData.fck,
      unity: 'MPa',
    },
    {
      key: 'reduction',
      label: t('abcp.results.reduction'),
      value: dosage.insertParamsData.reduction,
      unity: 'mm',
    },
  ];

  const { user } = useAuth();

  useEffect(() => {
    abcpDosageService
      .getAbcpDosage(dosageId.toString())
      .then((response) => {
        setDosage(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load dosages:', error);
      });
  }, [user]);

  const results = [
    {
      key: 'fcj',
      label: t('abcp.results.fcj'),
      value: dosage.results.fcj,
      unity: 'MPa',
    },
    {
      key: 'waterCementRelation',
      label: t('abcp.results.water-cement'),
      value: dosage.results.ac,
      unity: '',
    },
    {
      key: 'waterConsume',
      label: t('abcp.results.water-consume'),
      value: dosage.results.ca,
      unity: 'Lm³',
    },
    {
      key: 'cementConsume',
      label: t('abcp.results.cement-consume'),
      value: dosage.results.cc,
      unity: 'Kg/m³',
    },
    {
      key: 'coarseAggregateConsume',
      label: t('abcp.results.coarse-aggregate-consume'),
      value: dosage.results.cb,
      unity: 'kg/m³',
    },
    {
      key: 'fineAggregateConsume',
      label: t('abcp.results.fine-aggregate-consume'),
      value: dosage.results.careia,
      unity: 'kg/m³',
    },
  ];

  const coefficients = `${dosage.results.cc / dosage.results.cc} : ${(
    dosage.results.careia / dosage.results.cc
  ).toFixed(3)} : ${(dosage.results.cb / dosage.results.cc).toFixed(3)} : ${(
    dosage.results.ca / dosage.results.cc
  ).toFixed(3)}`;

  return (
    <Container>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <Container>
          <Box sx={{ margin: '3rem' }}>
            <Header title={'Dosagens ABCP'} image={AbcpLogo} />
          </Box>

          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              pt: { mobile: 0, notebook: '0.5vh' },
            }}
          >
            <Box
              sx={{
                width: { mobile: '90%', notebook: '80%' },
                maxWidth: '2200px',
                padding: '2rem',
                borderRadius: '20px',
                bgcolor: 'primaryTons.white',
                border: '1px solid',
                borderColor: 'primaryTons.border',
                marginBottom: '1rem',
              }}
            >
              <FlexColumnBorder title={t('results')} open={true}>
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
                  <ResultSubTitle title={t('general data')} sx={{ margin: '.65rem' }} />
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
                      <Result_Card key={item.key} label={item.label} value={item.value.toString()} unity={item.unity} />
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
                      <Result_Card key={item.key} label={item.label} value={item.value.toString()} unity={item.unity} />
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
                  Xvalues={dosage.results.Xvalues}
                  Yvalues={dosage.results.Yvalues}
                  ac={dosage.results.ac}
                  formula={dosage.results.formula}
                  fcj={dosage.results.fcj}
                />
              </FlexColumnBorder>
            </Box>
          </Box>
        </Container>
      )}
    </Container>
  );
};

export default SpecificAbcpDosage;
