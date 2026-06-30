import { EssayPageProps } from '@/components/templates/essays';
import { Box, Typography, Chip, Alert } from '@mui/material';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import useFWDStore from '@/stores/asphalt/fwd/fwd.store';
import { CheckCircle, Warning, Assessment } from '@mui/icons-material';

const FWDResume = ({ setNextDisabled }: EssayPageProps) => {
  const store = useFWDStore();

  setNextDisabled?.(false);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  return (
    <>
      <FlexColumnBorder title="RESUMO DA ANÁLISE FWD" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
          
          {/* DADOS GERAIS */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#07B811', mb: 1 }}>
              DADOS GERAIS
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 300px' }}>
                <Typography variant="body2" color="text.secondary">Nome da Análise</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {store.analysisData.name || 'Não informado'}
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <Typography variant="body2" color="text.secondary">Local</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {store.analysisData.location || 'Não informado'}
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <Typography variant="body2" color="text.secondary">Rodovia</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {store.analysisData.highway || 'Não informado'}
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <Typography variant="body2" color="text.secondary">Camada</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {store.analysisData.layerType || 'Não informado'}
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <Typography variant="body2" color="text.secondary">Município/Estado</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {store.analysisData.cityState || 'Não informado'}
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <Typography variant="body2" color="text.secondary">Velocidade Diretriz</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {store.analysisData.speedLimit ? `${store.analysisData.speedLimit} km/h` : 'Não informado'}
                </Typography>
              </Box>
            </Box>
            {store.analysisData.description && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">Descrição</Typography>
                <Typography variant="body1">{store.analysisData.description}</Typography>
              </Box>
            )}
          </Box>

          {/* AMOSTRAS */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#07B811', mb: 1 }}>
              AMOSTRAS
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                icon={store.samples.length >= 5 ? <CheckCircle /> : <Warning />}
                label={`${store.samples.length} amostras cadastradas`}
                color={store.samples.length >= 5 ? 'success' : 'warning'}
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
              {store.samples.length > 0 && (
                <>
                  <Chip 
                    label={`Estaca inicial: ${Math.min(...store.samples.map(s => s.stationNumber))}`}
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                  <Chip 
                    label={`Estaca final: ${Math.max(...store.samples.map(s => s.stationNumber))}`}
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                </>
              )}
            </Box>
            {store.samples.length < 5 && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                Mínimo de 5 amostras necessário para processamento completo.
              </Alert>
            )}
          </Box>

          {/* ANÁLISE SELECIONADA */}
          {store.selectedAnalysis && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#07B811', mb: 1 }}>
                ANÁLISE SELECIONADA
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label={store.selectedAnalysis.name}
                  color="success"
                  sx={{ fontWeight: 600 }}
                />
                <Chip 
                  label={`Status: ${store.selectedAnalysis.status}`}
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
                <Chip 
                  label={`Criada: ${formatDate(store.selectedAnalysis.createdAt)}`}
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Box>
          )}

          {/* RESULTADO DO PROCESSAMENTO */}
          {store.procResult && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#07B811', mb: 1 }}>
                RESULTADO DO PROCESSAMENTO
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<Assessment />}
                  label={`${store.procResult.subtrechos?.length || 0} subtrechos homogêneos`}
                  color="success"
                  sx={{ fontWeight: 600 }}
                />
                <Chip 
                  label={`${store.procResult.ordered?.length || 0} amostras processadas`}
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
                <Chip 
                  label={`${store.procResult.quebra?.filter(q => q).length || 0} pontos de quebra`}
                  variant="outlined"
                  color="warning"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Box>
          )}

          {/* OBSERVAÇÕES */}
          {store.analysisData.notes && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#07B811', mb: 1 }}>
                OBSERVAÇÕES
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {store.analysisData.notes}
              </Typography>
            </Box>
          )}
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default FWDResume;