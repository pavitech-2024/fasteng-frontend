import { EssayPageProps } from '../../../templates/essay';
import { Box, Typography, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Alert, CircularProgress, Chip, Tooltip, IconButton, Snackbar } from '@mui/material';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Assessment, FileUpload } from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import * as XLSX from 'xlsx';
import { useState, useEffect } from 'react';
import useFWDStore from '@/stores/promedina/fwd/fwd.store';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend);

const pos_sensores = [0, 20, 30, 45, 60, 90, 120, 150, 180];

const FWD_step3 = ({ setNextDisabled }: EssayPageProps) => {
  const {
    selectedAnalysis,
    procResult, procError,
    loading, error, setError,
    processAnalysis, fetchAnalyses,
  } = useFWDStore();

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' });

  useEffect(() => {
    setNextDisabled?.(false);
  }, []);

  const handleProcessar = async () => {
    await processAnalysis();
  };

  const handleExportSubtrechos = () => {
    if (!procResult || !procResult.subtrechos || procResult.subtrechos.length === 0) {
      setSnackbar({ open: true, message: 'Nenhum subtrecho para exportar. Processe a análise primeiro.', severity: 'warning' });
      return;
    }

    try {
      const exportData = procResult.subtrechos.map((sub, index) => ({
        'Subtrecho': index + 1,
        'Início (Estaca)': sub['Início (Estaca)'],
        'Fim (Estaca)': sub['Fim (Estaca)'],
        'Comprimento (m)': sub['Comprimento (m)'],
        'N Amostras': sub['N Amostras'],
        'd0 (µm)': sub.d0,
        'd20 (µm)': sub.d20,
        'd30 (µm)': sub.d30,
        'd45 (µm)': sub.d45,
        'd60 (µm)': sub.d60,
        'd90 (µm)': sub.d90,
        'd120 (µm)': sub.d120,
        'd150 (µm)': sub.d150,
        'd180 (µm)': sub.d180,
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Subtrechos_Homogeneos');

      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const fileName = `subtrechos_fwd_${selectedAnalysis?.name || 'analise'}_${timestamp}.xlsx`;

      XLSX.writeFile(wb, fileName);

      setSnackbar({ open: true, message: 'Planilha exportada com sucesso!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Erro ao exportar planilha', severity: 'error' });
    }
  };

  // Dados para gráfico d0
  const d0ChartData = procResult && procResult.ordered && procResult.ordered.length > 0
    ? {
        labels: procResult.ordered.map((r) => r.stationNumber),
        datasets: [
          {
            label: 'd0 (Deflexão Máxima)',
            data: procResult.ordered.map((r) => r.d0),
            borderColor: '#07B811',
            backgroundColor: 'rgba(7, 184, 17, 0.2)',
            borderWidth: 2,
            pointRadius: 3,
            fill: false,
            tension: 0.2,
          },
          {
            label: 'Quebra (CV > 30%)',
            data: procResult.ordered.map((_, i) =>
              procResult.quebra && procResult.quebra[i] ? procResult.ordered[i].d0 : NaN
            ),
            borderColor: 'red',
            backgroundColor: 'red',
            borderWidth: 0,
            pointRadius: 6,
            pointBackgroundColor: 'red',
          },
        ],
      }
    : undefined;

  // Dados para bacia de deflexão
  const baciaChartData = procResult && procResult.subtrechos && procResult.subtrechos.length > 0
    ? {
        labels: pos_sensores.map((x) => `${x} cm`),
        datasets: procResult.subtrechos.map((sub, i) => ({
          label: `Subtrecho ${i + 1}: Est. ${sub['Início (Estaca)']}–${sub['Fim (Estaca)']}`,
          data: pos_sensores.map((p) => {
            const value = sub[`d${p}` as keyof typeof sub];
            return typeof value === 'number' ? value : 0;
          }),
          fill: false,
          borderWidth: 2,
          borderColor: `hsl(${(i * 77) % 360}, 64%, 54%)`,
          backgroundColor: `hsl(${(i * 77) % 360}, 64%, 54%)`,
          pointRadius: 5,
          pointBorderWidth: 2,
        })),
      }
    : undefined;

  return (
    <>
      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>{error}</Alert>}

      {/* CABEÇALHO */}
      <FlexColumnBorder title="PROCESSAMENTO FWD" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {!selectedAnalysis ? (
            <Alert severity="info" sx={{ width: '100%' }}>
              Nenhuma análise selecionada. Vá para a aba "Gerenciar Análises" e selecione uma.
            </Alert>
          ) : selectedAnalysis.samples?.length < 5 ? (
            <Alert severity="warning" sx={{ width: '100%' }}>
              Análise <strong>{selectedAnalysis.name}</strong> possui apenas {selectedAnalysis.samples?.length || 0} amostras. 
              Mínimo de 5 amostras necessário para processamento.
            </Alert>
          ) : (
            <>
              <Box sx={{ width: '100%', display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip 
                  label={`Análise: ${selectedAnalysis.name}`} 
                  color="success" 
                  variant="outlined" 
                  sx={{ fontWeight: 600 }}
                />
                <Chip 
                  label={`${selectedAnalysis.samples?.length || 0} amostras`} 
                  color="success" 
                  variant="outlined" 
                  sx={{ fontWeight: 600 }}
                />
                {selectedAnalysis.status === 'completed' && (
                  <Chip 
                    label="Processada" 
                    color="info" 
                    variant="outlined" 
                    sx={{ fontWeight: 600 }}
                  />
                )}
              </Box>

              <Box sx={{ width: '100%', display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  onClick={handleProcessar}
                  startIcon={loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : <Assessment />}
                  variant="contained"
                  disabled={loading}
                  sx={{ 
                    backgroundColor: '#07B811',
                    '&:hover': { backgroundColor: '#05a00e' },
                    fontWeight: 700,
                  }}
                >
                  {loading ? 'PROCESSANDO...' : 'PROCESSAR ANÁLISE'}
                </Button>

                <Button
                  onClick={handleExportSubtrechos}
                  startIcon={<FileUpload />}
                  variant="outlined"
                  disabled={!procResult || procResult.subtrechos?.length === 0}
                  sx={{ 
                    borderColor: '#07B811',
                    color: '#07B811',
                    '&:hover': {
                      borderColor: '#05a00e',
                      backgroundColor: 'rgba(7,184,17,0.04)',
                    },
                    fontWeight: 600,
                  }}
                >
                  EXPORTAR PLANILHA
                </Button>
              </Box>

              <Box sx={{ width: '100%', mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Critérios: CV {'>'} 30% | Mínimo 200m | Máximo 2000m
                  </Typography>
                  <Tooltip title="Os subtrechos são definidos por quebras no Coeficiente de Variação (CV > 30%) ou comprimento máximo de 2000m. O último subtrecho não tem restrição de comprimento mínimo." arrow>
                    <IconButton size="small" sx={{ color: '#07B811' }}>
                      <HelpOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </FlexColumnBorder>

      {/* ERRO DE PROCESSAMENTO */}
      {procError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => useFWDStore.getState().setProcError(null)}>
          {procError}
        </Alert>
      )}

      {/* RESULTADOS */}
      {procResult && procResult.ordered && procResult.ordered.length > 0 && (
        <>
          {/* GRÁFICO d0 */}
          <FlexColumnBorder title="GRÁFICO DEFLEXÃO d0" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
            <Box sx={{ width: '100%', height: 350 }}>
              {d0ChartData && (
                <Line
                  data={d0ChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top' as const,
                        labels: { font: { size: 11 } }
                      },
                      title: {
                        display: true,
                        text: 'Deflexão Máxima (d0) e Pontos de Quebra (CV > 30%)',
                        font: { size: 13 }
                      },
                    },
                    scales: {
                      x: {
                        title: { display: true, text: 'Estaca' },
                        ticks: { font: { size: 10 } }
                      },
                      y: {
                        title: { display: true, text: 'Deflexão d0 (µm)' },
                        ticks: { font: { size: 10 } }
                      },
                    },
                  }}
                />
              )}
            </Box>
          </FlexColumnBorder>

          {/* TABELA DE SUBTRECHOS */}
          <FlexColumnBorder title={`SUBTRECHOS HOMOGÊNEOS (${procResult.subtrechos?.length || 0})`} open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
            <Box sx={{ width: '100%' }}>
              <TableContainer component={Paper} sx={{ border: '1px solid #07B811', borderRadius: 1 }}>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: '#f0fff0' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: '#07B811', whiteSpace: 'nowrap' }}>INÍCIO (EST.)</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#07B811', whiteSpace: 'nowrap' }}>FIM (EST.)</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#07B811', whiteSpace: 'nowrap' }}>COMP. (m)</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#07B811', whiteSpace: 'nowrap' }}>N AMOST.</TableCell>
                      {pos_sensores.map((d) => (
                        <TableCell key={d} sx={{ fontWeight: 700, color: '#07B811', whiteSpace: 'nowrap' }}>
                          d{d}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {procResult.subtrechos?.map((sub, i) => {
                      const compMetros = sub['Comprimento (m)'];
                      const isForaPadrao = compMetros < 200 && i < (procResult.subtrechos?.length || 0) - 1;
                      
                      return (
                        <TableRow 
                          key={i} 
                          sx={{ 
                            '&:nth-of-type(odd)': { backgroundColor: '#f8fff8' },
                            backgroundColor: isForaPadrao ? '#fff8e1' : undefined
                          }}
                        >
                          <TableCell>{sub['Início (Estaca)']}</TableCell>
                          <TableCell>{sub['Fim (Estaca)']}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {compMetros}
                              {isForaPadrao && (
                                <Chip label="Atenção" size="small" color="warning" sx={{ height: 18, fontSize: '0.6rem' }} />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>{sub['N Amostras']}</TableCell>
                          {pos_sensores.map((d) => (
                            <TableCell key={d}>
                              {sub[`d${d}` as keyof typeof sub]}
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {procResult.subtrechos?.some((s, i) => s['Comprimento (m)'] < 200 && i < procResult.subtrechos.length - 1) && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Alguns subtrechos estão abaixo de 200m. Apenas o último subtrecho pode ter comprimento inferior ao mínimo.
                </Alert>
              )}
            </Box>
          </FlexColumnBorder>

          {/* BACIAS DE DEFLEXÃO */}
          {baciaChartData && baciaChartData.datasets && baciaChartData.datasets.length > 0 && (
            <FlexColumnBorder title="BACIAS DE DEFLEXÃO CARACTERÍSTICAS" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box sx={{ width: '100%', height: 350 }}>
                <Line
                  data={baciaChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top' as const,
                        labels: { font: { size: 11 } }
                      },
                      title: {
                        display: true,
                        text: 'Bacias de Deflexão Características por Subtrecho',
                        font: { size: 13 }
                      },
                    },
                    scales: {
                      x: {
                        title: { display: true, text: 'Distância do Centro (cm)' },
                        ticks: { font: { size: 10 } }
                      },
                      y: {
                        title: { display: true, text: 'Deflexão característica (µm)' },
                        reverse: true,
                        ticks: { font: { size: 10 } }
                      },
                    },
                  }}
                />
              </Box>
            </FlexColumnBorder>
          )}

          {/* ESTATÍSTICAS */}
          <FlexColumnBorder title="ESTATÍSTICAS DO PROCESSAMENTO" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
            <Box sx={{ width: '100%', display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                label={`Total de amostras: ${procResult.ordered?.length || 0}`} 
                variant="outlined" 
                color="success" 
                sx={{ fontWeight: 600 }}
              />
              <Chip 
                label={`Subtrechos: ${procResult.subtrechos?.length || 0}`} 
                variant="outlined" 
                color="success" 
                sx={{ fontWeight: 600 }}
              />
              <Chip 
                label={`Média d0: ${(procResult.media_d0?.reduce((a, b) => a + b, 0) / procResult.media_d0?.length || 0).toFixed(1)} µm`} 
                variant="outlined" 
                sx={{ fontWeight: 600 }}
              />
              <Chip 
                label={`CV médio: ${(procResult.cv_d0?.reduce((a, b) => a + b, 0) / procResult.cv_d0?.length || 0).toFixed(1)}%`} 
                variant="outlined" 
                color={procResult.cv_d0?.some(cv => cv > 30) ? 'warning' : 'success'}
                sx={{ fontWeight: 600 }}
              />
              <Chip 
                label={`Quebras: ${procResult.quebra?.filter(q => q).length || 0}`} 
                variant="outlined" 
                color="error" 
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </FlexColumnBorder>
        </>
      )}

      {/* SEM RESULTADOS */}
      {!procResult && !loading && selectedAnalysis && selectedAnalysis.samples?.length >= 5 && (
        <FlexColumnBorder title="INSTRUÇÕES" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
          <Box sx={{ width: '100%', textAlign: 'center', py: 2 }}>
            <Assessment sx={{ fontSize: 48, color: '#07B811', mb: 1 }} />
            <Typography variant="h6" sx={{ color: '#07B811', fontWeight: 600, mb: 1 }}>
              Pronto para Processar
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Clique em &quot;PROCESSAR ANÁLISE&quot; para gerar os subtrechos homogêneos e visualizar os gráficos de deflexão.
            </Typography>
          </Box>
        </FlexColumnBorder>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FWD_step3;