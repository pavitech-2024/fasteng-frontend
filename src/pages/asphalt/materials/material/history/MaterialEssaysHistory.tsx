// components/organisms/material-essays-history/MaterialEssaysHistory.tsx
import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { GranulometryEssay } from '../types/material.types';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import { MaterialEssayModal } from '../MaterialEssayModal';

interface MaterialEssaysHistoryProps {
  granulometryEssays: GranulometryEssay[];
}

export const MaterialEssaysHistory = ({ granulometryEssays }: MaterialEssaysHistoryProps) => {
  const [showGranulometryHistory, setShowGranulometryHistory] = useState(false);
  const [selectedEssay, setSelectedEssay] = useState<GranulometryEssay | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openEssayModal = (essay: GranulometryEssay) => {
    setSelectedEssay(essay);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedEssay(null);
  };

  if (granulometryEssays.length === 0) return null;

  return (
    <>
      <Box sx={{ mt: 3, mb: 3 }}>
        <Button
          variant="outlined"
          onClick={() => setShowGranulometryHistory(!showGranulometryHistory)}
          sx={{ mb: 2 }}
        >
          {showGranulometryHistory ? 'Ocultar' : 'Mostrar'} Histórico de Ensaios de Granulometria (
          {granulometryEssays.length})
        </Button>

        {showGranulometryHistory && (
          <FlexColumnBorder title="Histórico de Ensaios de Granulometria" open={true}>
            {granulometryEssays.map((essay) => (
              <Box key={essay._id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6">{essay.generalData.name}</Typography>
                    <Typography variant="body2">
                      Data: {new Date(essay.generalData.createdAt).toLocaleDateString()} | Operador:{' '}
                      {essay.generalData.operator || 'N/A'}
                    </Typography>
                  </Box>
                  <Button variant="outlined" size="small" onClick={() => openEssayModal(essay)}>
                    Ver Ensaio Completo
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap', mt: 1 }}>
                  <Result_Card label="M. Finura" value={`${essay.results.fineness_module}`} unity="%" />
                  <Result_Card label="Tam. Nominal" value={`${essay.results.nominal_size}`} unity="mm" />
                  <Result_Card label="CC" value={`${essay.results.cc}`} unity="" />
                  <Result_Card label="CNU" value={`${essay.results.cnu}`} unity="" />
                  <Result_Card label="Erro" value={`${essay.results.error}`} unity="%" />
                </Box>
              </Box>
            ))}
          </FlexColumnBorder>
        )}
      </Box>

      {selectedEssay && (
        <MaterialEssayModal essay={selectedEssay} open={modalOpen} onClose={closeModal} />
      )}
    </>
  );
};