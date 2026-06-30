import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Button, Divider, CircularProgress, Alert, Chip } from '@mui/material';
import { ArrowBack, Assessment, Speed, Timeline, BarChart, TableChart } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import fwdAnalysisService from '@/services/asphalt/essays/fwd/fwdApi';
import { processarSubtrechos } from '@/utils/fwdProcessing';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PRIMARY_GREEN = '#07B811';
const BORDER_GREEN = '#07B811';
const LIGHT_GREEN_BG = '#f0fff0';
const pos_sensores = [0, 20, 30, 45, 60, 90, 120, 150, 180];

const FwdViewDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [analysis, setAnalysis] = useState<any>(null);
  const [procResult, setProcResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadAnalysis(id as string);
  }, [id]);

  const loadAnalysis = async (analysisId: string) => {
    try {
      setLoading(true);
      const response = await fwdAnalysisService.getAnalysis(analysisId);
      const data = response.data?.data || response.data;
      setAnalysis(data);

      // Processa localmente se tiver amostras suficientes
      if (data?.samples?.length >= 5) {
        try {
          const result = processarSubtrechos(data.samples);
          setProcResult(result);
        } catch (err) {
          console.error('Erro ao processar:', err);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar análise:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const getLastSubtrechoIndex = () => {
    return (procResult?.subtrechos?.length || 0) - 1;
  };

  // Gráfico d0
  const d0ChartData = procResult?.ordered?.length ? {
    labels: procResult.ordered.map((r: any) => r.stationNumber),
    datasets: [
      {
        label: 'd0 (Deflexão Máxima)',
        data: procResult.ordered.map((r: any) => r.d0),
        borderColor: PRIMARY_GREEN,
        backgroundColor: 'rgba(7, 184, 17, 0.2)',
        borderWidth: 2, pointRadius: 3, fill: false, tension: 0.2,
      },
      {
        label: 'Quebra (CV > 30%)',
        data: procResult.ordered.map((_: any, i: number) =>
          procResult.quebra?.[i] ? procResult.ordered[i].d0 : NaN
        ),
        borderColor: 'red', backgroundColor: 'red',
        borderWidth: 0, pointRadius: 6, pointBackgroundColor: 'red',
      },
    ],
  } : undefined;

  // Bacia de deflexão
  const baciaChartData = procResult?.subtrechos?.length ? {
    labels: pos_sensores.map(x => `${x} cm`),
    datasets: procResult.subtrechos.map((sub: any, i: number) => ({
      label: `Subtrecho ${i + 1}: Est. ${sub['Início (Estaca)']}–${sub['Fim (Estaca)']}`,
      data: pos_sensores.map(p => typeof sub[`d${p}`] === 'number' ? sub[`d${p}`] : 0),
      fill: false, borderWidth: 2,
      borderColor: `hsl(${(i * 77) % 360}, 64%, 54%)`,
      backgroundColor: `hsl(${(i * 77) % 360}, 64%, 54%)`,
      pointRadius: 5, pointBorderWidth: 2,
    })),
  } : undefined;

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

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: '#f0f2f5',
        minHeight: '100vh',
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
          maxWidth: '1400px',
          mt: { xs: '2rem', md: '3rem' },
        }}
      >
        {/* CABEÇALHO */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50' }}>
            <Speed sx={{ mr: 1, color: PRIMARY_GREEN }} fontSize="inherit" />
            RELATÓRIO FWD: {analysis.name}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => router.push('/asphalt/essays/fwd/view')}
            startIcon={<ArrowBack />}
            sx={{ borderColor: BORDER_GREEN, color: BORDER_GREEN }}
          >
            Voltar para Lista
          </Button>
        </Box>
        <Divider sx={{ mb: 4, borderColor: BORDER_GREEN }} />

        {/* DADOS GERAIS */}
        <Paper variant="outlined" sx={{ p: 2, mb: 3, border: `1px solid ${BORDER_GREEN}` }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: PRIMARY_GREEN }}>
            <Assessment sx={{ mr: 0.5 }} fontSize="small" /> Dados da Análise
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Nome
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {analysis.name || '-'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Amostras
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {analysis.samples?.length || 0}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Status
              </Typography>
              <Chip
                label={
                  analysis.status === 'completed' ? 'Finalizada' : analysis.status === 'draft' ? 'Rascunho' : 'Ativa'
                }
                size="small"
                color={analysis.status === 'completed' ? 'success' : analysis.status === 'draft' ? 'warning' : 'info'}
              />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Criada em
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {formatDate(analysis.createdAt)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Atualizada em
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {analysis.updatedAt ? formatDate(analysis.updatedAt) : '-'}
              </Typography>
            </Box>
            {analysis.description && (
              <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 3' } }}>
                <Typography variant="body2" color="text.secondary">
                  Descrição
                </Typography>
                <Typography variant="body1">{analysis.description}</Typography>
              </Box>
            )}
          </Box>
        </Paper>

        {/* RESULTADOS DO PROCESSAMENTO */}
        {procResult ? (
          <>
            {/* GRÁFICO d0 */}
            <Paper variant="outlined" sx={{ p: 2, mb: 3, border: `1px solid ${BORDER_GREEN}` }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: PRIMARY_GREEN }}>
                <Timeline sx={{ mr: 0.5 }} fontSize="small" /> Gráfico de Deflexão Máxima (d0)
              </Typography>
              <Box sx={{ height: 350 }}>
                {d0ChartData && (
                  <Line
                    data={d0ChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: true, position: 'top' as const },
                        title: { display: true, text: 'Deflexão d0 e Pontos de Quebra (CV > 30%)' },
                      },
                      scales: {
                        x: { title: { display: true, text: 'Estaca' } },
                        y: { title: { display: true, text: 'Deflexão d0 (µm)' } },
                      },
                    }}
                  />
                )}
              </Box>
            </Paper>

            {/* TABELA DE SUBTRECHOS */}
            <Paper variant="outlined" sx={{ p: 2, mb: 3, border: `1px solid ${BORDER_GREEN}` }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: PRIMARY_GREEN }}>
                <TableChart sx={{ mr: 0.5 }} fontSize="small" />
                Subtrechos Homogêneos ({procResult.subtrechos?.length || 0})
              </Typography>
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: LIGHT_GREEN_BG }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: PRIMARY_GREEN }}>INÍCIO (EST.)</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: PRIMARY_GREEN }}>FIM (EST.)</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: PRIMARY_GREEN }}>COMP. (m)</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: PRIMARY_GREEN }}>N AMOST.</TableCell>
                      {pos_sensores.map((d) => (
                        <TableCell key={d} sx={{ fontWeight: 700, color: PRIMARY_GREEN }}>
                          d{d}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {procResult.subtrechos?.map((sub: any, i: number) => {
                      const compMetros = sub['Comprimento (m)'];
                      const isUltimo = i === getLastSubtrechoIndex();
                      const isForaPadrao = !isUltimo && compMetros < 200;

                      return (
                        <TableRow
                          key={i}
                          sx={{
                            '&:nth-of-type(odd)': { backgroundColor: '#f8fff8' },
                            backgroundColor: isForaPadrao ? '#fff8e1' : undefined,
                          }}
                        >
                          <TableCell>{sub['Início (Estaca)']}</TableCell>
                          <TableCell>{sub['Fim (Estaca)']}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {compMetros}
                              {isUltimo && compMetros < 200 && (
                                <Chip
                                  label="Último"
                                  size="small"
                                  color="info"
                                  sx={{ height: 18, fontSize: '0.6rem' }}
                                />
                              )}
                              {isForaPadrao && (
                                <Chip label="!" size="small" color="warning" sx={{ height: 18, fontSize: '0.6rem' }} />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>{sub['N Amostras']}</TableCell>
                          {pos_sensores.map((d) => (
                            <TableCell key={d}>{sub[`d${d}`]}</TableCell>
                          ))}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
            </Paper>

            {/* BACIAS DE DEFLEXÃO */}
            {baciaChartData && (
              <Paper variant="outlined" sx={{ p: 2, mb: 3, border: `1px solid ${BORDER_GREEN}` }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: PRIMARY_GREEN }}>
                  <BarChart sx={{ mr: 0.5 }} fontSize="small" /> Bacias de Deflexão Características
                </Typography>
                <Box sx={{ height: 350 }}>
                  <Line
                    data={baciaChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: true, position: 'top' as const },
                        title: { display: true, text: 'Bacias de Deflexão por Subtrecho' },
                      },
                      scales: {
                        x: { title: { display: true, text: 'Distância do Centro (cm)' } },
                        y: { title: { display: true, text: 'Deflexão (µm)' }, reverse: true },
                      },
                    }}
                  />
                </Box>
              </Paper>
            )}

            {/* ESTATÍSTICAS */}
            <Paper variant="outlined" sx={{ p: 2, border: `1px solid ${BORDER_GREEN}` }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: PRIMARY_GREEN }}>
                <BarChart sx={{ mr: 0.5 }} fontSize="small" /> Estatísticas do Processamento
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip
                  label={`Total: ${procResult.ordered?.length || 0} amostras`}
                  variant="outlined"
                  color="success"
                  sx={{ fontWeight: 600 }}
                />
                <Chip
                  label={`${procResult.subtrechos?.length || 0} subtrechos`}
                  variant="outlined"
                  color="success"
                  sx={{ fontWeight: 600 }}
                />
                <Chip
                  label={`Média d0: ${(
                    procResult.media_d0?.reduce((a: number, b: number) => a + b, 0) / procResult.media_d0?.length || 0
                  ).toFixed(1)} µm`}
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
                <Chip
                  label={`CV médio: ${(
                    procResult.cv_d0?.reduce((a: number, b: number) => a + b, 0) / procResult.cv_d0?.length || 0
                  ).toFixed(1)}%`}
                  variant="outlined"
                  color={procResult.cv_d0?.some((cv: number) => cv > 30) ? 'warning' : 'success'}
                  sx={{ fontWeight: 600 }}
                />
                <Chip
                  label={`Quebras: ${procResult.quebra?.filter((q: boolean) => q).length || 0}`}
                  variant="outlined"
                  color="error"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Paper>
          </>
        ) : (
          <Alert severity={analysis.samples?.length >= 5 ? 'info' : 'warning'}>
            {analysis.samples?.length >= 5
              ? 'Análise possui amostras suficientes para processamento. Os resultados serão exibidos aqui.'
              : `Análise possui apenas ${
                  analysis.samples?.length || 0
                } amostras. Mínimo de 5 necessário para processamento.`}
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default FwdViewDetails;