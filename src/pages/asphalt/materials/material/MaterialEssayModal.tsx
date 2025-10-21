import { Modal, Box, Button, Typography } from '@mui/material';
import { GranulometryEssay } from './types/material.types';
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
  const { modalData, modalExperimentResumeData, modalRows, modalColumns } = useEssayModalData(essay);

  // 👇 DADOS ORIGINAIS - SIMPLES E DIRETO
  const modalGraphData = [
    [t('granulometry-asphalt.passant'), t('granulometry-asphalt.diameter')],
    ...(essay.results.graph_data || []),
  ];

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
          Ensaio: {essay.generalData.name}
        </Typography>

        <ExperimentResume data={modalExperimentResumeData} />

        <FlexColumnBorder title={t('results')} open={true}>
          <Box sx={{ width: '100%', display: 'flex', gap: '10px', mt: '20px', flexWrap: 'wrap' }}>
            {modalData.container_other_data.map((item, index) => (
              <Result_Card
                key={index}
                label={item.label}
                value={
                  Array.isArray(item.value) ? item.value[0]?.[1]?.toString?.() ?? '' : item.value?.toString?.() ?? ''
                }
                unity={item.unity || ''}
              />
            ))}
          </Box>

          {/* 👇 GRÁFICO SIMPLES E CORRETO */}
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
              curveType: 'function', // 👈 CURVA SUAVE NATURAL
            }}
          />

          <AsphaltGranulometry_resultsTable rows={modalRows} columns={modalColumns} />
        </FlexColumnBorder>

        <Button onClick={onClose} variant="contained" sx={{ mt: 2 }}>
          Fechar
        </Button>
      </Box>
    </Modal>
  );
};