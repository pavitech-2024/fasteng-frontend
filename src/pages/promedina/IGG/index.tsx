// PavementAnalysisPage.tsx - Versão Profissional e Compacta PROMEDINA com Contagem de Defeitos

import React, { useState, useMemo } from 'react';
import {
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Alert,
  IconButton, 
  Divider, 
  SelectChangeEvent,
  Stepper,
  Step,
  StepLabel,
  Tooltip
} from '@mui/material';
import { 
  Add, Delete, Assessment, Edit, Save, 
  ArrowBack, TrendingUp, Storage, History, 
  Speed, Warning, BarChart, InfoOutlined, 
  CheckCircleOutline, Close
} from '@mui/icons-material';

// --- Interfaces ATUALIZADAS ---
interface PavementStation {
  id: number;
  stationNumber: string;
  section: string;
  tri: number;
  tre: number;
  // AGORA ARMAZENA O CÓDIGO DO DEFEITO E A QUANTIDADE
  defects: Record<string, number>; // Ex: { "FI": 3, "J": 1 }
  date?: string;
}

interface PavementAnalysis {
  id: string;
  name: string;
  road: string;
  evaluationDate: string;
  stations: PavementStation[];
  results: PavementResults;
  createdAt: string;
}

interface PavementResults {
  generalData: any;
  statistics: {
    flechas_TRI: { media: number; variancia: number };
    flechas_TRE: { media: number; variancia: number };
    F: number;
    FV: number;
    frequencias_absolutas: Record<number, number>;
    frequencias_relativas: Record<number, number>;
    IGI_tipos: Record<number, number>;
    IGI_F: number;
    IGI_FV: number;
    IGG: number;
    classificacao: string;
    cor_classificacao: string;
    // O estacao_critica deve ser atualizado para o novo formato de defeitos
    estacao_critica: PavementStation | null; 
    total_defeitos: number;
    // Adicionado para exibir a composição do IGG
    composicao_igg: { fator: string; valor: number; tipo?: number }[];
    total_estacoes: number;
  };
}

// --- Constantes (Sem Alteração na Informação) ---
const FATORES_PONDERACAO: Record<number, number> = {
  1: 0.2, 2: 0.5, 3: 0.8, 4: 0.9, 5: 1.0, 6: 0.5, 7: 0.3, 8: 0.6
};

const CLASSIFICACAO = [
  { min: 0, max: 20, classificacao: "ÓTIMO", cor: "#2ecc71" },
  { min: 20, max: 40, classificacao: "BOM", cor: "#3498db" },
  { min: 40, max: 80, classificacao: "REGULAR", cor: "#f39c12" },
  { min: 80, max: 160, classificacao: "RUIM", cor: "#e74c3c" },
  { min: 160, max: Infinity, classificacao: "PÉSSIMO", cor: "#c0392b" }
];

const DEFEITOS_INFO: Record<string, [string, number, number]> = {
  "FI": ["Fissuras Isoladas", 1, 3], "TTC": ["Trincas Transversais Curtas", 1, 3], 
  "TTL": ["Trincas Transversais Longas", 1, 3], "TLC": ["Trincas Longitudinais Curtas", 1, 3], 
  "TLL": ["Trincas Longitudinais Longas", 1, 3], "TRR": ["Trincas por Retração Térmica", 1, 3], 
  "J": ["Trincas em Jacaré (sem erosão)", 2, 2], "TB": ["Trincas em Bloco (sem erosão)", 2, 2], 
  "JE": ["Trincas em Jacaré (com erosão)", 3, 1], "TBE": ["Trincas em Bloco (com erosão)", 3, 1], 
  "ALP": ["Afundamento Plástico Local", 4, 1], "ATP": ["Afundamento Plástico na Trilha", 4, 1], 
  "ALC": ["Afundamento por Consolidação Local", 4, 1], "ATC": ["Afundamento por Consolidação na Trilha", 4, 1], 
  "O": ["Ondulações/Corrugações", 5, 1], "P": ["Panelas/Buracos", 5, 1], "E": ["Escorregamento", 5, 1], 
  "EX": ["Exsudação", 6, 1], "D": ["Desgaste", 7, 1], "R": ["Remendos", 8, 1]
};

const SECOES_TERRAPLENAGEM_MAP: Record<string, string> = {
  "A": "ATERRO", "C": "CORTE", "SMA": "SEÇÃO MISTA (ATERRO)", 
  "SMC": "SEÇÃO MISTA (CORTE)", "CR": "CORTE EM ROCHA", "PP": "PONTO DE PASSAGEM"
};

const SECOES_TERRAPLENAGEM_OPTIONS = Object.entries(SECOES_TERRAPLENAGEM_MAP).map(([code, name]) => ({
  code, name
}));

// Cores PROMEDINA
const PRIMARY_GREEN = '#388e3c'; 
const LIGHT_GREEN_BG = '#e8f5e9'; 
const WARNING_ORANGE = '#f39c12'; 
const ERROR_RED = '#e74c3c';

// --- Funções Auxiliares (Processamento DNIT - Ajustado para o novo formato de defeitos e robustez) ---
const processarDadosDNIT = (dados: { geral: any, estacoes: PavementStation[] }): PavementResults => {
  const stations = dados.estacoes;
  const n = stations.length;
  
  // Objeto de retorno inicial com valores seguros (default)
  const defaultResults: PavementResults = {
    generalData: dados.geral,
    statistics: {
      flechas_TRI: { media: 0, variancia: 0 },
      flechas_TRE: { media: 0, variancia: 0 },
      F: 0, FV: 0,
      frequencias_absolutas: {},
      frequencias_relativas: {},
      IGI_tipos: {}, IGI_F: 0, IGI_FV: 0, IGG: 0,
      classificacao: CLASSIFICACAO[0].classificacao, // ÓTIMO (Default)
      cor_classificacao: CLASSIFICACAO[0].cor,
      estacao_critica: null, 
      total_defeitos: 0,
      composicao_igg: [], // Inicializa composicao_igg como um array vazio
      total_estacoes: n
    }
  };

  if (n === 0) return defaultResults;

  // 1. Cálculo das flechas 
  const media_tri = stations.reduce((sum: number, station: any) => sum + station.tri, 0) / n;
  const media_tre = stations.reduce((sum: number, station: any) => sum + station.tre, 0) / n;
  const var_tri = stations.reduce((sum: number, station: any) => sum + Math.pow(station.tri - media_tri, 2), 0) / n;
  const var_tre = stations.reduce((sum: number, station: any) => sum + Math.pow(station.tre - media_tre, 2), 0) / n;
  
  const F = (media_tri + media_tre) / 2;
  const FV = (var_tri + var_tre) / 2;
  
  // 2. Processamento de defeitos (Priorização e Tipos)
  const tiposDefeitos = stations.map((station: PavementStation) => {
    const tiposEncontrados: number[] = [];
    Object.keys(station.defects).forEach(code => {
      if (station.defects[code] > 0) {
        tiposEncontrados.push(DEFEITOS_INFO[code][1]);
      }
    });
    return tiposEncontrados;
  });
  
  const tiposPriorizados = tiposDefeitos.map((tipos: number[]) => {
    // Implementação simplificada da priorização DNIT (o maior tipo tem prioridade)
    const tiposUnicos = [...new Set(tipos)].sort((a, b) => b - a);
    
    if (tiposUnicos.includes(3)) {
        return tiposUnicos.filter(t => t >= 3);
    }
    if (tiposUnicos.includes(2)) {
        return tiposUnicos.filter(t => t >= 2);
    }
    return tiposUnicos;
  });
  
  // 3. Frequências Absolutas e Relativas
  const freq_abs: Record<number, number> = {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0};
  tiposPriorizados.forEach((tipos: number[]) => {
    [...new Set(tipos)].forEach(t => { 
      // Conta se o TIPO (já priorizado) está presente na estaca
      freq_abs[t]++; 
    });
  });
  
  const freq_rel = Object.fromEntries(
    Object.entries(freq_abs).map(([t, count]) => [parseInt(t), (count as number / n) * 100])
  );
  
  // 4. Cálculo dos IGIs
  const IGI_tipos: Record<number, number> = {};
  Object.entries(freq_rel).forEach(([t, freq]) => {
    const tipo = parseInt(t);
    if (tipo > 0) {
        IGI_tipos[tipo] = (freq as number) * FATORES_PONDERACAO[tipo];
    }
  });
  
  // Fórmulas IGI_F e IGI_FV
  const IGI_F = F <= 30 ? F * (4/3) : 40;
  const IGI_FV = FV <= 50 ? FV : 50;
  
  // 5. Cálculo do IGG
  const IGG = Object.values(IGI_tipos).reduce((a, b) => a + b, 0) + IGI_F + IGI_FV;
  
  // 6. Classificação
  const classificacaoObj = CLASSIFICACAO.find(c => IGG >= c.min && IGG < c.max) || CLASSIFICACAO[CLASSIFICACAO.length - 1];
  
  // 7. Estação crítica (Baseado no número total de ocorrências de defeitos)
  const estacaoCritica: PavementStation | null = stations.length > 0 
    ? stations.reduce((critica: PavementStation, station: PavementStation) => {
        const totalDefeitosStation = Object.values(station.defects).reduce((sum, count) => sum + count, 0);
        const totalDefeitosCritica = Object.values(critica.defects).reduce((sum, count) => sum + count, 0);
        // Se a contagem é maior, ou se é a primeira iteração, atualiza
        if (totalDefeitosStation > totalDefeitosCritica || critica.id === 0) {
            return station;
        }
        return critica;
      }, { // Inicialização para o reduce
          id: 0, stationNumber: '', section: '', tri: 0, tre: 0, defects: {}
      } as PavementStation)
    : null;
    
  const total_defeitos_geral = stations.reduce((sum: number, station: PavementStation) => 
    sum + Object.values(station.defects).reduce((s, count) => s + count, 0), 0
  );

  // 8. Composição do IGG para o gráfico de resultados
  const composicao_igg = [
    ...Object.entries(IGI_tipos)
        .filter(([, valor]) => valor > 0.01) // Ignora valores muito pequenos
        .map(([tipo, valor]) => ({ 
            fator: `IGI Tipo ${tipo}`, 
            valor: valor, 
            tipo: parseInt(tipo) 
        })),
    { fator: "IGI Flechas (F)", valor: IGI_F },
    { fator: "IGI Variância (FV)", valor: IGI_FV },
  ].sort((a, b) => b.valor - a.valor); // Ordena por maior contribuição
  
  return {
    generalData: dados.geral,
    statistics: {
      flechas_TRI: { media: media_tri, variancia: var_tri },
      flechas_TRE: { media: media_tre, variancia: var_tre },
      F, FV,
      frequencias_absolutas: freq_abs,
      frequencias_relativas: freq_rel,
      IGI_tipos, IGI_F, IGI_FV, IGG,
      classificacao: classificacaoObj.classificacao,
      cor_classificacao: classificacaoObj.cor,
      estacao_critica: estacaoCritica,
      total_defeitos: total_defeitos_geral,
      composicao_igg,
      total_estacoes: n
    }
  };
};

// --- Componente Simulado de Gráfico de Barras (Para Frequência) ---
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
    <Box sx={{ p: 2, height: 250, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Distribuição de Frequência Relativa de Tipos de Defeito (IGG)</Typography>
      {chartData.map(item => (
        <Grid container key={item.tipo} alignItems="center" spacing={1}>
          <Grid item xs={3}>
            <Typography variant="caption" noWrap>{item.tipo}</Typography>
          </Grid>
          <Grid item xs={8}>
            <Box 
              sx={{ 
                height: 18, 
                backgroundColor: PRIMARY_GREEN, 
                width: `${(item.frequencia / maxFreq) * 100}%`, 
                borderRadius: 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                pr: 1
              }}
            >
              <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                {item.frequencia}%
              </Typography>
            </Box>
          </Grid>
        </Grid>
      ))}
    </Box>
  );
};

// --- Componente de Resultados (Implementação do Layout Profissional) ---
const ResultsSection: React.FC<{ results: PavementResults, onSave: () => void, onEdit: () => void }> = ({ results, onSave, onEdit }) => {
  const stats = results.statistics;
  const F_class = stats.F > 15 ? WARNING_ORANGE : PRIMARY_GREEN; // Exemplo de regra visual para F
  const FV_class = stats.FV > 10 ? WARNING_ORANGE : PRIMARY_GREEN; // Exemplo de regra visual para FV
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: PRIMARY_GREEN, fontWeight: 600 }}>
        <CheckCircleOutline sx={{ mr: 1 }} /> RESULTADOS DA ANÁLISE
      </Typography>
      <Divider sx={{ mb: 3, borderColor: PRIMARY_GREEN }} />

      <Grid container spacing={3}>
        {/* COLUNA 1: Destaque IGG e Indicadores Chave */}
        <Grid item xs={12} md={5}>
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
              <Typography variant="caption" sx={{ opacity: 0.8 }}>ÍNDICE DE GRAVIDADE GLOBAL (IGG)</Typography>
              <Typography variant="h2" sx={{ fontWeight: 800 }}>{stats.IGG.toFixed(2)}</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{stats.classificacao}</Typography>
            </CardContent>
          </Card>

          {/* Indicadores & Flechas (Tabela Compacta) */}
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: PRIMARY_GREEN }}>
              <TrendingUp sx={{ mr: 0.5 }} fontSize="small" /> Indicadores de Desempenho
            </Typography>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>F (Média Flecha)</TableCell>
                  <TableCell sx={{ color: F_class }}>{stats.F.toFixed(2)} mm</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>FV (Variância)</TableCell>
                  <TableCell sx={{ color: FV_class }}>{stats.FV.toFixed(2)}</TableCell>
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

          {/* Estação Crítica (Alerta) */}
          {stats.estacao_critica && stats.estacao_critica.id !== 0 && Object.values(stats.estacao_critica.defects).reduce((sum, count) => sum + count, 0) > 0 && (
            <Alert 
              severity="error" 
              icon={<Warning />} 
              sx={{ mb: 3, border: `1px solid ${ERROR_RED}` }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Ponto de Atenção Crítico:</Typography>
              Estaca **{stats.estacao_critica.stationNumber}** (Seção {stats.estacao_critica.section}). Registrou o maior número de ocorrências de defeitos (**{Object.values(stats.estacao_critica.defects).reduce((sum, count) => sum + count, 0)}**).
            </Alert>
          )}

        </Grid>

        {/* COLUNA 2: Composição do IGG e Frequência de Defeitos */}
        <Grid item xs={12} md={7}>
          
          {/* Composição do IGG (Tabela de Contribuição) */}
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: PRIMARY_GREEN }}>
              <BarChart sx={{ mr: 0.5 }} fontSize="small" /> Composição do IGG (Pontos)
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: LIGHT_GREEN_BG }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Fator Contribuinte</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Pontos</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>% Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.composicao_igg.map((item, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        {item.fator}
                        {item.tipo && (
                            <Tooltip 
                                title={Object.entries(DEFEITOS_INFO).filter(([, [, type]]) => type === item.tipo).map(([code, [desc]]) => `${code}: ${desc}`).join(', ')}
                            >
                                <InfoOutlined sx={{ fontSize: 14, ml: 0.5, color: '#90a4ae' }} />
                            </Tooltip>
                        )}
                      </TableCell>
                      <TableCell>{item.valor.toFixed(2)}</TableCell>
                      <TableCell>{((item.valor / stats.IGG) * 100).toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                  <TableRow sx={{ backgroundColor: LIGHT_GREEN_BG }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Total IGG</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{stats.IGG.toFixed(2)}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>100.0%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Distribuição de Frequência Relativa */}
          <Paper variant="outlined" sx={{ p: 2 }}>
            <FrequencyBarChart data={stats.frequencias_relativas} />
          </Paper>

        </Grid>
      </Grid>
      
      {/* Ações Finais */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
        <Button variant="outlined" onClick={onEdit} startIcon={<ArrowBack />}>
          Voltar e Editar Dados
        </Button>
        <Button 
          variant="contained" 
          onClick={onSave}
          startIcon={<Save />}
          sx={{ backgroundColor: PRIMARY_GREEN, '&:hover': { backgroundColor: '#2e7d32' } }} 
        >
          SALVAR ANÁLISE
        </Button>
      </Box>
    </Box>
  );
};


// --- Componente Principal ---
const PavementAnalysisPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [results, setResults] = useState<PavementResults | null>(null);
  const [stations, setStations] = useState<PavementStation[]>([]);
  const [editingStationId, setEditingStationId] = useState<number | null>(null);
  const [savedAnalyses, setSavedAnalyses] = useState<PavementAnalysis[]>([]);
  const [viewingSaved, setViewingSaved] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<PavementAnalysis | null>(null);

  // --- Estado do Formulário de Dados Gerais ---
  const [formData, setFormData] = useState({
    name: '', description: '', road: '', section: '', subtrack: '',
    pavementType: '', evaluationDate: new Date().toISOString().split('T')[0],
  });

  // --- Estado da Estação Atual/Edição ---
  const initialStation: Partial<PavementStation> = {
    stationNumber: '', section: 'A', tri: 0, tre: 0, defects: {}
  };
  
  const [currentStation, setCurrentStation] = useState<Partial<PavementStation>>(initialStation);
  
  // O estado de 'defectCounts' agora reflete a contagem de defeitos na estação atual.
  const [defectCounts, setDefectCounts] = useState<Record<string, number>>({});

  const steps = ['Dados Gerais', 'Estações e Defeitos', 'Resultados'];

  // Handlers
  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStationChange = (field: keyof PavementStation, value: any) => {
    setCurrentStation(prev => ({ ...prev, [field]: value }));
  };

  // --- NOVO HANDLER PARA CONTAR DEFEITOS ---
  const handleDefectCountChange = (defectCode: string, value: number) => {
    setDefectCounts(prev => {
      const newCounts = { ...prev };
      if (value > 0) {
        newCounts[defectCode] = value;
      } else {
        // Remove da lista se a contagem for 0 ou menos
        delete newCounts[defectCode];
      }
      return newCounts;
    });
  };

  const resetStationForm = (keepSection: boolean = true) => {
    setCurrentStation({
      stationNumber: '',
      section: keepSection ? currentStation.section : 'A',
      tri: 0,
      tre: 0,
      defects: {}
    });
    setDefectCounts({}); // Resetar a contagem
    setEditingStationId(null);
  };
  
  // --- Lógica de Adição/Edição de Estação ATUALIZADA ---
  const handleAddOrUpdateStation = () => {
    if (!currentStation.stationNumber) {
      alert('Número da estaca é obrigatório');
      return;
    }
    
    // Filtra defeitos com contagem > 0 antes de salvar
    const defectsToSave: Record<string, number> = Object.entries(defectCounts)
      .filter(([, count]) => count > 0)
      .reduce((acc, [code, count]) => ({ ...acc, [code]: count }), {});

    const stationData: PavementStation = {
      ...currentStation as PavementStation,
      tri: parseFloat(currentStation.tri as any) || 0,
      tre: parseFloat(currentStation.tre as any) || 0,
      defects: defectsToSave, // Usa o novo formato
      id: editingStationId || stations.length + 1
    };
    
    if (Object.keys(defectsToSave).length === 0) {
      const confirm = window.confirm("Nenhum defeito foi registrado para esta estaca. Deseja adicionar mesmo assim?");
      if (!confirm) return;
    }

    if (editingStationId) {
      // Atualizar estação existente
      setStations(prev => 
        prev.map(s => s.id === editingStationId ? stationData : s)
      );
    } else {
      // Adicionar nova estação
      // Garante que o ID é único (embora o stations.length + 1 já ajude)
      const newId = stations.length > 0 ? Math.max(...stations.map(s => s.id)) + 1 : 1;
      setStations(prev => [...prev, {...stationData, id: newId}]);
    }
    
    resetStationForm(true);
  };
  
  // --- Lógica para Carregar Estação para Edição ATUALIZADA ---
  const handleEditStation = (station: PavementStation) => {
    setCurrentStation(station);
    // Carrega o formato Record<string, number> para a contagem
    setDefectCounts(station.defects); 
    setEditingStationId(station.id);
  };
  
  const handleDeleteStation = (id: number) => {
      if (window.confirm('Tem certeza que deseja excluir esta estação?')) {
          setStations(prev => prev.filter(s => s.id !== id));
      }
  };


  // --- Lógica de Processamento e Salvamento (Mantido) ---
  const handleProcessAnalysis = () => {
    if (stations.length === 0) {
      alert('Adicione pelo menos uma estação');
      return;
    }

    const analysisData = { geral: formData, estacoes: stations };
    const processedResults = processarDadosDNIT(analysisData);
    setResults(processedResults);
    setActiveStep(2);
  };

  const handleSaveAnalysis = () => {
    if (!results) return;

    const newAnalysis: PavementAnalysis = {
      id: `ANL-${Date.now()}`,
      name: formData.name || `Análise ${new Date().toLocaleDateString()}`,
      road: formData.road,
      evaluationDate: formData.evaluationDate,
      stations: stations,
      results: results,
      createdAt: new Date().toISOString(),
    };
    
    setSavedAnalyses(prev => [...prev, newAnalysis]);
    alert(`Análise "${newAnalysis.name}" salva com sucesso!`);
    resetAll();
  };
  
  // Lógica para Resetar, Visualizar/Carregar Análise Salva (Mantido)
  const resetAll = () => {
    setFormData({
      name: '', description: '', road: '', section: '', subtrack: '',
      pavementType: '', evaluationDate: new Date().toISOString().split('T')[0],
    });
    setStations([]);
    setResults(null);
    setActiveStep(0);
    resetStationForm(false);
    setViewingSaved(false);
    setSelectedAnalysis(null);
  };

  const handleViewAnalysis = (analysis: PavementAnalysis) => {
    setSelectedAnalysis(analysis);
    setViewingSaved(true);
    setResults(analysis.results);
    setActiveStep(2); 
  };
  
  // Função para voltar para a Edição (etapa 2) a partir da Etapa 3
  const handleEditFromResults = () => {
    if (selectedAnalysis) {
        // Se estiver vendo uma análise salva, carrega os dados completos
        setFormData(selectedAnalysis.results.generalData);
        setStations(selectedAnalysis.stations);
        setSelectedAnalysis(null); // Sai do modo de visualização salva
        setViewingSaved(false);
    }
    setActiveStep(1);
    // Limpa os resultados para recalcular
    setResults(null); 
  };
  
  const handleBackToSavedList = () => {
    setSelectedAnalysis(null);
    setResults(null);
    setStations([]);
  };
  
  const handleBackToStart = () => {
    setViewingSaved(false);
    resetAll();
  };


  // Renderização da Lista de Análises Salvas
  if (viewingSaved && !selectedAnalysis) {
      return (
          <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
              <Paper sx={{ p: 4, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: PRIMARY_GREEN }}>
                      <Storage sx={{ mr: 1 }} /> ANÁLISES SALVAS ({savedAnalyses.length})
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  {savedAnalyses.length === 0 ? (
                      <Alert severity="info">Nenhuma análise salva ainda.</Alert>
                  ) : (
                      <Grid container spacing={3}>
                          {savedAnalyses.map(analysis => (
                              <Grid item xs={12} sm={6} md={4} key={analysis.id}>
                                  <Card 
                                    variant="outlined" 
                                    sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                                  >
                                      <CardContent>
                                          <Typography variant="body1" sx={{ fontWeight: 'bold', color: PRIMARY_GREEN, mb: 1 }}>{analysis.name}</Typography>
                                          <Typography variant="body2" color="text.secondary">Rodovia: **{analysis.road}**</Typography>
                                          <Typography variant="body2" color="text.secondary">Data: {new Date(analysis.evaluationDate).toLocaleDateString()}</Typography>
                                          <Typography variant="body2">Estações: {analysis.stations.length}</Typography>
                                          <Chip 
                                            label={`IGG: ${analysis.results.statistics.IGG.toFixed(1)} (${analysis.results.statistics.classificacao})`}
                                            sx={{ mt: 1, backgroundColor: analysis.results.statistics.cor_classificacao, color: 'white', fontWeight: 'bold' }}
                                          />
                                      </CardContent>
                                      <Box sx={{ p: 2, pt: 0, textAlign: 'right' }}>
                                          <Button size="small" onClick={() => handleViewAnalysis(analysis)} startIcon={<Assessment />}>
                                              Visualizar
                                          </Button>
                                      </Box>
                                  </Card>
                              </Grid>
                          ))}
                      </Grid>
                  )}
                  
                  <Box sx={{ mt: 4, textAlign: 'center' }}>
                      <Button variant="outlined" onClick={handleBackToStart} startIcon={<ArrowBack />}>
                          Voltar ao Cálculo
                      </Button>
                  </Box>
              </Paper>
          </Box>
      );
  }

  // Se estiver visualizando uma análise salva E já processada, mostra os resultados.
  if (viewingSaved && selectedAnalysis && results) {
       return (
          <Box sx={{ p: 3, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
              <Paper sx={{ p: 4, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                     <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                         <Assessment sx={{ mr: 1, color: PRIMARY_GREEN }} fontSize="inherit" /> RELATÓRIO: {selectedAnalysis.name}
                     </Typography>
                      <Button 
                          variant="outlined" 
                          onClick={handleBackToSavedList} 
                          startIcon={<ArrowBack />}
                      >
                          Voltar para Lista
                      </Button>
                  </Box>
                  <Divider sx={{ mb: 4 }} />
                  <ResultsSection results={results} onSave={() => alert('Esta análise já está salva.')} onEdit={handleEditFromResults} />
              </Paper>
          </Box>
       );
  }

  // --- Renderização da Página Principal (Passos) ---
  return (
    <Box sx={{ p: 3, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Paper sx={{ p: 4, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        
        {/* Título e Ações */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                <Assessment sx={{ mr: 1, color: PRIMARY_GREEN }} fontSize="inherit" /> AVALIAÇÃO DE PAVIMENTOS
            </Typography>
            <Button 
                variant="outlined" 
                onClick={() => setViewingSaved(true)} 
                startIcon={<History />}
            >
                Ver Análises Salvas
            </Button>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Stepper */}
        <Box sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel 
                  StepIconProps={{ style: { color: index === activeStep ? PRIMARY_GREEN : '#757575' } }}
                  sx={{ '& .MuiStepLabel-label': { fontWeight: index === activeStep ? 'bold' : 'normal' } }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* ===================================================================== */}
        {/* Etapa 1: Dados Gerais (Mantido) */}
        {activeStep === 0 && (
          <Box 
            sx={{ border: `1px solid ${PRIMARY_GREEN}`, borderRadius: 1, p: 3, position: 'relative' }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: PRIMARY_GREEN, fontWeight: 600, position: 'absolute', top: '-15px',
                left: '10px', backgroundColor: 'white', px: 1
              }}
            >
              DADOS GERAIS DO TRECHO
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}> 
              <Grid item xs={12} md={4}><TextField fullWidth label="Nome da Análise *" value={formData.name} onChange={(e) => handleFormChange('name', e.target.value)} required /></Grid>
              <Grid item xs={12} md={4}><TextField fullWidth label="Rodovia *" value={formData.road} onChange={(e) => handleFormChange('road', e.target.value)} required /></Grid>
              <Grid item xs={12} md={4}><TextField fullWidth label="Trecho/Local *" value={formData.section} onChange={(e) => handleFormChange('section', e.target.value)} required /></Grid>
              <Grid item xs={12} md={4}><TextField fullWidth label="Subtramo" value={formData.subtrack} onChange={(e) => handleFormChange('subtrack', e.target.value)} /></Grid>
              <Grid item xs={12} md={4}><TextField fullWidth label="Tipo de Revestimento *" value={formData.pavementType} onChange={(e) => handleFormChange('pavementType', e.target.value)} required /></Grid>
              <Grid item xs={12} md={4}><TextField fullWidth label="Data da Avaliação *" type="date" value={formData.evaluationDate} onChange={(e) => handleFormChange('evaluationDate', e.target.value)} InputLabelProps={{ shrink: true }} required /></Grid>
              <Grid item xs={12}><TextField fullWidth multiline rows={2} label="Observações" value={formData.description} onChange={(e) => handleFormChange('description', e.target.value)} /></Grid>
            </Grid>
            
            <Box sx={{ mt: 4, textAlign: 'right' }}>
              <Button 
                variant="contained" 
                onClick={() => setActiveStep(1)}
                disabled={!formData.name || !formData.road || !formData.section || !formData.pavementType}
                sx={{ backgroundColor: PRIMARY_GREEN, '&:hover': { backgroundColor: '#2e7d32' } }} 
              >
                Próximo - Adicionar Estações
              </Button>
            </Box>
          </Box>
        )}

        {/* ===================================================================== */}
        {/* Etapa 2: Estações e Defeitos (ATUALIZADA) */}
        {activeStep === 1 && (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ color: PRIMARY_GREEN, fontWeight: 600 }}>
              <Speed sx={{ mr: 1 }} /> ESTAÇÕES E COLETA DE DADOS
            </Typography>
            <Divider sx={{ mb: 3, borderColor: PRIMARY_GREEN }} />
            
            <Alert severity="info" sx={{ mb: 3 }}>
              {editingStationId ? `Editando Estação #${editingStationId} - ${currentStation.stationNumber}` : 'Cadastre uma nova estação de avaliação.'}
            </Alert>
            
            {/* Formulário de Adição/Edição de Estação */}
            <Grid container spacing={3} component={Paper} sx={{ p: 3, mb: 3, border: `1px solid ${LIGHT_GREEN_BG}` }}> 
              <Grid item xs={12} md={3}>
                <TextField fullWidth label="Estaca/Quilômetro *" value={currentStation.stationNumber} onChange={(e) => handleStationChange('stationNumber', e.target.value)} required />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Seção *</InputLabel>
                  <Select
                    value={currentStation.section || 'A'}
                    label="Seção *"
                    onChange={(e: SelectChangeEvent<string>) => handleStationChange('section', e.target.value)}
                  >
                    {SECOES_TERRAPLENAGEM_OPTIONS.map(sec => (
                      <MenuItem key={sec.code} value={sec.code}>{sec.code} - {sec.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField fullWidth label="Flecha TRI (mm) *" type="number" value={currentStation.tri === 0 ? '' : currentStation.tri} onChange={(e) => handleStationChange('tri', parseFloat(e.target.value) || 0)} inputProps={{ min: 0, step: 0.1 }} required />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField fullWidth label="Flecha TRE (mm) *" type="number" value={currentStation.tre === 0 ? '' : currentStation.tre} onChange={(e) => handleStationChange('tre', parseFloat(e.target.value) || 0)} inputProps={{ min: 0, step: 0.1 }} required />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button 
                  variant="contained" 
                  startIcon={editingStationId ? <Save /> : <Add />}
                  onClick={handleAddOrUpdateStation}
                  fullWidth
                  disabled={!currentStation.stationNumber}
                  sx={{ height: '56px', backgroundColor: editingStationId ? WARNING_ORANGE : PRIMARY_GREEN, '&:hover': { backgroundColor: editingStationId ? '#e67e22' : '#2e7d32' } }}
                >
                  {editingStationId ? 'Salvar Edição' : 'Adicionar Estação'}
                </Button>
              </Grid>
              {editingStationId && (
                <Grid item xs={12} sx={{ pt: 0, textAlign: 'right' }}>
                    <Button variant="text" color="inherit" onClick={() => resetStationForm(true)} startIcon={<Close />}>
                        Cancelar Edição
                    </Button>
                </Grid>
              )}
            </Grid>

            {/* SELEÇÃO E CONTAGEM DE DEFEITOS */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4, fontWeight: 600, color: PRIMARY_GREEN }}>
              <Add sx={{ mr: 1, verticalAlign: 'middle' }} fontSize="small" /> Ocorrência de Defeitos (Contagem)
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {Object.entries(DEFEITOS_INFO).map(([code, [desc, type, priority]]) => (
                <Grid item xs={12} sm={6} md={4} key={code}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      p: 1.5, 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      backgroundColor: defectCounts[code] > 0 ? LIGHT_GREEN_BG : 'white',
                      border: defectCounts[code] > 0 ? `1px solid ${PRIMARY_GREEN}` : '1px solid #e0e0e0'
                    }}
                  >
                    <Box sx={{ flexGrow: 1, mr: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {code} - {desc} 
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        (Tipo {type}, Prioridade {priority})
                      </Typography>
                    </Box>
                    <TextField
                      label="Qtd."
                      type="number"
                      size="small"
                      value={defectCounts[code] || ''}
                      onChange={(e) => handleDefectCountChange(code, parseInt(e.target.value) || 0)}
                      inputProps={{ min: 0, max: 99, style: { textAlign: 'center' } }}
                      sx={{ width: 80 }}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Lista de Estações (Tabela ATUALIZADA) */}
            {stations.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Estações Cadastradas ({stations.length})
                </Typography>
                <TableContainer component={Paper} sx={{ mb: 3 }}>
                  <Table size="small">
                    <TableHead sx={{ backgroundColor: LIGHT_GREEN_BG }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', color: PRIMARY_GREEN }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: PRIMARY_GREEN }}>Estaca</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: PRIMARY_GREEN }}>Seção</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: PRIMARY_GREEN }}>TRI (mm)</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: PRIMARY_GREEN }}>TRE (mm)</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: PRIMARY_GREEN }}>Defeitos (Qtd.)</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: PRIMARY_GREEN, width: '10%' }}>Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stations.map((station) => (
                        <TableRow key={station.id} hover>
                          <TableCell>{station.id}</TableCell>
                          <TableCell>{station.stationNumber}</TableCell>
                          <TableCell>{station.section}</TableCell>
                          <TableCell>{station.tri.toFixed(1)}</TableCell>
                          <TableCell>{station.tre.toFixed(1)}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {Object.entries(station.defects).map(([code, count]) => (
                                <Chip 
                                  key={code} 
                                  // AGORA MOSTRA O CÓDIGO E A QUANTIDADE
                                  label={`${code} (${count})`} 
                                  size="small" 
                                  variant="outlined" 
                                  color="info" 
                                  title={DEFEITOS_INFO[code][0]} // Tooltip para nome completo
                                />
                              ))}
                              {Object.keys(station.defects).length === 0 && (
                                <Typography variant="body2" color="text.secondary">
                                  Nenhum
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <IconButton color="warning" size="small" onClick={() => handleEditStation(station)}>
                              <Edit fontSize="inherit" />
                            </IconButton>
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleDeleteStation(station.id)}
                            >
                              <Delete fontSize="inherit" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', mt: 4 }}>
              <Button variant="outlined" onClick={() => setActiveStep(0)} startIcon={<ArrowBack />}>
                Anterior (Dados Gerais)
              </Button>
              <Button 
                variant="contained" 
                onClick={handleProcessAnalysis}
                disabled={stations.length === 0}
                startIcon={<Assessment />}
                sx={{ backgroundColor: PRIMARY_GREEN, '&:hover': { backgroundColor: '#2e7d32' } }} 
              >
                PROCESSAR ANÁLISE
              </Button>
            </Box>
          </Box>
        )}
        
        {/* ===================================================================== */}
        {/* Etapa 3: Resultados (NOVA E PROFISSIONAL) */}
        {activeStep === 2 && results && (
            <ResultsSection 
                results={results} 
                onSave={handleSaveAnalysis} 
                onEdit={handleEditFromResults} 
            />
        )}
        
        {/* Caso a Etapa 3 seja acessada sem dados */}
        {activeStep === 2 && !results && (
            <Alert severity="error">
                Os resultados não foram processados. Volte para a Etapa 2.
            </Alert>
        )}

      </Paper>
    </Box>
  );
};

export default PavementAnalysisPage;