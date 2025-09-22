// components/templates/asphalt-granulometry/AsphaltGranulometry_Results.tsx
import { useState } from 'react';
import { EssayPageProps } from '@/components/templates/essay';
import { GranulometryEssay } from './types/asphalt-granulometry.types';

// Hooks
import { useGranulometryEssays } from './hooks/useGranulometryEssays';
import { useCurrentEssayData } from './hooks/useCurrentEssayData';

// Components
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import ExperimentResume from '@/components/molecules/boxes/experiment-resume';
import Loading from '@/components/molecules/loading';
import Chart from 'react-google-charts';
import AsphaltGranulometry_resultsTable from './tables/results-table.granulometry';
import { EssaysHistory } from './components/EssaysHistory';
import { EssayModal } from './EssayModal';

// UI
import { Box } from '@mui/material';
import { t } from 'i18next';

const AsphaltGranulometry_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  
  // Estado do modal
  const [selectedEssay, setSelectedEssay] = useState<GranulometryEssay | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Dados dos ensaios
  const { currentEssays, loadingEssays, currentPage, totalPages, setCurrentPage } = useGranulometryEssays();
  
  // Dados do ensaio atual
  const { currentData, experimentResumeData, graph_data, rows, columns, granulometry_results } = useCurrentEssayData();

  // Handlers
  const openEssayModal = (essay: GranulometryEssay) => {
    setSelectedEssay(essay);
    setModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEssay(null);
  };

  return (
    <>
      {/* SEÇÃO DO ENSAIO ATUAL */}
      <ExperimentResume data={experimentResumeData} />
      <FlexColumnBorder title={t('results')} open={true}>
        <ResultSubTitle title={t('asphalt.essays.granulometry')} sx={{ margin: '.65rem' }} />
        <Box sx={{ width: '100%', display: 'flex', gap: '10px', mt: '20px' }}>
          {currentData.container_other_data.map((item, index) => {
            if (Array.isArray(item.value)) return null;
            return <Result_Card key={index} label={item.label} value={item.value} unity={item.unity || ''} />;
          })}
        </Box>
        {granulometry_results && (
          <Chart
            chartType="LineChart"
            width={'100%'}
            height={'400px'}
            loader={<Loading />}
            data={graph_data}
            options={{
              title: t('granulometry-asphalt.granulometry'),
              backgroundColor: 'transparent',
              pointSize: 5,
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
            }}
          />
        )}
        <AsphaltGranulometry_resultsTable rows={rows} columns={columns} />
      </FlexColumnBorder>

      {/* HISTÓRICO DE ENSAIOS */}
      <FlexColumnBorder title={`Histórico de Ensaios (${currentEssays.length} total)`} open={true}>
        <ResultSubTitle title="Todos os Ensaios Realizados" sx={{ margin: '.65rem' }} />
        
        <EssaysHistory
          essays={currentEssays}
          loading={loadingEssays}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onEssayClick={openEssayModal}
        />
      </FlexColumnBorder>

      {/* MODAL */}
      {selectedEssay && (
        <EssayModal 
          essay={selectedEssay} 
          open={modalOpen} 
          onClose={handleCloseModal} 
        />
      )}
    </>
  );
};

export default AsphaltGranulometry_Results;