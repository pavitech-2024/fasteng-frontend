import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Alert,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Assessment, ArrowBack, Storage, Speed, Delete } from '@mui/icons-material';
import { useRouter } from 'next/router';
import fwdAnalysisService from '@/services/asphalt/essays/fwd/fwdApi';

const PRIMARY_GREEN = '#07B811';
const BORDER_GREEN = '#07B811';

interface FWDAnalysis {
  _id: string;
  name: string;
  description?: string;
  status: 'completed' | 'active' | 'draft';
  samples?: Array<{ [key: string]: unknown }>;
  createdAt: string;
  updatedAt?: string;
}

const FwdViewPage: React.FC = () => {
  const router = useRouter();
  const [analyses, setAnalyses] = useState<FWDAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [analysisToDelete, setAnalysisToDelete] = useState<FWDAnalysis | null>(null);

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    try {
      setLoading(true);
      const response = await fwdAnalysisService.getAnalyses();
      const data = response.data?.data || response.data?.docs || response.data || [];
      setAnalyses(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      console.error('Erro ao carregar análises:', err);
      setError(error?.response?.data?.message || 'Erro ao carregar análises');
    } finally {
      setLoading(false);
    }
  };

  const handleViewAnalysis = (analysisId: string) => {
    router.push(`/asphalt/essays/fwd/view/data/${analysisId}`);
  };

  const handleBackToWelcome = () => {
    router.push('asphalt/essays/fwd');
  };

  const handleDeleteClick = (e: React.MouseEvent, analysis: FWDAnalysis) => {
    e.stopPropagation();
    setAnalysisToDelete(analysis);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!analysisToDelete) return;

    try {
      await fwdAnalysisService.deleteAnalysis(analysisToDelete._id);
      setAnalyses(analyses.filter((a) => a._id !== analysisToDelete._id));
      setDeleteDialogOpen(false);
      setAnalysisToDelete(null);
    } catch (err: unknown) {
      console.error('Erro ao deletar análise:', err);
      setError('Erro ao deletar análise');
      setDeleteDialogOpen(false);
      setAnalysisToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setAnalysisToDelete(null);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'active':
        return 'info';
      case 'draft':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Finalizada';
      case 'active':
        return 'Ativa';
      case 'draft':
        return 'Rascunho';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: PRIMARY_GREEN }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        pt: { xs: '2rem', md: '4rem' },
      }}
    >
      <Paper
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: `2px solid ${BORDER_GREEN}`,
          width: '100%',
          maxWidth: '1200px',
          mt: { xs: '2rem', md: '3rem' },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: PRIMARY_GREEN }}>
            <Storage sx={{ mr: 1 }} /> ANÁLISES FWD SALVAS ({analyses.length})
          </Typography>
          <Button
            variant="outlined"
            onClick={handleBackToWelcome}
            startIcon={<ArrowBack />}
            sx={{ borderColor: BORDER_GREEN, color: BORDER_GREEN }}
          >
            Voltar
          </Button>
        </Box>
        <Divider sx={{ mb: 3, borderColor: BORDER_GREEN }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {analyses.length === 0 ? (
          <Alert severity="info">Nenhuma análise FWD salva ainda.</Alert>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
            {analyses.map((analysis: FWDAnalysis) => (
              <Card
                key={analysis._id}
                variant="outlined"
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  border: `1px solid ${BORDER_GREEN}`,
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(7, 184, 17, 0.3)',
                    border: `2px solid ${BORDER_GREEN}`,
                  },
                  transition: 'all 0.3s',
                }}
                onClick={() => handleViewAnalysis(analysis._id)}
              >
                <CardContent>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: PRIMARY_GREEN, mb: 1 }}>
                    {analysis.name || 'Sem nome'}
                  </Typography>

                  {analysis.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {analysis.description.length > 80
                        ? analysis.description.substring(0, 80) + '...'
                        : analysis.description}
                    </Typography>
                  )}

                  <Typography variant="body2" color="text.secondary">
                    Amostras: <strong>{analysis.samples?.length || 0}</strong>
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Criada: {analysis.createdAt ? formatDate(analysis.createdAt) : '-'}
                  </Typography>

                  {analysis.updatedAt && (
                    <Typography variant="body2" color="text.secondary">
                      Atualizada: {formatDate(analysis.updatedAt)}
                    </Typography>
                  )}

                  <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={getStatusLabel(analysis.status)}
                      size="small"
                      color={getStatusColor(analysis.status)}
                      variant="outlined"
                    />
                    {analysis.samples?.length >= 5 ? (
                      <Chip
                        icon={<Speed />}
                        label="Pronta para processar"
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    ) : (
                      <Chip label="Amostras insuficientes" size="small" color="warning" variant="outlined" />
                    )}
                  </Box>
                </CardContent>
                <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button size="small" startIcon={<Assessment />} sx={{ color: BORDER_GREEN }}>
                    Visualizar
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Delete />}
                    onClick={(e) => handleDeleteClick(e, analysis)}
                    sx={{ color: '#ff1744' }}
                  >
                    Remover
                  </Button>
                </Box>
              </Card>
            ))}
          </Box>
        )}

        <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
          <DialogTitle sx={{ fontWeight: 700, color: BORDER_GREEN }}>Remover Análise?</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Tem certeza que deseja remover a análise <strong>&quot;{analysisToDelete?.name}&quot;</strong>? Esta ação
              não pode ser desfeita.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete} sx={{ color: 'text.secondary' }}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              sx={{ backgroundColor: '#ff1744', '&:hover': { backgroundColor: '#d50a2a' } }}
            >
              Remover
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default FwdViewPage;
