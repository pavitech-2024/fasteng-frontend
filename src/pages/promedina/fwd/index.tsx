import { Delete, Add, Assessment, ExpandMore, FileUpload, Edit, Visibility } from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Api from '@/api';
import * as XLSX from 'xlsx';
import {
  Tab,
  Tabs,
  CircularProgress,
  useMediaQuery,
  Typography,
  Paper,
  Alert,
  Grid,
  TextField,
  Divider,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Box,
  Stack,
  AppBar,
  Toolbar,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { Container } from '@mui/material';
import { useState, useEffect, ChangeEvent } from 'react';
import { useTheme, createTheme, ThemeProvider } from '@mui/material/styles';

// Chart.js registration
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Definir o tema PRO-MEDINA
const proMedinaTheme = createTheme({
  palette: {
    primary: {
      main: '#ff6b35',
      light: '#ff8a65',
      dark: '#c53d13',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2c3e50',
      light: '#546e7a',
      dark: '#1a252f',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Segoe UI', sans-serif",
    h4: {
      fontWeight: 700,
      fontSize: '1.75rem',
    },
    h5: {
      fontWeight: 700,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    body1: {
      fontSize: '0.9rem',
    },
    body2: {
      fontSize: '0.8rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.85rem',
        },
        contained: {
          background: 'linear-gradient(45deg, #ff6b35 30%, #ff8a65 90%)',
          boxShadow: '0 2px 4px rgba(255, 107, 53, 0.3)',
          '&:hover': {
            background: 'linear-gradient(45deg, #e55a2b 30%, #e5735d 90%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

// Cores PRO-MEDINA para uso direto
const PRO_MEDINA_COLORS = {
  primary: {
    main: '#ff6b35',
    light: '#ff8a65',
    dark: '#c53d13',
  },
  secondary: {
    main: '#2c3e50',
    light: '#546e7a',
    dark: '#1a252f',
  },
  background: {
    main: '#f5f7fa',
    light: '#ffffff',
  }
};

// Types
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
      {value === index && <Box sx={{ py: { xs: 1, md: 2 } }}>{children}</Box>}
    </div>
  );
}

interface FWDData {
  id?: number;
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

// Helpers
const coef_K: Record<number, number> = {
  4: 3.0, 5: 1.55, 6: 1.41, 7: 1.36, 8: 1.31, 9: 1.25, 10: 1.21,
  11: 1.2, 12: 1.16, 13: 1.13, 14: 1.11, 15: 1.1, 16: 1.08, 17: 1.06,
  18: 1.05, 19: 1.04, 20: 1.02, 21: 1.01, 22: 1.0, 23: 1.0, 24: 1.0,
  25: 1.0, 26: 1.0, 27: 1.0, 28: 1.0, 29: 1.0, 30: 1.0,
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
  const d0Arr = ordered.map((r) => r.d0);
  const { media: media_d0, std: std_d0 } = rollingWindow(d0Arr, janela);
  const cv_d0 = std_d0.map((s, i) => (media_d0[i] ? (s / media_d0[i]) * 100 : 0));
  const quebra = cv_d0.map((cv) => cv > limiar_cv);
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
        colDef.forEach((col) => {
          const vals = trecho.map((x) => x[col]);
          const m = vals.reduce((a, b) => a + b, 0) / vals.length;
          const s = Math.sqrt(vals.reduce((a, b) => a + (b - m) * (b - m), 0) / vals.length);
          medias[col] = m;
          desvios[col] = s;
        });
        const K = getCoefK(n_amostras);
        const deflexoes_char: Record<string, number> = {};
        colDef.forEach((col) => {
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
    colDef.forEach((col) => {
      const vals = trecho.map((x) => x[col]);
      const m = vals.reduce((a, b) => a + b, 0) / vals.length;
      const s = Math.sqrt(vals.reduce((a, b) => a + (b - m) * (b - m), 0) / vals.length);
      medias[col] = m;
      desvios[col] = s;
    });
    const K = getCoefK(n_amostras);
    const deflexoes_char: Record<string, number> = {};
    colDef.forEach((col) => {
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
    description: '',
  });
  const [currentSample, setCurrentSample] = useState<Partial<FWDData>>({
    stationNumber: 0,
    d0: 0,
    d20: 0,
    d30: 0,
    d45: 0,
    d60: 0,
    d90: 0,
    d120: 0,
    d150: 0,
    d180: 0,
  });
  const [samples, setSamples] = useState<FWDData[]>([]);
  const [error, setError] = useState('');
  const [procResult, setProcResult] = useState<any>(null);
  const [procError, setProcError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [editingAnalysis, setEditingAnalysis] = useState<FWDAnalysis | null>(null);
  const [showAllAnalyses, setShowAllAnalyses] = useState(false);

  const theme = useTheme();

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    setLoading(true);
    try {
      const response = await fwdAnalysisService.getAnalyses();
      const backendAnalyses = response.data;
      const frontendAnalyses = backendAnalyses.map((analysis: any) => ({
        id: analysis._id,
        name: analysis.name,
        description: analysis.description || '',
        samples: analysis.samples.map((sample: any, index: number) => ({
          id: index + 1,
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
          appliedLoad: sample.appliedLoad,
        })),
        createdAt: analysis.createdAt ? analysis.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
        status: analysis.status || 'active',
      }));

      setFwdAnalysis(frontendAnalyses);
      if (frontendAnalyses.length > 0 && !selectedAnalysis) {
        setSelectedAnalysis(frontendAnalyses[0]);
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Erro ao carregar análises', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInputChange = (field: keyof FWDData, value: string | number) => {
    setCurrentSample((prev) => ({
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
      ...(currentSample as FWDData),
      id: samples.length + 1,
    };

    setSamples((prev) => [...prev, newSample]);
    setCurrentSample({
      stationNumber: (newSample.stationNumber || 0) + 4,
      d0: 0,
      d20: 0,
      d30: 0,
      d45: 0,
      d60: 0,
      d90: 0,
      d120: 0,
      d150: 0,
      d180: 0,
    });
    setError('');
  };

  const handleDeleteSample = (id: number) => {
    setSamples((prev) => prev.filter((s) => s.id !== id));
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
      const backendData = {
        name: newAnalysis.name,
        description: newAnalysis.description,
        samples: samples.map((sample) => ({
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
          appliedLoad: sample.appliedLoad,
        })),
        status: 'active',
      };

      const response = await fwdAnalysisService.createAnalysis(backendData);
      const createdAnalysis = response.data;
      const frontendAnalysis: FWDAnalysis = {
        id: createdAnalysis._id,
        name: createdAnalysis.name,
        description: createdAnalysis.description || '',
        samples: createdAnalysis.samples.map((sample: any, index: number) => ({
          id: index + 1,
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
          appliedLoad: sample.appliedLoad,
        })),
        createdAt: createdAnalysis.createdAt
          ? createdAnalysis.createdAt.split('T')[0]
          : new Date().toISOString().split('T')[0],
        status: createdAnalysis.status || 'active',
      };

      setFwdAnalysis((prev) => [...prev, frontendAnalysis]);
      setSelectedAnalysis(frontendAnalysis);

      setNewAnalysis({ name: '', description: '' });
      setSamples([]);
      setCurrentSample({
        stationNumber: 0,
        d0: 0,
        d20: 0,
        d30: 0,
        d45: 0,
        d60: 0,
        d90: 0,
        d120: 0,
        d150: 0,
        d180: 0,
      });

      setError('');
      setTabValue(2);
      setSnackbar({ open: true, message: 'Análise criada com sucesso!', severity: 'success' });
    } catch (err) {
      setError('Erro ao criar análise');
      setSnackbar({ open: true, message: 'Erro ao criar análise', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditAnalysis = async (analysis: FWDAnalysis) => {
    setEditingAnalysis(analysis);
    setNewAnalysis({
      name: analysis.name,
      description: analysis.description,
    });
    setSamples(analysis.samples);
    setTabValue(0);
  };

  const handleUpdateAnalysis = async () => {
    if (!editingAnalysis || !newAnalysis.name) {
      setError('Nome da análise é obrigatório');
      return;
    }

    if (samples.length < 5) {
      setError('Mínimo de 5 amostras necessárias para atualizar a análise');
      return;
    }

    setLoading(true);
    try {
      const backendData = {
        name: newAnalysis.name,
        description: newAnalysis.description,
        samples: samples.map((sample) => ({
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
          appliedLoad: sample.appliedLoad,
        })),
        status: 'active',
      };

      await fwdAnalysisService.updateAnalysis(editingAnalysis.id, backendData);
      
      await loadAnalyses();
      
      setEditingAnalysis(null);
      setNewAnalysis({ name: '', description: '' });
      setSamples([]);
      setCurrentSample({
        stationNumber: 0,
        d0: 0,
        d20: 0,
        d30: 0,
        d45: 0,
        d60: 0,
        d90: 0,
        d120: 0,
        d150: 0,
        d180: 0,
      });

      setError('');
      setSnackbar({ open: true, message: 'Análise atualizada com sucesso!', severity: 'success' });
    } catch (err) {
      setError('Erro ao atualizar análise');
      setSnackbar({ open: true, message: 'Erro ao atualizar análise', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingAnalysis(null);
    setNewAnalysis({ name: '', description: '' });
    setSamples([]);
    setCurrentSample({
      stationNumber: 0,
      d0: 0,
      d20: 0,
      d30: 0,
      d45: 0,
      d60: 0,
      d90: 0,
      d120: 0,
      d150: 0,
      d180: 0,
    });
    setError('');
  };

  const handleDeleteAnalysis = async (id: string) => {
    setLoading(true);
    try {
      await fwdAnalysisService.deleteAnalysis(id);
      setFwdAnalysis((prev) => prev.filter((a) => a.id !== id));
      if (selectedAnalysis?.id === id) {
        setSelectedAnalysis(fwdAnalysis.find((a) => a.id !== id) || null);
      }
      setSnackbar({ open: true, message: 'Análise deletada com sucesso!', severity: 'success' });
    } catch (err) {
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
      if (response.data && response.data.ordered && response.data.ordered.length > 0) {
        setProcResult(response.data);
      } else {
        throw new Error('Resultado inválido');
      }
    } catch (err) {
      // Processamento local sem mensagem de erro
      const proc = processarSubtrechos(selectedAnalysis.samples);
      if (proc && proc.ordered && proc.ordered.length > 0) {
        setProcResult(proc);
      } else {
        setProcResult(null);
        setProcError('Falha ao processar os dados da análise.');
      }
    } finally {
      setLoading(false);
    }
  };

  // UPLOAD DE PLANILHA - VERSÃO CORRIGIDA PARA SUA PLANILHA
  const handleUploadExcel = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // ENCONTRAR A LINHA ONDE COMEÇAM OS DADOS REAIS
        let dataStartRow = -1;
        for (let i = 0; i < Math.min(10, rows.length); i++) {
          const row = rows[i] as any[];
          if (row && row[0] && (
            row[0].toString().toUpperCase().includes('ESTACA') || 
            row[0].toString().toUpperCase().includes('DATA')
          )) {
            dataStartRow = i;
            break;
          }
        }

        if (dataStartRow === -1) {
          setError('Estrutura da planilha não reconhecida. Cabeçalho não encontrado.');
          return;
        }

        // CABEÇALHO NA LINHA ENCONTRADA
        const headerRow: string[] = (rows[dataStartRow] as any[])?.map((cell: any) => 
          cell?.toString().trim().toUpperCase() || ''
        ) || [];

        // MAPEAMENTO CORRETO DAS COLUNAS PARA SUA PLANILHA FWD
        const colIndices: Record<string, number> = {
          date: headerRow.findIndex(h => h.includes('DATA')),
          airTemperature: headerRow.findIndex(h => h.includes('TEMP. DO AR') || h.includes('TEMP DO AR')),
          pavementTemperature: headerRow.findIndex(h => h.includes('TEMP. DO PAVIMENTO') || h.includes('TEMP DO PAVIMENTO')),
          appliedLoad: headerRow.findIndex(h => h.includes('CARGA')),
          stationNumber: headerRow.findIndex(h => h.includes('ESTACA – NÚMERO') || h.includes('ESTACA-NÚMERO') || h.includes('ESTACA NÚMERO')),
          d0: headerRow.findIndex(h => h.includes('D0') || h === 'D0'),
          d20: headerRow.findIndex(h => h.includes('D20') || h === 'D20'),
          d30: headerRow.findIndex(h => h.includes('D30') || h === 'D30'),
          d45: headerRow.findIndex(h => h.includes('D45') || h === 'D45'),
          d60: headerRow.findIndex(h => h.includes('D60') || h === 'D60'),
          d90: headerRow.findIndex(h => h.includes('D90') || h === 'D90'),
          d120: headerRow.findIndex(h => h.includes('D120') || h === 'D120'),
          d150: headerRow.findIndex(h => h.includes('D150') || h === 'D150'),
          d180: headerRow.findIndex(h => h.includes('D180') || h === 'D180'),
        };

        // Verificar se encontrou as colunas essenciais
        if (colIndices.stationNumber === -1 || colIndices.d0 === -1) {
          setError('Colunas essenciais (Estaca – Número e d0) não encontradas na planilha');
          console.log('Cabeçalhos encontrados:', headerRow);
          console.log('Índices mapeados:', colIndices);
          return;
        }

        // Dados começam na próxima linha após o cabeçalho
        const dataRows = rows.slice(dataStartRow + 1);
        const loadedSamples: FWDData[] = [];
        
        for (const row of dataRows) {
          // Adicione uma verificação de tipo para garantir que row é um array
          if (!row || !Array.isArray(row) || row.length < 2) continue;

          const stationNumber = Number(row[colIndices.stationNumber]);
          const d0 = Number(row[colIndices.d0]);
          
          // Pular linhas inválidas ou vazias
          if (isNaN(stationNumber) || isNaN(d0) || stationNumber === 0) continue;

          // Converter valores para número, tratando células vazias
          const sample: FWDData = {
            id: loadedSamples.length + 1,
            stationNumber,
            d0: d0 || 0,
            d20: Number(row[colIndices.d20]) || 0,
            d30: Number(row[colIndices.d30]) || 0,
            d45: Number(row[colIndices.d45]) || 0,
            d60: Number(row[colIndices.d60]) || 0,
            d90: Number(row[colIndices.d90]) || 0,
            d120: Number(row[colIndices.d120]) || 0,
            d150: Number(row[colIndices.d150]) || 0,
            d180: Number(row[colIndices.d180]) || 0,
            date: row[colIndices.date] ? new Date((row[colIndices.date] - 25569) * 86400 * 1000).toISOString().split('T')[0] : undefined,
            airTemperature: Number(row[colIndices.airTemperature]) || undefined,
            pavementTemperature: Number(row[colIndices.pavementTemperature]) || undefined,
            appliedLoad: Number(row[colIndices.appliedLoad]) || undefined,
          };

          // Verificar se é um dado válido (pelo menos d0 tem valor)
          if (sample.d0 > 0) {
            loadedSamples.push(sample);
          }
        }

        if (loadedSamples.length > 0) {
          setSamples(loadedSamples);
          setError('');
          setSnackbar({
            open: true,
            message: `Planilha carregada: ${loadedSamples.length} amostras válidas`,
            severity: loadedSamples.length >= 5 ? 'success' : 'warning',
          });
          
          // Log para debug
          console.log('Amostras carregadas:', loadedSamples);
        } else {
          setError('Nenhuma amostra válida encontrada na planilha. Verifique o formato dos dados.');
          setSamples([]);
        }
      } catch (error) {
        console.error('Erro ao processar planilha:', error);
        setError('Erro ao processar o arquivo Excel. Verifique o formato.');
        setSamples([]);
      }
    };
    reader.readAsBinaryString(file);
  };

  // Chart Data
  const d0ChartData =
    procResult && procResult.ordered && procResult.ordered.length > 0
      ? {
          labels: procResult.ordered.map((r: FWDData) => r.stationNumber),
          datasets: [
            {
              label: 'd0 (Deflexão Máxima)',
              data: procResult.ordered.map((r: FWDData) => r.d0),
              borderColor: PRO_MEDINA_COLORS.primary.main,
              backgroundColor: PRO_MEDINA_COLORS.primary.light,
              borderWidth: 2,
              pointRadius: 3,
              fill: false,
              tension: 0.2,
            },
            {
              label: 'Quebra (CV > 30%)',
              data: procResult.ordered.map((_: any, i: number) =>
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

  const baciaChartData =
    procResult && procResult.subtrechos && Array.isArray(procResult.subtrechos) && procResult.subtrechos.length > 0
      ? {
          labels: pos_sensores.map((x) => `${x} cm`),
          datasets: procResult.subtrechos.map((sub: any, i: number) => ({
            label: `Subtrecho ${i + 1}: Est. ${sub['Início (Estaca)']}–${sub['Fim (Estaca)']}`,
            data: pos_sensores.map((p) => {
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
          datasets: [],
        };

  // Steps for the stepper
  const steps = ['Dados Gerais', 'Gerenciar Análises', 'Resultados e Gráficos'];

  // Loading
  if (loading && tabValue !== 2) {
    return (
      <ThemeProvider theme={proMedinaTheme}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          }}
        >
          <CircularProgress size={50} sx={{ color: PRO_MEDINA_COLORS.primary.main }} />
          <Typography sx={{ mt: 2, fontWeight: 600, color: 'grey.600', fontSize: '1rem' }}>
            Carregando...
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  // Main layout following PRO-MEDINA style
  return (
    <ThemeProvider theme={proMedinaTheme}>
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        {/* Header similar to PRO-MEDINA */}
        <AppBar 
          position="static" 
          sx={{ 
            background: 'linear-gradient(45deg, #2c3e50 0%, #34495e 50%, #ff6b35 100%)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', py: 0.5, minHeight: '48px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  background: 'linear-gradient(45deg, #ff6b35, #ff8a65)',
                  borderRadius: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}
              >
                FWD
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>
                  PRO-MEDINA
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem' }}>
                  ANÁLISE FWD DE PAVIMENTOS
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, fontSize: '0.8rem' }}>
              SISTEMA DE ANÁLISE
            </Typography>
          </Toolbar>
        </AppBar>

        <Container 
          maxWidth={false} 
          sx={{ 
            py: 2, 
            maxWidth: '1800px',
            margin: '0 auto'
          }}
        >
          {/* Title section */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#2c3e50',
                mb: 1,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              LIGANTE E CONCRETO ASFÁLTICOS
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#7f8c8d',
                fontWeight: 400,
              }}
            >
              Sistema completo de análise de deflexão de pavimentos (FWD)
            </Typography>
          </Box>

          {/* Steps indicator */}
          <Box sx={{ mb: 2 }}>
            <Stepper activeStep={tabValue} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    StepIconProps={{
                      sx: {
                        fontSize: '1.2rem',
                        '&.Mui-active': {
                          color: PRO_MEDINA_COLORS.primary.main,
                        },
                        '&.Mui-completed': {
                          color: PRO_MEDINA_COLORS.secondary.main,
                        },
                      },
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: tabValue === index ? 600 : 400,
                        color: tabValue === index ? PRO_MEDINA_COLORS.primary.main : 'text.secondary',
                        fontSize: '0.8rem'
                      }}
                    >
                      {label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Main content card */}
          <Paper 
            elevation={6} 
            sx={{ 
              borderRadius: 2,
              overflow: 'hidden',
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
              border: `2px solid ${PRO_MEDINA_COLORS.secondary.main}`,
            }}
          >
            {/* Tabs */}
            <Box sx={{ borderBottom: `1px solid ${PRO_MEDINA_COLORS.secondary.main}`, background: '#f8f9fa' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  minHeight: '40px',
                  '& .MuiTabs-flexContainer': { justifyContent: 'center' },
                  '& .MuiTab-root': { 
                    fontWeight: 600, 
                    fontSize: '0.85rem',
                    textTransform: 'none',
                    color: '#2c3e50',
                    minHeight: '40px',
                    py: 1,
                    '&.Mui-selected': {
                      color: PRO_MEDINA_COLORS.primary.main,
                      fontWeight: 700,
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: PRO_MEDINA_COLORS.primary.main,
                    height: 2,
                  }
                }}
              >
                <Tab label="Dados Gerais" />
                <Tab label="Gerenciar Análises" />
                <Tab label="Resultados e Gráficos" />
              </Tabs>
            </Box>

            <Box sx={{ p: { xs: 2, md: 3 } }}>
              {error && (
                <Alert 
                  severity="error" 
                  onClose={() => setError('')} 
                  sx={{ 
                    mb: 2,
                    borderRadius: 1,
                    fontSize: '0.85rem',
                    '& .MuiAlert-icon': {
                      color: '#e74c3c'
                    }
                  }}
                >
                  {error}
                </Alert>
              )}

              {/* Tab 0 - Dados Gerais (Criar/Editar análise) */}
              <TabPanel value={tabValue} index={0}>
                <Paper 
                  sx={{ 
                    p: 3, 
                    border: `2px solid ${PRO_MEDINA_COLORS.secondary.main}`,
                    borderRadius: 2,
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700, 
                        color: '#2c3e50',
                        textTransform: 'uppercase',
                        letterSpacing: '0.3px'
                      }}
                    >
                      {editingAnalysis ? 'Editar Análise' : 'Dados Gerais'}
                    </Typography>
                    {editingAnalysis && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleCancelEdit}
                        sx={{ 
                          fontSize: '0.8rem',
                          fontWeight: 600,
                        }}
                      >
                        Cancelar Edição
                      </Button>
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      <Box sx={{ flex: '1 1 300px' }}>
                        <TextField
                          fullWidth
                          label="Nome *"
                          value={newAnalysis.name}
                          onChange={(e) => setNewAnalysis({ ...newAnalysis, name: e.target.value })}
                          required
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1,
                              '&:hover fieldset': {
                                borderColor: PRO_MEDINA_COLORS.primary.main,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: PRO_MEDINA_COLORS.primary.main,
                              },
                            },
                          }}
                        />
                      </Box>
                      <Box sx={{ flex: '1 1 300px' }}>
                        <TextField
                          fullWidth
                          label="Local *"
                          placeholder="Localização do projeto"
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1,
                              '&:hover fieldset': {
                                borderColor: PRO_MEDINA_COLORS.primary.main,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: PRO_MEDINA_COLORS.primary.main,
                              },
                            },
                          }}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      <Box sx={{ flex: '1 1 300px' }}>
                        <TextField
                          fullWidth
                          label="Rodovia *"
                          placeholder="Nome da rodovia"
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1,
                              '&:hover fieldset': {
                                borderColor: PRO_MEDINA_COLORS.primary.main,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: PRO_MEDINA_COLORS.primary.main,
                              },
                            },
                          }}
                        />
                      </Box>
                      <Box sx={{ flex: '1 1 300px' }}>
                        <TextField
                          fullWidth
                          label="Camada *"
                          placeholder="Tipo de camada"
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1,
                              '&:hover fieldset': {
                                borderColor: PRO_MEDINA_COLORS.primary.main,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: PRO_MEDINA_COLORS.primary.main,
                              },
                            },
                          }}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      <Box sx={{ flex: '1 1 300px' }}>
                        <TextField
                          fullWidth
                          label="Município/Estado *"
                          placeholder="Município e Estado"
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1,
                              '&:hover fieldset': {
                                borderColor: PRO_MEDINA_COLORS.primary.main,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: PRO_MEDINA_COLORS.primary.main,
                              },
                            },
                          }}
                        />
                      </Box>
                      <Box sx={{ flex: '1 1 300px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TextField
                            fullWidth
                            label="Velocidade diretriz da via"
                            type="number"
                            size="small"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 1,
                                '&:hover fieldset': {
                                  borderColor: PRO_MEDINA_COLORS.primary.main,
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: PRO_MEDINA_COLORS.primary.main,
                                },
                              },
                            }}
                          />
                          <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 'fit-content', fontSize: '0.8rem' }}>
                            km/h
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Box>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Observações"
                        value={newAnalysis.description}
                        onChange={(e) => setNewAnalysis({ ...newAnalysis, description: e.target.value })}
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                            '&:hover fieldset': {
                              borderColor: PRO_MEDINA_COLORS.primary.main,
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: PRO_MEDINA_COLORS.primary.main,
                            },
                          },
                        }}
                      />
                    </Box>

                    <Box>
                      <Divider sx={{ my: 1, borderColor: PRO_MEDINA_COLORS.secondary.main }} />
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<FileUpload />}
                        size="small"
                        sx={{ 
                          mb: 2,
                          borderColor: PRO_MEDINA_COLORS.secondary.main,
                          color: PRO_MEDINA_COLORS.secondary.main,
                          '&:hover': {
                            borderColor: PRO_MEDINA_COLORS.secondary.dark,
                            backgroundColor: 'rgba(76, 175, 80, 0.04)',
                          }
                        }}
                      >
                        Importar Planilha Excel
                        <input
                          type="file"
                          accept=".xls,.xlsx"
                          hidden
                          onChange={handleUploadExcel}
                        />
                      </Button>
                      <Typography variant="body2" gutterBottom sx={{ fontWeight: 600, color: '#2c3e50' }}>
                        Adicionar Amostras ({samples.length} adicionadas)
                      </Typography>
                      <Alert 
                        severity={samples.length >= 5 ? 'success' : 'warning'} 
                        sx={{ 
                          mb: 2,
                          borderRadius: 1,
                          fontSize: '0.8rem',
                        }}
                      >
                        {samples.length >= 5
                          ? 'Análise completa (mínimo 5 amostras atingido)'
                          : `Atenção: necessário ${5 - samples.length} amostras para análise completa`}
                      </Alert>
                      
                      {/* Grid para amostras usando Box */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        <Box sx={{ flex: '1 1 120px', minWidth: '120px' }}>
                          <TextField
                            fullWidth
                            label="Estaca *"
                            type="number"
                            value={currentSample.stationNumber || ''}
                            onChange={(e) => handleInputChange('stationNumber', e.target.value)}
                            required
                            size="small"
                          />
                        </Box>
                        {[0, 20, 30, 45, 60, 90, 120, 150, 180].map((distance) => (
                          <Box sx={{ flex: '1 1 80px', minWidth: '80px' }} key={distance}>
                            <TextField
                              fullWidth
                              label={`d${distance}`}
                              type="number"
                              value={currentSample[`d${distance}` as keyof FWDData] || ''}
                              onChange={(e) => handleInputChange(`d${distance}` as keyof FWDData, e.target.value)}
                              size="small"
                            />
                          </Box>
                        ))}
                        <Box sx={{ flex: '1 1 120px', minWidth: '120px' }}>
                          <TextField
                            fullWidth
                            label="Data"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={currentSample.date || ''}
                            onChange={(e) => setCurrentSample({ ...currentSample, date: e.target.value })}
                            size="small"
                          />
                        </Box>
                        <Box sx={{ flex: '1 1 140px', minWidth: '140px' }}>
                          <TextField
                            fullWidth
                            label="Temp. Pavimento (°C)"
                            type="number"
                            value={currentSample.pavementTemperature || ''}
                            onChange={(e) => handleInputChange('pavementTemperature', e.target.value)}
                            size="small"
                          />
                        </Box>
                        <Box sx={{ flex: '1 1 120px', minWidth: '120px' }}>
                          <Button 
                            variant="outlined" 
                            startIcon={<Add />} 
                            onClick={handleAddSample} 
                            size="small"
                            sx={{ 
                              mt: 0.5,
                              borderColor: PRO_MEDINA_COLORS.secondary.main,
                              color: PRO_MEDINA_COLORS.secondary.main,
                            }}
                          >
                            Adicionar
                          </Button>
                        </Box>
                      </Box>
                    </Box>

                    {samples.length > 0 && (
                      <Box>
                        <Accordion sx={{ borderRadius: 1, border: `1px solid ${PRO_MEDINA_COLORS.secondary.main}` }}>
                          <AccordionSummary expandIcon={<ExpandMore />} sx={{ minHeight: '40px', '& .MuiAccordionSummary-content': { margin: '8px 0' } }}>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>Amostras Adicionadas ({samples.length})</Typography>
                          </AccordionSummary>
                          <AccordionDetails sx={{ p: 1 }}>
                            <TableContainer>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', p: 1 }}>Estaca</TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', p: 1 }}>d0</TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', p: 1 }}>d20</TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', p: 1 }}>d30</TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', p: 1 }}>d45</TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', p: 1 }}>d60</TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', p: 1 }}>d90</TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', p: 1 }}>d120</TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', p: 1 }}>d150</TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', p: 1 }}>d180</TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', p: 1 }}>Ações</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {samples.map((sample) => (
                                    <TableRow key={sample.id}>
                                      <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{sample.stationNumber}</TableCell>
                                      <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{sample.d0}</TableCell>
                                      <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{sample.d20}</TableCell>
                                      <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{sample.d30}</TableCell>
                                      <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{sample.d45}</TableCell>
                                      <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{sample.d60}</TableCell>
                                      <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{sample.d90}</TableCell>
                                      <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{sample.d120}</TableCell>
                                      <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{sample.d150}</TableCell>
                                      <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{sample.d180}</TableCell>
                                      <TableCell sx={{ p: 1 }}>
                                        <IconButton
                                          size="small"
                                          color="error"
                                          onClick={() => handleDeleteSample(sample.id as number)}
                                        >
                                          <Delete fontSize="small" />
                                        </IconButton>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </AccordionDetails>
                        </Accordion>
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 2 }}>
                      {editingAnalysis ? (
                        <>
                          <Button
                            variant="outlined"
                            onClick={handleCancelEdit}
                            sx={{ 
                              px: 3,
                              py: 1,
                              fontSize: '0.9rem',
                              fontWeight: 700,
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button
                            variant="contained"
                            onClick={handleUpdateAnalysis}
                            disabled={samples.length < 5 || !newAnalysis.name || loading}
                            sx={{ 
                              px: 3,
                              py: 1,
                              fontSize: '0.9rem',
                              fontWeight: 700,
                            }}
                          >
                            {loading ? <CircularProgress size={20} /> : 'Atualizar Análise'}
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="contained"
                          onClick={handleCreateAnalysis}
                          disabled={samples.length < 5 || !newAnalysis.name || loading}
                          sx={{ 
                            px: 3,
                            py: 1,
                            fontSize: '0.9rem',
                            fontWeight: 700,
                          }}
                        >
                          {loading ? <CircularProgress size={20} /> : 'Criar Análise FWD'}
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Paper>
              </TabPanel>

              {/* Tab 1 - Gerenciar análises */}
              <TabPanel value={tabValue} index={1}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700, 
                        color: '#2c3e50',
                        textTransform: 'uppercase',
                        letterSpacing: '0.3px'
                      }}
                    >
                      Análises FWD Existentes
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<Visibility />}
                      onClick={() => setShowAllAnalyses(!showAllAnalyses)}
                      sx={{ 
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}
                    >
                      {showAllAnalyses ? 'Ocultar Detalhes' : 'Ver Todas as Análises'}
                    </Button>
                  </Box>
                  {fwdAnalysis.length === 0 ? (
                    <Alert severity="info" sx={{ borderRadius: 1, fontSize: '0.85rem' }}>
                      Nenhuma análise criada ainda. Vá para &quot;Dados Gerais&quot; para criar uma nova análise.
                    </Alert>
                  ) : showAllAnalyses ? (
                    // Visualização detalhada de todas as análises
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {fwdAnalysis.map((analysis) => (
                        <Card
                          key={analysis.id}
                          sx={{
                            border: selectedAnalysis?.id === analysis.id 
                              ? `2px solid ${PRO_MEDINA_COLORS.primary.main}` 
                              : `1px solid ${PRO_MEDINA_COLORS.secondary.main}`,
                            borderRadius: 2,
                            background: selectedAnalysis?.id === analysis.id 
                              ? 'linear-gradient(145deg, #fff5f0 0%, #ffffff 100%)'
                              : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                          }}
                        >
                          <CardContent sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Box>
                                <Typography 
                                  variant="h6" 
                                  fontWeight={700}
                                  sx={{ 
                                    color: selectedAnalysis?.id === analysis.id 
                                      ? PRO_MEDINA_COLORS.primary.main 
                                      : '#2c3e50',
                                    mb: 0.5,
                                    fontSize: '1rem'
                                  }}
                                >
                                  {analysis.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                  {analysis.description}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleEditAnalysis(analysis)}
                                  sx={{ 
                                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                                    '&:hover': {
                                      backgroundColor: 'rgba(255, 107, 53, 0.2)',
                                    }
                                  }}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteAnalysis(analysis.id)}
                                  sx={{ 
                                    backgroundColor: 'rgba(211, 47, 47, 0.1)',
                                    '&:hover': {
                                      backgroundColor: 'rgba(211, 47, 47, 0.2)',
                                    }
                                  }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                              <Chip
                                label={`${analysis.samples.length} amostras`}
                                variant="outlined"
                                size="small"
                                sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                              />
                              <Chip
                                label={analysis.samples.length >= 5 ? 'Completa' : 'Incompleta'}
                                color={analysis.samples.length >= 5 ? 'success' : 'warning'}
                                size="small"
                                sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                              />
                              <Chip
                                label={`Criada em: ${analysis.createdAt}`}
                                variant="outlined"
                                size="small"
                                sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                              />
                            </Box>

                            <Button
                              fullWidth
                              variant={selectedAnalysis?.id === analysis.id ? "contained" : "outlined"}
                              onClick={() => setSelectedAnalysis(analysis)}
                              size="small"
                              sx={{ 
                                borderRadius: 1,
                                fontWeight: 600,
                                fontSize: '0.75rem',
                              }}
                            >
                              {selectedAnalysis?.id === analysis.id ? 'Selecionada' : 'Selecionar para Análise'}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  ) : (
                    // Visualização em cards (original)
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                      {fwdAnalysis.map((analysis) => (
                        <Box key={analysis.id} sx={{ flex: '0 1 280px' }}>
                          <Card
                            variant={selectedAnalysis?.id === analysis.id ? 'elevation' : 'outlined'}
                            elevation={selectedAnalysis?.id === analysis.id ? 6 : 2}
                            sx={{
                              cursor: 'pointer',
                              minWidth: 240,
                              maxWidth: 280,
                              border: selectedAnalysis?.id === analysis.id 
                                ? `2px solid ${PRO_MEDINA_COLORS.primary.main}` 
                                : `1px solid ${PRO_MEDINA_COLORS.secondary.main}`,
                              borderRadius: 2,
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                              },
                              background: selectedAnalysis?.id === analysis.id 
                                ? 'linear-gradient(145deg, #fff5f0 0%, #ffffff 100%)'
                                : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                            }}
                            onClick={() => setSelectedAnalysis(analysis)}
                          >
                            <CardContent sx={{ p: 2 }}>
                              <Typography 
                                variant="h6" 
                                fontWeight={700}
                                sx={{ 
                                  color: selectedAnalysis?.id === analysis.id 
                                    ? PRO_MEDINA_COLORS.primary.main 
                                    : '#2c3e50',
                                  mb: 0.5,
                                  fontSize: '1rem'
                                }}
                              >
                                {analysis.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: '0.8rem' }}>
                                {analysis.description}
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 500, fontSize: '0.8rem' }}>
                                {analysis.samples.length} amostras - Criada em: {analysis.createdAt}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1.5 }}>
                                <Chip
                                  label={analysis.samples.length >= 5 ? 'Completa' : 'Incompleta'}
                                  color={analysis.samples.length >= 5 ? 'success' : 'warning'}
                                  size="small"
                                  sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                                />
                                <Chip
                                  label={analysis.status === 'completed' ? 'Finalizada' : 'Em andamento'}
                                  variant="outlined"
                                  size="small"
                                  sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                                />
                              </Box>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<Edit />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditAnalysis(analysis);
                                  }}
                                  sx={{ 
                                    flex: 1,
                                    borderRadius: 1,
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    py: 0.5,
                                  }}
                                >
                                  Editar
                                </Button>
                                <Button
                                  size="small"
                                  color="error"
                                  variant="outlined"
                                  disabled={loading}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteAnalysis(analysis.id);
                                  }}
                                  sx={{ 
                                    flex: 1,
                                    borderRadius: 1,
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    py: 0.5,
                                  }}
                                >
                                  {loading ? <CircularProgress size={14} /> : 'Excluir'}
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </TabPanel>

              {/* Tab 2 - Resultados e Gráficos */}
              <TabPanel value={tabValue} index={2}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 2, 
                      color: '#2c3e50',
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px'
                    }}
                  >
                    Resultados e Gráficos
                  </Typography>
                  {fwdAnalysis.length === 0 ? (
                    <Alert severity="info" sx={{ borderRadius: 1, fontSize: '0.85rem' }}>
                      Nenhuma análise disponível. Crie uma análise primeiro na aba Dados Gerais.
                    </Alert>
                  ) : !selectedAnalysis ? (
                    <Alert severity="info" sx={{ borderRadius: 1, fontSize: '0.85rem' }}>
                      Selecione uma análise para visualizar os gráficos
                    </Alert>
                  ) : selectedAnalysis.samples.length < 5 ? (
                    <Alert severity="warning" sx={{ mb: 2, borderRadius: 1, fontSize: '0.85rem' }}>
                      Análise incompleta. Mínimo 5 amostras necessárias para resultados confiáveis.
                    </Alert>
                  ) : (
                    <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto' }}>
                      <Box sx={{ mb: 2 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel sx={{ fontSize: '0.85rem' }}>Selecionar Análise</InputLabel>
                          <Select
                            value={selectedAnalysis?.id || ''}
                            onChange={(e) => {
                              const analysis = fwdAnalysis.find((a) => a.id === e.target.value);
                              if (analysis) setSelectedAnalysis(analysis);
                            }}
                            label="Selecionar Análise"
                            sx={{
                              borderRadius: 1,
                              fontSize: '0.85rem',
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: PRO_MEDINA_COLORS.secondary.main,
                              },
                            }}
                          >
                            {fwdAnalysis.map((analysis) => (
                              <MenuItem key={analysis.id} value={analysis.id} sx={{ fontSize: '0.85rem' }}>
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
                        sx={{ 
                          mb: 2,
                          px: 3,
                          py: 1,
                          fontSize: '0.9rem',
                          fontWeight: 700,
                        }}
                      >
                        {loading ? <CircularProgress size={20} /> : 'Processar Análise'}
                      </Button>
                      {procError && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: 1, fontSize: '0.85rem' }}>
                          {procError}
                        </Alert>
                      )}
                      {procResult && procResult.ordered && procResult.ordered.length > 0 ? (
                        <>
                          <Card 
                            sx={{ 
                              mb: 2,
                              border: `1px solid ${PRO_MEDINA_COLORS.secondary.main}`,
                              borderRadius: 2,
                            }}
                          >
                            <CardContent sx={{ p: 2 }}>
                              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50', fontSize: '1rem' }}>
                                {selectedAnalysis.name} - Gráfico Deflexão d0
                              </Typography>
                              <Box sx={{ height: 300 }}>
                              <Line
                                  data={d0ChartData}
                                  options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                      legend: { 
                                        display: true, 
                                        position: 'top' as const,
                                        labels: { 
                                          font: {
                                            size: 10
                                          }
                                        }
                                      },
                                      title: { 
                                        display: true, 
                                        text: 'Deflexão d0 (Máxima) e Quebras (CV > 30%)',
                                        font: { size: 12 }
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
                              </Box>
                            </CardContent>
                          </Card>
                          <Typography 
                            variant="h6" 
                            gutterBottom 
                            sx={{ 
                              fontWeight: 700, 
                              color: '#2c3e50',
                              textAlign: 'left',
                              mb: 1,
                              fontSize: '1rem'
                            }}
                          >
                            Análise de Subtrechos Homogêneos
                          </Typography>
                          <TableContainer 
                            component={Paper} 
                            sx={{ 
                              mb: 2,
                              border: `1px solid ${PRO_MEDINA_COLORS.secondary.main}`,
                              borderRadius: 2,
                            }}
                          >
                            <Table size="small">
                              <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', p: 1 }}>Início (Estaca)</TableCell>
                                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', p: 1 }}>Fim (Estaca)</TableCell>
                                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', p: 1 }}>Comprimento (m)</TableCell>
                                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', p: 1 }}>N Amostras</TableCell>
                                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', p: 1 }}>d0</TableCell>
                                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', p: 1 }}>d20</TableCell>
                                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', p: 1 }}>d30</TableCell>
                                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', p: 1 }}>d45</TableCell>
                                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', p: 1 }}>d60</TableCell>
                                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', p: 1 }}>d90</TableCell>
                                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', p: 1 }}>d120</TableCell>
                                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', p: 1 }}>d150</TableCell>
                                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', p: 1 }}>d180</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {procResult.subtrechos &&
                                  procResult.subtrechos.map((sub: Subtrecho, i: number) => (
                                    <TableRow key={i} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f8f9fa' } }}>
                                      <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{sub['Início (Estaca)']}</TableCell>
                                      <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{sub['Fim (Estaca)']}</TableCell>
                                      <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{sub['Comprimento (m)']}</TableCell>
                                      <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{sub['N Amostras']}</TableCell>
                                      <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{sub.d0}</TableCell>
                                      <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{sub.d20}</TableCell>
                                      <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{sub.d30}</TableCell>
                                      <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{sub.d45}</TableCell>
                                      <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{sub.d60}</TableCell>
                                      <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{sub.d90}</TableCell>
                                      <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{sub.d120}</TableCell>
                                      <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{sub.d150}</TableCell>
                                      <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{sub.d180}</TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <Typography 
                            variant="h6" 
                            fontWeight={700} 
                            sx={{ 
                              mb: 1, 
                              color: '#2c3e50',
                              textAlign: 'left',
                              fontSize: '1rem'
                            }}
                          >
                            Bacias de Deflexão Características por Subtrecho
                          </Typography>
                          {baciaChartData && baciaChartData.labels && baciaChartData.labels.length > 0 ? (
                            <Paper 
                              sx={{ 
                                p: 2, 
                                borderRadius: 2,
                                border: `1px solid ${PRO_MEDINA_COLORS.secondary.main}`,
                                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                              }}
                            >
                              <Box sx={{ height: 300 }}>
                              <Line
                                  data={baciaChartData}
                                  options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                      legend: { 
                                        display: true, 
                                        position: 'top' as const,
                                        labels: { 
                                          font: {
                                            size: 10
                                          }
                                        }
                                      },
                                      title: { 
                                        display: true, 
                                        text: 'Bacias de Deflexão Características',
                                        font: { size: 12 }
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
                            </Paper>
                          ) : (
                            <Alert severity="info" sx={{ mb: 2, borderRadius: 1, fontSize: '0.85rem' }}>
                              Não há dados suficientes para gerar o gráfico de bacias de deflexão.
                            </Alert>
                          )}
                        </>
                      ) : (
                        <Alert severity="info" sx={{ borderRadius: 1, fontSize: '0.85rem' }}>
                          Nenhum dado para gerar gráfico.
                        </Alert>
                      )}
                    </Box>
                  )}
                </Box>
              </TabPanel>
            </Box>
          </Paper>
        </Container>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </ThemeProvider>
  );
};

export default FWDPage;