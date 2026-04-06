import { Modal, Box, Button, Typography } from '@mui/material';
import { GranulometryEssay } from '@/components/asphalt/material/types/material.types';
import ExperimentResume from '@/components/molecules/boxes/experiment-resume';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import Chart from 'react-google-charts';
import Loading from '@/components/molecules/loading';
import AsphaltGranulometry_resultsTable from '@/components/asphalt/essays/granulometry/tables/results-table.granulometry';
import { t } from 'i18next';
import { useEssayModalData } from './hook/useEssayModalData';

interface MaterialEssayModalProps {
  essay: GranulometryEssay;
  open: boolean;
  onClose: () => void;
}

export const MaterialEssayModal = ({ essay, open, onClose }: MaterialEssayModalProps) => {
  const { 
    modalData, 
    modalExperimentResumeData, 
    modalRows, 
    modalColumns,
    hasGraph,
    hasTable,
    essayType,
    essayTitle 
  } = useEssayModalData(essay);

  // Dados do gráfico (apenas para granulometria)
  const modalGraphData = hasGraph && essay.results?.graph_data ? [
    [t('granulometry-asphalt.passant'), t('granulometry-asphalt.diameter')],
    ...essay.results.graph_data,
  ] : [];

  // Determinar o título do modal baseado no tipo de ensaio
  const modalTitle = essayType === 'granulometry' 
    ? `Ensaio: ${essay.generalData?.name || 'Sem nome'}`
    : `${essayTitle} - ${essay.generalData?.name || 'Ensaio sem nome'}`;

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box
        sx={{
          backgroundColor: 'white',
          padding: 3,
          borderRadius: 2,
          maxWidth: '90%',
          maxHeight: '90%',
          overflow: 'auto',
          width: '1200px',
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ position: 'relative', top: -10 }} 
        >
          {modalTitle}
        </Typography>

        <ExperimentResume data={modalExperimentResumeData} />

        <FlexColumnBorder title={t('results')} open={true}>
          {/* Cards de resultados - usando Box com flexbox */}
          <Box sx={{ width: '100%', display: 'flex', gap: '10px', mt: '20px', flexWrap: 'wrap' }}>
            {modalData && modalData.length > 0 ? (
              modalData.map((item, index) => (
                <Result_Card
                  key={index}
                  label={item.label}
                  value={
                    Array.isArray(item.value) ? item.value[0]?.[1]?.toString?.() ?? '' : item.value?.toString?.() ?? ''
                  }
                  unity={item.unit || ''}
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center', width: '100%' }}>
                Nenhum dado disponível para este ensaio
              </Typography>
            )}
          </Box>

          {/* Gráfico - apenas para granulometria */}
          {hasGraph && modalGraphData.length > 1 && (
            <Box sx={{ mt: 3 }}>
              <Chart
                chartType="LineChart"
                width={'100%'}
                height={'400px'}
                loader={<Loading />}
                data={modalGraphData}
                options={{
                  title: t('granulometry-asphalt.granulometry'),
                  backgroundColor: 'transparent',
                  pointSize: 6,
                  lineWidth: 2,
                  hAxis: {
                    title: `${t('granulometry-asphalt.sieve-openness') + ' (mm)'}`,
                    type: 'number',
                    scaleType: 'log',
                  },
                  vAxis: {
                    title: `${t('granulometry-asphalt.passant') + ' (%)'}`,
                    minValue: 0,
                    maxValue: 105,
                  },
                  legend: 'none',
                  curveType: 'function',
                }}
              />
            </Box>
          )}

          {/* Tabela - apenas para granulometria */}
          {hasTable && modalRows.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <AsphaltGranulometry_resultsTable rows={modalRows} columns={modalColumns} />
            </Box>
          )}

          {/* Mensagem para ensaios que não são granulometria */}
          {essayType !== 'granulometry' && (
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Este ensaio não possui dados de granulometria para exibir gráfico ou tabela detalhada.
              </Typography>
            </Box>
          )}
        </FlexColumnBorder>

        <Button onClick={onClose} variant="contained" sx={{ mt: 2 }}>
          Fechar
        </Button>
      </Box>
    </Modal>
  );
};