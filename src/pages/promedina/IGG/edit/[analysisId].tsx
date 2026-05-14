import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, CircularProgress, Alert } from '@mui/material';
import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import IggGeneralData from '@/components/promedina/IGG/register/general-data.pm.gl';
import IggStationsDefects from '@/components/promedina/IGG/register/stations-defects.igg';
import IggResults from '@/components/promedina/IGG/register/results.igg';
import { useIggStore, IggAnalysisActions } from '@/stores/promedina/igg/igg.store';
import iggAnalysisService from '@/services/promedina/igg/igg-view.service';
import IGG_SERVICE from '@/services/promedina/igg/igg.service';

const PRIMARY_GREEN = '#388e3c';

const IggEditPage = () => {
  const router = useRouter();
  const { analysisId } = router.query;
  const { user: { _id: userId } } = useAuth();
  const store = useIggStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const iggService = new IGG_SERVICE();
  iggService.userId = userId;
  iggService.store_actions = store as IggAnalysisActions;

  useEffect(() => {
    store.reset();
  }, []);

  useEffect(() => {
    loadAnalysis();

    // Cleanup: reset store when leaving the page
    return () => {
      store.reset();
    };
  }, [analysisId]);

  const loadAnalysis = async () => {
    if (!analysisId) return;

    try {
      setLoading(true);
      const response = await iggAnalysisService.getAnalysis(analysisId as string);
      const analysis = response.data;

      // Set the ID for update mode
      store.setData({ _id: analysis._id });

      // Populate store with existing data
      store.setGeneralData({
        road: analysis.road || '',
        section: analysis.section || '',
        evaluationDate: analysis.evaluationDate || '',
        name: analysis.name || '',
        description: analysis.description || '',
        subtrack: analysis.subtrack || '',
        pavementType: analysis.pavementType || '',
      });

      if (analysis.stations && Array.isArray(analysis.stations)) {
        store.setStations(analysis.stations);
      }

      if (analysis.results) {
        store.setResults(analysis.results);
      }
    } catch (err: any) {
      console.error('Erro ao carregar análise:', err);
      setError(err?.response?.data?.message || 'Erro ao carregar análise');
    } finally {
      setLoading(false);
    }
  };

  if (!analysisId) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: PRIMARY_GREEN }} />
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: PRIMARY_GREEN }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const childrens = [
    { step: 0, children: <IggGeneralData />, data: store.generalData },
    { step: 1, children: <IggStationsDefects />, data: store },
    { step: 2, children: <IggResults />, data: store },
  ];

  return (
    <EssayTemplate 
      essayInfo={{
        ...iggService.info,
        title: 'Editar Análise IGG',
      }}
      nextCallback={iggService.handleNext} 
      childrens={childrens} 
    />
  );
};

export default IggEditPage;
