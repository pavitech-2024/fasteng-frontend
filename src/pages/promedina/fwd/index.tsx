import { useState, useEffect } from 'react';
import {
  Typography,
  Container,
  Box,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Chip,
  IconButton,
  Grid,
  Alert,
  Stack,
  useMediaQuery,
  useTheme,
  Divider,
  Card,
  CardContent,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { Delete, Add, Assessment, ExpandMore } from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Api from '@/api';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`fwd-tabpanel-${index}`}
      aria-labelledby={`fwd-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: { xs: 2, md: 3 } }}>{children}</Box>}
    </div>
  );
}

interface FWDData {
  id?: number; // ID opcional (apenas para uso interno no frontend)
  stationNumber: number;
  d0: number;
  d20: number;
  d30: number;
  d45: number;
  d60: number;
  d90: number;
  d120: number;
  d150: number;
  d180: number;
  date?: string;
  airTemperature?: number;
  pavementTemperature?: number;
  appliedLoad?: number;
}

interface FWDAnalysis {
  id: string;
  name: string;
  description: string;
  samples: FWDData[];
  createdAt: string;
  status: 'active' | 'completed';
}

type Subtrecho = {
  'Início (Estaca)': number;
  'Fim (Estaca)': number;
  'Comprimento (m)': number;
  'N Amostras': number;
  d0: number;
  d20: number;
  d30: number;
  d45: number;
  d60: number;
  d90: number;
  d120: number;
  d150: number;
  d180: number;
};

const coef_K: Record<number, number> = {
  4: 3.00, 5: 1.55, 6: 1.41, 7: 1.36, 8: 1.31, 9: 1.25, 10: 1.21,
  11: 1.20, 12: 1.16, 13: 1.13, 14: 1.11, 15: 1.10, 16: 1.08, 17: 1.06,
  18: 1.05, 19: 1.04, 20: 1.02, 21: 1.01, 22: 1.00, 23: 1.00, 24: 1.00,
  25: 1.00, 26: 1.00, 27: 1.00, 28: 1.00, 29: 1.00, 30: 1.00,
};

function getCoefK(n: number) {
  if (n < 4) return 3.0;
  if (n > 30) return 1.0;
  return coef_K[n] ?? 1.0;
}

function rollingWindow(arr: number[], window: number) {
  const media: number[] = [];
  const std: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = arr.slice(start, i + 1);
    const m = slice.reduce((a, b) => a + b, 0) / slice.length;
    const s = Math.sqrt(slice.reduce((a, b) => a + (b - m) * (b - m), 0) / slice.length);
    media.push(m);
    std.push(s);
  }
  return { media, std };
}

function processarSubtrechos(dados: FWDData[]) {
  const colDef = ['d0', 'd20', 'd30', 'd45', 'd60', 'd90', 'd120', 'd150', 'd180'] as const;
  const estaca_para_metros = 20;
  const min_len = 200 / estaca_para_metros;
  const max_len = 5000 / estaca_para_metros;
  const janela = 5;
  const limiar_cv = 30;
  const ordered = [...dados].sort((a, b) => a.stationNumber - b.stationNumber);
  const d0Arr = ordered.map(r => r.d0);
  const { media: media_d0, std: std_d0 } = rollingWindow(d0Arr, janela);
  const cv_d0 = std_d0.map((s, i) => (media_d0[i] ? s / media_d0[i] * 100 : 0));
  const quebra = cv_d0.map(cv => cv > limiar_cv);
  const subtrechos: Subtrecho[] = [];
  let atual = 0;
  let inicio = ordered[0]?.stationNumber ?? 0;
  
  for (let i = 1; i < ordered.length; i++) {
    const comprimento_estacas = ordered[i].stationNumber - ordered[atual].stationNumber;
    if (quebra[i] || comprimento_estacas >= max_len) {
      const fim = ordered[i - 1].stationNumber;
      const n_amostras = i - atual;
      if (comprimento_estacas >= min_len) {
        const trecho = ordered.slice(atual, i);
        const medias: Record<string, number> = {};
        const desvios: Record<string, number> = {};
        colDef.forEach(col => {
          const vals = trecho.map(x => x[col]);
          const m = vals.reduce((a, b) => a + b, 0) / vals.length;
          const s = Math.sqrt(vals.reduce((a, b) => a + (b - m) * (b - m), 0) / vals.length);
          medias[col] = m;
          desvios[col] = s;
        });
        const K = getCoefK(n_amostras);
        const deflexoes_char: Record<string, number> = {};
        colDef.forEach(col => {
          deflexoes_char[col] = Number((medias[col] + K * desvios[col]).toFixed(1));
        });
        subtrechos.push({
          'Início (Estaca)': inicio,
          'Fim (Estaca)': fim,
          'Comprimento (m)': Number(((fim - inicio) * estaca_para_metros).toFixed(1)),
          'N Amostras': n_amostras,
          ...deflexoes_char,
        } as Subtrecho);
      }
      atual = i;
      inicio = ordered[i].stationNumber;
    }
  }
  
  // Último subtrecho
  const fim = ordered[ordered.length - 1]?.stationNumber ?? 0;
  const comprimento_final = fim - inicio;
  const n_amostras = ordered.length - atual;
  if (comprimento_final >= min_len) {
    const trecho = ordered.slice(atual);
    const medias: Record<string, number> = {};
    const desvios: Record<string, number> = {};
    colDef.forEach(col => {
      const vals = trecho.map(x => x[col]);
      const m = vals.reduce((a, b) => a + b, 0) / vals.length;
      const s = Math.sqrt(vals.reduce((a, b) => a + (b - m) * (b - m), 0) / vals.length);
      medias[col] = m;
      desvios[col] = s;
    });
    const K = getCoefK(n_amostras);
    const deflexoes_char: Record<string, number> = {};
    colDef.forEach(col => {
      deflexoes_char[col] = Number((medias[col] + K * desvios[col]).toFixed(1));
    });
    subtrechos.push({
      'Início (Estaca)': inicio,
      'Fim (Estaca)': fim,
      'Comprimento (m)': Number(((fim - inicio) * estaca_para_metros).toFixed(1)),
      'N Amostras': n_amostras,
      ...deflexoes_char,
        } as Subtrecho);
  }
  return { subtrechos, media_d0, std_d0, cv_d0, quebra, ordered };
}

const pos_sensores = [0, 20, 30, 45, 60, 90, 120, 150, 180];

// Serviço para comunicação com o backend
const fwdAnalysisService = {
  createAnalysis: (analysisData: any) => Api.post('fwd-analysis/save', analysisData),
  getAnalyses: () => Api.get('fwd-analysis/all'),
  getAnalysis: (analysisId: string) => Api.get(`fwd-analysis/${analysisId}`),
  updateAnalysis: (analysisId: string, analysisData: any) => Api.put(`fwd-analysis/${analysisId}`, analysisData),
  deleteAnalysis: (analysisId: string) => Api.delete(`fwd-analysis/${analysisId}`),
  processAnalysis: (analysisId: string) => Api.post(`fwd-analysis/${analysisId}/process`),
};

const FWDPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [fwdAnalysis, setFwdAnalysis] = useState<FWDAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<FWDAnalysis | null>(null);
  const [newAnalysis, setNewAnalysis] = useState({
    name: '',
    description: ''
  });
  const [currentSample, setCurrentSample] = useState<Partial<FWDData>>({
    stationNumber: 0,
    d0: 0, d20: 0, d30: 0, d45: 0, d60: 0, d90: 0, d120: 0, d150: 0, d180: 0,
  });
  const [samples, setSamples] = useState<FWDData[]>([]);
  const [error, setError] = useState('');
  const [procResult, setProcResult] = useState<any>(null);
  const [procError, setProcError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    setLoading(true);
    try {
      const response = await fwdAnalysisService.getAnalyses();
      const backendAnalyses = response.data;
      
      // Converter do formato do backend para o formato do frontend
      const frontendAnalyses = backendAnalyses.map((analysis: any) => ({
        id: analysis._id,
        name: analysis.name,
        description: analysis.description || '',
        samples: analysis.samples.map((sample: any, index: number) => ({
          id: index + 1, // ID apenas para uso interno no frontend
          stationNumber: sample.stationNumber,
          d0: sample.d0,
          d20: sample.d20,
          d30: sample.d30,
          d45: sample.d45,
          d60: sample.d60,
          d90: sample.d90,
          d120: sample.d120,
          d150: sample.d150,
          d180: sample.d180,
          date: sample.date,
          airTemperature: sample.airTemperature,
          pavementTemperature: sample.pavementTemperature,
          appliedLoad: sample.appliedLoad
        })),
        createdAt: analysis.createdAt ? analysis.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
        status: analysis.status || 'active'
      }));
      
      setFwdAnalysis(frontendAnalyses);
      if (frontendAnalyses.length > 0 && !selectedAnalysis) {
        setSelectedAnalysis(frontendAnalyses[0]);
      }
    } catch (err) {
      console.error('Erro ao carregar análises:', err);
      setSnackbar({ open: true, message: 'Erro ao carregar análises', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInputChange = (field: keyof FWDData, value: string | number) => {
    setCurrentSample(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleAddSample = () => {
    if (!currentSample.stationNumber && currentSample.stationNumber !== 0) {
      setError('Número da estaca é obrigatório');
      return;
    }

    const newSample: FWDData = {
      ...currentSample as FWDData,
      id: samples.length + 1, // ID apenas para uso interno no frontend
    };

    setSamples(prev => [...prev, newSample]);
    
    // Prepara próximo número de estaca
    setCurrentSample({
      stationNumber: (newSample.stationNumber || 0) + 4,
      d0: 0, d20: 0, d30: 0, d45: 0, d60: 0, d90: 0, d120: 0, d150: 0, d180: 0,
    });
    
    setError('');
  };

  const handleDeleteSample = (id: number) => {
    setSamples(prev => prev.filter(s => s.id !== id));
  };

  const handleCreateAnalysis = async () => {
    if (!newAnalysis.name) {
      setError('Nome da análise é obrigatório');
      return;
    }

    if (samples.length < 5) {
      setError('Mínimo de 5 amostras necessárias para criar uma análise');
      return;
    }

    setLoading(true);
    try {
      // Converter para formato do backend - NÃO ENVIAR NENHUM CAMPO DE ID
      const backendData = {
        name: newAnalysis.name,
        description: newAnalysis.description,
        samples: samples.map(sample => ({
          // NÃO enviar nenhum campo de ID (nem 'id' nem '_id')
          stationNumber: sample.stationNumber,
          d0: sample.d0,
          d20: sample.d20,
          d30: sample.d30,
          d45: sample.d45,
          d60: sample.d60,
          d90: sample.d90,
          d120: sample.d120,
          d150: sample.d150,
          d180: sample.d180,
          date: sample.date,
          airTemperature: sample.airTemperature,
          pavementTemperature: sample.pavementTemperature,
          appliedLoad: sample.appliedLoad
        })),
        status: 'active'
      };

      console.log('Dados enviados para o backend:', JSON.stringify(backendData, null, 2));

      const response = await fwdAnalysisService.createAnalysis(backendData);
      const createdAnalysis = response.data;

      // Converter para formato do frontend
      const frontendAnalysis: FWDAnalysis = {
        id: createdAnalysis._id,
        name: createdAnalysis.name,
        description: createdAnalysis.description || '',
        samples: createdAnalysis.samples.map((sample: any, index: number) => ({
          id: index + 1, // ID apenas para uso interno no frontend
          stationNumber: sample.stationNumber,
          d0: sample.d0,
          d20: sample.d20,
          d30: sample.d30,
          d45: sample.d45,
          d60: sample.d60,
          d90: sample.d90,
          d120: sample.d120,
          d150: sample.d150,
          d180: sample.d180,
          date: sample.date,
          airTemperature: sample.airTemperature,
          pavementTemperature: sample.pavementTemperature,
          appliedLoad: sample.appliedLoad
        })),
        createdAt: createdAnalysis.createdAt ? createdAnalysis.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
        status: createdAnalysis.status || 'active'
      };

      setFwdAnalysis(prev => [...prev, frontendAnalysis]);
      setSelectedAnalysis(frontendAnalysis);
      
      // Reset form
      setNewAnalysis({ name: '', description: '' });
      setSamples([]);
      setCurrentSample({
        stationNumber: 0,
        d0: 0, d20: 0, d30: 0, d45: 0, d60: 0, d90: 0, d120: 0, d150: 0, d180: 0,
      });
      
      setError('');
      setTabValue(2);
      setSnackbar({ open: true, message: 'Análise criada com sucesso!', severity: 'success' });
    } catch (err) {
      console.error('Erro ao criar análise:', err);
      setError('Erro ao criar análise');
      setSnackbar({ open: true, message: 'Erro ao criar análise', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnalysis = async (id: string) => {
    setLoading(true);
    try {
      await fwdAnalysisService.deleteAnalysis(id);
      setFwdAnalysis(prev => prev.filter(a => a.id !== id));
      if (selectedAnalysis?.id === id) {
        setSelectedAnalysis(fwdAnalysis.find(a => a.id !== id) || null);
      }
      setSnackbar({ open: true, message: 'Análise deletada com sucesso!', severity: 'success' });
    } catch (err) {
      console.error('Erro ao deletar análise:', err);
      setSnackbar({ open: true, message: 'Erro ao deletar análise', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleProcessar = async () => {
    setProcError(null);
    if (!selectedAnalysis || selectedAnalysis.samples.length < 5) {
      setProcError('Selecione uma análise com ao menos 5 amostras para processar.');
      setProcResult(null);
      return;
    }

    setLoading(true);
    try {
      const response = await fwdAnalysisService.processAnalysis(selectedAnalysis.id);
      setProcResult(response.data);
    } catch (err) {
      console.error('Erro ao processar análise:', err);
      setProcError('Erro ao processar análise. Processando localmente...');
      // Fallback para processamento local
      const proc = processarSubtrechos(selectedAnalysis.samples);
      setProcResult(proc);
    } finally {
      setLoading(false);
    }
  };

  const d0ChartData = procResult && procResult.ordered && procResult.ordered.length > 0
  ? {
      labels: procResult.ordered.map((r: FWDData) => r.stationNumber),
      datasets: [
        {
          label: 'd0 (Deflexão Máxima)',
          data: procResult.ordered.map((r: FWDData) => r.d0),
          borderColor: theme.palette.primary.main,
          backgroundColor: theme.palette.primary.light,
          borderWidth: 2,
          pointRadius: 3,
          fill: false,
          tension: 0.2,
        },
        {
          label: 'Quebra (CV > 30%)',
          data: procResult.ordered.map((_: any, i: number) =>
            procResult.quebra && procResult.quebra[i] ? procResult.ordered[i].d0 : null
          ),
          borderColor: 'red',
          backgroundColor: 'red',
          borderWidth: 0,
          pointRadius: 6,
          type: 'scatter' as const,
          showLine: false,
        },
      ],
    }
  : undefined;

  const baciaChartData = procResult && 
                       procResult.subtrechos && 
                       Array.isArray(procResult.subtrechos) && 
                       procResult.subtrechos.length > 0
  ? {
      labels: pos_sensores.map((x) => `${x} cm`),
      datasets: procResult.subtrechos.map((sub: any, i: number) => ({
        label: `Subtrecho ${i + 1}: Est. ${sub['Início (Estaca)']}–${sub['Fim (Estaca)']}`,
        data: pos_sensores.map((p) => {
          // Verifica se a propriedade existe e é um número
          const value = sub[`d${p}`];
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
  : {
      labels: pos_sensores.map((x) => `${x} cm`),
      datasets: []
    };

  const generateAnalysisChart = (analysis: FWDAnalysis) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#F9A826', '#6A0572', 
      '#AB83A1', '#4CAF50', '#FF9800', '#795548', '#607D8B'
    ];

    return {
      data: {
        labels: pos_sensores.map(pos => `${pos} cm`),
        datasets: analysis.samples.slice(0, 10).map((sample, index) => ({
          label: `Estaca ${sample.stationNumber}`,
          data: [sample.d0, sample.d20, sample.d30, sample.d45, sample.d60, 
                 sample.d90, sample.d120, sample.d150, sample.d180],
          borderColor: colors[index % colors.length],
          backgroundColor: colors[index % colors.length] + '20',
          borderWidth: 2,
          pointRadius: 4,
          fill: false,
          tension: 0.3,
        })),
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' as const },
          title: { display: true, text: analysis.name },
        },
        scales: {
          x: {
            title: { display: true, text: 'Distância do Centro (cm)' },
            reverse: false,
          },
          y: {
            title: { display: true, text: 'Deflexão (µm)' },
            beginAtZero: true,
          },
        },
      }
    };
  };

  if (loading && tabValue !== 2) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', pt: 12, pb: 6 }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="primary">
                Análise FWD
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Sistema completo de análise de deflexão de pavimentos
              </Typography>
            </Box>
          </Stack>

          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Criar Análise" />
            <Tab label="Gerenciar Análises" />
            <Tab label="Resultados e Gráficos" />
          </Tabs>

          {error && (
            <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TabPanel value={tabValue} index={0}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Criar Nova Análise FWD
              </Typography>
              
              <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nome da Análise FWD *"
                      value={newAnalysis.name}
                      onChange={(e) => setNewAnalysis({...newAnalysis, name: e.target.value})}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Descrição"
                      value={newAnalysis.description}
                      onChange={(e) => setNewAnalysis({...newAnalysis, description: e.target.value})}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      Adicionar Amostras ({samples.length} adicionadas)
                    </Typography>
                    
                    <Alert severity={samples.length >= 5 ? 'success' : 'warning'} sx={{ mb: 2 }}>
                      {samples.length >= 5 
                        ? 'Análise completa (mínimo 5 amostras atingido)'
                        : `Atenção: necessário ${5 - samples.length} amostras para análise completa`
                      }
                    </Alert>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          label="Estaca *"
                          type="number"
                          value={currentSample.stationNumber || ''}
                          onChange={(e) => handleInputChange('stationNumber', e.target.value)}
                          required
                        />
                      </Grid>
                      
                      {[0, 20, 30, 45, 60, 90, 120, 150, 180].map((distance) => (
                        <Grid item xs={6} sm={4} md={2} key={distance}>
                          <TextField
                            fullWidth
                            label={`d${distance} (µm)`}
                            type="number"
                            value={currentSample[`d${distance}` as keyof FWDData] || ''}
                            onChange={(e) => handleInputChange(`d${distance}` as keyof FWDData, e.target.value)}
                          />
                        </Grid>
                      ))}
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Data"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          value={currentSample.date || ''}
                          onChange={(e) => setCurrentSample({...currentSample, date: e.target.value})}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Temp. Pavimento (°C)"
                          type="number"
                          value={currentSample.pavementTemperature || ''}
                          onChange={(e) => handleInputChange('pavementTemperature', e.target.value)}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Button
                          variant="outlined"
                          startIcon={<Add />}
                          onClick={handleAddSample}
                          sx={{ mt: 1 }}
                        >
                          Adicionar Amostra
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>

                  {samples.length > 0 && (
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography>Amostras Adicionadas ({samples.length})</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Estaca</TableCell>
                                  <TableCell>d0</TableCell>
                                  <TableCell>d20</TableCell>
                                  <TableCell>d30</TableCell>
                                  <TableCell>d45</TableCell>
                                  <TableCell>d60</TableCell>
                                  <TableCell>d90</TableCell>
                                  <TableCell>d120</TableCell>
                                  <TableCell>d150</TableCell>
                                  <TableCell>d180</TableCell>
                                  <TableCell>Ações</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {samples.map((sample) => (
                                  <TableRow key={sample.id}>
                                    <TableCell>{sample.stationNumber}</TableCell>
                                    <TableCell>{sample.d0}</TableCell>
                                    <TableCell>{sample.d20}</TableCell>
                                    <TableCell>{sample.d30}</TableCell>
                                    <TableCell>{sample.d45}</TableCell>
                                    <TableCell>{sample.d60}</TableCell>
                                    <TableCell>{sample.d90}</TableCell>
                                    <TableCell>{sample.d120}</TableCell>
                                    <TableCell>{sample.d150}</TableCell>
                                    <TableCell>{sample.d180}</TableCell>
                                    <TableCell>
                                      <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteSample(sample.id as number)}
                                      >
                                        <Delete />
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      onClick={handleCreateAnalysis}
                      disabled={samples.length < 5 || !newAnalysis.name || loading}
                      sx={{ mt: 2 }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Criar Análise FWD'}
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Análises FWD Existentes
              </Typography>
              
              {fwdAnalysis.length === 0 ? (
                <Alert severity="info">
                  <p>Nenhuma análise criada ainda. Vá para a aba "Criar Análise" para começar.</p>
                </Alert>
              ) : (
                <Grid container spacing={2}>
                  {fwdAnalysis.map((analysis) => (
                    <Grid item xs={12} md={6} key={analysis.id}>
                      <Card 
                        variant={selectedAnalysis?.id === analysis.id ? 'elevation' : 'outlined'}
                        elevation={selectedAnalysis?.id === analysis.id ? 3 : 0}
                        sx={{ 
                          cursor: 'pointer',
                          border: selectedAnalysis?.id === analysis.id ? `2px solid ${theme.palette.primary.main}` : 'none',
                        }}
                        onClick={() => setSelectedAnalysis(analysis)}
                      >
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {analysis.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {analysis.description}
                          </Typography>
                          <Typography variant="body2">
                            {analysis.samples.length} amostras - Criada em: {analysis.createdAt}
                          </Typography>
                          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip 
                              label={analysis.samples.length >= 5 ? 'Completa' : 'Incompleta'} 
                              color={analysis.samples.length >= 5 ? 'success' : 'warning'} 
                              size="small"
                            />
                            <Chip 
                              label={analysis.status === 'completed' ? 'Finalizada' : 'Em andamento'} 
                              variant="outlined" 
                              size="small"
                            />
                          </Box>
                          <Box sx={{ mt: 2 }}>
                            <Button
                              size="small"
                              color="error"
                              disabled={loading}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAnalysis(analysis.id);
                              }}
                            >
                              {loading ? <CircularProgress size={16} /> : 'Excluir Análise'}
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              Resultados e Gráficos
            </Typography>
            
            {fwdAnalysis.length === 0 ? (
              <Alert severity="info">
                <p>Nenhuma análise disponível. Crie uma análise primeiro na aba "Criar Análise".</p>
              </Alert>
            ) : !selectedAnalysis ? (
              <Alert severity="info">
                Selecione uma análise para visualizar os gráficos
              </Alert>
            ) : selectedAnalysis.samples.length < 5 ? (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Análise incompleta. Mínimo 5 amostras necessárias para resultados confiáveis.
              </Alert>
            ) : (
              <Box>
                <Box sx={{ mb: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Selecionar Análise</InputLabel>
                    <Select
                      value={selectedAnalysis?.id || ''}
                      onChange={(e) => {
                        const analysis = fwdAnalysis.find(a => a.id === e.target.value);
                        if (analysis) setSelectedAnalysis(analysis);
                      }}
                      label="Selecionar Análise"
                    >
                      {fwdAnalysis.map((analysis) => (
                        <MenuItem key={analysis.id} value={analysis.id}>
                          {analysis.name} ({analysis.samples.length} amostras)
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Button
                  onClick={handleProcessar}
                  startIcon={<Assessment />}
                  variant="contained"
                  disabled={loading}
                  sx={{ mb: 3 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Processar Análise'}
                </Button>

                {procError && <Alert severity="error" sx={{ mb: 2 }}>{procError}</Alert>}

                {procResult && (
                  <>
                    <Card sx={{ mb: 3 }}>
  <CardContent>
    <Typography variant="h6" gutterBottom>
      {selectedAnalysis.name} - Bacias de Deflexão
    </Typography>
    <Box sx={{ height: 400 }}>
      <Line 
        data={generateAnalysisChart(selectedAnalysis).data} 
        options={generateAnalysisChart(selectedAnalysis).options} 
      />
    </Box>
  </CardContent>
</Card>

                    <Typography variant="h6" gutterBottom>
                      Análise de Subtrechos Homogêneos
                    </Typography>
                    
                    <TableContainer component={Paper} sx={{ mb: 3 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Início (Estaca)</TableCell>
                            <TableCell>Fim (Estaca)</TableCell>
                            <TableCell>Comprimento (m)</TableCell>
                            <TableCell>N Amostras</TableCell>
                            <TableCell>d0</TableCell>
                            <TableCell>d20</TableCell>
                            <TableCell>d30</TableCell>
                            <TableCell>d45</TableCell>
                            <TableCell>d60</TableCell>
                            <TableCell>d90</TableCell>
                            <TableCell>d120</TableCell>
                            <TableCell>d150</TableCell>
                            <TableCell>d180</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                        {procResult.subtrechos && procResult.subtrechos.map((sub: Subtrecho, i: number) => (
                            <TableRow key={i}>
                              <TableCell>{sub['Início (Estaca)']}</TableCell>
                              <TableCell>{sub['Fim (Estaca)']}</TableCell>
                              <TableCell>{sub['Comprimento (m)']}</TableCell>
                              <TableCell>{sub['N Amostras']}</TableCell>
                              <TableCell>{sub.d0}</TableCell>
                              <TableCell>{sub.d20}</TableCell>
                              <TableCell>{sub.d30}</TableCell>
                              <TableCell>{sub.d45}</TableCell>
                              <TableCell>{sub.d60}</TableCell>
                              <TableCell>{sub.d90}</TableCell>
                              <TableCell>{sub.d120}</TableCell>
                              <TableCell>{sub.d150}</TableCell>
                              <TableCell>{sub.d180}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    
                    

                    {/* Bacia de Deflexão */}
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                      Bacias de Deflexão Características por Subtrecho
                    </Typography>
                    {baciaChartData && baciaChartData.labels && baciaChartData.labels.length > 0 ? (
  <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', background: "#fff", borderRadius: 3, p: 2 }}>
    <Line
      data={baciaChartData}
      options={{
        responsive: true,
        plugins: {
          legend: { display: true, position: 'top' as const },
          title: { display: true, text: 'Bacias de Deflexão Características' },
        },
        scales: {
          x: { 
            title: { display: true, text: 'Distância do Centro (cm)' } 
          },
          y: { 
            title: { display: true, text: 'Deflexão característica (µm)' }, 
            reverse: true 
          },
        },
      }}
    />
  </Box>
) : (
  <Alert severity="info" sx={{ mb: 3 }}>
    Não há dados suficientes para gerar o gráfico de bacias de deflexão.
  </Alert>
)}
                                    </>
                                    )}
                                </Box>
            )}
          </TabPanel>
        </Paper>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default FWDPage;