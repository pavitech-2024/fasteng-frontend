// components/promedina/IGG/register/results.igg.tsx
import React, { useEffect, useMemo } from 'react';
import { Box, Typography, Paper, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Alert, Divider, Tooltip } from '@mui/material';
import { CheckCircleOutline, TrendingUp, Warning, BarChart, InfoOutlined } from '@mui/icons-material';
import { useIggStore } from '@/stores/promedina/igg/igg.store';
import { EssayPageProps } from '@/components/templates/essay';

const PRIMARY_GREEN = '#388e3c';
const LIGHT_GREEN_BG = '#e8f5e9';
const ERROR_RED = '#e74c3c';

// ✅ COMPONENTE DE GRÁFICO DE BARRAS (igual ao antigo)
const FrequencyBarChart: React.FC<{ data: Record<number, number> }> = ({ data }) => {
  const chartData = useMemo(() => {
    return Object.entries(data)
      .filter(([, freq]) => freq > 0)
      .map(([tipo, freq]) => ({
        tipo: `Tipo ${tipo}`,
        frequencia: parseFloat(freq.toFixed(1))
      }));
  }, [data]);

  if (chartData.length === 0) {
    return <Alert severity="warning" icon={<InfoOutlined />}>Nenhuma frequência de defeito significativa registrada.</Alert>;
  }

  const maxFreq = Math.max(...chartData.map(d => d.frequencia)) * 1.1 || 100;
  
  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
        Distribuição de Frequência Relativa de Tipos de Defeito (IGG)
      </Typography>
      {chartData.map(item => (
        <Box key={item.tipo} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Box sx={{ width: '25%', minWidth: 80 }}>
            <Typography variant="caption" noWrap>{item.tipo}</Typography>
          </Box>
          <Box sx={{ width: '70%' }}>
            <Box 
              sx={{ 
                height: 18, 
                backgroundColor: PRIMARY_GREEN, 
                width: `${(item.frequencia / maxFreq) * 100}%`, 
                borderRadius: 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                pr: 1,
                minWidth: '40px'
              }}
            >
              <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                {item.frequencia}%
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

const IggResults: React.FC<EssayPageProps> = ({ setNextDisabled }) => {
  const { results, generalData, stations } = useIggStore();

  useEffect(() => {
    setNextDisabled?.(false);
  }, [setNextDisabled]);

  if (!results) {
    return (
      <Alert severity="error">
        Nenhum resultado disponível. Processe a análise primeiro.
      </Alert>
    );
  }

  const stats = results.statistics;

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: PRIMARY_GREEN, fontWeight: 600 }}>
        <CheckCircleOutline sx={{ mr: 1 }} /> RESULTADOS DA ANÁLISE
      </Typography>
      <Divider sx={{ mb: 3, borderColor: PRIMARY_GREEN }} />

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
              boxShadow: '0 6px 15px rgba(0,0,0,0.2)'
            }}
          >
            <CardContent>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                ÍNDICE DE GRAVIDADE GLOBAL (IGG)
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 800 }}>
                {stats.IGG.toFixed(2)}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {stats.classificacao}
              </Typography>
            </CardContent>
          </Card>

          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: PRIMARY_GREEN }}>
              <TrendingUp sx={{ mr: 0.5 }} fontSize="small" /> Indicadores de Desempenho
            </Typography>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>F (Média Flecha)</TableCell>
                  <TableCell>{stats.F.toFixed(2)} mm</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>FV (Variância)</TableCell>
                  <TableCell>{stats.FV.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Total Estações</TableCell>
                  <TableCell>{stats.total_estacoes}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Total Defeitos</TableCell>
                  <TableCell>{stats.total_defeitos}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>

          {/* ✅ ESTAÇÃO CRÍTICA COM QUANTIDADE DE DEFEITOS (igual ao antigo) */}
          {stats.estacao_critica && stats.estacao_critica.id !== 0 && (
            <Alert 
              severity="error" 
              icon={<Warning />} 
              sx={{ mb: 3, border: `1px solid ${ERROR_RED}` }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Ponto de Atenção Crítico:
              </Typography>
              <Typography variant="body2">
                Estaca <strong>{stats.estacao_critica.stationNumber}</strong> (Seção {stats.estacao_critica.section}). 
                Registrou o maior número de ocorrências de defeitos 
                (<strong>{stats.estacao_critica.totalDefeitos || 
                  Object.values(stats.estacao_critica.defects || {}).reduce((sum: number, d: any) => sum + (d.count || 0), 0)
                }</strong>).
              </Typography>
            </Alert>
          )}
        </Box>

        {/* Coluna 2: Composição IGG e Frequências */}
        <Box sx={{ width: { xs: '100%', md: '60%' } }}>
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: PRIMARY_GREEN }}>
              <BarChart sx={{ mr: 0.5 }} fontSize="small" /> Composição do IGG (Pontos)
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: LIGHT_GREEN_BG }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Fator Contribuinte</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Pontos</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>% Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.composicao_igg.map((item, i) => (
                  <TableRow key={i} hover>
                    <TableCell>
                      {item.fator}
                      {item.tipo && (
                        <Tooltip title={`Tipo de defeito ${item.tipo}`}>
                          <InfoOutlined sx={{ fontSize: 14, ml: 0.5, color: '#90a4ae' }} />
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell>{item.valor.toFixed(2)}</TableCell>
                    <TableCell>
                      {stats.IGG > 0 ? ((item.valor / stats.IGG) * 100).toFixed(1) : '0.0'}%
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow sx={{ backgroundColor: LIGHT_GREEN_BG }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Total IGG</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{stats.IGG.toFixed(2)}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>100.0%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>

          {/* ✅ GRÁFICO DE BARRAS DE FREQUÊNCIA */}
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <FrequencyBarChart data={stats.frequencias_relativas} />
          </Paper>

          {/* Resumo dos Dados Gerais */}
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Dados do Trecho Analisado
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <Typography variant="body2"><strong>Nome:</strong> {generalData.name}</Typography>
              <Typography variant="body2"><strong>Rodovia:</strong> {generalData.road}</Typography>
              <Typography variant="body2"><strong>Trecho:</strong> {generalData.section}</Typography>
              <Typography variant="body2"><strong>Data:</strong> {generalData.evaluationDate}</Typography>
              <Typography variant="body2"><strong>Revestimento:</strong> {generalData.pavementType}</Typography>
              <Typography variant="body2"><strong>Estações:</strong> {stations.length}</Typography>
              {generalData.subtrack && (
                <Typography variant="body2"><strong>Subtramo:</strong> {generalData.subtrack}</Typography>
              )}
              {generalData.description && (
                <Box sx={{ gridColumn: 'span 2', mt: 1 }}>
                  <Typography variant="body2">
                    <strong>Observações:</strong> {generalData.description}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default IggResults;