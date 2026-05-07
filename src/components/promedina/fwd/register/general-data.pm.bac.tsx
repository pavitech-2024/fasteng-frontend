import { EssayPageProps } from '../../../templates/essay';
import { Box, TextField, Tooltip, IconButton, Typography, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Alert, Accordion, AccordionSummary, AccordionDetails, Chip, Snackbar, CircularProgress } from '@mui/material';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Delete, Add, FileUpload, ExpandMore, Download } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { useState, ChangeEvent, useEffect } from 'react';
import useFWDStore, { FWDData } from '@/stores/promedina/fwd/fwd.store';

const FWD_step1 = ({ setNextDisabled }: EssayPageProps) => {
  const {
    analysisData, setAnalysisData,
    samples, addSample, removeSample, setSamples, clearSamples,
    editingId, setEditingId, setActiveTab,
    loading, error, setError,
    saveAnalysis, fetchAnalysis,
  } = useFWDStore();

  const [currentSample, setCurrentSample] = useState<Partial<FWDData>>({
    stationNumber: 0, d0: 0, d20: 0, d30: 0, d45: 0, d60: 0,
    d90: 0, d120: 0, d150: 0, d180: 0,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const sensoresDeflexao = [0, 20, 30, 45, 60, 90, 120, 150, 180];

  useEffect(() => {
    setNextDisabled?.(false);
    if (editingId) {
      fetchAnalysis(editingId).then(analysis => {
        if (analysis) {
          setAnalysisData({
            name: analysis.name || '',
            description: analysis.description || '',
          });
          setSamples(analysis.samples || []);
        }
      });
    }
  }, []);

  // ⭐ Função para baixar a planilha padrão
  const handleDownloadModelo = () => {
    const link = document.createElement('a');
    link.href = '/assets/promedina/fwd/modelo-bacias-fwd.xlsx';
    link.download = 'Modelo_Planilha_FWD_Bacias.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setSnackbar({ 
      open: true, 
      message: 'Download da planilha padrão iniciado!', 
      severity: 'success' 
    });
  };

  const tooltips: Record<string, string> = {
    fwdName: 'Nome descritivo para a análise FWD',
    fwdLocation: 'Localização do trecho analisado',
    fwdHighway: 'Nome da rodovia em análise',
    fwdLayerType: 'Tipo de camada do pavimento',
    fwdCityState: 'Município e Estado da rodovia',
    fwdSpeedLimit: 'Velocidade diretriz da via em km/h',
    fwdDescription: 'Descrição detalhada da análise',
    stationNumber: 'Número da estaca de medição',
    d0: 'Deflexão máxima no centro da carga (µm)',
    d20: 'Deflexão a 20 cm do centro (µm)',
    d30: 'Deflexão a 30 cm do centro (µm)',
    d45: 'Deflexão a 45 cm do centro (µm)',
    d60: 'Deflexão a 60 cm do centro (µm)',
    d90: 'Deflexão a 90 cm do centro (µm)',
    d120: 'Deflexão a 120 cm do centro (µm)',
    d150: 'Deflexão a 150 cm do centro (µm)',
    d180: 'Deflexão a 180 cm do centro (µm)',
  };

  const renderTextField = (key: string, label: string, value: any, onChange: (value: string) => void, type = 'text', adornment?: string) => {
    if (adornment) {
      return (
        <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InputEndAdornment
            adornment={adornment}
            type={type}
            variant="standard"
            label={label}
            placeholder={adornment ? `Ex: ${adornment}` : ''}
            value={value?.toString() || ''}
            onChange={(e) => onChange(e.target.value)}
            sx={{ flex: 1 }}
          />
          <Tooltip title={tooltips[key] || 'Preencher conforme especificação'} arrow>
            <IconButton size="small" sx={{ color: '#07B811' }}>
              <HelpOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      );
    }

    return (
      <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          variant="standard"
          type={type}
          label={label}
          value={value || ''}
          InputLabelProps={type === 'date' ? { shrink: true } : undefined}
          onChange={(e) => onChange(e.target.value)}
          InputProps={{ inputProps: { style: { textTransform: 'uppercase' } } }}
          sx={{ flex: 1 }}
        />
        <Tooltip title={tooltips[key] || 'Preencher conforme especificação'} arrow>
          <IconButton size="small" sx={{ color: '#07B811' }}>
            <HelpOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };

  const handleAddSample = () => {
    if (!currentSample.stationNumber && currentSample.stationNumber !== 0) {
      setError('Número da estaca é obrigatório');
      return;
    }

    addSample(currentSample as FWDData);
    setCurrentSample({
      stationNumber: (currentSample.stationNumber || 0) + 4,
      d0: 0, d20: 0, d30: 0, d45: 0, d60: 0,
      d90: 0, d120: 0, d150: 0, d180: 0,
    });
    setError(null);
  };

  const handleImportExcel = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

        let dataStartRow = -1;
        for (let i = 0; i < Math.min(10, rows.length); i++) {
          const row = rows[i];
          if (row && row[0] && (row[0].toString().toUpperCase().includes('ESTACA') || row[0].toString().toUpperCase().includes('DATA'))) {
            dataStartRow = i;
            break;
          }
        }

        if (dataStartRow === -1) {
          setError('Estrutura da planilha não reconhecida');
          return;
        }

        const headerRow: string[] = (rows[dataStartRow] as any[])?.map((cell: any) => cell?.toString().trim().toUpperCase() || '') || [];

        const colIndices: Record<string, number> = {
          stationNumber: headerRow.findIndex(h => h.includes('ESTACA')),
          d0: headerRow.findIndex(h => h === 'D0' || h === 'D0 (µm)'),
          d20: headerRow.findIndex(h => h === 'D20' || h === 'D20 (µm)'),
          d30: headerRow.findIndex(h => h === 'D30' || h === 'D30 (µm)'),
          d45: headerRow.findIndex(h => h === 'D45' || h === 'D45 (µm)'),
          d60: headerRow.findIndex(h => h === 'D60' || h === 'D60 (µm)'),
          d90: headerRow.findIndex(h => h === 'D90' || h === 'D90 (µm)'),
          d120: headerRow.findIndex(h => h === 'D120' || h === 'D120 (µm)'),
          d150: headerRow.findIndex(h => h === 'D150' || h === 'D150 (µm)'),
          d180: headerRow.findIndex(h => h === 'D180' || h === 'D180 (µm)'),
        };

        if (colIndices.stationNumber === -1 || colIndices.d0 === -1) {
          setError('Colunas essenciais não encontradas');
          return;
        }

        const dataRows = rows.slice(dataStartRow + 1);
        const loadedSamples: FWDData[] = [];

        for (const row of dataRows) {
          if (!row || !Array.isArray(row) || row.length < 2) continue;
          const stationNumber = Number(row[colIndices.stationNumber]);
          const d0 = Number(row[colIndices.d0]);
          if (isNaN(stationNumber) || isNaN(d0) || stationNumber === 0) continue;

          loadedSamples.push({
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
          });
        }

        if (loadedSamples.length > 0) {
          setSamples(loadedSamples);
          setError(null);
          setSnackbar({ open: true, message: `${loadedSamples.length} amostras importadas`, severity: 'success' });
        } else {
          setError('Nenhuma amostra válida encontrada');
        }
      } catch (error) {
        setError('Erro ao processar o arquivo');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleSave = async (asDraft = false) => {
    const result = await saveAnalysis(asDraft);
    if (result) {
      setSnackbar({ open: true, message: asDraft ? 'Rascunho salvo!' : 'Análise criada com sucesso!', severity: 'success' });
    }
  };

  // ⭐ Mensagem dinâmica de amostras faltantes
  const amostrasFaltantes = Math.max(0, 5 - samples.length);
  const mensagemAmostras = samples.length >= 5 
    ? '✅ Análise completa (mínimo 5 amostras atingido)'
    : amostrasFaltantes === 1
      ? `⚠️ Atenção: falta ${amostrasFaltantes} amostra para análise completa`
      : `⚠️ Atenção: faltam ${amostrasFaltantes} amostras para análise completa`;

  return (
    <>
      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>{error}</Alert>}

      {/* DADOS GERAIS */}
      <FlexColumnBorder title="DADOS GERAIS DA ANÁLISE FWD" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
            {renderTextField('fwdName', 'NOME DA ANÁLISE *', analysisData.name, (val) => setAnalysisData({ name: val }))}
            {renderTextField('fwdLocation', 'LOCAL', analysisData.location, (val) => setAnalysisData({ location: val }))}
            {renderTextField('fwdHighway', 'RODOVIA', analysisData.highway, (val) => setAnalysisData({ highway: val }))}
            {renderTextField('fwdLayerType', 'CAMADA', analysisData.layerType, (val) => setAnalysisData({ layerType: val }))}
            {renderTextField('fwdCityState', 'MUNICÍPIO/ESTADO', analysisData.cityState, (val) => setAnalysisData({ cityState: val }))}
            {renderTextField('fwdSpeedLimit', 'VELOCIDADE DIRETRIZ', analysisData.speedLimit, (val) => setAnalysisData({ speedLimit: val }), 'text', 'km/h')}
          </Box>
          <Box sx={{ width: '100%', paddingBottom: '20px' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <TextField
                fullWidth multiline rows={2} variant="outlined" label="DESCRIÇÃO"
                value={analysisData.description}
                onChange={(e) => setAnalysisData({ description: e.target.value })}
                InputProps={{ inputProps: { style: { textTransform: 'uppercase' } } }}
              />
              <Tooltip title={tooltips['fwdDescription'] || 'Descrição detalhada da análise'} arrow>
                <IconButton size="small" sx={{ color: '#07B811', mt: 1 }}>
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </FlexColumnBorder>

      {/* AMOSTRAS */}
      <FlexColumnBorder title="AMOSTRAS FWD" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          <Box sx={{ width: '100%', display: 'flex', gap: 2, pb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Button variant="outlined" component="label" startIcon={<FileUpload />}
              sx={{ color: '#07B811', borderColor: '#07B811', '&:hover': { borderColor: '#05a00e', backgroundColor: 'rgba(7,184,17,0.04)' } }}>
              IMPORTAR EXCEL
              <input type="file" accept=".xls,.xlsx" hidden onChange={handleImportExcel} />
            </Button>
            
            <Button 
              variant="outlined" 
              startIcon={<Download />}
              onClick={handleDownloadModelo}
              sx={{ 
                color: '#07B811', 
                borderColor: '#07B811', 
                '&:hover': { borderColor: '#05a00e', backgroundColor: 'rgba(7,184,17,0.04)' } 
              }}
            >
              BAIXAR MODELO PADRÃO
            </Button>
            
            <Chip label={`${samples.length} AMOSTRAS`} color={samples.length >= 5 ? 'success' : 'warning'} variant="outlined" sx={{ fontWeight: 600 }} />
          </Box>

          {/* ⭐ ALERTA COM MENSAGEM DINÂMICA DE AMOSTRAS FALTANTES */}
          <Alert 
            severity={samples.length >= 5 ? 'success' : 'warning'} 
            sx={{ 
              mb: 2, 
              width: '100%',
              borderRadius: 1,
              fontSize: '0.85rem',
            }}
          >
            {mensagemAmostras}
          </Alert>

          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr 1fr' }, gap: '10px 20px', pb: 2 }}>
            {renderTextField('stationNumber', 'ESTACA *', currentSample.stationNumber?.toString(), (val) => setCurrentSample({...currentSample, stationNumber: Number(val)}))}
            {sensoresDeflexao.map((dist) =>
              renderTextField(`d${dist}`, `d${dist} (µm)`, currentSample[`d${dist}` as keyof FWDData]?.toString(), (val) => {
                setCurrentSample({...currentSample, [`d${dist}`]: Number(val)});
              })
            )}
          </Box>

          <Box sx={{ width: '100%', display: 'flex', gap: 2, pb: 2 }}>
            <Button variant="contained" startIcon={<Add />} onClick={handleAddSample}
              sx={{ backgroundColor: '#07B811', '&:hover': { backgroundColor: '#05a00e' } }}>
              ADICIONAR AMOSTRA
            </Button>
          </Box>

          {samples.length > 0 && (
            <Accordion sx={{ width: '100%', border: '1px solid #07B811', borderRadius: 1 }}>
              <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#07B811' }} />}>
                <Typography sx={{ fontWeight: 600, color: '#07B811' }}>AMOSTRAS ({samples.length})</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper} sx={{ border: '1px solid #07B811' }}>
                  <Table size="small">
                    <TableHead sx={{ backgroundColor: '#f0fff0' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, color: '#07B811' }}>ESTACA</TableCell>
                        {sensoresDeflexao.map((d) => (
                          <TableCell key={d} sx={{ fontWeight: 700, color: '#07B811' }}>d{d}</TableCell>
                        ))}
                        <TableCell sx={{ fontWeight: 700, color: '#07B811' }}>AÇÕES</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {samples.map((sample, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{sample.stationNumber}</TableCell>
                          {sensoresDeflexao.map((d) => (
                            <TableCell key={d}>{sample[`d${d}` as keyof FWDData]}</TableCell>
                          ))}
                          <TableCell>
                            <IconButton size="small" onClick={() => removeSample(idx)} sx={{ color: '#ff1744' }}>
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
          )}

          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
            <Button variant="outlined" onClick={() => handleSave(true)} disabled={samples.length === 0 || loading}
              sx={{ color: '#07B811', borderColor: '#07B811', '&:hover': { borderColor: '#05a00e', backgroundColor: 'rgba(7,184,17,0.04)' } }}>
              {loading ? <CircularProgress size={20} sx={{ color: '#07B811' }} /> : 'SALVAR COMO RASCUNHO'}
            </Button>
            <Button variant="contained" onClick={() => handleSave(false)} disabled={samples.length < 5 || !analysisData.name || loading}
              sx={{ backgroundColor: '#07B811', '&:hover': { backgroundColor: '#05a00e' } }}>
              {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'SALVAR ANÁLISE'}
            </Button>
          </Box>
        </Box>
      </FlexColumnBorder>

      {/* OBSERVAÇÕES */}
      <FlexColumnBorder title="OBSERVAÇÕES" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: '1fr', gap: '10px 20px', pb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <TextField
                fullWidth multiline rows={4} variant="outlined" label="OBSERVAÇÕES"
                value={analysisData.notes}
                onChange={(e) => setAnalysisData({ notes: e.target.value })}
                InputProps={{ inputProps: { style: { textTransform: 'uppercase' } } }}
              />
              <Tooltip title="Espaço para anotações complementares" arrow>
                <IconButton size="small" sx={{ color: '#07B811', mt: 1 }}>
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </FlexColumnBorder>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity as any}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FWD_step1;