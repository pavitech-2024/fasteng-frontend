import { EssayPageProps } from '../../../templates/essay';
import { Box, Typography, Button, Card, CardContent, Chip, IconButton, Alert, FormControl, InputLabel, Select, MenuItem, CircularProgress, Tooltip, Snackbar } from '@mui/material';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import useFWDStore, { FWDAnalysis } from '@/stores/promedina/fwd/fwd.store';

const FWD_step2 = ({ setNextDisabled }: EssayPageProps) => {
  const {
    analyses, drafts,
    selectedAnalysis, setSelectedAnalysis,
    loading, error, setError,
    fetchAnalyses, deleteAnalysis,
    setActiveTab, setEditingId, setAnalysisData, setSamples,
  } = useFWDStore();

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    setNextDisabled?.(false);
    fetchAnalyses();
  }, []);

  const handleSelect = (analysis: FWDAnalysis) => {
    setSelectedAnalysis(analysis);
    setSnackbar({ open: true, message: `Análise "${analysis.name}" selecionada!`, severity: 'success' });
  };

  const handleEdit = (analysis: FWDAnalysis) => {
    setEditingId(analysis._id);
    setAnalysisData({
      name: analysis.name || '',
      description: analysis.description || '',
      location: (analysis as any).location || '',
      highway: (analysis as any).highway || '',
      layerType: (analysis as any).layerType || '',
      cityState: (analysis as any).cityState || '',
      speedLimit: (analysis as any).speedLimit?.toString() || '',
      notes: (analysis as any).notes || '',
    });
    setSamples(analysis.samples || []);
    setActiveTab(0);
  };

  const handleDelete = async (id: string) => {
    const success = await deleteAnalysis(id);
    if (success) {
      setSnackbar({ open: true, message: 'Análise deletada com sucesso!', severity: 'success' });
      if (selectedAnalysis?._id === id) {
        setSelectedAnalysis(null);
      }
    }
  };

  const handleViewResults = (analysis: FWDAnalysis) => {
    setSelectedAnalysis(analysis);
    setActiveTab(2);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'info';
      case 'draft': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'completed': return 'Finalizada';
      case 'draft': return 'Rascunho';
      default: return status;
    }
  };

  return (
    <>
      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>{error}</Alert>}

      {/* SELEÇÃO RÁPIDA */}
      <FlexColumnBorder title="ANÁLISE SELECIONADA" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ width: '100%', paddingBottom: '20px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#07B811' }}>SELECIONAR ANÁLISE</InputLabel>
                <Select
                  value={selectedAnalysis?._id || ''}
                  onChange={(e) => {
                    const id = e.target.value as string;
                    const found = [...analyses, ...drafts].find(a => a._id === id);
                    if (found) handleSelect(found);
                  }}
                  label="SELECIONAR ANÁLISE"
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#07B811' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#07B811' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#07B811' },
                  }}
                >
                  <MenuItem value="" disabled>
                    <em>Selecione uma análise...</em>
                  </MenuItem>
                  {analyses.map((a) => (
                    <MenuItem key={a._id} value={a._id}>
                      🟢 {a.name} ({a.samples?.length || 0} amostras) - {formatDate(a.createdAt)}
                    </MenuItem>
                  ))}
                  {drafts.map((d) => (
                    <MenuItem key={d._id} value={d._id} sx={{ color: '#ff6b35' }}>
                      📝 {d.name} ({d.samples?.length || 0} amostras) - Rascunho
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Tooltip title="Selecione uma análise para visualizar, editar ou processar os resultados" arrow>
                <IconButton size="small" sx={{ color: '#07B811' }}>
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {selectedAnalysis && (
            <Alert severity="success" sx={{ width: '100%' }}>
              Análise <strong>{selectedAnalysis.name}</strong> selecionada! 
              {selectedAnalysis.samples?.length >= 5 
                ? ' Pronta para processamento.' 
                : ' Necessário mínimo de 5 amostras.'}
            </Alert>
          )}
        </Box>
      </FlexColumnBorder>

      {/* RASCUNHOS */}
      <FlexColumnBorder 
        title={`RASCUNHOS (${drafts.length})`} 
        open={drafts.length > 0} 
        theme={'#ff6b35'} 
        sx_title={{ whiteSpace: 'wrap' }}
      >
        {drafts.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            Nenhum rascunho encontrado.
          </Typography>
        ) : (
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {drafts.map((draft) => (
              <Card 
                key={draft._id} 
                sx={{ 
                  border: selectedAnalysis?._id === draft._id ? '2px solid #ff6b35' : '1px solid #ff6b3580',
                  borderRadius: 1,
                  background: selectedAnalysis?._id === draft._id 
                    ? 'linear-gradient(145deg, #fff5f0 0%, #ffffff 100%)' 
                    : '#ffffff',
                  transition: 'all 0.2s',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(255,107,53,0.15)' },
                }}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#ff6b35' }}>
                        {draft.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {draft.description || 'Sem descrição'}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          label={`${draft.samples?.length || 0} amostras`} 
                          size="small" 
                          color={draft.samples?.length >= 5 ? 'success' : 'warning'} 
                          variant="outlined" 
                        />
                        <Chip 
                          label={getStatusLabel(draft.status)} 
                          size="small" 
                          color={getStatusColor(draft.status)} 
                          variant="outlined" 
                        />
                        <Chip 
                          label={`Criado: ${formatDate(draft.createdAt)}`} 
                          size="small" 
                          variant="outlined" 
                        />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5, ml: 2 }}>
                      <Tooltip title="Editar rascunho">
                        <IconButton size="small" onClick={() => handleEdit(draft)} 
                          sx={{ 
                            color: '#ff6b35',
                            '&:hover': { backgroundColor: 'rgba(255,107,53,0.1)' }
                          }}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir rascunho">
                        <IconButton size="small" onClick={() => handleDelete(draft._id)} 
                          sx={{ 
                            color: '#ff1744',
                            '&:hover': { backgroundColor: 'rgba(255,23,68,0.1)' }
                          }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleSelect(draft)}
                      sx={{ 
                        flex: 1,
                        borderRadius: 1,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        borderColor: '#ff6b35',
                        color: '#ff6b35',
                        '&:hover': {
                          borderColor: '#e55a2b',
                          backgroundColor: 'rgba(255,107,53,0.04)',
                        }
                      }}
                    >
                      {selectedAnalysis?._id === draft._id ? 'SELECIONADO' : 'SELECIONAR'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </FlexColumnBorder>

      {/* ANÁLISES COMPLETAS */}
      <FlexColumnBorder 
        title={`ANÁLISES COMPLETAS (${analyses.length})`} 
        open={true} 
        theme={'#07B811'} 
        sx_title={{ whiteSpace: 'wrap' }}
      >
        {analyses.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            Nenhuma análise completa encontrada. Crie uma nova análise na aba &quot;Dados Gerais&quot;.
          </Typography>
        ) : (
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {analyses.map((analysis) => (
              <Card 
                key={analysis._id} 
                sx={{ 
                  border: selectedAnalysis?._id === analysis._id ? '2px solid #07B811' : '1px solid #07B81180',
                  borderRadius: 1,
                  background: selectedAnalysis?._id === analysis._id 
                    ? 'linear-gradient(145deg, #f0fff0 0%, #ffffff 100%)' 
                    : '#ffffff',
                  transition: 'all 0.2s',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(7,184,17,0.15)' },
                }}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ 
                        fontWeight: 700, 
                        color: selectedAnalysis?._id === analysis._id ? '#07B811' : '#2c3e50' 
                      }}>
                        {selectedAnalysis?._id === analysis._id && '✅ '}
                        {analysis.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {analysis.description || 'Sem descrição'}
                      </Typography>
                      {(analysis as any).location && (
                        <Typography variant="caption" display="block" sx={{ mt: 0.5, color: '#666' }}>
                          📍 {(analysis as any).location} - {(analysis as any).highway || 'Rodovia não informada'}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          label={`${analysis.samples?.length || 0} amostras`} 
                          size="small" 
                          color={analysis.samples?.length >= 5 ? 'success' : 'warning'} 
                          variant="outlined" 
                        />
                        <Chip 
                          label={getStatusLabel(analysis.status)} 
                          size="small" 
                          color={getStatusColor(analysis.status)} 
                          variant="outlined" 
                        />
                        <Chip 
                          label={`Criada: ${formatDate(analysis.createdAt)}`} 
                          size="small" 
                          variant="outlined" 
                        />
                        {analysis.updatedAt && (
                          <Chip 
                            label={`Atualizada: ${formatDate(analysis.updatedAt)}`} 
                            size="small" 
                            variant="outlined" 
                          />
                        )}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5, ml: 2 }}>
                      <Tooltip title="Visualizar resultados">
                        <IconButton size="small" onClick={() => handleViewResults(analysis)}
                          sx={{ 
                            color: '#07B811',
                            '&:hover': { backgroundColor: 'rgba(7,184,17,0.1)' }
                          }}>
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar análise">
                        <IconButton size="small" onClick={() => handleEdit(analysis)}
                          sx={{ 
                            color: '#07B811',
                            '&:hover': { backgroundColor: 'rgba(7,184,17,0.1)' }
                          }}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir análise">
                        <IconButton size="small" onClick={() => handleDelete(analysis._id)}
                          sx={{ 
                            color: '#ff1744',
                            '&:hover': { backgroundColor: 'rgba(255,23,68,0.1)' }
                          }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                      size="small"
                      variant={selectedAnalysis?._id === analysis._id ? "contained" : "outlined"}
                      onClick={() => handleSelect(analysis)}
                      sx={{ 
                        flex: 1,
                        borderRadius: 1,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        ...(selectedAnalysis?._id === analysis._id 
                          ? { 
                              backgroundColor: '#07B811',
                              '&:hover': { backgroundColor: '#05a00e' }
                            }
                          : {
                              borderColor: '#07B811',
                              color: '#07B811',
                              '&:hover': {
                                borderColor: '#05a00e',
                                backgroundColor: 'rgba(7,184,17,0.04)',
                              }
                            }
                        )
                      }}
                    >
                      {selectedAnalysis?._id === analysis._id ? 'SELECIONADA' : 'SELECIONAR'}
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleViewResults(analysis)}
                      startIcon={<Visibility />}
                      sx={{ 
                        flex: 1,
                        borderRadius: 1,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        borderColor: '#07B811',
                        color: '#07B811',
                        '&:hover': {
                          borderColor: '#05a00e',
                          backgroundColor: 'rgba(7,184,17,0.04)',
                        }
                      }}
                    >
                      RESULTADOS
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </FlexColumnBorder>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FWD_step2;