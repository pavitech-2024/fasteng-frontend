// components/promedina/IGG/register/stations-defects.igg.tsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Paper, FormControl,
  InputLabel, Select, MenuItem, IconButton,
  Divider, Chip, Card, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, SelectChangeEvent
} from '@mui/material';
import { Add, Edit, Delete, Save, Close, Speed } from '@mui/icons-material';
import { useIggStore, IggStation } from '@/stores/promedina/igg/igg.store';
import { EssayPageProps } from '@/components/templates/essay';

const PRIMARY_GREEN = '#388e3c';
const LIGHT_GREEN_BG = '#e8f5e9';
const WARNING_ORANGE = '#f39c12';

const SECOES_TERRAPLENAGEM = {
  "A": "ATERRO", 
  "C": "CORTE", 
  "SMA": "SEÇÃO MISTA (ATERRO)",
  "SMC": "SEÇÃO MISTA (CORTE)", 
  "CR": "CORTE EM ROCHA", 
  "PP": "PONTO DE PASSAGEM"
};

const DEFEITOS_INFO: Record<string, { description: string; type: number; priority: number }> = {
  "FI": { description: "Fissuras Isoladas", type: 1, priority: 3 },
  "TTC": { description: "Trincas Transversais Curtas", type: 1, priority: 3 },
  "TTL": { description: "Trincas Transversais Longas", type: 1, priority: 3 },
  "TLC": { description: "Trincas Longitudinais Curtas", type: 1, priority: 3 },
  "TLL": { description: "Trincas Longitudinais Longas", type: 1, priority: 3 },
  "TRR": { description: "Trincas por Retração Térmica", type: 1, priority: 3 },
  "J": { description: "Trincas em Jacaré (sem erosão)", type: 2, priority: 2 },
  "TB": { description: "Trincas em Bloco (sem erosão)", type: 2, priority: 2 },
  "JE": { description: "Trincas em Jacaré (com erosão)", type: 3, priority: 1 },
  "TBE": { description: "Trincas em Bloco (com erosão)", type: 3, priority: 1 },
  "ALP": { description: "Afundamento Plástico Local", type: 4, priority: 1 },
  "ATP": { description: "Afundamento Plástico na Trilha", type: 4, priority: 1 },
  "ALC": { description: "Afundamento por Consolidação Local", type: 4, priority: 1 },
  "ATC": { description: "Afundamento por Consolidação na Trilha", type: 4, priority: 1 },
  "O": { description: "Ondulações/Corrugações", type: 5, priority: 1 },
  "P": { description: "Panelas/Buracos", type: 5, priority: 1 },
  "E": { description: "Escorregamento", type: 5, priority: 1 },
  "EX": { description: "Exsudação", type: 6, priority: 1 },
  "D": { description: "Desgaste", type: 7, priority: 1 },
  "R": { description: "Remendos", type: 8, priority: 1 }
};

const IggStationsDefects: React.FC<EssayPageProps> = ({ setNextDisabled }) => {
  const { stations, addStation, updateStation, removeStation } = useIggStore();
  
  const [currentStation, setCurrentStation] = useState<Partial<IggStation>>({
    stationNumber: '', section: 'A', tri: 0, tre: 0
  });
  const [defectCounts, setDefectCounts] = useState<Record<string, number>>({});
  const [editingStationId, setEditingStationId] = useState<number | null>(null);

  // ✅ VALIDAÇÃO: Habilita "Próximo" se houver pelo menos 1 estação
  useEffect(() => {
    setNextDisabled?.(stations.length === 0);
  }, [stations, setNextDisabled]);

  const handleStationChange = (field: string, value: string | number) => {
    setCurrentStation(prev => ({ ...prev, [field]: value }));
  };

  const handleDefectCountChange = (code: string, value: number) => {
    setDefectCounts(prev => {
      const newCounts = { ...prev };
      if (value > 0) newCounts[code] = value;
      else delete newCounts[code];
      return newCounts;
    });
  };

  const handleEditStation = (station: IggStation) => {
    setCurrentStation({
      stationNumber: station.stationNumber,
      section: station.section,
      tri: station.tri,
      tre: station.tre,
    });
    const defectsMap: Record<string, number> = {};
    station.defects.forEach(d => { defectsMap[d.code] = d.count; });
    setDefectCounts(defectsMap);
    setEditingStationId(station.id);
  };

  const resetForm = () => {
    setCurrentStation({ stationNumber: '', section: 'A', tri: 0, tre: 0 });
    setDefectCounts({});
    setEditingStationId(null);
  };

  const handleAddOrUpdate = () => {
    if (!currentStation.stationNumber) {
      alert('Número da estaca é obrigatório');
      return;
    }

    const defects = Object.entries(defectCounts)
      .filter(([, count]) => count > 0)
      .map(([code, count]) => ({ code, count }));

    if (defects.length === 0) {
      const confirm = window.confirm("Nenhum defeito registrado. Adicionar mesmo assim?");
      if (!confirm) return;
    }

    if (editingStationId) {
      updateStation(editingStationId, {
        stationNumber: currentStation.stationNumber,
        section: currentStation.section,
        tri: Number(currentStation.tri) || 0,
        tre: Number(currentStation.tre) || 0,
        defects,
      } as Partial<IggStation>);
    } else {
      const newId = stations.length > 0 ? Math.max(...stations.map(s => s.id)) + 1 : 1;
      addStation({
        id: newId,
        stationNumber: currentStation.stationNumber || '',
        section: currentStation.section || 'A',
        tri: Number(currentStation.tri) || 0,
        tre: Number(currentStation.tre) || 0,
        defects,
      } as IggStation);
    }
    resetForm();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: PRIMARY_GREEN, fontWeight: 600 }}>
        <Speed sx={{ mr: 1 }} /> ESTAÇÕES E COLETA DE DADOS
      </Typography>
      <Divider sx={{ mb: 3, borderColor: PRIMARY_GREEN }} />

      {/* Formulário de Estação */}
      <Paper sx={{ p: 3, mb: 3, border: `1px solid ${LIGHT_GREEN_BG}` }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr 1fr 1fr' }, gap: 3 }}>
          <TextField 
            fullWidth 
            label="Estaca/Quilômetro *" 
            value={currentStation.stationNumber} 
            onChange={(e) => handleStationChange('stationNumber', e.target.value)} 
            required 
          />
          <FormControl fullWidth>
            <InputLabel>Seção *</InputLabel>
            <Select 
              value={currentStation.section || 'A'} 
              label="Seção *" 
              onChange={(e: SelectChangeEvent<string>) => handleStationChange('section', e.target.value)}
            >
              {Object.entries(SECOES_TERRAPLENAGEM).map(([code, name]) => (
                <MenuItem key={code} value={code}>{code} - {name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField 
            fullWidth 
            label="Flecha TRI (mm) *" 
            type="number" 
            value={currentStation.tri || ''} 
            onChange={(e) => handleStationChange('tri', parseFloat(e.target.value) || 0)} 
            inputProps={{ min: 0, step: 0.1 }}
          />
          <TextField 
            fullWidth 
            label="Flecha TRE (mm) *" 
            type="number" 
            value={currentStation.tre || ''} 
            onChange={(e) => handleStationChange('tre', parseFloat(e.target.value) || 0)} 
            inputProps={{ min: 0, step: 0.1 }}
          />
          <Button 
            variant="contained" 
            startIcon={editingStationId ? <Save /> : <Add />}
            onClick={handleAddOrUpdate}
            fullWidth
            disabled={!currentStation.stationNumber}
            sx={{ 
              height: '56px', 
              backgroundColor: editingStationId ? WARNING_ORANGE : PRIMARY_GREEN,
              '&:hover': { 
                backgroundColor: editingStationId ? '#e67e22' : '#2e7d32' 
              } 
            }}
          >
            {editingStationId ? 'Salvar Edição' : 'Adicionar'}
          </Button>
        </Box>
        {editingStationId && (
          <Box sx={{ pt: 2, textAlign: 'right' }}>
            <Button variant="text" onClick={resetForm} startIcon={<Close />}>
              Cancelar Edição
            </Button>
          </Box>
        )}
      </Paper>

      {/* Grid de Defeitos */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, fontWeight: 600, color: PRIMARY_GREEN }}>
        <Add sx={{ mr: 1 }} fontSize="small" /> Ocorrência de Defeitos (Contagem)
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 4 }}>
        {Object.entries(DEFEITOS_INFO).map(([code, info]) => (
          <Card 
            key={code} 
            variant="outlined" 
            sx={{ 
              p: 1.5, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              backgroundColor: defectCounts[code] > 0 ? LIGHT_GREEN_BG : 'white',
              border: defectCounts[code] > 0 ? `2px solid ${PRIMARY_GREEN}` : '1px solid #e0e0e0'
            }}
          >
            <Box sx={{ flexGrow: 1, mr: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {code} - {info.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                (Tipo {info.type}, Prioridade {info.priority})
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
        ))}
      </Box>

      {/* Tabela de Estações Cadastradas */}
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
                    <TableCell>{station.tri}</TableCell>
                    <TableCell>{station.tre}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {station.defects && station.defects.length > 0 ? (
                          station.defects.map((d) => (
                            <Chip 
                              key={d.code} 
                              label={`${d.code} (${d.count})`} 
                              size="small" 
                              variant="outlined" 
                              color="info"
                              title={DEFEITOS_INFO[d.code]?.description || d.code}
                            />
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">Nenhum</Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton color="warning" size="small" onClick={() => handleEditStation(station)}>
                        <Edit fontSize="inherit" />
                      </IconButton>
                      <IconButton color="error" size="small" onClick={() => removeStation(station.id)}>
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
    </Box>
  );
};

export default IggStationsDefects;