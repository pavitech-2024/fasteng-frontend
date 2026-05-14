import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Card, CardContent, Chip, Button, Alert, Divider, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Assessment, ArrowBack, Storage, Edit, Delete } from '@mui/icons-material';
import { useRouter } from 'next/router';
import iggAnalysisService from '@/services/promedina/igg/igg-view.service';

const PRIMARY_GREEN = '#388e3c';
const BORDER_GREEN = '#06B811';

const IggViewPage: React.FC = () => {
  const router = useRouter();
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    try {
      setLoading(true);
      const response = await iggAnalysisService.getAnalyses(1, 100);
      setAnalyses(response.data?.docs || response.data || []);
    } catch (err: any) {
      console.error('Erro ao carregar análises:', err);
      setError(err?.response?.data?.message || 'Erro ao carregar análises');
    } finally {
      setLoading(false);
    }
  };

  const handleViewAnalysis = (analysisId: string) => {
    router.push(`/promedina/IGG/view/data/${analysisId}`);
  };

  const handleEditAnalysis = (analysisId: string) => {
    router.push(`/promedina/IGG/edit/${analysisId}`);
  };

  const handleDeleteClick = (analysisId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAnalysisId(analysisId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAnalysisId) return;
    
    try {
      setDeleting(true);
      await iggAnalysisService.deleteAnalysis(selectedAnalysisId);
      setAnalyses(analyses.filter(a => a._id !== selectedAnalysisId));
      setDeleteDialogOpen(false);
      setSelectedAnalysisId(null);
    } catch (err: any) {
      console.error('Erro ao deletar análise:', err);
      setError(err?.response?.data?.message || 'Erro ao deletar análise');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedAnalysisId(null);
  };

  const handleBackToWelcome = () => {
    router.push('/promedina/IGG');
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
        pt: { xs: '2rem', md: '4rem' }, // ✅ Mais espaço do topo
      }}
    >
      <Paper 
        sx={{ 
          p: 4, 
          borderRadius: 2, 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: `2px solid ${BORDER_GREEN}`, // ✅ Borda verde
          width: '100%',
          maxWidth: '1200px',
          mt: { xs: '2rem', md: '3rem' }, // ✅ Margem extra do topo
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: PRIMARY_GREEN }}>
            <Storage sx={{ mr: 1 }} /> ANÁLISES IGG SALVAS ({analyses.length})
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
          <Alert severity="info">Nenhuma análise IGG salva ainda.</Alert>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
            {analyses.map((analysis: any) => (
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
                    boxShadow: '0 4px 12px rgba(6, 184, 17, 0.3)',
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
                  <Typography variant="body2" color="text.secondary">
                    Rodovia: <strong>{analysis.road || '-'}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Trecho: {analysis.section || '-'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Data: {analysis.evaluationDate ? new Date(analysis.evaluationDate).toLocaleDateString('pt-BR') : '-'}
                  </Typography>
                  <Typography variant="body2">
                    Estações: {analysis.stations?.length || 0}
                  </Typography>
                  
                  {analysis.results?.statistics && (
                    <Chip 
                      label={`IGG: ${analysis.results.statistics.IGG?.toFixed(1) || '?'} (${analysis.results.statistics.classificacao || '?'})`}
                      sx={{ 
                        mt: 1, 
                        backgroundColor: analysis.results.statistics.cor_classificacao || PRIMARY_GREEN, 
                        color: 'white', 
                        fontWeight: 'bold' 
                      }}
                    />
                  )}
                </CardContent>
                <Box sx={{ p: 2, pt: 0, textAlign: 'right' }}>
                  <Button 
                    size="small" 
                    startIcon={<Assessment />} 
                    sx={{ color: BORDER_GREEN, mr: 1 }}
                  >
                    Visualizar
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditAnalysis(analysis._id);
                    }}
                    sx={{ color: '#1976d2', mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Delete />}
                    onClick={(e) => handleDeleteClick(analysis._id, e)}
                    sx={{ color: '#d32f2f' }}
                  >
                    Deletar
                  </Button>
                </Box>
              </Card>
            ))}
          </Box>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir esta análise IGG? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
            disabled={deleting}
          >
            {deleting ? 'Deletando...' : 'Deletar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IggViewPage;