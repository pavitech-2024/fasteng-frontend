import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Button, Divider, CircularProgress, Alert, Chip } from '@mui/material';
import { ArrowBack, CheckCircleOutline, TrendingUp, Warning, BarChart, Assessment } from '@mui/icons-material';
import { useRouter } from 'next/router';
import iggAnalysisService from '@/services/promedina/igg/igg-view.service';

const PRIMARY_GREEN = '#388e3c';
const BORDER_GREEN = '#06B811';
const LIGHT_GREEN_BG = '#e8f5e9';

const IggViewDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadAnalysis(id as string);
  }, [id]);

  const loadAnalysis = async (analysisId: string) => {
    try {
      setLoading(true);
      const response = await iggAnalysisService.getAnalysis(analysisId);
      setAnalysis(response.data);
    } catch (error) {
      console.error('Erro ao carregar análise:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: PRIMARY_GREEN }} />
      </Box>
    );
  }

  if (!analysis) {
    return (
      <Box sx={{ p: 3, pt: '4rem', display: 'flex', justifyContent: 'center' }}>
        <Alert severity="error">Análise não encontrada.</Alert>
      </Box>
    );
  }

  const stats = analysis.results?.statistics;
  const generalData = analysis;

  return (
    <Box 
      sx={{ 
        p: 3, 
        backgroundColor: '#f0f2f5', 
        minHeight: '100vh',
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50' }}>
            <Assessment sx={{ mr: 1, color: PRIMARY_GREEN }} fontSize="inherit" /> 
            RELATÓRIO: {analysis.name}
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => router.push('/promedina/IGG/view')} 
            startIcon={<ArrowBack />}
            sx={{ borderColor: BORDER_GREEN, color: BORDER_GREEN }}
          >
            Voltar para Lista
          </Button>
        </Box>
        <Divider sx={{ mb: 4, borderColor: BORDER_GREEN }} />

        {stats ? (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* Coluna 1: IGG e Indicadores */}
            <Box sx={{ width: { xs: '100%', md: '40%' } }}>
              <Card 
                variant="outlined" 
                sx={{ 
                  backgroundColor: stats.cor_classificacao, 
                  color: 'white', 
                  textAlign: 'center', 
                  mb: 3, 
                  boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
                  border: `2px solid ${BORDER_GREEN}`,
                }}
              >
                <CardContent>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>ÍNDICE DE GRAVIDADE GLOBAL</Typography>
                  <Typography variant="h2" sx={{ fontWeight: 800 }}>{stats.IGG?.toFixed(2)}</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{stats.classificacao}</Typography>
                </CardContent>
              </Card>

              <Paper variant="outlined" sx={{ p: 2, mb: 3, border: `1px solid ${BORDER_GREEN}` }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: PRIMARY_GREEN }}>
                  <TrendingUp sx={{ mr: 0.5 }} fontSize="small" /> Indicadores
                </Typography>
                <Table size="small">
                  <TableBody>
                    <TableRow><TableCell sx={{ fontWeight: 'bold' }}>F (Média Flecha)</TableCell><TableCell>{stats.F?.toFixed(2)} mm</TableCell></TableRow>
                    <TableRow><TableCell sx={{ fontWeight: 'bold' }}>FV (Variância)</TableCell><TableCell>{stats.FV?.toFixed(2)}</TableCell></TableRow>
                    <TableRow><TableCell sx={{ fontWeight: 'bold' }}>Total Estações</TableCell><TableCell>{stats.total_estacoes}</TableCell></TableRow>
                    <TableRow><TableCell sx={{ fontWeight: 'bold' }}>Total Defeitos</TableCell><TableCell>{stats.total_defeitos}</TableCell></TableRow>
                  </TableBody>
                </Table>
              </Paper>

              {stats.estacao_critica && (
                <Alert 
                  severity="error" 
                  icon={<Warning />} 
                  sx={{ mb: 3, border: `1px solid #e74c3c` }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Ponto de Atenção Crítico:</Typography>
                  <Typography variant="body2">
                    Estaca <strong>{stats.estacao_critica.stationNumber}</strong> - Seção {stats.estacao_critica.section}
                  </Typography>
                  <Typography variant="caption">
                    Maior número de ocorrências de defeitos registrados.
                  </Typography>
                </Alert>
              )}
            </Box>

            {/* Coluna 2: Detalhes */}
            <Box sx={{ width: { xs: '100%', md: '60%' } }}>
              <Paper variant="outlined" sx={{ p: 2, mb: 3, border: `1px solid ${BORDER_GREEN}` }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: PRIMARY_GREEN }}>
                  <BarChart sx={{ mr: 0.5 }} fontSize="small" /> Dados do Trecho Analisado
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                  <Typography variant="body2"><strong>Nome:</strong> {generalData.name}</Typography>
                  <Typography variant="body2"><strong>Rodovia:</strong> {generalData.road}</Typography>
                  <Typography variant="body2"><strong>Trecho:</strong> {generalData.section}</Typography>
                  <Typography variant="body2"><strong>Data:</strong> {generalData.evaluationDate ? new Date(generalData.evaluationDate).toLocaleDateString('pt-BR') : '-'}</Typography>
                  <Typography variant="body2"><strong>Revestimento:</strong> {generalData.pavementType}</Typography>
                  <Typography variant="body2"><strong>Estações:</strong> {generalData.stations?.length || 0}</Typography>
                  {generalData.subtrack && (
                    <Typography variant="body2"><strong>Subtramo:</strong> {generalData.subtrack}</Typography>
                  )}
                  {generalData.description && (
                    <Box sx={{ gridColumn: 'span 2', mt: 1 }}>
                      <Typography variant="body2"><strong>Observações:</strong> {generalData.description}</Typography>
                    </Box>
                  )}
                </Box>
              </Paper>

              {stats.composicao_igg && stats.composicao_igg.length > 0 && (
                <Paper variant="outlined" sx={{ p: 2, border: `1px solid ${BORDER_GREEN}` }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: PRIMARY_GREEN }}>
                    <BarChart sx={{ mr: 0.5 }} fontSize="small" /> Composição do IGG (Pontos)
                  </Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: LIGHT_GREEN_BG }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Fator Contribuinte</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Pontos</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>% Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.composicao_igg.map((item: any, i: number) => (
                        <TableRow key={i} hover>
                          <TableCell>{item.fator}</TableCell>
                          <TableCell>{item.valor?.toFixed(2)}</TableCell>
                          <TableCell>
                            {stats.IGG > 0 ? ((item.valor / stats.IGG) * 100).toFixed(1) : '0'}%
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ backgroundColor: LIGHT_GREEN_BG }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Total IGG</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>{stats.IGG?.toFixed(2)}</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>100.0%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Paper>
              )}
            </Box>
          </Box>
        ) : (
          <Alert severity="warning">Resultados não processados para esta análise.</Alert>
        )}
      </Paper>
    </Box>
  );
};

export default IggViewDetails;