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
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';

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
    essayTitle,
    modalGraphData
  } = useEssayModalData(essay);

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
        <Typography variant="h5" gutterBottom sx={{ position: 'relative', top: -10 }}>
          {modalTitle}
        </Typography>

        <ExperimentResume data={modalExperimentResumeData} />

        <FlexColumnBorder title={t('results')} open={true}>
          {/* Cards de resultados */}
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

          {/* ✅ Gráfico - Granulometria */}
          {essayType === 'granulometry' && modalGraphData.length > 1 && (
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

{/* ✅ Gráfico - Viscosidade Rotacional */}
{essayType === 'viscosityRotational' && modalGraphData.length > 1 && (
  <Box sx={{ mt: 3 }}>
    <ResultSubTitle 
      title={t('asphalt.essays.viscosityRotational.graph')} 
      sx={{ margin: '.65rem' }} 
    />
    <Chart
      chartType="LineChart"
      width={'100%'}
      height={'400px'}
      loader={<Loading />}
      data={modalGraphData}
      options={{
        backgroundColor: 'transparent',
        hAxis: {
          title: `${t('asphalt.essays.viscosityRotational.temperature')} C`,
        },
        vAxis: {
          title: `${t('asphalt.essays.viscosityRotational.viscosity')} (SSF)`,
        },
        explorer: {
          actions: ['dragToZoom', 'rightClickToReset'],
          axis: 'vertical',
        },
        legend: 'none',
        trendlines: {
          0: {
            type: 'polynomial',
            degree: 4,
            visibleInLegend: true,
            labelInLegend: 'curva',
          },
        },
      }}
    />
  </Box>
)}

          {/* Tabela - Granulometria */}
          {hasTable && modalRows.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <AsphaltGranulometry_resultsTable rows={modalRows} columns={modalColumns} />
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