// components/promedina/IGG/register/results.igg.tsx
import React, { useEffect } from 'react';
import { Box, Typography, Paper, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Alert, Divider } from '@mui/material';
import { CheckCircleOutline, TrendingUp, Warning, BarChart } from '@mui/icons-material';
import { useIggStore } from '@/stores/promedina/igg/igg.store';
import { EssayPageProps } from '@/components/templates/essay';

const PRIMARY_GREEN = '#388e3c';
const LIGHT_GREEN_BG = '#e8f5e9';

const IggResults: React.FC<EssayPageProps> = ({ setNextDisabled }) => {
  const { results, generalData, stations } = useIggStore();

  // ✅ Último step: SEMPRE habilita o botão (é Save/Update)
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

          {stats.estacao_critica && stats.estacao_critica.id !== 0 && (
            <Alert 
              severity="error" 
              icon={<Warning />} 
              sx={{ mb: 3, border: '1px solid #e74c3c' }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Ponto de Atenção Crítico:
              </Typography>
              <Typography variant="body2">
                Estaca <strong>{stats.estacao_critica.stationNumber}</strong> - Seção {stats.estacao_critica.section}
              </Typography>
              <Typography variant="caption">
                Maior número de ocorrências de defeitos registrados.
              </Typography>
            </Alert>
          )}
        </Box>

        {/* Coluna 2: Composição IGG e Dados do Trecho */}
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
                    <TableCell>{item.fator}</TableCell>
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